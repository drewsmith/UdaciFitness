export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES'
export const ADD_ENTRY = 'ADD_ENTRY'
import { fetchCalendarResults } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'

export const retrieveCalendarResults = () => {
  return dispatch => {
    return fetchCalendarResults()
        .then(entries => {
          dispatch(receiveEntries(entries))
          if(!entries[timeToString()]) {
            dispatch(addEntry({
              [timeToString()]: getDailyReminderValue()
            }))
          }
        })
  }
}

export const receiveEntries = (entries) => ({
  type: RECEIVE_ENTRIES,
  entries,
})

export const addEntry = (entry) => ({
  type: ADD_ENTRY,
  entry,
})
