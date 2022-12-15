import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { useImmer } from "use-immer"
import DropBox from "../DropBox/DropBox"
import EmailPreview from "../EmailsPreview/EmailsPreview"
import {
  fileIsDuplicate,
  extractEmailsFromFile,
  isEmpty,
} from "./upload-helpers"
import type { EmailList } from "../d"
import { useSend } from "../hooks/useSend"
import Message from "../Messge.tsx/Message"

const UploadPage = () => {
  const [emailList, setEmailList] = useImmer<EmailList>({})
  const fileId = useRef<number>(1)
  const { sendEmails, data, error, isLoading } = useSend()

  // to allow user to "dispatch" an exclude action when they click on "ignore duplicate emails"
  // individual hanle functions are used, instead of a more DRY toggle approach. This ensures
  // email addresses stay excluded from the mailing list, and don't unintentionally switch to
  // being included

  useEffect(() => {
    if (data?.status) {
      setEmailList({})
    }
  }, [data])

  function handleExcludeEmail(id: string) {
    const [fileID, emailPos] = id.split("_")

    setEmailList(draft => {
      draft[fileID].emails[Number(emailPos)].isIncluded = false
    })
  }

  function handleIncludeEmail(id: string) {
    const [fileID, emailPos] = id.split("_")

    setEmailList(draft => {
      draft[fileID].emails[Number(emailPos)].isIncluded = true
    })
  }

  function handleFileChange(files: FileList) {
    if (files) {
      const uploadedFiles = Array.from(files)

      uploadedFiles.forEach(async file => {
        try {
          // decide on how to handle files from different directories being uploaded with the same name: override or add?
          // todo: fix the error that's prevent a file from uploading, (thinking its' a duplicate?) after the form was sent
          if (!fileIsDuplicate(file, emailList)) {
            const emailsFromFile = await extractEmailsFromFile(file)
            const emailsWithId = emailsFromFile.map((email, idx) => ({
              id: `${fileId.current}"_"${idx}`,
              email,
              isIncluded: true,
            }))

            const fileData: EmailList = {
              [fileId.current]: {
                id: fileId.current,
                fileName: file.name,
                date: file.lastModified,
                emails: emailsWithId,
              },
            }

            setEmailList(prevList => ({ ...prevList, ...fileData }))
            fileId.current++
          }
          // else can notify user that they're uploading a duplicate file

        } catch (err) {
          console.log(err)
        }
      })
    }
  }

  return (
    <StyledWrapper>
      <DropBox handleFileChange={handleFileChange} />
      {/* todo: use toasts instead, or write implementation to remove notification */}
      {(data?.status || error?.status) && (
        <Message errorCode={error?.status} successCode={data?.status} />
      )}

      {!isEmpty(emailList) && (
        <EmailPreview
          emailList={emailList}
          handleExcludeEmail={handleExcludeEmail}
          handleIncludeEmail={handleIncludeEmail}
          sendEmails={sendEmails}
          failedEmails={error?.emails}
        />
      )}
    </StyledWrapper>
  )
}

export default UploadPage

const StyledWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`
