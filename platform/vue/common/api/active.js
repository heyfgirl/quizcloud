import { fetch } from 'common/utils/fetch';

export function getList(params) {
    return fetch({
        url: '/mapi/active',
        method: 'post',
        data: params
    });
}

export function getInfo(id){
    return fetch({
        url:'/mapi/active/'+id,
        method:'get'
    });
}