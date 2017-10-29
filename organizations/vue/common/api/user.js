
import { fetch } from 'common/utils/fetch';
//信息
export function getUserInfo(param) {
    return fetch({
        url: '/api/user/info',
        method: 'post',
        data: param
    });
}
//用户列表
export function getUserList(param) {
    return fetch({
        url: '/api/user/list',
        method: 'post',
        data: param 
    });
}
//创建用户
export function CreateUser(param) {
    return fetch({
        url: '/api/user/create',
        method: 'post',
        data: param 
    });
}
//分组
export function UserGroup(TAG,newGroup) {
    let params={'hash':"User"};
    params["key"] =TAG;
    params["value"] =newGroup;
    return fetch({
        url: '/api/user/group',
        method: 'post',
        data: params 
    });
}
//分组
export function DeleteUsergroup(TAG,newGroup,DeleteKey,replaceKey) {
    let params={};
    params['hash']="User";
    params['key']=TAG;
    params['value']=newGroup;
    params['DeleteKey'] = DeleteKey;
    params['replaceKey']=replaceKey;
    return fetch({
        url: '/api/user/deleteUserGroup',
        method: 'post',
        data: params
    });
}
//
export function ListGroup(param) {
    let params={hash:"User"};
    params['key'] = param;
    return fetch({
        url: '/api/user/ListGroup',
        method: 'post',
        data: params
    });
}


