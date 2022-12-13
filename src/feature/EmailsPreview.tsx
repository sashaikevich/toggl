import { useState } from "react"
import type { FileList, Email } from "./d"
import styled from "styled-components"

interface EmailPreviewProps {
  fileList: FileList
}
type NormalizedEmail = Email & {
  id: string
}

const EmailPreview = ({ fileList }: EmailPreviewProps) => {
  const [isSorted, setIsSorted] = useState(false)
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)

  const fileIds = Object.keys(fileList)

  const allEmails = fileIds.reduce((emails, fileId) => {
    const curEmails = fileList[fileId].emails.map((email, idx) => {
      return {
        id: `${fileId}_${idx}`,
        email: email.email,
        isIncluded: email.isIncluded,
      }
    })
    return [...emails, ...curEmails]
  }, [] as NormalizedEmail[])

  return (
    <>
      <button
        onClick={() => {
          setIsSorted(prevSorted => !prevSorted)
        }}>
        sort
      </button>
      {fileIds.map(id => {
        return (
          <li key={id}>
            <StyledFileTag
              onMouseEnter={() => setHoverId(id)}
              onMouseLeave={() => setHoverId(null)}>
              {fileList[id].fileName}
            </StyledFileTag>
          </li>
        )
      })}

      {allEmails.map(email => {
        const isFaded = hoverId !== null && email.id.split("_")[0] !== hoverId

        return (
          <li key={email.id}>
            <StyledEmailRow isFaded={isFaded}>{email.email}</StyledEmailRow>
          </li>
        )
      })}
    </>
  )
}

export default EmailPreview

const StyledFileTag = styled.div`
  border: 2px solid red;
`
interface EmailRowProps {
  isFaded: boolean
}
const StyledEmailRow = styled.div<EmailRowProps>`
  padding: 0.25em 1em;
  opacity: ${props => (props.isFaded ? 0.35 : 1)};
  transition: opacity 200ms ease-out;
`
