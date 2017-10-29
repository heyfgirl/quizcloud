import { fetch } from 'common/utils/fetch';

export function getApps(params) {
    return fetch({
        url: '/mapi/aplication',
        method: 'post',
        data: params
    });
}

export function createApp(params){
    return fetch({
        url:'/mapi/aplication/add',
        method:'post',
        data:params
    });
}

export function updateApp(hash,params){
    return fetch({
        url:'/mapi/aplication/'+hash+'/update',
        method:'post',
        data:params
    });
}

export function getAppInfo(hash){
    return fetch({
        url:'/mapi/aplication/'+hash,
        method:'get'
    });
}

