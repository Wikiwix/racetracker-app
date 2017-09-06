/** types/constants */
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';

/** actions */
export const authorize = (login, password) => ({
  type: AUTH_REQUEST,
  payload: { login, password }
});

const DEFAULT_STATE = {
  // TODO: pull this token from proper storage
  token: localStorage.getItem('token'),
  error: null
};

/** include selectors here */

/** initial_state & reducers */
export const authReducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case AUTH_SUCCESS: {
      return { ...state, token: payload };
    }
    case AUTH_FAILURE: {
      return { ...state, error: payload };
    }
    default:
      return state;
  }
};