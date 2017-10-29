'use strict';

const Koa  = require('koa');
const router = require('koa2-routing');
const Views = require("koa-views");
const routers = require('./route');


var app = new Koa();
//加载全局错误
app.use(async (ctx, next) => {
    try{
        console.log("进入竞赛应用控制器");
        await next();
    }catch(err){
        console.log(err)
        this.status =500;
        await ctx.render("500.pug",err);
    }
});

//Session组件
// app.use(session({
// 'prefix':'', 'rolling': true, 'cookie': {
//     'maxage':30*60*1000, 'signed': false}
// }));

//加载路由
app.use(router(app));
routers(app);




//加载应用级404处理
app.use(async (ctx, next) => {
    try{
        console.log("进入竞赛应用控制器");
        await next();
    }catch(err){
        this.status =500;
        await ctx.render("404.jade",err);
    }
});




module.exports = {
    "app":app,
    "hash":"quiz",
    "models":{
        
    }
};