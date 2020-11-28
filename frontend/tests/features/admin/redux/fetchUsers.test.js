import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_FETCH_USERS_BEGIN,
  ADMIN_FETCH_USERS_SUCCESS,
  ADMIN_FETCH_USERS_FAILURE,
  ADMIN_FETCH_USERS_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  fetchUsers,
  dismissFetchUsersError,
  reducer,
} from '../../../../src/features/admin/redux/fetchUsers';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/fetchUsers', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchUsers succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchUsers())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_FETCH_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_FETCH_USERS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchUsers fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchUsers({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_FETCH_USERS_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_FETCH_USERS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchUsersError', () => {
    const expectedAction = {
      type: ADMIN_FETCH_USERS_DISMISS_ERROR,
    };
    expect(dismissFetchUsersError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_FETCH_USERS_BEGIN correctly', () => {
    const prevState = { fetchUsersPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_FETCH_USERS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUsersPending).toBe(true);
  });

  it('handles action type ADMIN_FETCH_USERS_SUCCESS correctly', () => {
    const prevState = { fetchUsersPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_FETCH_USERS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUsersPending).toBe(false);
  });

  it('handles action type ADMIN_FETCH_USERS_FAILURE correctly', () => {
    const prevState = { fetchUsersPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_FETCH_USERS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUsersPending).toBe(false);
    expect(state.fetchUsersError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_FETCH_USERS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUsersError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_FETCH_USERS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchUsersError).toBe(null);
  });
});

