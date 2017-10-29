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
export function getUserInfo(token) {
    return fetch({
        url: '/api/user/info',
        method: 'get',
        params: { token }
    });
}


//用户列表
export function getUserList(param) {
    return fetch({
        url: '/api/user/list',
        method: 'post',
        data: param 
    });
}


//列表
export function getNewsList(param) {
    return fetch({
        url: '/api/news/list',
        method: 'post',
        data: param 
    });
}

//活动
export function getActiviteList(param) {
    return fetch({
        url: '/api/activite/list',
        method: 'post',
        data: param 
    });
}
//创建活动
export function CreateActive(param) {
    return fetch({
        url: '/api/activite/info',
        method: 'post',
        data: param 
    });
}

//应用
export function getAppList(param) {
    return fetch({
        url: '/api/app/list',
        method: 'post',
        data: param 
    });
}

