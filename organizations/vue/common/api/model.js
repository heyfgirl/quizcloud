//用户接口
import { fetch } from 'common/utils/fetch';

export function getModel(tablename) {
    return fetch({
        url: '/api/model/attr?table='+tablename,
        method: 'get',
    });
}
