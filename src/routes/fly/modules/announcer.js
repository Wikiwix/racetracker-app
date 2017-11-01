import { sendVoice } from '../../../global/voice/modules/voice';

let cacheTable = (window.__announcer_cacheTable = {}); // cache table prevent multiple laps from being called out

/** Split the mills into an array of mins, seconds, mills */
function splitMillsToArray(ms) {
  let mins = Math.floor(ms / 60000);
  return [mins, Math.floor(ms / 1000) - mins * 60, Math.floor(ms % 1000)];
}

/** Make the speech of the announcer sound normal, though with out a proper text to speech engine this will */
function humanSpeech(millis) {
  let speech = '';
  let [mins, seconds, ms] = splitMillsToArray(millis);

  if (ms > 100 && ms % 10 >= 5) {
    // round to the 10th position
    ms = `${Math.floor(ms % 1000 / 100)}${Math.floor(ms % 100 / 10) + 1}`;
  } else if (ms > 100 && ms % 10 < 5) {
    ms = `${Math.floor(ms % 1000 / 100)}${Math.floor(ms % 100 / 10)}`;
  }

  while (ms > 0 && ms % 10 === 0) {
    // Only show leading zeros
    ms /= 10;
  }

  if (mins > 0) {
    // show minutes is it has minutes
    speech += mins + ' minute(s), ';
  }

  if (seconds > 0 && ms > 0) {
    // Show both seconds and millis
    speech += seconds + '.' + ms + ' second(s)';
  } else if (seconds > 0 && ms <= 0) {
    // Only show the seconds
    speech += seconds + ' second(s)';
  } else {
    // Only show the point of a seconds
    speech += '.' + ms + ' second(s)';
  }

  return speech;
}

/** Read the response from the payload and announce the values */
export function announceLapsFromResponse(response) {
  return (dispatch, getStore) => {
    let store = getStore();
    let activeHeat = store.race.activeHeat;
    let key = (0x1 << response.racer) * response.racer + response.lap;
    let heatTable = cacheTable[activeHeat] || (cacheTable[activeHeat] = {});
    if (!(key in heatTable)) {
      heatTable[key] = true;
      if (!store.race.laps) {
        console.log("CHECK FASTEST");
        checkFastestLap(store.race.laps, response)
        // todo check if current lap is the fastest lap
      }
      dispatch(announceLap(response.racer, response.lapTime));
    }
  };
}

export function checkFastestLap(laps, response) {
  console.log(laps);
  console.log(response);
/*  if (store.race.laps.length > 1) {
    if (laps[0].lapTime === 0) {
      return msToClock(laps[1].lapTime);
    }
  }
  return msToClock(laps[0].lapTime);*/
  // dispatch(sendVoice('New Fastest Lap'));
};


/** Will announce the lap */
export function announceLap(person, time) {
  return (dispatch, getStore) => {
    //let store = getStore();
    let racerToPilot = person; // todo map id with pilots name from current heat
    dispatch(sendVoice(`Racer ${racerToPilot}, ${humanSpeech(time)}`));
  };
}
