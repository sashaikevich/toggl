import { render, screen } from "@testing-library/react"

import UploadPage from "./UploadPage"

it("renders the initial state, and with no txt file selected, there should be no list of emails visible", () => {
  render(<UploadPage />)
  const dropArea = screen.getByText(/drop files/i)
  expect(dropArea).toBeInTheDocument()

  const listArea = screen.queryByText(/email/i)
  expect(listArea).not.toBeInTheDocument()
})

it.todo(
  "lets user upload file via button, or via drag, and processes the content; displaying the file name and its content"
  // () => {}
)
it.todo(
  "prevents the upload of duplicate files"
  // () => {}
)
it.todo("renders the loading state, followed by a success or failed message")
