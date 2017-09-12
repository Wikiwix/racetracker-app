/*
 * Application entry file, contains only setup and boilerplate
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Loading from './components/app/loading/Loading';

// css styling
import 'mdi/css/materialdesignicons.css';
import './styles/dronesquad.css';
// material-ui needs this for the onTouchTap plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// keep all urls under hashbang (cordova)
window.history.replaceState(null, document.title, '/' + (window.location.hash || '#!/'));

// root dom element to attach application
const appEl = document.getElementById('app');

// initial render: displays loading screen while device/app is prepared
ReactDOM.render(
  <AppContainer>
    <Loading isLoading={true} />
  </AppContainer>,
  appEl
);

// hot module swapping (development use only)
if (module.hot) {
  module.hot.accept('./components/app/loading/Loading', () => {
    ReactDOM.render(
      <AppContainer>
        <Loading isLoading={false} />
      </AppContainer>,
      appEl
    );
  });
}
