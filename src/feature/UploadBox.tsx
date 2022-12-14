import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { useImmer } from "use-immer"
import DropBox from "./DropBox"
import EmailPreview from "./EmailsPreview"
import { fileIsDuplicate, extractEmailsFromFile, isEmpty } from "./utils"
import type { EmailList } from "./d"
import { sendAPI } from "./api/sendAPI"

const UploadBox = () => {
  const [emailList, setEmailList] = useImmer<EmailList>({})
  const fileId = useRef<number>(1)

  // to allow user to "dispatch" an exclude action when they click on "ignore duplicate emails"
  // individual hanle functions are used, instead of a more DRY toggle approach. This ensures
  // email addresses stay excluded from the mailing list, and don't unintentionally switch to
  // being included

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
          // handle files from different directories being uploaded with the same name. Override or add?
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

          // setEmails(prevEmails => [...prevEmails, ...fileContent])
        } catch (err) {
          console.log(err)
        }
      })
    }
  }

  return (
    <StyledWrapper>
      <DropBox handleFileChange={handleFileChange} />

      {!isEmpty(emailList) && (
        <EmailPreview
          emailList={emailList}
          handleExcludeEmail={handleExcludeEmail}
          handleIncludeEmail={handleIncludeEmail}
          sendAPI={sendAPI}
        />
      )}
    </StyledWrapper>
  )
}

export default UploadBox

const StyledWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`
