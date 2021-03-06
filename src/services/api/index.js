import config from './config.json';
import url from 'url';
import axios from 'axios';

import { notNull } from '../../utils';

/** The API class will handle all the requests to the API server */
export class Api {
  constructor() {
    this._config = { ...config, lb: url.resolve(config.api, '/api/') };
    this._token = null;
    this._axios = axios.create({
      baseURL: this._config.lb
    });
  }

  static get() {
    if (!Api._instance) {
      Api._instance = new Api();
    }
    return Api._instance;
  }

  /** Update the token */
  _updateToken(token) {
    if (!token) return;
    this._token = {
      hash: token.id || token.hash,
      ttl: token.ttl,
      pilot: token.userId || token.pilot,
      created: token.created
    };
    this._axios.defaults.headers.common['Authorization'] = this._token.hash;
  }

  /** Create the request, todo add error handling and add middleware */
  request(base, endpoint, options) {
    return base(endpoint, options).then(response => ({ ...response.data, $response: response })).catch(error => {
      window.onerror(error);
    });
  }

  /** Return urls for things, genneraly used for redirects or picture */
  urls = {
    /** Get the avatar for the pilot id oo the current pilot */
    avatar: id => {
      return url.resolve(this._config.api, `avatar/${id || this._token.pilot || notNull(id, 'id')}`);
    },

    /** Get the banner for the group */
    banner: id => {
      return url.resolve(this._config.api, `banner/${notNull(id, 'id')}`);
    }
  };

  /** Pilots endpoint */
  pilots = {
    /** Login the user, payload is {email, password} */
    login: (email, password) => {
      return this.request(this._axios.post, 'pilots/login', {
        email: notNull(email, 'email'),
        password: notNull(password, 'password')
      }).then(json => {
        this._updateToken(json);
        return json;
      });
    },

    /** If the user login token is set, logout the user on the server side */
    logout: token => {
      return this.request(this._axios.post, `pilots/logout?access_token=${token || this._token.hash}`).then(json => {
        if (!token) {
          this._token = null;
          delete this._axios.defaults.headers.common['Authorization'];
        }
        return json;
      });
    },

    /** Create a new account */
    register: (firstName, lastName, callsign, email, password) => {
      return this.request(this._axios.post, 'pilots', {
        firstName: notNull(firstName, 'firstName'),
        lastName: notNull(lastName, 'lastName'),
        callsign: notNull(callsign, 'callsign'),
        email: notNull(email, 'email'),
        password: notNull(password, 'password')
      });
    },

    /** Send a password reset link for the account */
    forgot: email => {
      return this.request(this._axios.post, 'pilots/reset', { email: notNull(email, 'email') });
    },

    /** Get the current groups for the pilot sorted by the location lat lng*/
    groups: (lat, lng) => {
      return this.request(this._axios.get, `pilots/${notNull(this._token.pilot, 'pilot')}/myRaceGroups`, {
        params: {
          lat: notNull(lat, 'lat'),
          lng: notNull(lng, 'lng')
        }
      });
    },

    /** Get the rsvps for the pilot */
    rsvps: () => {
      return this.request(this._axios.get, `pilots/${notNull(this._token.pilot, 'pilot')}/rsvps`, {
        params: {
          // lat: notNull(lat, 'lat'),
          // lng: notNull(lng, 'lng')
        }
      });
    }
  };

  /** Get the pilot or the current logged in pilot */
  pilot = id => {
    return this.request(this._axios.get, `pilots/${id || this._token.pilot || notNull(id, 'id')}`);
  };

  /** All actions that can be taken on a group */
  groups = {
    /** Get the list of all members that are part of the group */
    members: (id, filter) => {
      return this.request(this._axios.get, `raceGroups/${notNull(id, 'id')}/members`, {
        params: {
          filter: JSON.stringify(filter)
        }
      });
    },

    /** Get the count of members */
    memberCount: id => {
      return this.request(this._axios.get, `raceGroups/${notNull(id, 'id')}/members/count`);
    }
  };

  /** Get the group from the id */
  group = id => {
    return this.request(this._axios.get, `raceGroups/${notNull(id, 'id')}`);
  };

  /** Public API endpoints that do not need an api key */
  public = {
    pilot: id => {
      return axios.get(`${this._config.api}/pilot/${notNull(id, 'id')}`).then(response => response.data);
    }
  };
}

export default Api.get();
