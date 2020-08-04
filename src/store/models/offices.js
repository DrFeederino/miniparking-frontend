import { action } from 'easy-peasy';

export default {
  offices: [],
  setOffices: action((state, payload) => {
    if (!payload) return;
    state.offices = payload;
  }),
  office: null,
  setOffice: action((state, payload) => {
    state.office = payload;
  }),
};
