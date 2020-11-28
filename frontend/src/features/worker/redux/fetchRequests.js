import axios from 'axios'
import { useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  WORKER_FETCH_REQUESTS_BEGIN,
  WORKER_FETCH_REQUESTS_SUCCESS,
  WORKER_FETCH_REQUESTS_FAILURE,
  WORKER_FETCH_REQUESTS_DISMISS_ERROR,
} from './constants'
import { SERVER_API } from '../../common/redux/constants'

export function fetchRequests(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: WORKER_FETCH_REQUESTS_BEGIN,
    })

    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.get(`${SERVER_API}/requests`)

      doRequest.then(
        res => {
          dispatch({
            type: WORKER_FETCH_REQUESTS_SUCCESS,
            data: res.data,
          })
          resolve(res)
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: WORKER_FETCH_REQUESTS_FAILURE,
            data: { error: err },
          })
          reject(err)
        },
      )
    })

    return promise
  }
}

export function dismissFetchRequestsError() {
  return {
    type: WORKER_FETCH_REQUESTS_DISMISS_ERROR,
  }
}

export function useFetchRequests() {
  const dispatch = useDispatch()

  const { requestsList, fetchRequestsPending, fetchRequestsError } = useSelector(
    state => ({
      requestsList: state.worker.requestsList,
      fetchRequestsPending: state.worker.fetchRequestsPending,
      fetchRequestsError: state.worker.fetchRequestsError,
    }),
    shallowEqual,
  )

  const boundAction = useCallback(() => dispatch(fetchRequests()), [dispatch])

  const boundDismissError = useCallback(() => {
    dispatch(dismissFetchRequestsError())
  }, [dispatch])

  return {
    requestsList,
    fetchRequests: boundAction,
    fetchRequestsPending,
    fetchRequestsError,
    dismissFetchRequestsError: boundDismissError,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case WORKER_FETCH_REQUESTS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchRequestsPending: true,
        fetchRequestsError: null,
      }

    case WORKER_FETCH_REQUESTS_SUCCESS:
      // The request is success
      return {
        ...state,
        requestsList: action.data,

        fetchRequestsPending: false,
        fetchRequestsError: null,
      }

    case WORKER_FETCH_REQUESTS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchRequestsPending: false,
        fetchRequestsError: action.data.error,
      }

    case WORKER_FETCH_REQUESTS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchRequestsError: null,
      }

    default:
      return state
  }
}
