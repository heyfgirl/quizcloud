'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var ErrorParse = require("../../Data/tool/error.js")
const{ActiviteAction } = require("../action/index");
////////活动列表//////////
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
        result =  await ActiviteAction.list(option,orgHash);
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};

///
exports.info = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try {
        let orgHash = ctx.organ["hash"];        
        let option = {};
        copy(ctx.request.body).to(option);
        
        result =  await ActiviteAction.info(orgHash,option);
        
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return ctx.body = result;           
}