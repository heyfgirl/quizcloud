'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var ErrorParse = require("../../Data/tool/error.js");
const{NewsAction ,FileAction,FilesAction} = require("../action/index");
const path = require('path');
exports.list = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try {
        let option = {};
        //关键字（搜索词 ）  GET/POST
        option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
        //过滤字段（默认选择全部 ） POST
        let filter =   ctx.request.body["filter"] || [];
        if(filter == "ALL"){
            option["filter"] = null;
        }else{
            option["filter"]=[];
            option["filter"].push(filter);
        }
        //需要获取的页码数/分页大小  GET/POST
        option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1 ;
        option["size"] =  ctx.query["size"] || ctx.request.body["size"] || "20";
        //排序数据 [["name","DESC"],["id","ESC"]]
        let order = ctx.query["order"] || [];
        let orgHash = ctx.organ["hash"];
        //权限设置 this.session["role"] == "admin" || this.session["role"] == "root"
        result =  await NewsAction.list(option,orgHash);
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};
exports.info = async(ctx,next)=>{

};
exports.edit = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        //hash  title  content   edit     editid  activitehash  img  recom  click  tag  grop release
        let option={};
        let orgHash = ctx.organ["hash"]; 
        copy(ctx.request.body).to(option);
        option["editid"] = ctx.session["uid"] || 1;
        //设置权限  ctx.session["role"] == "admin"  || ctx.session["role"] == "root";
        if(1){
            result =  await NewsAction.edit(option,orgHash);
        }else{
            result["error"] = await ErrorParse("没有权限");                            
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return ctx.body = result;           
};
exports.customer = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try {
        let option = {};
        //关键字（搜索词 ）  GET/POST
        option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
        //过滤字段（默认选择全部 ） POST
        let filter =   ctx.request.body["filter"] || [];
        if(filter == "ALL"){
            option["filter"] = null;
        }else{
            option["filter"]=[];
            option["filter"].push(filter);
        }
        //需要获取的页码数/分页大小  GET/POST
        option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1 ;
        option["size"] =  ctx.query["size"] || ctx.request.body["size"] || "20";
        //排序数据 [["name","DESC"],["id","ESC"]]
        let order = ctx.query["order"] || [];
        let orgHash = ctx.organ["hash"];
        //权限设置 this.session["role"] == "admin" || this.session["role"] == "root"
        result =  await NewsAction.list(option,orgHash);

        //////匹配新闻摘要
        let IMGREG = /<img[^>]+>/g;
        for(let news of result.data.rows){
            let str = news["dataValues"]["content"].replace(IMGREG,"[图片]");
            // let one = str.substr(0,str.indexOf("</p>")).replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"");
            // let two = str.substr(0,str.indexOf("<br/>")).replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"");
            let abstract = str.replace(/<[^>]*>/g,"").replace(/\&nbsp\;/g,"").substr(0,160);
            news["dataValues"]["content"] = abstract+".....";
            news["content"] =  abstract + "......";
        }
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};


