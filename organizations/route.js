'use strict';
const ueditor = require('ueditor');

//机构
const  koaBody = require('koa-bodyparser')();
const  koa_Body = require('koa-body');
const   path    =require('path');
const  api = require('./api/index');


//API
const apiRoute =function (route) {
    route.nested("/model/attr").all(api.model.frontAttr);
    //登陆/登出auth
    route.nested("/auth/regist").all(koaBody,api.auth.regist);
    route.nested("/auth/login").all(koaBody,api.auth.login);
    route.nested("/auth/logout").all(koaBody,api.auth.logout);
    route.nested("/auth/repass").all(koaBody,api.auth.repass);
    // route.nested("/auth/update").all(koaBody,api.auth.update);

    //用户管理
    route.nested("/user/create").post(koaBody,api.user.create);
    route.nested("/user/info").post(koaBody,api.user.info);
    route.nested("/user/updata").post(koaBody,api.user.updata);
    route.nested("/user/list").all(koaBody,api.user.list);
    route.nested("/user/remove").post(koaBody,api.user.remove);
    route.nested("/user/group").all(koaBody,api.user.groupinfo);
    route.nested("/user/deleteUserGroup").all(koaBody,api.user.deleteUserGroup);
    route.nested("/user/ListGroup").all(koaBody,api.user.ListGroup);
    route.nested("/user/import").all(koa_Body({multipart :true}),api.user.Import);
    route.nested("/user/download").all(koa_Body({multipart :true}),api.user.download);
    
    
    //新闻
    route.nested("/news").all(koaBody,api.news.newest);//前台接口，获取最新两条新闻
    route.nested("/news/list").all(koaBody,api.news.list);
    route.nested("/news/edit").all(koaBody,api.news.edit);
    route.nested("/news/info").all(koaBody,api.news.info);
    //前台新闻
    route.nested("/news/customer").all(koaBody,api.news.customer);//前台接口，获取最新两条新闻




    route.nested("/file").all(koa_Body({multipart :true}),api.file);
    //百度富文本编辑器
    route.nested("/ueditor").all(koa_Body({multipart :true}),api.file);
    
    //活动管理
    route.nested("/activite/list").post(koaBody,api.active.list);
    route.nested("/app/list").post(koaBody,api.application.list);
    route.nested("/activite/info").post(koaBody,api.active.info);
    // route.nested("/active/create").post(koaBody,api.active.create);
    // route.nested("/active/updata").post(koaBody,api.active.updata);
    // route.nested("/active/remove").post(koaBody,api.active.remove);
};

//一级路由
module.exports = function(institution) {
    apiRoute(institution.route('/api'));
};