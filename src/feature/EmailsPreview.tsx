import { useEffect, useState } from "react"
import { getDuplicatesById } from "./utils"
import type { EmailList, NormalizedEmail } from "./d"
import styled from "styled-components"
import { BiSortAZ } from "react-icons/bi"
import { TbCopyOff } from "react-icons/tb"

interface EmailPreviewProps {
  emailList: EmailList
  handleExcludeEmail(id: string): void
  handleIncludeEmail(id: string): void
  sendAPI(emails: string[]): void
}

const EmailPreview = ({
  emailList,
  handleExcludeEmail,
  handleIncludeEmail,
  sendAPI,
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

  const duplicatesById = getDuplicatesById(allEmails)
  const includedEmails = allEmails.filter(email => email.isIncluded)
  const previewEmails = !isSorted
    ? allEmails
    : [...allEmails].sort((a, b) => a.email.localeCompare(b.email))

  useEffect(() => {
    if (ignoreDuplicates) {
      duplicatesById.forEach(id => {
        handleExcludeEmail(id)
      })
    }
    if (!ignoreDuplicates) {
      duplicatesById.forEach(id => {
        handleIncludeEmail(id)
      })
    }
    // todo:
    // let user manually reactiveate duplicates one-by-one, and when all
    // duplicates have been included, remove chemark (and allow it to be clicked again)
    // can move duplicatesById out of the effect and memo it.
  }, [ignoreDuplicates, emailList])

  return (
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
            return (
              <li
                key={email.id}
                onClick={() => {
                  isIncluded
                    ? handleExcludeEmail(email.id)
                    : handleIncludeEmail(email.id)
                }}>
                <StyledEmailRow
                  isHighlighted={isHighlighted}
                  isIncluded={isIncluded}>
                  <span className="email-address">{email.email}</span>
                </StyledEmailRow>
              </li>
            )
          })}
        </div>
      </StyledData>
      {includedEmails.length > 0 && (
        <StyledSend>
          <button
            onClick={() => {
              const addressesArray = includedEmails.map(email => email.email)
              sendAPI(addressesArray)
            }}>
            Send to {includedEmails.length} email
            {includedEmails.length > 1 ? "s" : ""}
          </button>
        </StyledSend>
      )}
    </>
  )
}

export default EmailPreview

const StyledControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const StyledControlButton = styled.div<{ isSelected: boolean }>`
  display: inline-flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
  border: 1px solid #f1f1f1;
  border-radius: 0.4em;
  cursor: pointer;
  &:hover {
    border-color: rgba(56, 126, 238, 0.2);
  }
  background-color: ${props =>
    props.isSelected ? "rgba(56, 126, 238, 0.2)" : "transparent"};
`

const StyledData = styled.section`
  display: grid;
  grid-template-columns: 20em 1fr;
  grid-gap: 3em;
  margin-bottom: 3em;
  h3 {
    font-weight: 600;
    font-size: 0.9em;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`

const StyledFileTag = styled.div`
  border: 1px solid #f1f1f1;
  display: inline-block;
  padding: 0.25em 0.5em;
  margin-bottom: 0.5em;
  border-radius: 0.4em;
  transition: border-color 200ms ease-out;
  .emails-total {
    color: rgba(56, 126, 238);
  }
  &:hover {
    border-color: rgba(56, 126, 238, 0.5);
  }
`

interface EmailRowProps {
  isHighlighted: boolean
  isIncluded: boolean
}

const StyledEmailRow = styled.div<EmailRowProps>`
  margin: 0.25em 0;
  background-color: ${props =>
    props.isHighlighted ? "rgba(56, 126, 238, 0.1)" : "unset"};
  transition: background-color 200ms ease-out;
  .email-address {
    text-decoration: ${props => (!props.isIncluded ? "line-through" : "unset")};
    opacity: ${props => (!props.isIncluded ? "0.5" : "unset")};
  }
`

const StyledSend = styled.div`
  text-align: center;

  button {
    background-color: rgb(56, 126, 238);
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9em;
    font-size: 1.1em;
    padding: 0.5em 1em;
    border-radius: 9999px;
    letter-spacing: 0.03em;
    cursor: pointer;
    display: inline-block;
    &:hover {
      opacity: 0.9;
    }
  }
`
