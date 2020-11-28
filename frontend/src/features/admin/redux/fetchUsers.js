import axios from 'axios'
import { useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  ADMIN_FETCH_USERS_BEGIN,
  ADMIN_FETCH_USERS_SUCCESS,
  ADMIN_FETCH_USERS_FAILURE,
  ADMIN_FETCH_USERS_DISMISS_ERROR,
} from './constants'
import { SERVER_API } from '../../common/redux/constants'

export function fetchUsers(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_FETCH_USERS_BEGIN,
    })

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${SERVER_API}/users`)
      doRequest.then(
        res => {
          dispatch({
            type: ADMIN_FETCH_USERS_SUCCESS,
            data: res.data,
          })
          resolve(res)
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ADMIN_FETCH_USERS_FAILURE,
            data: { error: err },
          })
          reject(err)
        },
      )
    })

    return promise
  }
}

export function dismissFetchUsersError() {
  return {
    type: ADMIN_FETCH_USERS_DISMISS_ERROR,
  }
}

export function useFetchUsers() {
  const dispatch = useDispatch()

  const { usersList, fetchUsersPending, fetchUsersError } = useSelector(
    state => ({
      usersList: state.admin.usersList,
      fetchUsersPending: state.admin.fetchUsersPending,
      fetchUsersError: state.admin.fetchUsersError,
    }),
    shallowEqual,
  )

  const boundAction = useCallback(
    (...args) => {
      return dispatch(fetchUsers(...args))
    },
    [dispatch],
  )

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFetchUsersError())
  }, [dispatch])

  return {
    usersList,
    fetchUsers: boundAction,
    fetchUsersPending,
    fetchUsersError,
    dismissFetchUsersError: boundDismissError,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_FETCH_USERS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchUsersPending: true,
        fetchUsersError: null,
      }

    case ADMIN_FETCH_USERS_SUCCESS:
      // The request is success
      return {
        ...state,
        usersList: action.data,

        fetchUsersPending: false,
        fetchUsersError: null,
      }

    case ADMIN_FETCH_USERS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchUsersPending: false,
        fetchUsersError: action.data.error,
      }

    case ADMIN_FETCH_USERS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchUsersError: null,
      }

    default:
      return state
  }
}
