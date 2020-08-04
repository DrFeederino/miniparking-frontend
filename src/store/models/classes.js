import { action } from 'easy-peasy';

export default {
  classes: null,
  setClasses: action((state, payload) => {
    state.classes = payload;
  }),
};
