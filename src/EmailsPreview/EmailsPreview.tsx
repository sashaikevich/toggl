import { useEffect, useState } from "react"
import { getDuplicateEmailsById, isEmpty } from "../utils/upload-helpers"
import { BiSortAZ } from "react-icons/bi"
import { TbCopyOff } from "react-icons/tb"
import type { EmailList, NormalizedEmail } from "../d"
import {
  StyledControls,
  StyledControlButton,
  StyledData,
  StyledFileTag,
  StyledEmailRow,
  StyledSend,
} from "./EmailPreview.style"

interface EmailPreviewProps {
  emailList: EmailList
  handleEmailInclusion(id: string, include: boolean): void
  sendEmails(emails: string[]): void
  failedEmails?: string[]
  isLoading: boolean
}

const EmailPreview = ({
  emailList,
  handleEmailInclusion,
  sendEmails,
  isLoading,
  failedEmails,
}: EmailPreviewProps) => {
  const [isSorted, setIsSorted] = useState(false)
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const fileIds = Object.keys(emailList)
  const allEmails = fileIds.reduce((emails, fileId) => {
    const curEmails = emailList[fileId].emails.map((email, idx) => {
      return {
        id: `${fileId}_${idx}`,
        email: email.email,
        isIncluded: email.isIncluded,
      }
    })
    return [...emails, ...curEmails]
  }, [] as NormalizedEmail[])

  const duplicatesById = getDuplicateEmailsById(allEmails)
  const includedEmails = allEmails.filter(email => email.isIncluded)
  const previewEmails = !isSorted
    ? allEmails
    : [...allEmails].sort((a, b) => a.email.localeCompare(b.email))

  const addressesArray = includedEmails.map(email => email.email)

  useEffect(() => {
    if (ignoreDuplicates) {
      duplicatesById.forEach(id => {
        handleEmailInclusion(id, false)
      })
    }
    if (!ignoreDuplicates) {
      duplicatesById.forEach(id => {
        handleEmailInclusion(id, true)
      })
    }
    // todo:
    // let user manually reactiveate duplicates one-by-one, and when all
    // duplicates have been included, remove checkmark (and allow it to be clicked again)
    // can move duplicatesById out of the effect and memo it.
  }, [ignoreDuplicates, emailList])

  return !isEmpty(allEmails) ? (
    <>
      <StyledControls>
        <StyledControlButton
          isSelected={isSorted}
          onClick={() => {
            setIsSorted(prevSorted => !prevSorted)
          }}>
          <BiSortAZ />
        </StyledControlButton>
        {duplicatesById.length > 0 && (
          <StyledControlButton
            isSelected={ignoreDuplicates}
            onClick={() => {
              setIgnoreDuplicates(duplicates => !duplicates)
            }}>
            <TbCopyOff />
          </StyledControlButton>
        )}
      </StyledControls>

      <StyledData>
        <div>
          <h3>Uploaded Files</h3>
          {fileIds.map(id => {
            const totalIncluded = emailList[id].emails.filter(
              email => email.isIncluded
            ).length
            return (
              <li key={id}>
                <StyledFileTag
                  // todo add handler to remove file, and its data
                  onMouseEnter={() => setHoverId(id)}
                  onMouseLeave={() => setHoverId(null)}>
                  {emailList[id].fileName.slice(0, -4)} (
                  <span className="emails-total">{totalIncluded}</span>)
                </StyledFileTag>
              </li>
            )
          })}
        </div>
        <div>
          <h3>Extracted Emails</h3>
          {previewEmails.map(email => {
            const isHighlighted =
              hoverId !== null && email.id.split("_")[0] === hoverId
            const isIncluded = email.isIncluded
            const hasFailed = failedEmails?.includes(email.email)
            return (
              <li
                key={email.id}
                onClick={() => {
                  isIncluded
                    ? handleEmailInclusion(email.id, false)
                    : handleEmailInclusion(email.id, true)
                }}>
                <StyledEmailRow
                  isHighlighted={isHighlighted}
                  isIncluded={isIncluded}
                  hasFailed={hasFailed}>
                  <span className="email-address">{email.email}</span>
                </StyledEmailRow>
              </li>
            )
          })}
        </div>
      </StyledData>
      {includedEmails.length > 0 && !isLoading && (
        <StyledSend>
          <button
            onClick={() => {
              sendEmails(addressesArray)
            }}>
            Send to {includedEmails.length} email
            {includedEmails.length > 1 ? "s" : ""}
          </button>
        </StyledSend>
      )}
    </>
  ) : <h4 className="notice">Upload some .txt files and see the emails added here</h4>
}
export default EmailPreview
