import type { EmailList, NormalizedEmail } from "./d"

export function fileIsDuplicate(file: File, emailList: EmailList) {
  // check the file name and the file size. Same name and size will assume that it's the same file (though that's not 100% true)
  // todo or check by creation date or last modified date

  const fileIds = Object.keys(emailList)

  return fileIds.some(
    id =>
      emailList[id].fileName === file.name &&
      emailList[id].date === file.lastModified
  )
}

export async function extractEmailsFromFile(file: File) {
  return new Promise<string[]>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = fileContent => {
      if (typeof fileContent.target?.result === "string") {
        const emailsByLine = fileContent.target.result.split(/\n/)
        resolve(emailsByLine)
      } else {
        reject("not a txt file")
      }
    }

    reader.readAsText(file)
  })
}

export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0
}

export function getDuplicatesById(allEmails: NormalizedEmail[]) {
  const emailsByAddress = allEmails.map(({ email }) => email)

  const duplicatesById = allEmails
    .filter((email, idx) => emailsByAddress.indexOf(email.email) !== idx)
    .map(({ id }) => id)
  return duplicatesById
}
