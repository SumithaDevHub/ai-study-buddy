"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function SettingsPage() {

  const router = useRouter();
  const [user,setUser] = useState<User | null>(null);

  useEffect(()=>{

    const token = localStorage.getItem("token");

    async function loadUser(){

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,{
        headers:{ Authorization:`Bearer ${token}` }
      });

      const data = await res.json();
      setUser(data);

    }

    loadUser();

  },[]);

  const logout = ()=>{
    localStorage.removeItem("token");
    router.push("/login");
  };

  return(

<div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white text-black">

<div className="max-w-5xl mx-auto p-8 space-y-8">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-3xl font-bold text-black">
Settings
</h1>

<button
onClick={()=>router.push("/dashboard")}
className="bg-white border px-4 py-2 rounded-lg shadow-sm hover:shadow text-black"
>
Back
</button>

</div>


{/* HERO */}

<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow">

<h2 className="text-2xl font-bold text-white">
Account Settings
</h2>

<p className="text-indigo-100">
Manage your account and preferences
</p>

</div>


{/* ACCOUNT */}

<div className="bg-white border rounded-xl shadow-sm p-6">

<h3 className="font-bold text-lg mb-4">
Account
</h3>

<div className="space-y-3">

<div>
<p className="text-sm text-gray-600">
Name
</p>

<p className="font-semibold">
{user?.name || "—"}
</p>
</div>

<div>
<p className="text-sm text-gray-600">
Email
</p>

<p className="font-semibold">
{user?.email}
</p>
</div>

</div>

</div>


{/* STUDY PREFERENCES */}

<div className="bg-white border rounded-xl shadow-sm p-6">

<h3 className="font-bold text-lg mb-4">
Study Preferences
</h3>

<div className="space-y-4">

<Toggle label="Enable focus monitoring"/>

<Toggle label="Enable mentor alerts"/>

<Toggle label="Show progress tower"/>

</div>

</div>


{/* NOTIFICATIONS */}

<div className="bg-white border rounded-xl shadow-sm p-6">

<h3 className="font-bold text-lg mb-4">
Notifications
</h3>

<div className="space-y-4">

<Toggle label="Daily study reminder"/>

<Toggle label="Streak reminder"/>

</div>

</div>


{/* ACCOUNT ACTIONS */}

<div className="bg-white border rounded-xl shadow-sm p-6">

<h3 className="font-bold text-lg mb-4">
Account Actions
</h3>

<button
onClick={logout}
className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
>
Logout
</button>

</div>

</div>
</div>

  );
}


/* TOGGLE */

function Toggle({label}:{label:string}){

  const [enabled,setEnabled] = useState(true);

  return(

<div className="flex items-center justify-between">

<p className="text-black font-medium">
{label}
</p>

<button
onClick={()=>setEnabled(!enabled)}
className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
enabled ? "bg-indigo-500" : "bg-gray-300"
}`}
>

<div
className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
enabled ? "translate-x-6" : ""
}`}
/>

</button>

</div>

  );

}