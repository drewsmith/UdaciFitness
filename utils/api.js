import { AsyncStorage } from 'react-native'
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calendar'

export const fetchCalendarResults = () => (
  AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then(formatCalendarResults)
)

export const submitEntry = ({ entry, key }) => (
  AsyncStorage.mergeItem(
    CALENDAR_STORAGE_KEY,
    JSON.stringify({ [key]: entry})
  )
)

export const removeEntry = () => {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then((results) => {
      const data = JSON.parse(results)

      data[key] = undefiend
      delete data[key]

      AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
    })
}
