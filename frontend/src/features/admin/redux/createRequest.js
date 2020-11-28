import axios from 'axios'
import { useCallback } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  ADMIN_CREATE_REQUEST_BEGIN,
  ADMIN_CREATE_REQUEST_SUCCESS,
  ADMIN_CREATE_REQUEST_FAILURE,
  ADMIN_CREATE_REQUEST_DISMISS_ERROR,
} from './constants'
import { SERVER_API } from '../../common/redux/constants'

export function createRequest(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_CREATE_REQUEST_BEGIN,
    })

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${SERVER_API}/create_request`)

      doRequest.then(
        res => {
          dispatch({
            type: ADMIN_CREATE_REQUEST_SUCCESS,
            data: res,
          })
          resolve(res)
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ADMIN_CREATE_REQUEST_FAILURE,
            data: { error: err },
          })
          reject(err)
        },
      )
    })

    return promise
  }
}

export function dismissCreateRequestError() {
  return {
    type: ADMIN_CREATE_REQUEST_DISMISS_ERROR,
  }
}

export function useCreateRequest() {
  const dispatch = useDispatch()

  const { createRequestPending, createRequestError } = useSelector(
    state => ({
      createRequestPending: state.admin.createRequestPending,
      createRequestError: state.admin.createRequestError,
    }),
    shallowEqual,
  )

  const boundAction = useCallback(
    (...args) => {
      return dispatch(createRequest(...args))
    },
    [dispatch],
  )

  const boundDismissError = useCallback(() => {
    return dispatch(dismissCreateRequestError())
  }, [dispatch])

  return {
    createRequest: boundAction,
    createRequestPending,
    createRequestError,
    dismissCreateRequestError: boundDismissError,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_CREATE_REQUEST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        createRequestPending: true,
        createRequestError: null,
      }

    case ADMIN_CREATE_REQUEST_SUCCESS:
      // The request is success
      return {
        ...state,
        createRequestPending: false,
        createRequestError: null,
      }

    case ADMIN_CREATE_REQUEST_FAILURE:
      // The request is failed
      return {
        ...state,
        createRequestPending: false,
        createRequestError: action.data.error,
      }

    case ADMIN_CREATE_REQUEST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        createRequestError: null,
      }

    default:
      return state
  }
}
