"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  goal: string;
  start_time: string;
  duration_minutes: number;
  tasks_completed: number;
  avg_focus_score: number;
  xp_earned: number;
  quiz_accuracy: number;
};

export default function HistoryPage() {

  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8000/sessions/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setSessions(data.sessions || []);

    } catch (err) {

      console.error("Failed to load history", err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white">

      <div className="max-w-6xl mx-auto p-8 space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📚 Study History
          </h1>

          <button
            onClick={() => router.push("/dashboard")}
            className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            ← Dashboard
          </button>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="bg-white border rounded-xl p-6 shadow">
            Loading study sessions...
          </div>

        )}


        {/* EMPTY STATE */}

        {!loading && sessions.length === 0 && (

          <div className="bg-white border rounded-xl p-10 text-center shadow">

            <h3 className="font-bold text-xl mb-2">
              No study sessions yet
            </h3>

            <p className="text-black mb-4">
              Start your first session and begin building your learning tower.
            </p>

            <button
              onClick={() => router.push("/start")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow hover:opacity-90"
            >
              Start Study Session
            </button>

          </div>

        )}


        {/* SESSION LIST */}

        <div className="space-y-5">

          {sessions.map((session) => (

            <div
              key={session.id}
              onClick={() => router.push(`/session/${session.id}`)}
              className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer"
            >

              {/* TOP ROW */}

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-bold text-lg text-black">
                    {session.goal || "Study Session"}
                  </h3>

                  <p className="text-sm text-black">
                    {new Date(session.start_time).toLocaleDateString()}
                  </p>

                </div>

                <div className="text-lg font-bold text-purple-600">
                  +{session.xp_earned} XP
                </div>

              </div>


              {/* METRICS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                <Metric
                  label="Duration"
                  value={`${session.duration_minutes ?? 0} min`}
                  color="bg-blue-50"
                  text="text-blue-700"
                />

                <Metric
                  label="Tasks"
                  value={session.tasks_completed ?? 0}
                  color="bg-green-50"
                  text="text-green-700"
                />

                <Metric
                  label="Focus"
                  value={session.avg_focus_score ?? 0}
                  color="bg-purple-50"
                  text="text-purple-700"
                />

                <Metric
                  label="Quiz"
                  value={`${session.quiz_accuracy ?? 0}%`}
                  color="bg-orange-50"
                  text="text-orange-700"
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}


/* METRIC CARD */

function Metric({
  label,
  value,
  color,
  text
}: {
  label: string;
  value: string | number;
  color: string;
  text: string;
}) {

  return (

    <div className={`${color} rounded-lg p-4 shadow-sm`}>

      <p className="text-sm text-black">
        {label}
      </p>

      <p className={`text-xl font-bold ${text}`}>
        {value}
      </p>

    </div>

  );

}