"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import StudyTimer from "@/components/StudyTimer";
import TaskList from "@/components/TaskList";
import FocusPanel from "@/components/FocusPanel";
import TutorPanel from "@/components/TutorPanel";
import QuizModal from "@/components/QuizModal";
import SessionReportModal from "@/components/SessionReportModal";
import CameraConsentModal from "@/components/CameraConsentModal";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Question = {
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export default function StudyPage() {

  const params = useParams();
  const router = useRouter();
  const session_id = params.session_id as string;

  const [cameraConsent, setCameraConsent] = useState<boolean | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [reviewMode, setReviewMode] = useState(false);
  const [score, setScore] = useState(0);

  const [chat, setChat] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const [mentorMessage, setMentorMessage] = useState("");
  const [focusScores, setFocusScores] = useState<number[]>([]);

  const [reportOpen, setReportOpen] = useState(false);
  const [sessionReport, setSessionReport] = useState<any>(null);

  const [ending, setEnding] = useState(false);

  /* CAMERA CONSENT */

  const allowCamera = () => setCameraConsent(true);
  const denyCamera = () => setCameraConsent(false);

  /* TIMER */

  useEffect(() => {

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    loadTasks();

    return () => clearInterval(timer);

  }, [session_id]);

  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  /* TASKS */

  const loadTasks = async () => {

    try {

      const res = await fetch(`http://127.0.0.1:8000/tasks/${session_id}`);
      const data = await res.json();

      setTasks(data || []);

    } catch {

      console.log("failed to load tasks");

    }

  };

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  /* QUIZ */

  const openQuiz = async (task: Task) => {

    setSelectedTask(task);
    setQuizOpen(true);
    setQuizLoading(true);

    setAnswers({});
    setReviewMode(false);

    try {

      const res = await fetch("http://127.0.0.1:8000/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_title: task.title,
          duration: 30,
          difficulty: "beginner"
        })
      });

      const data = await res.json();

      const questionsData =
        data.questions ||
        data.quiz?.questions ||
        [];

      setQuestions(questionsData);

    } catch {

      console.log("quiz generation failed");

    }

    setQuizLoading(false);

  };

  const submitQuiz = () => {

    if (!questions.length) return;

    let correct = 0;

    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) correct++;
    });

    const percent = Math.round((correct / questions.length) * 100);

    setScore(percent);
    setReviewMode(true);

  };

  const continueAfterReview = async () => {

    if (!selectedTask) return;

    let correct = 0;

    questions.forEach((q, i) => {

      let correctAnswer = q.answer;

      if (!isNaN(Number(q.answer)) && q.options) {
        const index = Number(q.answer) - 1;
        correctAnswer = q.options[index];
      }

      if (answers[i] && answers[i] === correctAnswer) correct++;

    });

    const results = questions.map((q, i) => ({
      question: q.question,
      user_answer: answers[i] || null,
      correct_answer: q.answer,
      correct: answers[i] === q.answer
    }));

    await fetch("http://127.0.0.1:8000/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        task_id: selectedTask.id,
        session_id,
        total_questions: questions.length,
        correct_answers: correct,
        attempt_type: "quiz",
        question_results: results
      })
    });

    cancelQuiz();
    loadTasks();

  };

  const skipQuiz = async () => {

    if (!selectedTask) return;

    await fetch("http://127.0.0.1:8000/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: selectedTask.id,
        session_id,
        total_questions: questions.length,
        correct_answers: 0,
        attempt_type: "skip"
      })
    });

    cancelQuiz();
    loadTasks();

  };

  const cancelQuiz = () => {

    setQuizOpen(false);
    setSelectedTask(null);
    setQuestions([]);
    setAnswers({});
    setReviewMode(false);

  };

  /* FOCUS */

  const sendFocusSignal = async (signal: any) => {

    try {

      const res = await fetch("http://127.0.0.1:8000/focus/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id,
          ...signal
        })
      });

      const data = await res.json();

      if (signal.focus_score !== undefined) {
        setFocusScores(prev => [...prev, signal.focus_score]);
      }

      if (data.alert) setMentorMessage(data.alert);

    } catch {

      console.log("focus signal failed");

    }

  };

  /* END SESSION */

  const avgFocus =
    focusScores.length > 0
      ? Math.round(
          focusScores.reduce((a, b) => a + b, 0) / focusScores.length
        )
      : 0;

  const endSession = async () => {

    if (ending) return;

    setEnding(true);

    try {

      const res = await fetch("http://127.0.0.1:8000/session/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id,
          avg_focus_score: avgFocus
        })
      });

      const data = await res.json();

      setSessionReport(data);
      setReportOpen(true);

    } catch {

      console.log("session end failed");
      setEnding(false);

    }

  };

  /* TUTOR */

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };

    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setTyping(true);

    try {

      const res = await fetch("http://127.0.0.1:8000/tutor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_id,
          message: userMsg.content
        })
      });

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        content: data.response
      };

      setChat(prev => [...prev, aiMsg]);
      speak(data.response);

    } catch {

      console.log("tutor request failed");

    }

    setTyping(false);

  };

return (

<>
  {cameraConsent === null && (
    <CameraConsentModal onAllow={allowCamera} onDeny={denyCamera} />
  )}

  {cameraConsent !== null && (

    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white">

      <div className="max-w-7xl mx-auto p-8 space-y-8">

        {/* HEADER */}

        <div className="bg-white rounded-xl border shadow-sm p-6 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Study Session
            </h1>

            <p className="text-black text-sm mt-1">
              Session ID: {session_id}
            </p>

          </div>

          <button
            disabled={ending}
            onClick={endSession}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow hover:opacity-90 disabled:opacity-50"
          >
            {ending ? "Ending..." : "End Session"}
          </button>

        </div>


        {/* TIMER SECTION */}

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 shadow text-center">

          <p className="text-white text-sm mb-2">
            Focus Timer
          </p>

          <StudyTimer minutes={minutes} seconds={sec} />

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT AREA */}

          <div className="col-span-2 space-y-6">

            {/* MENTOR ALERT */}

            {mentorMessage && (

              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow-sm">

                <span className="font-semibold text-black">
                  Mentor Alert:
                </span>

                <span className="ml-2 text-black">
                  {mentorMessage}
                </span>

              </div>

            )}


            {/* TASK PANEL */}

            <div className="bg-white rounded-xl border shadow-sm p-6">

              <h2 className="text-xl font-bold text-black mb-4">
                Study Tasks
              </h2>

              <TaskList
                tasks={tasks}
                completed={completed}
                progress={progress}
                openQuiz={openQuiz}
              />

            </div>

          </div>


          {/* RIGHT AREA */}

          <div className="space-y-6">

            {/* FOCUS PANEL */}

            <div className="bg-white rounded-xl border shadow-sm p-5">

              <h3 className="text-lg font-bold text-black mb-3">
                Focus Monitor
              </h3>

              <FocusPanel
                sendFocusSignal={sendFocusSignal}
                cameraEnabled={cameraConsent}
              />

            </div>


            {/* TUTOR PANEL */}

            <div className="bg-white rounded-xl border shadow-sm p-5">

              <h3 className="text-lg font-bold text-black mb-3">
                AI Tutor
              </h3>

              <TutorPanel
                chat={chat}
                message={message}
                typing={typing}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />

            </div>

          </div>

        </div>


        {/* QUIZ MODAL */}

        <QuizModal
          open={quizOpen}
          questions={questions}
          quizLoading={quizLoading}
          answers={answers}
          reviewMode={reviewMode}
          score={score}
          setAnswers={setAnswers}
          submitQuiz={submitQuiz}
          skipQuiz={skipQuiz}
          cancelQuiz={cancelQuiz}
          continueAfterReview={continueAfterReview}
        />


        {/* SESSION REPORT */}

        <SessionReportModal
          open={reportOpen}
          report={sessionReport}
          onClose={() => {
            setReportOpen(false);
            router.push("/dashboard");
          }}
        />

      </div>

    </div>

  )}
</>

);

}