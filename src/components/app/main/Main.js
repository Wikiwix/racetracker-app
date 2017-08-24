import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';

import Nav from './Nav';
import Chat from '../../chat/Chat';
import Home from '../../home/Home';
import Race from '../../race/Race';
import FourOhFour from '../../404/FourOhFour';

import logo from '../../../media/ds-full-logo-horizontal.svg';
import './main.css';

/** This is the main screen of the app, this will display the routes for the buttons */
class Main extends React.Component {
  render() {
    let { token, history } = this.props;

    if (!token) { // All content in main needs a valid token
      let to = `/login?redirect=${window.location.pathname}`;
      return <Redirect to={to} />;
    }

    // todo have the selected route change the bottom navigation index
    return (
      <content className="main">
        <header>
          <AppBar title={<img className="logo" src={logo} alt=""/>}/>
        </header>

        <main>
          <Switch>
            <Route path="/race" component={Race} />
            <Route path="/chat" component={Chat} />
            <Route path="/404" component={FourOhFour} />
            <Route path="/" exact component={Home} />
            <Route path="/" component={() => <Redirect to="/404" />} /> {/* Must be last */}
          </Switch>
        </main>

        <footer>
          <Nav history={history}/>
        </footer>
      </content>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    token: state.auth.token
  })
};

export default connect(mapStateToProps)(Main);
