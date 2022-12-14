import axios from "axios"

const axiosOptions = {
  headers: {
    "Content-Type": "application/json",
  },
}

export function sendAPI(emails: string[]) {
  axios
    .post(
      "https://toggl-hire-frontend-homework.onrender.com/api/send",
      { emails: emails },
      axiosOptions
    )
    .then(res => console.log(res))
    .catch(err => console.log(err))
}
