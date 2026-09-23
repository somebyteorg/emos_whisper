import dayjs from 'dayjs'

export function formatWhisperDate(value: string) {
  const date = dayjs(value)
  return date.isValid() ? date.format('YYYY.MM.DD  HH:mm') : value
}
