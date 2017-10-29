'use strict';
const  bodyparser = require('koa-bodyparser')();
const  koaBody = require('koa-body');
const  apiIndex = require('./api/index');

//api
const apiRoute =function (route) {
    route.nested("/news/list").post(bodyparser,apiIndex.news.list);    
    route.nested("/news/info").all(bodyparser,apiIndex.news.info);    
    route.nested("/news/recom").all(bodyparser,apiIndex.news.recom);    
    route.nested("/news/click").all(bodyparser,apiIndex.news.click);    
    
}    

// 静态页面
const staticRoute =function (route) {
    route.nested("newslist").all(async (ctx,next)=>{
        return await ctx.render("/newsList.html");
    });
    route.nested("news").all(async (ctx,next)=>{
        return await ctx.render("/news.html");
    });

}

module.exports = function(www) {
    apiRoute(www.route('/api'));    
    staticRoute(www.route("/"));

};
