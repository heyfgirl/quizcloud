//数据请求工具
import axios from 'axios';
import store from 'common/store';
import {Message} from  'iview';

export default function _fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: process.env.BASE_API,
            timeout: 5000,
            headers: { 'X-Ivanka-Token': store.getters.token }
        });
        instance(options)
            .then(response => {
                const res = response.data;
                if (res.code !== 20000) {
                    console.log(options); // for debug
                    // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
                    if (res.code === 50008 || res.code === 50014 || res.code === 50012) {
                        Message.error(res.message);
                        // Message({
                        //     message: res.message,
                        //     type: 'error',
                        //     duration: 5 * 1000
                        // });
                        // router.push({path: '/'})
                        // TODO
                        store.dispatch('FedLogOut').then(() => {
                             router.push({ path: '/login' })
                        });
                    }
                    reject(res);
                }
                resolve(res);
            })
            .catch(error => {
                Message.error('发生异常错误,请刷新页面重试,或联系程序员');
                reject(error);
            });
    });
}

export function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            timeout: 5000
        });
        instance(options)
            .then((response) => {
                if(response["status"] ===  200  && response["data"]["success"] === true ){
                    resolve(response["data"]);
                }else{
                    // alert( response["data"])
                    let error = response["data"]["error"];
                    Message.error(error);
                    reject(error);
                }
                const res = response.data;
            })
            .catch(error => {
                // alert(error)
                Message.error("请求失败!");
                reject(error);
            });
    });
}
