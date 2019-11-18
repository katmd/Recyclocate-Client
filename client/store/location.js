import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_LOCATION = 'GET_LOCATION';
const GET_ALL_LOCATIONS = 'GET_ALL_LOCATIONS';

/**
 * INITIAL STATE
 */

const initialState = {
  allLocations: [],
  currentLocation: {}
};

/**
 * ACTION CREATORS
 */
const getLocation = location => ({ type: GET_LOCATION, location });
const getLocations = locations => ({ type: GET_ALL_LOCATIONS, locations });

/**
 * THUNK CREATORS
 */
export const fetchLocation = locationId => async dispatch => {
  try {
    const res = await axios.get(`https://recyclocate.herokuapp.com/api/locations/${locationId}`);
    dispatch(getLocation(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchLocations = () => async dispatch => {
  try {
    const res = await axios.get(`https://recyclocate.herokuapp.com/api/locations`);
    dispatch(getLocations(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LOCATION: {
      return { ...state, currentLocation: action.location };
    }
    case GET_ALL_LOCATIONS: {
      return { ...state, allLocations: action.locations };
    }
    default:
      return state;
  }
}
