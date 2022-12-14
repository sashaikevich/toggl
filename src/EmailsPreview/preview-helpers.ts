import type { NormalizedEmail } from "../d"

export function getDuplicateEmailsById(allEmails: NormalizedEmail[]) {
  const emailsByAddress = allEmails.map(({ email }) => email)

  const duplicatesById = allEmails
    .filter((email, idx) => emailsByAddress.indexOf(email.email) !== idx)
    .map(({ id }) => id)
  return duplicatesById
}
