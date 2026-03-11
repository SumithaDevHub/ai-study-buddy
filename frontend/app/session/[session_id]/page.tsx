"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type QuizAttempt = {
  id: string
  score_percent: number
  total_questions: number
  correct_answers: number
  question_results: any[]
}

export default function SessionDetailPage() {

  const { session_id } = useParams()
  const router = useRouter()

  const [session, setSession] = useState<any>(null)
  const [report, setReport] = useState<any>(null)
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {

    const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${session_id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      console.log("SESSION DATA:", data)

      setSession(data.session)
      setReport(data.report)
      setQuizAttempts(data.quiz_attempts || [])

      setLoading(false)
    }

    const downloadReport = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${session_id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

    const blob = await res.blob()

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "study_report.pdf"
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-black">
        Loading session...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">

      <div className="max-w-6xl mx-auto p-8 space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📊 Study Session Report
          </h1>

          <div className="flex gap-3">

            <button
              onClick={() => router.push("/history")}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 text-black"
            >
              ← Back
            </button>

            <button
              onClick={downloadReport}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Download PDF
            </button>

          </div>

        </div>


        {/* METRICS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <Metric
            label="Duration"
            value={`${session?.duration_minutes ?? 0} min`}
            color="bg-blue-50"
            text="text-blue-700"
          />

          <Metric
            label="Tasks"
            value={session?.tasks_completed ?? 0}
            color="bg-green-50"
            text="text-green-700"
          />

          <Metric
            label="Focus"
            value={session?.avg_focus_score ?? 0}
            color="bg-purple-50"
            text="text-purple-700"
          />

          <Metric
            label="Quiz Accuracy"
            value={`${session?.quiz_accuracy ?? 0}%`}
            color="bg-orange-50"
            text="text-orange-700"
          />

        </div>


        {/* AI REPORT */}

        {report && (

          <div className="bg-white border rounded-xl p-6 shadow">

            <h2 className="font-semibold text-xl mb-4 text-black">
              🧠 AI Learning Insights
            </h2>

            <div className="space-y-4 text-black">

              <InsightBlock title="Summary" content={report.summary} />

              <InsightBlock
                title="Strengths"
                content={report.strengths}
                color="green"
              />

              <InsightBlock
                title="Weaknesses"
                content={report.weaknesses}
                color="red"
              />

              <InsightBlock
                title="Recommendations"
                content={report.recommendations}
                color="purple"
              />

            </div>

          </div>

        )}


        {/* QUIZ ATTEMPTS */}

        <div className="bg-white border rounded-xl p-6 shadow">

          <h2 className="font-semibold text-xl mb-4 text-black">
            📝 Quiz Attempts
          </h2>

          {quizAttempts.length === 0 && (
            <p className="text-black">
              No quizzes were taken in this session.
            </p>
          )}

          <div className="space-y-4">

            {quizAttempts.map((quiz) => (

              <div
                key={quiz.id}
                className="border rounded-xl p-5 bg-white"
              >

                <div className="flex justify-between items-center mb-3">

                  <div>

                    <p className="font-bold text-lg text-black">
                      Score: {quiz.score_percent}%
                    </p>

                    <p className="text-black">
                      {quiz.correct_answers} / {quiz.total_questions} correct
                    </p>

                  </div>

                  <details>

                    <summary className="cursor-pointer text-indigo-600 font-semibold">
                      View Questions
                    </summary>

                    <div className="mt-4 space-y-3">

                      {quiz.question_results?.map((q: any, i: number) => {

                        const correct =
                          q.user_answer === q.correct_answer

                        return (

                          <div
                            key={i}
                            className={`p-5 rounded-xl border ${
                              correct
                                ? "bg-green-50 border-green-300"
                                : "bg-red-50 border-red-300"
                            }`}
                          >

                            <p className="font-semibold text-black mb-2">
                              {i + 1}. {q.question}
                            </p>

                            <p className="text-black font-medium">
                              Your Answer: {q.user_answer ?? "Not answered"}
                            </p>

                            <p className="text-black">
                              Correct Answer: {q.correct_answer}
                            </p>

                            <p className={`font-semibold mt-2 ${
                              correct
                                ? "text-green-700"
                                : "text-red-700"
                            }`}>
                              {correct ? "Correct ✅" : "Incorrect ❌"}
                            </p>

                          </div>

                        )

                      })}

                    </div>

                  </details>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}


/* METRIC CARD */

function Metric({
  label,
  value,
  color,
  text
}: {
  label: string
  value: string | number
  color: string
  text: string
}) {

  return (

    <div className={`${color} p-4 rounded-xl shadow-sm`}>

      <p className="text-sm text-black">
        {label}
      </p>

      <p className={`text-2xl font-bold ${text}`}>
        {value}
      </p>

    </div>

  )

}


/* INSIGHT BLOCK */

function InsightBlock({
  title,
  content,
  color = "blue"
}: {
  title: string
  content: string
  color?: string
}) {

  const colors: any = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    purple: "bg-purple-50 border-purple-200"
  }

  return (

    <div className={`border p-4 rounded-lg ${colors[color]}`}>

      <p className="font-semibold text-black mb-1">
        {title}
      </p>

      <p className="text-black">
        {content}
      </p>

    </div>

  )

}