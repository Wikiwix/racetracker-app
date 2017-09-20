import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { FontIcon } from 'material-ui';
import { rssiToPercentage } from '../../../utils';
import { ListItem, Snackbar } from 'material-ui';

// import { connectTracker, disconnectTracker } from '../../reducers/tracker';

export const DeviceProperties = (props: { name: string, rssi: string }) => {
  return (
    <div className="device">
      <h3>
        {props.name}
      </h3>
      <span className="detail">
        <FontIcon className="mdi mdi-radio-tower" />
        {rssiToPercentage(props.rssi)}
      </span>
    </div>
  );
};

class TrackerDevice extends Component {
  props: {
    id: string,
    name: string,
    rssi: string,
    isConnecting: boolean,
    isConnected: boolean,
    connectSuccess: Function,
    connectFailure: Function
  };

  /** Connect to the tracker */
  connect = () => {
    if ('ble' in window) {
      window.ble.connect(this.props.id, this.props.connectSuccess, this.props.connectFailure);
    } else {
      this.props.connectSuccess();
    }
  };

  /** Open the settings for the tracker */
  openSettings = () => {
    console.log('openSettings');
    // TODO: handle navigaion
    this.props.history.push('/tracker/settings', this.props.id);
  };

  render() {
    let deviceLogo = <FontIcon className="ds-blue-text pull-icon-down mdi mdi-timer" />;
    let deviceComponent = <DeviceProperties name={this.props.name} rssi={this.props.rssi} />;
    let extraProps = { key: this.props.id, primaryText: deviceComponent, leftIcon: deviceLogo };
    let icon = <FontIcon className="pull-icon-down mdi mdi-settings" />;
    if (this.props.isConnected) {
      return <ListItem {...extraProps} rightIcon={icon} onClick={this.openSettings} />;
    }
    return (
      <div>
        <Snackbar open={this.props.isConnecting} message="Connecting..." />
        <ListItem {...extraProps} onClick={this.connect} />
      </div>
    );
  }
}

/*const mapStateToProps = (state, ownProps) => ({
  isConnecting: state.trackers.filter(t => t.id === ownProps.id)[0].isConnecting,
  isConnected: state.trackers.filter(t => t.id === ownProps.id)[0].isConnected
<<<<<<< HEAD:src/routes/tracker/components/TrackerDevice.js
});*/
=======
});
>>>>>>> 750b6074b02f01415b00b03e3d97fb1d277ac76a:src/components/tracker/TrackerDevice.js

/*const mapDispatchToProps = (dispatch: Function, ownProps) => ({
  connectSuccess() {
    console.log('connection success: ' & ownProps.id);
    dispatch(connectTracker(ownProps.id));
  },
  connectFailure(device) {
    console.log('connection failed disconnected: ' & device.id);
    dispatch(disconnectTracker(device.id));
  }
});*/

// export default connect(mapStateToProps, mapDispatchToProps)(TrackerDevice);

export default TrackerDevice;
