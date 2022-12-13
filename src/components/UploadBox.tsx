import { useState, useRef, useEffect } from "react"

const UploadBox = () => {
  // const [files, setFiles] = useState<FileList>()
  const fileNames: string[] = []
  const [emails, setEmails] = useState<EmailWithSource[]>(
    [] as EmailWithSource[]
  )

  interface EmailWithSource {
    email: string
    fileName: string
  }

  // const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(files: FileList) {
    Array.from(files).map((file, i) => {
      fileNames.push(file.name)

      const reader = new FileReader()
      // tood add a try catch to gracefully handle files of the wrong type

      reader.onload = fileContent => {
        let emailLines: string[]

        if (typeof fileContent.target?.result === "string") {
          emailLines = fileContent.target.result.split(/\n/)
          const emailWithSource: EmailWithSource[] = emailLines.map(email => {
            return { email, fileName: file.name }
          })
          setEmails(prev => [...prev, ...emailWithSource])
        }
      }
      reader.readAsText(file)
    })
  }

  return (
    <>
      <form action="" onSubmit={e => e.preventDefault()}>
        <input
          type="file"
          accept=".txt"
          multiple
          required
          // ref={inputRef}
          onChange={e => {
            if (e.target.files?.length) {
              handleFileChange(e.target.files)
            }
          }}
        />
      </form>

      <ul>
        {fileNames.map(name => (
          <span key={name}>{name}</span>
        ))}
        Emails:
        {emails.map((email, idx) => {
          // give a unique key, based on the data, and add index in case there are duplicate addresses
          return (
            <li key={email.email + idx}>
              {email.email} from {email.fileName}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default UploadBox
