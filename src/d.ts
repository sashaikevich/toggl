export type EmailList = Record<string, FileDetails>

export interface Email {
  email: string
  isIncluded: boolean
}
export type NormalizedEmail = Email & {
  id: string
}

interface FileDetails {
  id: number
  fileName: string
  date: number
  emails: Email[]
}
