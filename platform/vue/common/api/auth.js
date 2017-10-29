

//auth 接口

import { fetch } from 'common/utils/fetch';

export function login(username, password) {
    return fetch({
        url: '/api/auth/login',
        method: 'post',
        data:  {
            username,
            password
        }
    });
}

//退出登陆
export function logout(username) {
    return fetch({
        url: '/api/user/logout',
        method: 'post',
        params: {
            username
        }
    });
}

//信息
export function getInfo(token) {
    return fetch({
        url: '/api/user/info',
        method: 'get',
        params: { token }
    });
}

