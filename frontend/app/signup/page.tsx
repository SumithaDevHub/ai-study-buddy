"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {

    if (!name || !email || !password) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    const res = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
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

      {/* LEFT BRAND PANEL */}

      <div className="hidden md:flex w-1/2 bg-indigo-600 text-white flex-col justify-center items-center p-10">

        <h1 className="text-4xl font-bold mb-4">
          🎓 AI Study Buddy
        </h1>

        <p className="text-lg text-indigo-200 text-center max-w-md">
          Build strong study habits with AI guidance.
          Plan sessions, validate learning, and grow your progress tower.
        </p>

        <div className="mt-10 text-indigo-300 text-sm">
          Focus • Learn • Level Up
        </div>

      </div>

      {/* SIGNUP FORM */}

      <div className="flex flex-1 items-center justify-center bg-gray-50">

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>

          <p className="text-gray-600 mb-6 text-sm">
            Start tracking your learning progress today.
          </p>

          {/* NAME */}

          <div className="mb-4">

            <label className="block text-sm text-gray-700 mb-1">
              Name
            </label>

            <input
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block text-sm text-gray-700 mb-1">
              Email
            </label>

            <input
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>

            <input
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Create a secure password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-xs text-gray-500 mt-1">
              Use at least 8 characters for better security.
            </p>

          </div>

          {/* SIGNUP BUTTON */}

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white p-3 rounded-md font-medium"
            onClick={handleSignup}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* LOGIN REDIRECT */}

          <p className="text-sm text-gray-600 mt-6 text-center">

            Already have an account?

            <a
              href="/login"
              className="text-indigo-600 hover:underline ml-1"
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>
  )
}