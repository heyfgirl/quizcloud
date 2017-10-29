
import { fetch } from 'common/utils/fetch';

export function getNewsList(params){
    return fetch({
        url:'/mapi/news/list',
        method:'post',
        data:params
    });
}

export function getNewsInfo(params){
    return fetch({
        url:'/mapi/news/info',
        method:'post',
        data:params
    });
}

export function CreateNews(params){
    return fetch({
        url:'/mapi/news/info',
        method:'post',
        data:params
    });
}