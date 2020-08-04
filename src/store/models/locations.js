import { action } from 'easy-peasy';

export default {
  locations: [],
  setLocations: action((state, payload) => {
    if (!payload) return;
    state.locations = payload;
  }),
};
