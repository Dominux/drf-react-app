import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_CREATE_REQUEST_BEGIN,
  ADMIN_CREATE_REQUEST_SUCCESS,
  ADMIN_CREATE_REQUEST_FAILURE,
  ADMIN_CREATE_REQUEST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  createRequest,
  dismissCreateRequestError,
  reducer,
} from '../../../../src/features/admin/redux/createRequest';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/createRequest', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when createRequest succeeds', () => {
    const store = mockStore({});

    return store.dispatch(createRequest())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_CREATE_REQUEST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_CREATE_REQUEST_SUCCESS);
      });
  });

  it('dispatches failure action when createRequest fails', () => {
    const store = mockStore({});

    return store.dispatch(createRequest({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_CREATE_REQUEST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_CREATE_REQUEST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCreateRequestError', () => {
    const expectedAction = {
      type: ADMIN_CREATE_REQUEST_DISMISS_ERROR,
    };
    expect(dismissCreateRequestError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_CREATE_REQUEST_BEGIN correctly', () => {
    const prevState = { createRequestPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_CREATE_REQUEST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createRequestPending).toBe(true);
  });

  it('handles action type ADMIN_CREATE_REQUEST_SUCCESS correctly', () => {
    const prevState = { createRequestPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_CREATE_REQUEST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createRequestPending).toBe(false);
  });

  it('handles action type ADMIN_CREATE_REQUEST_FAILURE correctly', () => {
    const prevState = { createRequestPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_CREATE_REQUEST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createRequestPending).toBe(false);
    expect(state.createRequestError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_CREATE_REQUEST_DISMISS_ERROR correctly', () => {
    const prevState = { createRequestError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_CREATE_REQUEST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.createRequestError).toBe(null);
  });
});

