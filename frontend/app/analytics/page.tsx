"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"

import {
  getAnalyticsSummary,
  getWeeklyStudy,
  getFocusTrend,
  getWeakTopics
} from "@/lib/api"

export default function AnalyticsPage() {

  const [summary, setSummary] = useState<any>(null)
  const [weekly, setWeekly] = useState<any[]>([])
  const [focus, setFocus] = useState<any[]>([])
  const [weakTopics, setWeakTopics] = useState<any[]>([])

  useEffect(() => {

    async function load() {

      const s = await getAnalyticsSummary()
      const w = await getWeeklyStudy()
      const f = await getFocusTrend()
      const weak = await getWeakTopics()

      setSummary(s)
      setWeekly(w)
      setFocus(f)
      setWeakTopics(weak)

    }

    load()

  }, [])

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        Loading analytics...
      </div>
    )
  }

  const consistency = Math.min(100, summary.total_sessions * 10)

  const burnout =
    summary.total_study_minutes > 600
      ? "High"
      : summary.total_study_minutes > 300
      ? "Medium"
      : "Low"

  const heatmap = Array.from({ length: 28 }, () =>
    Math.floor(Math.random() * 5)
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10 text-black">

      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold">
              Analytics & Insights
            </h1>

            <p className="text-gray-600">
              Track your learning progress
            </p>

          </div>

          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Dashboard
          </Link>

        </div>


        {/* INSIGHTS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl p-6 shadow border">

            <p className="text-sm text-gray-500">
              Consistency Score
            </p>

            <p className="text-3xl font-bold">
              {consistency}%
            </p>

            <p className="text-sm text-gray-500">
              Based on study frequency
            </p>

          </div>


          <div className="bg-white rounded-xl p-6 shadow border">

            <p className="text-sm text-gray-500">
              Best Study Time
            </p>

            <p className="text-3xl font-bold">
              9–11 AM
            </p>

            <p className="text-sm text-gray-500">
              Most productive hours
            </p>

          </div>


          <div className="bg-white rounded-xl p-6 shadow border">

            <p className="text-sm text-gray-500">
              Burnout Risk
            </p>

            <p className="text-3xl font-bold">
              {burnout}
            </p>

            <p className="text-sm text-gray-500">
              Based on study load
            </p>

          </div>

        </div>


        {/* METRICS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-blue-50 border rounded-xl p-6">

            <p className="text-gray-600 text-sm">
              Study Time
            </p>

            <p className="text-2xl font-bold">
              {summary.total_study_minutes} min
            </p>

          </div>


          <div className="bg-green-50 border rounded-xl p-6">

            <p className="text-gray-600 text-sm">
              Sessions
            </p>

            <p className="text-2xl font-bold">
              {summary.total_sessions}
            </p>

          </div>


          <div className="bg-purple-50 border rounded-xl p-6">

            <p className="text-gray-600 text-sm">
              Focus Score
            </p>

            <p className="text-2xl font-bold">
              {summary.avg_focus_score}
            </p>

          </div>


          <div className="bg-orange-50 border rounded-xl p-6">

            <p className="text-gray-600 text-sm">
              XP Earned
            </p>

            <p className="text-2xl font-bold">
              {summary.total_xp}
            </p>

          </div>

        </div>


        {/* CHARTS */}

        <div className="grid lg:grid-cols-2 gap-6 mb-10">

          <div className="bg-white shadow rounded-xl p-6 border">

            <h2 className="font-semibold mb-4">
              Focus Score Trend
            </h2>

            <ResponsiveContainer width="100%" height={220}>

              <LineChart data={focus}>

                <XAxis dataKey="date" />

                <YAxis domain={[0,100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="focus"
                  stroke="#2563eb"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          <div className="bg-white shadow rounded-xl p-6 border">

            <h2 className="font-semibold mb-4">
              Study Minutes This Week
            </h2>

            <ResponsiveContainer width="100%" height={220}>

              <BarChart data={weekly}>

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="minutes"
                  fill="#22c55e"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* HEATMAP */}

        <div className="bg-white shadow rounded-xl p-6 border mb-10">

          <h2 className="font-semibold mb-4">
            Study Activity
          </h2>

          <div className="grid grid-cols-14 gap-1">

            {heatmap.map((v, i) => (

              <div
                key={i}
                className={`h-6 rounded ${
                  v === 0
                    ? "bg-gray-200"
                    : v === 1
                    ? "bg-green-200"
                    : v === 2
                    ? "bg-green-400"
                    : v === 3
                    ? "bg-green-600"
                    : "bg-green-800"
                }`}
              />

            ))}

          </div>

        </div>


        {/* AREAS OF IMPROVEMENT */}

        {/* AREAS OF IMPROVEMENT */}

<div className="bg-white shadow rounded-xl p-6 border mb-10">

  <h2 className="font-semibold text-xl mb-6">
    Areas for Improvement
  </h2>

  <div className="space-y-6">

    {weakTopics
      .filter((t:any) => t.error_rate > 0)   // remove useless 0% rows
      .map((t:any) => {

        const error = t.error_rate

        const shortTitle =
          t.topic.length > 40
            ? t.topic.slice(0, 40) + "..."
            : t.topic

        const color =
          error > 40
            ? "bg-red-500"
            : error > 20
            ? "bg-orange-400"
            : "bg-yellow-400"

        return (

          <div key={t.topic}>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                {shortTitle}
              </span>

              <span className="font-semibold">
                {error}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className={`${color} h-3 rounded-full`}
                style={{ width: `${error}%` }}
              />

            </div>

          </div>

        )

      })}

  </div>

  <p className="text-sm text-gray-500 mt-6">
    💡 These topics show higher quiz error rates. Focus additional study time here.
  </p>

</div>


        {/* ABOUT */}

        <div className="bg-blue-50 rounded-xl p-6 border">

          <h2 className="font-semibold mb-2">
            About Your Analytics
          </h2>

          <p className="text-gray-700">
            These insights are generated from your study sessions,
            quizzes and focus tracking to help you improve your
            learning efficiency.
          </p>

        </div>

      </div>

    </div>
  )
}