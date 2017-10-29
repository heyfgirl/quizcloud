import { fetch } from 'common/utils/fetch';

export function createUser(params){
    return fetch({
        url:'/mapi/user/add',
        method:'post',
        data:params
    });
}

export function updateUser(params){
    return fetch({
        url:'/mapi/user/update',
        method:'post',
        data:params
    });
}

export function getList(params) {
    return fetch({
        url: '/mapi/user',
        method: 'post',
        data: params
    });
}

export function getUserInfo(params) {
    return fetch({
        url: '/mapi/user/info',
        method: 'post',
        data: params
    });
}





