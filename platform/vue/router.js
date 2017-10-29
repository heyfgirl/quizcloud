import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from './layout.vue';


// dashboard
// const dashboard = require('../views/dashboard/index')

/* error page*/
const Err404 = require('common/views/error/404');
const Err401 = require('common/views/error/401');


const Login = require("common/views/auth/login.vue");


//User 
const User = {};
User["index"] = require("views/user/index.vue");
User["list"] = require("views/user/list.vue");
User["edit"] = require("views/user/edit.vue");
//Organ
const Organ = {};
Organ["index"] = require("views/organ/index.vue");
Organ["list"] = require("views/organ/list.vue");
Organ["edit"] = require("views/organ/edit.vue");

//Active
const Active = {};
Active["index"] = require("views/active/index.vue");
Active["list"] = require("views/active/list.vue");
//Aplication
const Aplication = {};
Aplication["index"] = require("views/aplication/index.vue");
Aplication["list"] = require("views/aplication/list.vue");
Aplication["edit"] = require("views/aplication/edit.vue");

//News
const News = {};
News["list"] = require("views/news/list.vue");
News["info"] = require("views/news/info.vue");



/* Introduction*/
const Indexpage = resolve => require(['views/index/index'], resolve);  //require('./node/index');
const Introduction = resolve => require(['views/node/index'], resolve);  //require('./node/index');

Vue.use(Router);

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/login', component: Login , hidden: true },
        // { path: '/authredirect', component: authRedirect, hidden: true },
        // { path: '/sendpwd', component: sendPWD, hidden: true },
        // { path: '/reset', component: reset, hidden: true },
        { path: '/404', component: Err404, hidden: true },
        { path: '/401', component: Err401, hidden: true },
        {
            path: '/',
            component: Layout,
            noDropdown: true,
            icon: 'home',
            children: [
                { path: '', component: Indexpage ,name:'Index',hidden: true } ,
            ]
        },

        {
            path: '/user',
            component: Layout,  
            redirect: '/user/index',
            name: '用户管理',
            icon: 'ionic',
            children: [
                { path: 'index', component: User.index, name: '概况' },
                { path: 'list', component: User.list, name: '列表' },
                { path: 'add', component: User.edit, name: '新建' },
                { path: 'update/:id', component: User.edit, name: '修改',hidden:true }
            ]
        },

         {
            path: '/organ',
            component: Layout,
            redirect: '/organ/index',
            name: '机构管理',
            icon: 'qq',
            children: [
                {path: 'index', component: Organ.index, name: '概况' },
                {path: 'list', component: Organ.list, name: '列表' },
                {path: 'add', component: Organ.edit, name: '编辑' },
                { path: 'update/:hash', component: Organ.edit, name: '修改',hidden:true }
            ]
        },
        {
            path: '/active',
            component: Layout,
            redirect: '/active/index',
            name: '活动管理',
            icon: 'qq',
            children: [
                {path: 'index', component: Active.index, name: '概况' },
                {path: 'list',component: Active.list, name: '列表' }
               
            ]
        },
         {
            path: '/aplication',
            component: Layout,
            redirect: '/aplication/index',
            name: '应用管理',
            icon: 'qq',
            children: [
                {path: 'index', component: Aplication.index, name: '概况' },
                {path: 'list',component: Aplication.list, name: '列表' },
                {path: 'add',component: Aplication.edit, name: '添加应用',hidden:true },
                {path: 'newtemp',component: Aplication.edit, name: '添加模板 new',hidden:true }
               
            ]
        },
        {
            path: '/news',
            component: Layout,  
            redirect: '/news/list',
            name: '新闻管理',
            icon: 'ionic',
            children: [
                { path: 'list', component: News.list, name: '列表' },
                { path: 'info', component: News.info, name: '详情' },                
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
