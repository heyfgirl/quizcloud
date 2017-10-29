import { fetch } from 'common/utils/fetch';
export function getGroups(params){
    return fetch({
        url:'/mapi/group',
        method:'get',
        params:params
    });
}

export function updateGroups(params){
    return fetch({
        url:'/mapi/group/update',
        method:'post',
        data:params
    });
}


export function createGroup(params){
    return fetch({
        url:'/mapi/group/add',
        method:'post',
        data:params
    });
}
