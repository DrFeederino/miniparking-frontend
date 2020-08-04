import { action } from 'easy-peasy';

export default {
  drivers: [],
  currentDriver: null,
  setDrivers: action((state, payload) => {
    if (!payload || payload.length === 0) return;
    state.drivers = payload;
  }),
  setCurrentDriver: action((state, payload) => {
    if (!payload) return;
    state.currentDriver = payload;
  }),
};
