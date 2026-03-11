export async function getAnalyticsSummary() {
  const token = localStorage.getItem("token")

  const res = await fetch("http://localhost:8000/analytics/summary", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}
export async function getWeeklyStudy(){
 const token = localStorage.getItem("token")

 const res = await fetch("http://localhost:8000/analytics/weekly-study",{
   headers:{Authorization:`Bearer ${token}`}
 })

 return res.json()
}

export async function getFocusTrend(){
 const token = localStorage.getItem("token")

 const res = await fetch("http://localhost:8000/analytics/focus-trend",{
   headers:{Authorization:`Bearer ${token}`}
 })

 return res.json()
}

 export async function getWeakTopics() {

  const token = localStorage.getItem("token")

  const res = await fetch("http://localhost:8000/analytics/weak-topics", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}