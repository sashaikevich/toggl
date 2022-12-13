import type { FileList } from "./d"

export function fileIsDuplicate(file: File, fileList: FileList) {
  // check the file name and the file size. Same name and size will assume that it's the same file (though that's not 100% true)
  // todo or check by creation date or last modified date

  const fileIds = Object.keys(fileList)

  return fileIds.some(
    id =>
      fileList[id].fileName === file.name &&
      fileList[id].date === file.lastModified
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
