import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from './layout.vue';


// dashboard
// const dashboard = require('../views/dashboard/index')

/* error page*/
const Err404 = require('common/views/error/404');
const Err401 = require('common/views/error/401');
const Login = require("common/views/auth/login.vue")
//User 
const User = {};
User["list"] = require("views/user/list.vue");
User["info"] = require("views/user/info.vue");
User["import"] = require("views/user/import.vue");
const News = {};
News["index"] = require('views/news/index.vue'); 
News["list"] = require("views/news/list.vue");    
News["edit"] = require("views/news/edit.vue");
//应用
const Application = {};
Application["list"] = require('views/application/list.vue'); 
//活动
const Activite = {};
Activite["list"] = require('views/activite/list.vue'); 
Activite["info"] = require('views/activite/info.vue'); 



/* Introduction*/
const Indexpage = resolve => require(['views/index/index'], resolve);  //require('./node/index');
const Introduction = resolve => require(['views/node/index'], resolve);  //require('./node/index');
Vue.use(Router);

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/',
            component: Layout,
            noDropdown: true,
            icon: 'home',
            children: [
                { path: '', component: Indexpage ,name:'Index',hidden: true } ,
            ]
        },
        { path: '/login', component: Login , hidden: true },
        // { path: '/authredirect', component: authRedirect, hidden: true },
        // { path: '/sendpwd', component: sendPWD, hidden: true },
        // { path: '/reset', component: reset, hidden: true },
        { path: '/404', component: Err404, hidden: true },
        { path: '/401', component: Err401, hidden: true },
        {
            path: '/user',
            component: Layout,
            redirect: '/user/list',
            name: '用户管理',
            icon: 'ionic',
            children: [
                { path: 'list', component: User.list, name: '列表' },
                { path: 'info', component: User.info, name: '新增' },
                { path: 'import', component: User.import, name: '导入' }
            ]
        },
        {
            path: '/news',
            component: Layout,
            redirect: '/news/index',
            name: '新闻管理',
            icon: 'ionic',
            children: [
                { path: 'index', component: News.index, name: '主页' },
                { path: 'list', component: News.list, name: '列表' },
                { path: 'edit', component: News.edit, name: '详情'}
            ]
        },
        {
            path: '/application',
            component: Layout,
            redirect: '/application/list',
            name: '应用管理',
            icon: 'ionic',
            children: [
                {  
                    path: 'list', component: Application.list, name: '应用列表'
                }
            ]
        },
        {
            path: '/activite',
            component: Layout,
            redirect: '/activite/list',
            name: '活动管理',
            icon: 'ionic',
            children: [
                {  
                    path: 'list', component: Activite.list, name: '活动列表'
                },
                {  
                    path: 'info', component: Activite.info, name: '新增活动'
                }
            ]
        },
    
        {
            path: '/error',
            component: Layout,
            redirect: 'noredirect',
            name: '错误页面',
            icon: '404',
            hidden: true,
            children: [
                { path: '401', component: Err401, name: '401' },
                { path: '404', component: Err404, name: '404' }
            ]
        },

    
        { path: '*', redirect: '/404', hidden: true }
    ]
});
