import type { EmailList } from "../d"

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

export function fileIsDuplicate(file: File, emailList: EmailList) {
  const fileIds = Object.keys(emailList)
  return fileIds.some(
    id =>
      emailList[id].fileName === file.name &&
      emailList[id].date === file.lastModified
  )
}
