import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';

import Nav from './Nav';
import Chat from '../../../routes/chat/components/Chat';
import Home from '../../../routes/home';
import Fly from '../../../routes/fly/components/Fly';
import FourOhFour from '../../404/components/FourOhFour';
import Group from '../../../routes/group/containers/GroupContainer';
import logo from '../../../media/ds-full-logo-horizontal.svg';
import './main.css';

/** This is the main screen of the app, this will display the routes for the buttons */
export default class Main extends Component {
  props: {
    isDeviceConnected: boolean
  };
  render() {
    let { history } = this.props;
    // TODO: have the selected route change the bottom navigation index
    return (
      <content className="main">
        <header>
          <AppBar title={<img className="logo" src={logo} alt="" />} />
        </header>
        <main>
          <Switch>
            <Route path="/group/:id" component={Group} />
            <Route path="/fly" component={Fly} />
            <Route path="/chat" component={Chat} />
            <Route path="/404" component={FourOhFour} />
            <Route path="/" exact component={Home} />
            <Route path="/" component={() => <Redirect to="/404" />} /> {/* Must be last */}
          </Switch>
        </main>
        <footer>
          <Nav history={history} />
        </footer>
      </content>
    );
  }
}