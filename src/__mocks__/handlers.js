import { rest } from "msw"

export const handlers = [
  // mock the post to get a successful
  rest.post(
    "https://toggl-hire-frontend-homework.onrender.com/api/send",
    (req, res, ctx) => {
      return res(ctx.json(mockSuccess))
    }
  ),
]

const mockSuccess = {
  data: "",
  status: 200,
}
