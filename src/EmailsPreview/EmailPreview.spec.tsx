import { render, screen } from "@testing-library/react"
import EmailPreview from "./EmailsPreview"

const mockEmails = {
  1: {
    id: 1,
    fileName: "emails1",
    date: 1,
    emails: [{ email: "za@example.com", isIncluded: true }],
  },
  2: {
    id: 2,
    fileName: "emails2",
    date: 2,
    emails: [
      { email: "az@example.com", isIncluded: true },
      { email: "za@example.com", isIncluded: true },
    ],
  },
}

it("renders the loading state", () => {
  render(
    <EmailPreview
      emailList={mockEmails}
      handleEmailInclusion={() => {}}
      isLoading={true}
      sendEmails={() => {}}
    />
  )
  const loadingTxt = screen.getByText(/loading/i)
  expect(loadingTxt).toBeInTheDocument()
})

// it.skip("Renders the contents of the list, and allows user to view it in sorted and unsorted view", () => {
//   render(<EmailPreview emailList={mockEmails} />)
// })

it.todo(
  "When duplicate entries are present, button to eliminate duplicates becomes available, and when clicked it crosses out the duplicate email"
  // () => {}
)

it.todo(
  "User can click on emails to eliminate or re-add them the list of emails that will be submitted to the API. The running totals are updated in the send button, and in the file title tabs"
  // () => {}
)

it.todo("Hovering over todos will highlight the emails from that file")
