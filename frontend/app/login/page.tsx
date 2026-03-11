"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {

    setLoading(true)

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {

      localStorage.setItem("token", data.access_token)

      router.push("/dashboard")

    } else {

      alert(data.detail)
    }

    setLoading(false)
  }

  return (

    <div className="min-h-screen flex">

      {/* LEFT SIDE BRAND PANEL */}

      <div className="hidden md:flex w-1/2 bg-indigo-600 text-white flex-col justify-center items-center p-10">

        <h1 className="text-4xl font-bold mb-4">
          🎓 AI Study Buddy
        </h1>

        <p className="text-lg text-indigo-100 text-center max-w-md">
          Turn every study session into measurable progress.
          Build streaks, earn XP, and grow your learning tower.
        </p>

        <div className="mt-10 text-indigo-200 text-sm">
          Focus • Learn • Level Up
        </div>

      </div>

      {/* RIGHT SIDE LOGIN FORM */}

      <div className="flex flex-1 items-center justify-center bg-gray-50">

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back 👋
          </h2>

          <p className="text-gray-500 mb-6 text-sm">
            Login to continue your learning journey
          </p>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>

            <input
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>

            <input
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white p-3 rounded-md font-medium"
            onClick={handleLogin}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* SIGNUP LINK */}

          <p className="text-sm text-gray-500 mt-6 text-center">

            Don’t have an account?

            <a
              href="/signup"
              className="text-indigo-600 hover:underline ml-1"
            >
              Create one
            </a>

          </p>

        </div>

      </div>

    </div>

  )
}