import { rest } from "msw"

export const handlers = [
  // mock the post to get a successful
  rest.post(
    "https://toggl-hire-frontend-homework.onrender.com/api/send",
    (req, res, ctx) => {
      return res(
        ctx.status(200), //dafault
        ctx.json(mockSuccess)
      )
    }
  ),
]

const mockSuccess = {
  data: "",
}
