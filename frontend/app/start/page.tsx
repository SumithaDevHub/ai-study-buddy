"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartSession() {

  const router = useRouter();

  const [step, setStep] = useState<"mode" | "plan">("mode");

  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [roomType, setRoomType] = useState<"individual" | "group" | "global">("individual");

  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const [tasks, setTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* GENERATE TASKS */

  const generateTasks = async () => {

    if (!goal) {
      alert("Please enter a study goal first");
      return;
    }

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/planner/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, duration, difficulty })
      });

      const data = await res.json();

      setTasks(data.tasks || []);

    } catch {

      alert("Failed to generate tasks");

    }

  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  /* START SESSION */

  const startSession = async () => {

    if (!goal) {
      alert("Please enter a study goal");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          goal,
          duration,
          room_type: roomType,
          tasks
        })
      });

      const data = await res.json();

      router.push(`/study/${data.id}`);

    } catch {

      alert("Failed to start session");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">

      <div className="max-w-2xl mx-auto bg-white border rounded-2xl shadow-lg p-8 space-y-8">

        {/* STEP INDICATOR */}

        <div className="flex justify-center gap-6 text-sm font-semibold">

          <div className={`${step === "mode" ? "text-indigo-600" : "text-gray-900"}`}>
            ① Choose Mode
          </div>

          <div className={`${step === "plan" ? "text-indigo-600" : "text-gray-900"}`}>
            ② Plan Session
          </div>

        </div>


        {/* STEP 1 — MODE */}

        {step === "mode" && (

          <>

            <h1 className="text-3xl font-bold text-center text-black">
              Start Study Session
            </h1>

            <p className="text-center text-black">
              Choose your study mode
            </p>


            <div className="space-y-4">

              <button
                className={`p-4 border rounded-xl w-full text-left transition ${
                  roomType === "individual"
                    ? "border-indigo-600 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setRoomType("individual")}
              >
                <h3 className="font-semibold text-lg text-black">
                  Individual
                </h3>

                <p className="text-black">
                  Study alone with full focus tracking
                </p>
              </button>


              <button
                className={`p-4 border rounded-xl w-full text-left transition ${
                  roomType === "group"
                    ? "border-indigo-600 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setRoomType("group")}
              >
                <h3 className="font-semibold text-lg text-black">
                  Group
                </h3>

                <p className="text-black">
                  Study with friends in a private room
                </p>
              </button>


              <button
                className={`p-4 border rounded-xl w-full text-left transition ${
                  roomType === "global"
                    ? "border-indigo-600 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setRoomType("global")}
              >
                <h3 className="font-semibold text-lg text-black">
                  Global
                </h3>

                <p className="text-black">
                  Reduced XP • Join others in a public study environment
                </p>
              </button>

            </div>


            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
              onClick={() => setStep("plan")}
            >
              Continue to Planning
            </button>


            {/* INFO */}

            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg text-black">

              <p className="font-semibold mb-2">
                ℹ️ About Study Modes
              </p>

              <p><b>Individual:</b> Full focus tracking and rewards, study alone</p>
              <p><b>Group:</b> Private room with friends, full XP rewards</p>
              <p><b>Global:</b> Public study environment, reduced XP</p>

            </div>

          </>
        )}


        {/* STEP 2 — PLAN */}

{step === "plan" && (

  <div className="space-y-8">

    {/* BACK */}

    <button
      className="text-black font-medium"
      onClick={() => setStep("mode")}
    >
      ← Back
    </button>


    {/* TITLE */}

    <div>

      <h1 className="text-2xl font-bold text-black">
        Plan Your Study Session
      </h1>

      <p className="text-black">
        Mode: <span className="font-semibold capitalize">{roomType}</span>
      </p>

    </div>


    {/* GOAL */}

    <div className="space-y-2">

      <label className="font-semibold text-black">
        What would you like to study?
      </label>

      <input
        className="w-full p-3 rounded-lg border-2 border-gray-300 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="e.g., Calculus derivatives, Python basics, World History..."
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <p className="text-black text-sm">
        💡 Tip: Be specific to get better AI-generated tasks
      </p>

    </div>


    {/* DURATION */}

    <div className="space-y-2">

      <label className="font-semibold text-black">
        Study Duration
      </label>

      <p className="text-black text-sm">
        Selected: {duration} minutes
      </p>

      <div className="flex gap-3 flex-wrap">

        {[15, 30, 60, 120].map((d) => (

          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-4 py-2 rounded-full border transition ${
              duration === d
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-400 text-black hover:bg-indigo-50"
            }`}
          >
            {d} min
          </button>

        ))}

      </div>

    </div>


    {/* DIFFICULTY */}

    <div className="space-y-2">

      <label className="font-semibold text-black">
        Difficulty Level
      </label>

      <select
        className="w-full p-3 rounded-lg border-2 border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={difficulty}
        onChange={(e) =>
          setDifficulty(
            e.target.value as "beginner" | "intermediate" | "advanced"
          )
        }
      >

        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>

      </select>

    </div>


    {/* TASKS */}

    <div className="space-y-3">

      <div className="flex justify-between items-center">

        <h2 className="font-semibold text-black">
          Study Tasks
        </h2>

        <button
          className="text-indigo-600 font-medium text-sm"
          onClick={() => setTasks([...tasks, "New task"])}
        >
          + Add Task
        </button>

      </div>


      {tasks.length === 0 && (

        <p className="text-black text-sm">
          No tasks yet. Click Generate Tasks to get AI suggestions.
        </p>

      )}


      <div className="space-y-2">

        {tasks.map((task, index) => (

          <div key={index} className="flex gap-2">

            <input
              className="flex-1 p-2 rounded-lg border-2 border-gray-300 text-black focus:ring-2 focus:ring-indigo-500"
              value={task}
              onChange={(e) => {

                const updated = [...tasks];
                updated[index] = e.target.value;
                setTasks(updated);

              }}
            />

            <button
              className="bg-red-500 text-white px-3 rounded-lg"
              onClick={() => deleteTask(index)}
            >
              X
            </button>

          </div>

        ))}

      </div>

    </div>


    {/* GENERATE */}

    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
      onClick={generateTasks}
    >
      Generate Tasks with AI
    </button>


    {/* SUMMARY */}

    <div className="p-4 rounded-lg bg-indigo-50">

      <p className="font-semibold text-black">
        Ready to start?
      </p>

      <p className="text-black">
        {tasks.length} tasks • {duration} minutes
      </p>

    </div>


    {/* START BUTTON */}

    <button
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
      onClick={startSession}
    >
      {loading ? "Starting..." : "Start Studying"}
    </button>


    {/* PREP TIPS */}

    <div className="text-black text-sm space-y-1">

      <p className="font-semibold">
        Before you start
      </p>

      <p>• Review AI-generated tasks</p>
      <p>• Make sure you have a quiet environment</p>
      <p>• Prepare study materials</p>

    </div>

  </div>

)}

      </div>

    </div>

  );

}