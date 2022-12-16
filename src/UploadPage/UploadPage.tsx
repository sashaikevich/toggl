import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import Loading from "../Loading/Loading"
import DropBox from "../DropBox/DropBox"
import { useImmer } from "use-immer"
import EmailPreview from "../EmailsPreview/EmailsPreview"
import {
  fileIsDuplicate,
  extractEmailsFromFile,
  isEmpty,
} from "../utils/upload-helpers"
import type { EmailList } from "../d"
import { useSend } from "../hooks/useSend"
import Message from "../Messge.tsx/Message"

const UploadPage = () => {
  const [emailList, setEmailList] = useImmer<EmailList>({})
  const fileId = useRef<number>(1)
  const { sendEmails, resetData, data, error, isLoading } = useSend()

  // to allow user to "dispatch" an exclude action when they click on "ignore duplicate emails"
  // individual handle functions are used, instead of a more DRY toggle approach.
  // This better communicates the intent, and ensures that email addresses stay excluded from
  //  the mailing list, and don't unintentionally switch to being included

  useEffect(() => {
    if (data?.status) {
      setEmailList({})
    }
  }, [data])

  useEffect(() => {
    if (data?.status === 200) {
      const timmy = setTimeout(() => {
        resetData()
      }, 2000)
      return () => {
        clearTimeout(timmy)
      }
    }
  }, [data])

  function handleEmailInclusion(id: string, include: boolean) {
    const [fileID, emailPos] = id.split("_")

    setEmailList(draft => {
      draft[fileID].emails[Number(emailPos)].isIncluded = false
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

      <StyledResults>
        {(data?.status || error?.status) && (
          <Message errorCode={error?.status} successCode={data?.status} />
        )}

        <EmailPreview
          emailList={emailList}
          handleEmailInclusion={handleEmailInclusion}
          sendEmails={sendEmails}
          isLoading={isLoading}
          failedEmails={error?.emails}
        />
      </StyledResults>
    </StyledWrapper>
  )
}

export default UploadPage

const StyledWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`
const StyledResults = styled.div`
  position: relative;
  padding-top: 3em;
`
