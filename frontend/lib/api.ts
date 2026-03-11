const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getAnalyticsSummary() {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/analytics/summary`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}

export async function getWeeklyStudy() {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/analytics/weekly-study`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}

export async function getFocusTrend() {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/analytics/focus-trend`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}

export async function getWeakTopics() {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/analytics/weak-topics`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.json()
}