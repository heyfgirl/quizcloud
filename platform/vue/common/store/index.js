import Vue from 'Vue';
import Vuex from 'vuex';
import app from './app';
import user from './user';
import getters from './getters';

Vue.use(Vuex);


const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  getters
});

export default store
