// export interface EmailList {
//   [key: number]: FileDetails
// }

export type FileList = Record<string, FileDetails>

export interface Email {
  email: string
  isIncluded: boolean
}
interface FileDetails {
  id: number
  fileName: string
  date: number
  emails: Email[]
}
