import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UploadPage from "./UploadPage"

import { rest } from "msw"
import { server } from "../__mocks__/server"

const handleFileChange = jest.fn()
const file1 = new File(["za@example.com"], "emails1.txt", {
  type: "text/plain",
})
const file2 = new File(["az@example.com", "za@example.com"], "emails2.txt", {
  type: "text/plain",
})

describe("renders empty, and shows data as files are uploaded via browse, or via drop", () => {
  beforeEach(() => {
    render(<UploadPage />)
  })

  it("renders the initial state, and with no txt file selected, there should be no list of emails visible", () => {
    const dropArea = screen.getByText(/drop files/i)
    expect(dropArea).toBeInTheDocument()

    const listArea = screen.queryByText(/extracted emails/i)
    expect(listArea).not.toBeInTheDocument()
  })

  it("lets user upload file via browse, and displays the file name and found emails", async () => {
    const inputBtn = screen.getByLabelText("upload") as HTMLInputElement
    await userEvent.upload(inputBtn, file1)
    expect(inputBtn.files?.[0]).toBe(file1)

    const firstFileName = await screen.findByText(/emails1/i)
    const emailFromFirstFile = await screen.findByText(/za@example.com/i)
    expect(firstFileName).toBeInTheDocument()
    expect(emailFromFirstFile).toBeInTheDocument()
  })

  it.skip("lets user upload file via drag and drop, and displays the file name and found emails", async () => {
    // handleFileChange is triggering when testing in DropBox component, but not here. I don't get it.
    const dropArea = screen.getByLabelText(/droparea/i)
    const handleFileChange = jest.fn()

    expect(dropArea).toBeInTheDocument()
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: file1,
      },
    })

    expect(handleFileChange).toHaveBeenCalledTimes(1)
    const firstFileName = await screen.findByText(/emails1/i)
    const emailFromFirstFile = await screen.findByText(/za@example.com/i)
    expect(firstFileName).toBeInTheDocument()
    expect(emailFromFirstFile).toBeInTheDocument()
  })
})

describe("renders the correct success/error messages", () => {
  it("renders the success msg after submit", async () => {
    render(<UploadPage />)

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

  it("renders the invalid email error message after submit", async () => {
    server.use(
      rest.post(
        "https://toggl-hire-frontend-homework.onrender.com/api/send",
        (req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              data: {
                error: "invalid_email_address",
                emails: ["azexample.com"],
              },
            })
          )
        }
      )
    )
    render(<UploadPage />)

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
    const errorMsg = await screen.findByText(
      /Some email\(s\) were not sent! \(error: 422\)/i
    )
    expect(errorMsg).toBeInTheDocument()
  })

  it("renders general error message after submit", async () => {
    server.use(
      rest.post(
        "https://toggl-hire-frontend-homework.onrender.com/api/send",
        (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              data: {
                error: "send_failure",
                emails: ["az@example.com"],
              },
            })
          )
        }
      )
    )
    render(<UploadPage />)

    const inputBtn = screen.getByLabelText("upload") as HTMLInputElement
    await userEvent.upload(inputBtn, [file1])

    const send = await screen.findByText(/send/i)

    //click on send button
    userEvent.click(send)
    const errorMsg = await screen.findByText(
      /Some email\(s\) were not sent! \(error: 500\)/i
    )
    expect(errorMsg).toBeInTheDocument()
  })
})
