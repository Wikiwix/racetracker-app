// @flow
import { connect } from 'react-redux';
import FlyoverSetting from '../components/settings/FlyoverSetting';

import { setRaceMode } from '../modules/racetracker';

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, a DeviceSettings */

const mapStateToProps = (state, ownProps) => ({
  raceMode: state.trackers.filter(t => t.id === ownProps.id)[0].raceMode
});

const mapDispatchToProps = (dispatch: Function) => ({
  setRaceMode: object => dispatch(setRaceMode(object))
});

const FlyoverSettingContainer = connect(mapStateToProps, mapDispatchToProps)(FlyoverSetting);

export default FlyoverSettingContainer;