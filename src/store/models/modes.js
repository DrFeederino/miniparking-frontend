import { action } from 'easy-peasy';

export default {
  modes: [],
  currentMode: 0,
  setModes: action((state, payload) => {
    if (!payload) return;
    state.modes = payload;
  }),
  setCurrentMode: action((state, payload) => {
    if (!payload) return;
    state.currentMode = payload;
  }),
};
