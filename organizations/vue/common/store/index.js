import Vue from 'Vue';
import Vuex from 'vuex';
import app from './app';
import user from './user';
import activite from './activite';
import getters from './getters';

Vue.use(Vuex);


const store = new Vuex.Store({
  modules: {
    app,
    user,
    activite
  },
  getters
});

export default store
