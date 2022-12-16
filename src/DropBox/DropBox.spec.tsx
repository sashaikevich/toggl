import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DropBox from "./DropBox"

const fileChangeMock = jest.fn()

it("renders the box", () => {
  render(<DropBox handleFileChange={fileChangeMock} />)
  const browseBtn = screen.getByRole("button", { name: "browse" })
  expect(browseBtn).toBeInTheDocument()
})

it("allows for files to be uploaded via button", async () => {
  render(<DropBox handleFileChange={fileChangeMock} />)
  const file = new File(["email@example.com"], "emails.txt", {
    type: "text/plain",
  })

  const inputBtn = screen.getByLabelText("upload") as HTMLInputElement
  await userEvent.upload(inputBtn, file)
  expect(inputBtn.files?.[0]).toBe(file)
  expect(inputBtn.files).toHaveLength(1)
  expect(fileChangeMock).toHaveBeenCalledTimes(1)
})

it.skip("allows for files to be dropped", async () => {
  render(<DropBox handleFileChange={fileChangeMock} />)
  const file = new File(["email@example.com"], "emails.txt", {
    type: "text/plain",
  })

  const dropArea = screen.getByLabelText(/droparea/i)
  expect(dropArea).toBeInTheDocument()
  fireEvent.drop(dropArea, {
    dataTransfer: {
      files: file,
    },
  })
})

it.todo(
  "prevents the upload of duplicate files"
  // () => {}
)
