import { login, logout, getUserInfo,getUserList } from 'common/api/auth';
import Cookies from 'js-cookie';
const tokenKey = 'X-Ivanka-Token';
//当前用户信息
const user = {
    state: {
        user: '',
        status: '',
        email: '',
        code: '',
        uid: undefined,
        auth_type: '',
        token: Cookies.get(tokenKey),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },
    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        LOGIN_SUCCESS: () => {

            console.log('login success')
        },
        LOGOUT_USER: state => {
            state.user = '';
        }
    },
    actions: {
        // 邮箱登录
        Login({ commit }, userInfo) {
            let state = this.getters;                        
            const name = userInfo.email.trim();
            return new Promise((resolve, reject) => {
                login(name, userInfo.password).then(response => {
                    if(response.success !== false){
                        let roles = state.roles;
                        roles.push(response.data.role);
                        Cookies.set(tokenKey, "aksdjflas123456");
                        commit('SET_TOKEN', "aksdjflas123456");
                        commit('SET_EMAIL', name);
                        commit('SET_ROLES', roles);
                        resolve();
                    }else{
                        reject(new Error("登录失败"));
                    }

                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 获取用户列表
        getUserList({ commit }, params) {
            return new Promise((resolve, reject) => {
                getUserList(params).then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log("store modules user error:")
                    console.log(error);
                    reject(error);
                });
            });
        },
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {

                    const data = response.data;
                    commit('SET_ROLES', data.role);
                    commit('SET_NAME', data.name);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_INTRODUCTION', data.introduction);
                    resolve(response);
                }).catch(error => {
                    console.log("store modules user error:")
                    console.log(error);
                    reject(error);
                });
            });
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove(tokenKey);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove(tokenKey);
                resolve();
            });
        }
    }
};

export default user;