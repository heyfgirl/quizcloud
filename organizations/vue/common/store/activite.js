import {getNewsList,getActiviteList,getAppList,CreateActive} from 'common/api/auth';
import Cookies from 'js-cookie';


const tokenKey = 'X-Ivanka-Token';
//当前用户信息
const activite = {
    state: {
        code: '',
        token: Cookies.get(tokenKey),
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        }
    },
    actions: {
        // 获取新闻列表
        getNewsList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getNewsList(params).then(response => {
                    console.log(response)
                    resolve(response);
                }).catch(error => {
                    console.log("store modules new error:")
                    console.log(error);
                    reject(error);
                });
            });
        },

        // 获取活动列表
        getActiviteList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getActiviteList(params).then(response => {
                    console.log(response)
                    resolve(response);
                }).catch(error => {
                    console.log("store modules new error:")
                    console.log(error);
                    reject(error);
                });
            });
        },

        // 获取应用列表
        getAppList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getAppList(params).then(response => {
                    console.log(response)
                    resolve(response);
                }).catch(error => {
                    console.log("store modules new error:")
                    console.log(error);
                    reject(error);
                });
            });
        },

        // 获取应用列表
        Create({ commit }, params) {
            return new Promise((resolve, reject) => {
                CreateActive(params).then(response => {
                    console.log(response)
                    resolve(response);
                }).catch(error => {
                    console.log("store modules new error:")
                    console.log(error);
                    reject(error);
                });
            });
        }

        
    }
};

export default activite;