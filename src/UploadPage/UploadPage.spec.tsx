import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import UploadPage from "./UploadPage"

// const readerSpy = jest.spyOn(UploadPage, "handleFileChange")
const handleFileChange = jest.fn()

describe("renders empty, and shows data as files are uploaded via browse, or via drop", () => {
  it("renders the initial state, and with no txt file selected, there should be no list of emails visible", () => {
    render(<UploadPage />)
    const dropArea = screen.getByText(/drop files/i)
    expect(dropArea).toBeInTheDocument()

    const listArea = screen.queryByText(/extracted emails/i)
    expect(listArea).not.toBeInTheDocument()
  })

  it("lets user upload file via browse, and displays the file name and found emails", async () => {
    render(<UploadPage />)
    const file1 = new File(["za@example.com"], "emails1.txt", {
      type: "text/plain",
    })

    const inputBtn = screen.getByLabelText("upload") as HTMLInputElement
    await userEvent.upload(inputBtn, file1)
    expect(inputBtn.files?.[0]).toBe(file1)

    const firstFileName = await screen.findByText(/emails1/i)
    const emailFromFirstFile = await screen.findByText(/za@example.com/i)
    expect(firstFileName).toBeInTheDocument()
    expect(emailFromFirstFile).toBeInTheDocument()
  })
})

it("renders the a success msg after submit", async () => {
  render(<UploadPage />)
  const file1 = new File(["za@example.com"], "emails1.txt", {
    type: "text/plain",
  })
  const file2 = new File(["az@example.com", "za@example.com"], "emails2.txt", {
    type: "text/plain",
  })

  const inputBtn = screen.getByLabelText("upload") as HTMLInputElement
  await userEvent.upload(inputBtn, [file1, file2])
  expect(inputBtn.files?.[0]).toBe(file1)

  const firstFileName = await screen.findByText(/emails1/i)
  const emailFromFirstFile = await screen.findAllByText(/za@example.com/i)
  expect(firstFileName).toBeInTheDocument()
  expect(emailFromFirstFile[0]).toBeInTheDocument()

  const send = await screen.findByText(/send/i)
  expect(send).toBeInTheDocument()

  //click on send button
  userEvent.click(send)
  const successMsg = await screen.findByText(/All emails sent successfully/i)
  expect(successMsg).toBeInTheDocument()
})

it.todo(
  "lets user upload file via drag and drop, and displays the file name and found emails"
)
