//用户接口
import { fetch } from 'common/utils/fetch';
//分组
export function CreateNews(params) {
    return fetch({
        url: '/api/news/edit',
        method: 'post',
        data: params 
    });
};

export function RecomActivite(params) {
    return fetch({
        url: '/api/activite/list',
        method: 'post',
        data: params 
    });
}