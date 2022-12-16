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

  it("lets user upload file via drag and drop, and displays the file name and found emails", async () => {
    render(<UploadPage />)
    const file2 = new File(["az@example.com"], "emails2.txt", {
      type: "text/plain",
    })

    const dropArea = screen.getByLabelText(/droparea/i)
    expect(dropArea).toBeInTheDocument()
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: file2,
      },
    })
    // let secondEmail = await screen.findByText(/emails2/i)
    // expect(secondEmail).toBeInTheDocument()
  })
})
it.todo(
  "prevents the upload of duplicate files"
  // () => {}
)
it.todo("renders the loading state, followed by a success or failed message")
