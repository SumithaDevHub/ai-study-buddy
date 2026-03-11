"use client"

import { useRouter } from "next/navigation"

export default function LandingPage() {

const router = useRouter()

return (

<div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">


{/* BACKGROUND BLOBS */}

<div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[120px] opacity-30 animate-pulse"></div>

<div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-30 animate-pulse"></div>


{/* GRID PATTERN */}

<div className="absolute inset-0 opacity-[0.03] pointer-events-none">

<div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

</div>


{/* NAVBAR */}

<nav className="max-w-7xl mx-auto flex justify-between items-center p-6 relative z-10">

<h1
className="text-2xl font-bold text-black cursor-pointer"
onClick={()=>router.push("/")}>
AI Study Buddy
</h1>

<div className="flex gap-4">

<button
onClick={()=>router.push("/login")}
className="text-black font-medium hover:text-indigo-600 transition">
Login
</button>

<button
onClick={()=>router.push("/signup")}
className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
Get Started
</button>

</div>

</nav>



{/* HERO */}

<section className="max-w-6xl mx-auto text-center py-16 px-6 relative z-10">

<h1 className="text-5xl font-bold text-black leading-tight">

Study Smarter  
<span className="text-indigo-600 block mt-2">
with AI Guidance
</span>

</h1>

<p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">

Plan study sessions, stay focused, validate learning with quizzes,
and track progress using XP and analytics.

</p>

<div className="mt-10 flex justify-center gap-4">

<button
onClick={()=>router.push("/signup")}
className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow hover:bg-indigo-700 transition">
Start Studying
</button>

<button
onClick={()=>router.push("/login")}
className="border px-8 py-3 rounded-xl text-black hover:bg-gray-100 transition">
Login
</button>

</div>

</section>



<div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>



{/* FEATURES */}

<section className="max-w-6xl mx-auto py-10 px-6 relative z-10">

<h2 className="text-3xl font-bold text-center text-black mb-12">
Why Students Love It
</h2>

<div className="grid md:grid-cols-3 gap-8">

<Feature icon="🧠" title="AI Study Planner" desc="Break goals into clear study tasks." />

<Feature icon="🎯" title="Focus Tracking" desc="Stay accountable during sessions." />

<Feature icon="📚" title="Quiz Validation" desc="Test understanding instantly." />

<Feature icon="🏆" title="XP & Streaks" desc="Gamified motivation for consistency." />

<Feature icon="📊" title="Analytics Dashboard" desc="Track focus, time, and progress." />

<Feature icon="🤖" title="AI Mentor" desc="Get alerts when focus drops." />

</div>

</section>



<div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>



{/* COMPARISON */}

<section className="bg-white py-16 relative z-10">

<div className="max-w-5xl mx-auto px-6 text-center">

<h2 className="text-3xl font-bold text-black mb-10">
Traditional Studying vs AI Study Buddy
</h2>

<div className="grid md:grid-cols-2 gap-10 text-left">

<div className="border rounded-xl p-6 bg-red-50">

<h3 className="font-bold text-red-600 mb-3">
Traditional Learning
</h3>

<ul className="space-y-2 text-gray-700">

<li>❌ Scattered notes</li>
<li>❌ Distracting WhatsApp groups</li>
<li>❌ No validation of learning</li>
<li>❌ No progress tracking</li>

</ul>

</div>

<div className="border rounded-xl p-6 bg-green-50">

<h3 className="font-bold text-green-600 mb-3">
AI Study Buddy
</h3>

<ul className="space-y-2 text-gray-700">

<li>✅ Structured AI study plans</li>
<li>✅ Focus monitoring</li>
<li>✅ Quiz validation</li>
<li>✅ XP, streaks & analytics</li>

</ul>

</div>

</div>

</div>

</section>



<div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>



{/* CTA */}

<section className="py-16 text-center relative z-10">

<h2 className="text-3xl font-bold text-black">
Start Your Focus Journey
</h2>

<button
onClick={()=>router.push("/signup")}
className="mt-8 bg-indigo-600 text-white px-10 py-3 rounded-xl shadow hover:bg-indigo-700 transition">
Create Free Account
</button>

</section>



{/* CONTACT */}

<footer className="py-12 text-center text-gray-600 relative z-10">

<p>
Built by
</p>

<div className="flex justify-center gap-6 mt-3">

<a
href="mailto:sandhiya.cs22@bitsathy.ac.in"
className="font-medium text-black hover:text-indigo-600 transition">
Sandhiya T
</a>

<a
href="mailto:asr.sumitha@gmail.com"
className="font-medium text-black hover:text-indigo-600 transition">
Sumitha S
</a>

</div>

</footer>


</div>

)
}



/* FEATURE CARD */

function Feature({icon,title,desc}:{icon:string,title:string,desc:string}){

return(

<div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition">

<div className="text-3xl mb-3">
{icon}
</div>

<h3 className="font-semibold text-black mb-1">
{title}
</h3>

<p className="text-gray-600 text-sm">
{desc}
</p>

</div>

)

}