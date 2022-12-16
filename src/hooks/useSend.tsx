import { useState } from "react"
import axios from "axios"

const axiosOptions = {
  headers: {
    "Content-Type": "application/json",
  },
}

export function useSend<T>() {
  const [data, setData] = useState<{ status: number; data: T } | null>()
  const [error, setError] = useState<
    | {
        status: number
        msg: string
        emails: string[]
      }
    | undefined
  >()
  const [isLoading, setIsLoading] = useState(false)

  function sendEmails(emails: string[]) {
    setIsLoading(true)

    axios
      .post(
        "https://toggl-hire-frontend-homework.onrender.com/api/send",
        { emails },
        axiosOptions
      )
      .then(response => {
        setError(undefined)
        setData({ status: response.status, data: response.data })
      })
      .catch(error => {
        setData(undefined)
        setError({
          status: error.response.status,
          msg: error.response.data.error,
          emails: error.response.data.emails,
        })
      })
      .finally(() => setIsLoading(false))
  }
  function resetData() {
    setData(null)
  }

  return { sendEmails, isLoading, error, data, resetData }
}
