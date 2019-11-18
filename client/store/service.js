import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_SERVICE = 'GET_SERVICE';
const GET_ALL_SERVICES = 'GET_ALL_SERVICES';

/**
 * INITIAL STATE
 */

const initialState = {
  allServices: [],
  currentService: {}
};

/**
 * ACTION CREATORS
 */
const getService = service => ({ type: GET_SERVICE, service });
const getServices = services => ({ type: GET_ALL_SERVICES, services });

/**
 * THUNK CREATORS
 */
export const fetchService = serviceId => async dispatch => {
  try {
    const res = await axios.get(`https://recyclocate.herokuapp.com/api/services/${serviceId}`);
    dispatch(getService(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchServices = () => async dispatch => {
  try {
    const res = await axios.get(`https://recyclocate.herokuapp.com/api/services`);
    dispatch(getServices(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SERVICE: {
      return { ...state, currentService: action.service };
    }
    case GET_ALL_SERVICES: {
      return { ...state, allServices: action.services };
    }
    default:
      return state;
  }
}
