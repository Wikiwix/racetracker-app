import api from '../../../services/api';
import { push } from 'react-router-redux';

/** types/constants */
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const FORGOT_REQUEST = 'FORGOT_REQUEST';
export const FORGOT_SUCCESS = 'FORGOT_SUCCESS';
export const FORGOT_FAILURE = 'FORGOT_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

/** actions */
export const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: token
});

export const loginFailure = response => ({
  type: LOGIN_FAILURE,
  payload: response
});

export const forgotSuccess = message => ({
  type: FORGOT_SUCCESS,
  payload: message
});

export const forgotFailure = response => ({
  type: FORGOT_FAILURE,
  payload: response
});

export const registerSuccess = message => ({
  type: REGISTER_SUCCESS,
  payload: message
});

export const registerFailure = message => ({
  type: REGISTER_FAILURE,
  payload: message
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
  payload: null
});

export const logoutFailure = () => ({
  type: LOGOUT_FAILURE,
  payload: null
});

export const loginRequest = credentials => {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUEST,
      payload: credentials
    });
    return api.pilots
      .login(credentials.login, credentials.password)
      .then(response => {
        let token = {
          hash: response.id,
          ttl: response.ttl,
          pilot: response.userId,
          created: response.created
        };
        dispatch(loginSuccess(token));
      })
      .catch(error => {
        dispatch(loginFailure({ error: error, message: 'Invalid email or password' }));
      });
  };
};

export const forgotRequest = email => {
  return dispatch => {
    dispatch({
      type: FORGOT_REQUEST,
      payload: email
    });
    return api.pilots
      .forgot(email)
      .then(response => {
        dispatch(forgotSuccess('Email has been sent'));
        dispatch(push('/account/login'));
      })
      .catch(error => {
        dispatch(forgotFailure({ error: error, message: 'Invalid email' }));
      });
  };
};

export const registerRequest = register => {
  return dispatch => {
    dispatch({
      type: REGISTER_REQUEST,
      payload: register
    });
    return api.pilots
      .register(register.firstName, register.lastName, register.callsign, register.email, register.password)
      .then(() => {
        dispatch(registerSuccess('Account has been created'));
        dispatch(push('/account/login'));
      })
      .catch(error => {
        dispatch(registerFailure({ error: error, message: 'Signup Failed' }));
      });
  };
};

export const logoutRequest = token => {
  return dispatch => {
    dispatch({
      type: LOGOUT_REQUEST,
      payload: token
    });
    return api.pilots
      .logout(token.token)
      .then(() => {
        dispatch(logoutSuccess());
        dispatch(push('/account/login'));
      })
      .catch(error => {
        dispatch(logoutFailure({ error: error, message: 'Signout Failed' }));
        dispatch(push('/account/login'));
      });
  };
};

/** initial_state */
const initialState = {
  message: '',
  token: null,
  error: null,
  loading: false
};

/** reducers */
export default function(state = initialState, action: Action) {
  switch (action.type) {
    case REGISTER_REQUEST:
    case FORGOT_REQUEST:
    case LOGIN_REQUEST: {
      return { ...state, error: null, message: '', loading: true };
    }
    case LOGOUT_SUCCESS:
    case LOGIN_SUCCESS: {
      return {
        ...state,
        token: action.payload,
        error: null,
        message: '',
        loading: false
      };
    }
    case REGISTER_FAILURE:
    case FORGOT_FAILURE:
    case LOGIN_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
        loading: false
      };
    }
    case REGISTER_SUCCESS:
    case FORGOT_SUCCESS: {
      return { ...state, error: null, message: action.payload, loading: false };
    }
    case 'persist/REHYDRATE': {
      if (action.payload !== undefined) {
        api._updateToken(action.payload.auth.token); // update the api as well
        return { ...state, ...action.payload.auth };
      }
      return { ...state };
    }
    default:
      return { ...state, error: null, message: '', loading: false };
  }
}
