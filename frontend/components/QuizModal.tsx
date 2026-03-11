"use client";

type Question = {
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

type Props = {
  open: boolean;
  questions: Question[];
  quizLoading: boolean;
  answers: { [key: number]: string };
  reviewMode: boolean;
  score: number;

  setAnswers: any;

  submitQuiz: () => void;
  skipQuiz: () => void;
  cancelQuiz: () => void;
  continueAfterReview: () => void;
};

export default function QuizModal({
  open,
  questions,
  quizLoading,
  answers,
  reviewMode,
  score,
  setAnswers,
  submitQuiz,
  skipQuiz,
  cancelQuiz,
  continueAfterReview
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[680px] max-h-[85vh] overflow-y-auto rounded-xl shadow-xl border">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl">

          <h2 className="text-white text-2xl font-bold">
            Quick Quiz
          </h2>

          <p className="text-indigo-100 text-sm mt-1">
            Validate your understanding before continuing
          </p>

        </div>

        <div className="p-6 space-y-6">

          {quizLoading && (
            <p className="text-black">Generating quiz...</p>
          )}

          {!quizLoading && questions.map((q, i) => {

            const options =
              q.options && q.options.length > 0
                ? q.options
                : ["True", "False"];

            const correctAnswer =
              !isNaN(Number(q.answer)) && q.options
                ? q.options[Number(q.answer) - 1]
                : q.answer;

            return (

              <div
                key={i}
                className="border rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-purple-50"
              >

                <p className="font-semibold text-black mb-3">
                  {i + 1}. {q.question}
                </p>

                <div className="space-y-2">

                  {options.map((opt, j) => (

                    <label
                      key={j}
                      className="flex items-center gap-2 bg-white border rounded-lg p-2 cursor-pointer hover:bg-indigo-50"
                    >

                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() =>
                          setAnswers((prev: any) => ({
                            ...prev,
                            [i]: opt
                          }))
                        }
                      />

                      <span className="text-black">{opt}</span>

                    </label>

                  ))}

                </div>

                {reviewMode && (

                  <div className="mt-3 text-sm">

                    <p className="text-black">
                      Your answer:
                      <span className={`ml-1 font-semibold ${
                        answers[i] === correctAnswer
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {answers[i] || "Not answered"}
                      </span>
                    </p>

                    <p className="text-green-700 font-medium">
                      Correct: {correctAnswer}
                    </p>

                    <p className="text-black mt-1">
                      {q.explanation}
                    </p>

                  </div>

                )}

              </div>

            );

          })}

          {/* SCORE */}

          {reviewMode && (

            <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg text-center">

              <p className="text-black font-bold text-lg">
                Score: {score}%
              </p>

            </div>

          )}

          {/* BUTTONS */}

          {!reviewMode && (

            <div className="flex gap-3 pt-2">

              <button
                onClick={submitQuiz}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Submit Quiz
              </button>

              <button
                onClick={skipQuiz}
                className="border px-4 py-2 rounded-lg text-black"
              >
                Skip for Now
              </button>

              <button
                onClick={cancelQuiz}
                className="border border-red-400 px-4 py-2 rounded-lg text-black"
              >
                Close Quiz
              </button>

            </div>

          )}

          {reviewMode && (

            <div className="flex gap-3 pt-2">

              <button
                onClick={continueAfterReview}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Continue
              </button>

              <button
                onClick={cancelQuiz}
                className="border border-red-400 px-4 py-2 rounded-lg text-black"
              >
                Close
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}