import Vue from 'vue' ;
//iview 视图库
import iView from 'iview' ;
import 'iview/dist/styles/iview.css' ; 
Vue.use(iView) ;
//自定义图标 npm run icon 编译
import svgicon from 'vue-svgicon' ;
import "components/svgicon/" ;
Vue.use(svgicon, {tagName: 'svgicon'}) ;
//波纹按钮
import vueWaves from 'common/directive/waves'; 
Vue.use(vueWaves) ;
//滑动流畅
import sticky from 'components/sticky' ;
Vue.component('Sticky', sticky) ;
import vueSticky from 'common/directive/sticky';
Vue.use(vueSticky) ;
//应用入口
import App from './app.vue' ;
import router from './router' ;
//全局工具
import store from 'common/store/index' ;
import errLog from 'common/utils/errLog' ;
//全局样式控制
import 'normalize.css/normalize.css' ;
//全局注入过滤器
import * as filters from 'common/utils/filter' ;
Object.keys(filters).forEach(key => {Vue.filter(key, filters[key]);});
//权限检查
function hasPermission(roles, permissionRoles){
    if (roles.indexOf('admin') >= 0) {
        return true ;
    };
    return roles.some(role => permissionRoles.indexOf(role) >= 0) ;
};

// 重定向白名单
const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'];
//全局路由注入
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if(store.getters.token){
        if (to.path === '/login') {
            next({ path: '/' }) ;
        } else {
            if (to.meta && to.meta.role) {
                if (hasPermission(store.getters.roles, to.meta.role)) {
                    next() ;
                } else {
                    next('/401') ;
                }
            } else {
                next() ;
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
        }
    }
});
//路由处理完成
router.afterEach(() => {
    iView.LoadingBar.finish();
});

//错误捕获
// window.onunhandledrejection = e => {
//     console.log('unhandled error:', e.reason, e.promise);
//     e.preventDefault()
// };

// 生产环境错误日志
if (process.env === 'production') {
    Vue.config.errorHandler = function(err, vm) {
        console.log(err, window.location.href);
        errLog.pushLog({
            err,
            url: window.location.href,
            vm
        })
    };
}

// 错误处理
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log(error)
};

//拓展console对象
// console.error = (function (origin) {
//     return function (errorlog) {
//         // handler();//基于业务的日志记录及数据报错
//         origin.call(console, errorlog);
//     }
// })(console.error);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');


