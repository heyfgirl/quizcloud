import { fetch } from 'common/utils/fetch';

export function createOrgan(params){
    return fetch({
        url:'/mapi/organ/add',
        method:'post',
        data:params
    });
}

export function updateOrgan(hash,params){
    return fetch({
        url:'/mapi/organ/'+ hash+'/update',
        method:'post',
        data:params
    });
}

export function getList(params) {
    return fetch({
        url: '/mapi/organ',
        method: 'post',
        data:params
    });
}

export function getOrganInfo(hash) {
    return fetch({
        url: '/mapi/organ/'+ hash +'/info',
        method: 'get'
    });
}

export function audit(hash,params) {
    return fetch({
        url: '/mapi/organ/'+ hash +'/audit',
        method: 'post',
        data:params
    });
}

export function dbInit(hash,params) {
    return fetch({
        url: '/mapi/organ/'+ hash +'/init',
        method: 'post',
        data:params
    });
}