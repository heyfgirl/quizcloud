import { fetch } from 'common/utils/fetch';

export function getTemps(params) {
    return fetch({
        url: '/mapi/temp',
        method: 'post',
        data: params
    });
}