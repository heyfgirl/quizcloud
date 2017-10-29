'use strict';
const copy = require('copyto');
const ErrorParse = require('./../../Data/tool/error');
const {NewsAction} = require('./../action/index');

exports.list = async(ctx,next)=>{
    
    let result = {"success":false, "error":{}, "data":{}};
    
    let option = {};
    //关键字（搜索词 ）  GET/POST
    option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
    //过滤字段（默认选择全部 ） POST
    option["filter"] =   ctx.request.body["filter"] || [];
    //需要获取的页码数/分页大小  GET/POST
    option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1 ;
    option["size"] =  ctx.query["size"] || ctx.request.body["size"] || "20";
    //排序数据 [["name","DESC"],["id","ESC"]]
    let order = ctx.query["order"] || [];

    result = await NewsAction.list(option);
    
    return ctx.body = result;


}

exports.edit = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        //hash  title  content   edit     editid  activitehash  img  recom  click  tag  grop release
        let option={};
        copy(ctx.request.body).to(option);
        option["editid"] = 1;

        // option["editid"] = ctx.session["uid"] || 1;
        //设置权限  ctx.session["role"] == "admin"  || ctx.session["role"] == "root";
        if(1){
            result =  await NewsAction.edit(option);
        }else{
            result["error"] = await ErrorParse("没有权限");                            
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return ctx.body = result;           
};