'use strict';


const Koa  = require('koa');
const router = require('koa2-routing');
const routers = require('./route');
const {complete} = require("../organizations/model/index");
const session = require('koa-generic-session');


var App = new Koa();

//加载全局错误
App.use(async (ctx, next) => {
    try{
        console.log("进入机构应用控制器");
        // console.log(ctx.request)
        await next();
    }catch(err){
        console.log(err);
        ctx.status =500;
        // await ctx.render("error.jade",err);
    }
});
 App.use(session({
    'prefix':'', 
    'rolling': true, 
    'cookie': {
        'maxage':30*60*1000, 
        'signed': false
    }
}));

if(!module.parent){
     App.use(async (ctx,next)=>{
        var  organInfo = {id:1,name:"这个机构",hash:"orgbeo5cg",password:"oo3gt2",subdomain:"abc"};
        ctx.organ = organInfo;
        await next()
    });
}


// 加载路由
App.use(router(App));
routers(App);


if(module.parent){
    //如果由根目录的app.js 启动
    module.exports = App;
}else{
    complete(function(organModel){});
    //如果独立启动，初始化一些基本信息 
    App.listen("8080");
}

