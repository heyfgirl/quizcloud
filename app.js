'use strict';

const Koa = require('koa');
const copy = require("copyto");
const Mware = require("./mware");
const Compose = require("koa-compose");
const session = require('koa-generic-session');
const debug = require('debug')('app:index');
const Master = new Koa();
const rootDomain = "quizyun.com";//平台一级域名
const mainDomain = "www.quizyun.com";//平台主域名
const RegExp_SUBDOMAIN = /\.quizyun\.com$/i;//平台主域名正则



//前置处理，拦截无效请求等,初始化ctx.base信息
Master.use(async (ctx, next) => {
    try {
        let start =
        new Date();
        let hostName = ctx.request.hostname;
        //IP 访问检查,匹配上需要返回不支持错误页面
        if (/^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(hostName)) {
            ctx.redirect("http://" + mainDomain);
            return
        }

        // 根域名禁用
        if (hostName === rootDomain) {
            ctx.redirect("http://" + mainDomain);
            return;
        }

        await next();
        if (404 != ctx.status) return;
        // 检查是否有机构/活动信息 然后渲染页面
        ctx.body = "网址错误,跳转到域名/网址错误页面";


        let ms = new Date() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
        debug(`${ctx.method} ${ctx.path} [${ms}ms]`);
    } catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = err;
    };
});

//域名处理
Master.use(async (ctx, next) => {
    ctx.base = {};
    let subDomain = null;
    let hostName = ctx.base["curDomain"] = ctx.request.hostname;

    // 识别二级域名或第三方域名
    if (RegExp_SUBDOMAIN.test(hostName)) {
        let domainSplit = hostName.split(".").reverse();
        subDomain = ctx.base["subDomain"] = domainSplit[2];
    } else {
        ctx.base["customDomain"] = hostName;
    }

    if (subDomain && /^(www|admin|api|auth|static)$/.test(subDomain)) {
        //二级域名作为hash
        ctx.base["type"] = subDomain;

        // // todo 平台的文件夹应该在应用目录下
        // ctx.base["file"] = "Data/"+subDomain+"/file/";
        // ctx.base["view"] = "Data/"+subDomain+"/Views/";
        // ctx.base["static"] = "Data/"+subDomain+"/static/";
        // 测试期间
        if(subDomain == "www"){
            ctx.base["file"] = "/www/file";
            ctx.base["view"] = "/www/view";
            ctx.base["static"] = "/www/static";
        }else{
            ctx.base["file"] = "/platform/file";
            ctx.base["view"] = "/platform/view";
            ctx.base["static"] = "/platform/static";
        }
        
    } else {
        let organInfo = null;
        let Instdata = null;

        // 活动hash
        let activepath = ctx.request.url.split("/")[1];
        // 查询机构信息
        if (ctx.base["subDomain"] ){
            // Instdata = await OrgModel.findOne({where: {"subdomain":ctx.base["subDomain"]}});
            organInfo = { "id": 1, "name": "这个机构", "hash": "orgbeo5cg", "password": "oo3gt2", "subdomain": "abc" };
        } else {
            // Instdata = await OrgModel.findOne({where: {"customdomain":ctx.base["hostName"]}});
            organInfo = { "id": 1, "name": "这个机构", "hash": "orgbeo5cg", "password": "oo3gt2", "subdomain": "abc" };
        }

        if (organInfo) {
            ctx.organ = {};
            copy(organInfo).pick("id", "name", "hash", "subdomain", "customdomain", "insttype").to(ctx.organ);
            if (activepath && !/^(index|static|file|api|mapi)/.test(activepath)) {
                // let activite = await Activity.findOne({ "where": { "instid": Instdata.id, "path": activepath } });
                let activite  = {"id":123123 ,"hash":"ACToe23k","type":"quiz","name":"知识竞答" };
                if (activite) {
                    // 进入活动
                    ctx.base["activite"] = {};
                    copy(activite).pick("id", "name", "hash", "insttype").to( ctx.base["activite"] );
                    ctx.base["type"]  = "quiz";
                    // ctx.base["file"]  ="Data/"+organInfo["hash"] +"/"+activite["hash"]+"/file/";
                    // ctx.base["view"]  ="Data/"+organInfo["hash"] +"/"+activite["hash"]+"/view/";
                    // ctx.base["static"] = "Data/"+organInfo["hash"] +"/"+activite["hash"]+"/static/";
                    ctx.base["file"] =  "/app/quiz/file";
                    ctx.base["view"] = "/app/quiz/view";
                    ctx.base["static"] =  "/app/quiz/static";
                }
            } else {
                ctx.base["type"] = "organ";
                // ctx.base["file"]  ="Data/"+organInfo["hash"] +"/file/";
                // ctx.base["view"]  ="Data/"+organInfo["hash"] +"/view/";
                // ctx.base["static"] = "Data/"+organInfo["hash"] +"/static/";
                // 测试使用
                ctx.base["file"] =  "/organizations/file";
                ctx.base["view"] = "/organizations/view"; 
                ctx.base["static"] =  "/organizations/static";
            }
        }
    }
    await next();
});

// 通用模块
//加载session模块
// Master.use(session({
//     'key': "SESSIONID",   
//     'maxAge': 30*60*1000, 
//     'prefix':'',
//     'rolling': true,
//     'cookie': {'maxage':30*60*1000, 'signed': false}
// }));

Master.use(Mware.send());
Master.use(Mware.view());
Master.use(Mware.static());


// 根据应用的hash进入具体的应用体
const appLoader = require("./app/index");
const Apps = appLoader.load();
// 应用加载逻辑交由./App/index.js处理并返回
Apps["www"] = require('./www/index');
Apps["admin"] = require('./platform/index');
Apps["organ"] = require('./organizations/index');
Master.use(async (ctx, next) => {
    let appName = ctx.base["type"];
    if(!appName){
        return
    }
    let app = Apps[appName];
    if (app && 　app.middleware) {
        await Compose(app.middleware)(ctx, next);
    }else{
        await next();
        console.log("没有应用"+appName)
    }
})




const listen = 80;
Master.listen(listen);
console.log("CloudApp Server listening " + listen);
