import { useEffect, useState } from "react"
import axios from "axios"

const axiosOptions = {
  headers: {
    "Content-Type": "application/json",
  },
}

export function useSend(emails: string[]) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function sendEmails(emails: string[]) {
      try {
        setLoading(true)
        const response = await axios.post(
          "https://toggl-hire-frontend-homework.onrender.com/api/send",
          { emails: emails },
          axiosOptions
        )
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
  }, [emails])

  return { data, error, loading }
}
