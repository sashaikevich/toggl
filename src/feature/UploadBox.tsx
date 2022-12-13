import React, { useState, useRef, useEffect } from "react"
import { fileIsDuplicate, extractEmailsFromFile, isEmpty } from "./utils"
import EmailPreview from "./EmailsPreview"
import type { FileList } from "./d"

const UploadBox = () => {
  const [fileList, setFileList] = useState<FileList>({})
  const fileId = useRef<number>(1)

  // async function extractEmailsFromFile(file: File) {
  //   return new Promise<EmailWithSource[]>((resolve, reject) => {
  //     const reader = new FileReader()

  //     reader.onload = fileContent => {
  //       let emailLines: string[]

  //       if (typeof fileContent.target?.result === "string") {
  //         emailLines = fileContent.target.result.split(/\n/)
  //         const emailWithSource: EmailWithSource[] = emailLines.map(email => {
  //           return { email, fileName: file.name }
  //         })

  //         resolve(emailWithSource)
  //       } else {
  //         reject("not a txt file")
  //       }
  //     }

  //     reader.readAsText(file)
  //   })
  // }

  // const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      const uploadedFiles = Array.from(e.target.files)

      uploadedFiles.forEach(async file => {
        try {
          // handle files from different directories being uploaded with the same name. Override or add?
          if (!fileIsDuplicate(file, fileList)) {
            const emailsFromFile = await extractEmailsFromFile(file)
            const emailsWithId = emailsFromFile.map((email, idx) => ({
              id: `${fileId.current}"_"${idx}`,
              email,
              isIncluded: true,
            }))

            const fileData: FileList = {
              [fileId.current]: {
                id: fileId.current,
                fileName: file.name,
                date: file.lastModified,
                emails: emailsWithId,
              },
            }

            setFileList(prevList => ({ ...prevList, ...fileData }))
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
    <>
      <form action="" onSubmit={e => e.preventDefault()}>
        <input
          type="file"
          accept=".txt"
          multiple
          required
          onChange={handleFileChange}
        />
      </form>

      {!isEmpty(fileList) && <EmailPreview fileList={fileList} />}
      {/* {fileList?.length > 0 && (
        <>
          {fileList.map((list, idx) => {
            return <span key={list.name + idx}>{list.name}</span>
          })}
        </>
      )} */}
    </>
  )
}

// return (
//   <>
//

//     <ul>
//       {fileNames.map(name => (
//         <span key={name}>{name}</span>
//       ))}
//       Emails:
//       {emails.map((email, idx) => {
//         // give a unique key, based on the data, and add index in case there are duplicate addresses
//         return (
//           <li key={email.email + idx}>
//             {email.email} from {email.fileName}
//           </li>
//         )
//       })}
//     </ul>
//   </>
// )

export default UploadBox
