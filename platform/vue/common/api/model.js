
import { fetch } from 'common/utils/fetch';

export function getModel(tbname) {
    return fetch({
        url: '/mapi/model/'+tbname,
        method: 'get',
    });
}
