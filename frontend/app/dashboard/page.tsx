"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
};

type Stats = {
  total_xp: number;
  level: number;
  current_streak: number;
  tower_blocks: number;
  total_sessions: number;
};

export default function DashboardPage() {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    loadUser();
    loadStats();
  }, []);

  const loadUser = async () => {
    const res = await fetch("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setUser(data);
  };

  const loadStats = async () => {
    const res = await fetch("http://localhost:8000/user/stats", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setStats(data);
  };

  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

return (
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white">

    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI Study Buddy
        </h1>

        <div className="text-black font-medium">
          {user?.email}
        </div>

      </div>


      {/* GREETING */}

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold text-white">
  {greeting}, {user?.name || user?.email || "Student"} 👋
</h2>

        <p className="text-indigo-100 mt-1">
          Ready to continue building your learning tower?
        </p>

      </div>


      {/* MAIN DASHBOARD GRID */}

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT AREA */}

        <div className="col-span-2 space-y-6">

          {/* STATS */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <StatCard
              title="Level"
              value={stats?.level ?? 0}
              color="bg-blue-50"
            />

            <StatCard
              title="Streak"
              value={`${stats?.current_streak ?? 0} 🔥`}
              color="bg-orange-50"
            />

            <StatCard
              title="Total XP"
              value={stats?.total_xp ?? 0}
              color="bg-purple-50"
            />

            <StatCard
              title="Sessions"
              value={stats?.total_sessions ?? 0}
              color="bg-green-50"
            />

          </div>


          {/* START SESSION */}

          <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center">

            <div>

              <h3 className="font-bold text-lg text-black">
                Ready to Study?
              </h3>

              <p className="text-black text-sm">
                Start a new study session and continue building your knowledge tower.
              </p>

            </div>

            <button
              onClick={() => router.push("/start")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow"
            >
              Start Study Session
            </button>

          </div>


          {/* NAVIGATION */}

          <div className="grid md:grid-cols-3 gap-4">

            <NavCard
              title="History"
              description="View past sessions"
              onClick={() => router.push("/history")}
            />

            <NavCard
              title="Analytics"
              description="Track your progress"
              onClick={() => router.push("/analytics")}
            />

            <NavCard
              title="Settings"
              description="Customize your experience"
              onClick={() => router.push("/settings")}
            />

          </div>

        </div>


        {/* RIGHT AREA — PROGRESS TOWER */}

        {/* RIGHT AREA — PROGRESS TOWER */}

<div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center">

  <h3 className="font-bold text-black mb-2">
    Progress Tower
  </h3>

  <p className="text-black text-sm mb-6">
    {stats?.tower_blocks ?? 0} blocks built
  </p>

  <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">

    {Array.from({ length: stats?.tower_blocks ?? 0 }).map((_, i) => {

      const width = 40 + (i % 4) * 8

      return (

        <div
          key={i}
          className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded shadow"
          style={{
            width: `${width}px`,
            height: "16px"
          }}
        />

      )

    })}

  </div>

</div>

      </div>


      {/* STUDY TIP */}

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">

        <h3 className="font-semibold text-black">
          Study Tip
        </h3>

        <p className="text-black mt-1">
          Consistency beats intensity. Even 20 minutes of focused learning
          daily compounds into massive long-term growth.
        </p>

      </div>

    </div>

  </div>
);
}

/* COMPONENTS */

function StatCard({
  title,
  value,
  color
}: {
  title: string;
  value: any;
  color: string;
}) {

  return (
    <div className={`${color} p-4 rounded-xl border`}>

      <p className="text-sm text-black">
        {title}
      </p>

      <p className="text-2xl font-bold text-black">
        {value}
      </p>

    </div>
  );
}

function NavCard({
  title,
  description,
  onClick
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {

  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
    >

      <h4 className="font-bold text-black">
        {title}
      </h4>

      <p className="text-sm text-black mt-1">
        {description}
      </p>

    </div>
  );
}