import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  WORKER_FETCH_REQUESTS_BEGIN,
  WORKER_FETCH_REQUESTS_SUCCESS,
  WORKER_FETCH_REQUESTS_FAILURE,
  WORKER_FETCH_REQUESTS_DISMISS_ERROR,
} from '../../../../src/features/worker/redux/constants';

import {
  fetchRequests,
  dismissFetchRequestsError,
  reducer,
} from '../../../../src/features/worker/redux/fetchRequests';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('worker/redux/fetchRequests', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchRequests succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchRequests())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', WORKER_FETCH_REQUESTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', WORKER_FETCH_REQUESTS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchRequests fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchRequests({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', WORKER_FETCH_REQUESTS_BEGIN);
        expect(actions[1]).toHaveProperty('type', WORKER_FETCH_REQUESTS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchRequestsError', () => {
    const expectedAction = {
      type: WORKER_FETCH_REQUESTS_DISMISS_ERROR,
    };
    expect(dismissFetchRequestsError()).toEqual(expectedAction);
  });

  it('handles action type WORKER_FETCH_REQUESTS_BEGIN correctly', () => {
    const prevState = { fetchRequestsPending: false };
    const state = reducer(
      prevState,
      { type: WORKER_FETCH_REQUESTS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRequestsPending).toBe(true);
  });

  it('handles action type WORKER_FETCH_REQUESTS_SUCCESS correctly', () => {
    const prevState = { fetchRequestsPending: true };
    const state = reducer(
      prevState,
      { type: WORKER_FETCH_REQUESTS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRequestsPending).toBe(false);
  });

  it('handles action type WORKER_FETCH_REQUESTS_FAILURE correctly', () => {
    const prevState = { fetchRequestsPending: true };
    const state = reducer(
      prevState,
      { type: WORKER_FETCH_REQUESTS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRequestsPending).toBe(false);
    expect(state.fetchRequestsError).toEqual(expect.anything());
  });

  it('handles action type WORKER_FETCH_REQUESTS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRequestsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: WORKER_FETCH_REQUESTS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchRequestsError).toBe(null);
  });
});

