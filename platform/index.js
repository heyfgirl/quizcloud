'use strict';

const Koa  = require('koa');
const App = new Koa();
const router = require('koa2-routing');
const routers = require('./route');


//加载全局错误
App.use(async (ctx, next) => {
    try{
        // console.log(ctx.path)
        // console.log("进入平台应用控制器");
        // if(ctx.path.indexOf("910037571051065344")>0 ){
          
        //     console.log("www:"+/^(\/[^(\/|\?|&)]+?)?\/static/.test(ctx.path))
        //  }
        // console.log(ctx.request)
        await next();
        
    }catch(err){
        console.log(err);
        ctx.status =500;
        // await ctx.render("error.jade",err);
    }
});
//加载路由
App.use(router(App));
routers(App);


if(module.parent){
    //如果由根目录的app.js 启动
    module.exports = App;
}else{
    //如果独立启动
    App.listen("8080");
}