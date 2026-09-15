const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createConfigurationId(date = new Date()): string {
  const year = date.getFullYear()
  let token = ''
  for (let i = 0; i < 5; i += 1) {
    token += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return `CFG-${year}-${token}`
}
