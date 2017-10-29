'use strict';
const  bodyparser = require('koa-bodyparser')();
const  koaBody = require('koa-body');
const  apiIndex = require('./api/index');



const apiRoute =function (route) {

    //测试  添加数据
    route.nested("/init").get(apiIndex.test.init);
    //登陆接口模拟
    route.nested("/auth/login").post(bodyparser,apiIndex.auth.login);
    // 前台注册
    route.nested("/auth/register").post(bodyparser,apiIndex.auth.register);

    //机构申请
    route.nested("/organ/apply").post(bodyparser,apiIndex.organ.apply);
    //修改信息，重新提交申请
    route.nested("/organ/:hash/reapply").post(bodyparser,apiIndex.organ.reapply);
   

    /**
     * 为机构提供查询接口
     */
    //提供所有机构数据库连接信息
    route.nested('/organ').all(bodyparser,apiIndex.organ.alldbs);
    //获取单个机构详细信息
    route.nested('/organ/:hash/detial').all(bodyparser,apiIndex.organ.detailInfor);
    //下属机构，提交修改机构信息
    route.nested('/organ/:hash/update').post(bodyparser,apiIndex.organ.update);

    route.nested('/active/add').post(bodyparser,apiIndex.active.add);


    //apps
    route.nested('/application').post(bodyparser,apiIndex.aplication.list);
    //temps
    route.nested('/temp').all(bodyparser,apiIndex.temp.list);
    

    route.nested("/ueditor").all(koaBody({multipart :true}),apiIndex.file);
    route.nested("/file").all(koaBody({multipart :true}),apiIndex.file);
    
};

    // 后台管理
const apiAdminRoute =function (route) {

   
    route.nested("/model/:tbname").all(bodyparser,apiIndex.front.fields);  //获取模型前端字段

    route.nested("/user").all(bodyparser,apiIndex.user.list);
    route.nested("/user/add").post(bodyparser,apiIndex.user.create);
    route.nested("/user/remove").post(bodyparser,apiIndex.user.remove);
    route.nested("/user/info").post(bodyparser,apiIndex.user.info);
    route.nested("/user/update").post(bodyparser,apiIndex.user.update);
    

    route.nested("/organ").all(bodyparser,apiIndex.organ.list);
    route.nested("/organ/add").post(bodyparser,apiIndex.organ.apply);
    route.nested("/organ/:hash/remove").get(apiIndex.organ.remove);
    route.nested("/organ/:hash/info").get(apiIndex.organ.info);
    route.nested('/organ/:hash/update').post(bodyparser,apiIndex.organ.update);
     //机构申请审核
    route.nested("/organ/:hash/audit").all(bodyparser,apiIndex.organ.audit);
     //机构数据库初始化
    route.nested('/organ/:hash/init').all(bodyparser,apiIndex.organ.createDB);
    //应用管理
    route.nested('/aplication').all(bodyparser,apiIndex.aplication.list);
    route.nested('/aplication/add').post(bodyparser,apiIndex.aplication.create);
    route.nested('/aplication/:hash/remove').post(bodyparser,apiIndex.aplication.remove);
    // route.nested("/aplication/:hash/info").post(apiIndex.aplication.info);
    route.nested("/aplication/:hash/update").post(bodyparser,apiIndex.aplication.update);
    route.nested("/aplication/upload/cover").all(koaBody({'multipart':true}),apiIndex.aplication.coverUpload);

    //模板管理
    route.nested('/temp').all(bodyparser,apiIndex.temp.list);
    route.nested('/temp/add').post(bodyparser,apiIndex.temp.create);
    route.nested('/temp/:hash/remove').post(bodyparser,apiIndex.temp.remove);
    // route.nested("/temp/:hash/info").post(apiIndex.temp.info);
    route.nested("/temp/:hash/update").post(bodyparser,apiIndex.temp.update);

    //活动管理
    route.nested('/active').post(bodyparser,apiIndex.active.list);
    route.nested('/active/:id').get(apiIndex.active.info);

    //分组管理
    route.nested("/group").all(bodyparser,apiIndex.group.list);
    route.nested("/group/add").all(bodyparser,apiIndex.group.create);
    route.nested("/group/update").post(bodyparser,apiIndex.group.update);

    //新闻管理
    route.nested("/news/list").post(bodyparser,apiIndex.news.list);
    route.nested("/news/info").post(bodyparser,apiIndex.news.edit);
    
};



module.exports = function(platform) {
    apiRoute(platform.route('/api'));
    apiAdminRoute(platform.route('/mapi'));
};
