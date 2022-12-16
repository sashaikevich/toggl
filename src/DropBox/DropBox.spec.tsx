import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DropBox from "./DropBox"

// prefer to run these tests as part of parent component,
// checking at the same time that they are processed,
// and emails state is updated

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
})

it.todo("allows for files to be dropped")
