'use strict';
const copy = require('copy-to');
const uid = require('uid');
const ErrorParse = require('./../../Data/tool/error');
const {UserAction,OrganAction} = require('./../action/index');

//提交机构信息申请
exports.apply = async (ctx,next)=>{
    let option = {};
    let result = {"success":false, "error":{}, "data":{}};

    copy(ctx.request.body).pick("orgname","proposer","mobile","qualification","node","gflag","telephone","email","abstract","subdomain","custodomain").to(option);
    option.hash = uid(8);
    option.qualification = option.qualification||"/static/default.jpg";//默认图片
    option.node = option.node||"defult";//默认服务器区域
    option.gflag = option.gflag||"normal";//默认分组


    if(!option.orgname){
        result.error = await ErrorParse("机构名称不可为空。");
        return ctx.body = result;
    }else if(!option.proposer){ 
        result.error = await ErrorParse("请准确填写申请人名称。");
        return ctx.body = result;
    }else if(!option.mobile){
        result.error = await ErrorParse("请填写申请人联系方式。");
        return ctx.body = result;
    }else if(!option.qualification){
         result.error = await ErrorParse("请上传机构资质认证证明。");
        return ctx.body = result;
    }

    result = await OrganAction.create(option);
   
    ctx.body = result;
}

//重新提交机构信息申请
exports.reapply = async (ctx,next)=>{
    let option = {};
    let result = {"success":false, "error":{}, "data":{}};

    copy(ctx.request.body).pick("orgname","proposer","mobile","qualification","node","gflag","telephone","email","abstract","subdomain","custodomain").to(option);
    let hash = ctx.request.body['hash']||ctx.query['hash']||ctx.params['hash']||'';
    option.qualification = option.qualification||"/static/default.jpg";//默认图片
    option.node = option.node||"defult";//默认服务器区域
    option.gflag = option.gflag||"normal";//默认分组
    option.state = 'auditing';//重新申请，状态修改为待审核

    if(!hash){
        result.error = await ErrorParse("args err:请传递正确的机构hash");
        return ctx.body = result;
    }else if(!option.orgname){
        result.error = await ErrorParse("机构名称不可为空。");
        return ctx.body = result;
    }else if(!option.proposer){ 
        result.error = await ErrorParse("请准确填写申请人名称。");
        return ctx.body = result;
    }else if(!option.mobile){
        result.error = await ErrorParse("请填写申请人联系方式。");
        return ctx.body = result;
    }else if(!option.qualification){
         result.error = await ErrorParse("请上传机构资质认证证明。");
        return ctx.body = result;
    }

    result = await OrganAction.reapply(hash,option);
   
    ctx.body = result;
}


exports.audit = async(ctx,next)=>{
    let result = {"success":false,"error":{},"data":{}};
    let option = {};
    option.hash = ctx.params.hash || ""; 
    let state = ctx.request.body.state || false;
    if(option.hash){
        option.state = (state?  "approved": "unapproved");
        result = await OrganAction.audit(option);
    }else{
        result.error = await ErrorParse('args err');
    }
    
    ctx.body = result;
}
 
//机构列表
exports.list = async (ctx,next)=>{
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

    result = await OrganAction.list(option);
    
    return ctx.body = result;

}


//机构详细信息
exports.info = async(ctx,next)=>{

    let result = {"success":false, "error":{}, "data":{}};
    let option = {};
    option.hash = ctx.params.hash || "";
    
    if(option.hash){

        result = await OrganAction.info(option);
            
    }else{
       
        result.error= await ErrorParse('args err');
    }
 
    ctx.body = result;

}

// //审核机构信息
// exports.auditInfo = async(ctx,next) =>{

//     let result = {"success":false, "error":{}, "data":{}};
//     let hash = ctx.params.hash || "";
//     if(hash){
//         result = await OrganAction.auditInfo(hash);     
//     }else{
//         result.error= await ErrorParse('args err');
//     } 
//     ctx.body = result;
// }

//下属机构修改机构信息
exports.update = async (ctx,next)=>{
    let result = {"success":false, "error":{}, "data":{}};

    let organ = {};
    let hash = ctx.params.hash ||"";
    //只修改机构名称，办公电话，机构简介
    copy(ctx.request.body).pick("orgname","telephone","abstract").to(organ);
    if(hash){
        result = await OrganAction.update(hash,organ);
    }else{
       
        result.error= await ErrorParse('args err');
    }

    ctx.body = result;
}

exports.remove = async(ctx,next)=>{

    let result = {"success":false, "error":{}, "data":{}};

    let hash = ctx.params.hash || "";

    if(hash){
        result = await OrganAction.remove(hash);
    }else{
        result.error= await ErrorParse('args err');
    }

    ctx.body = result;

}


exports.alldbs = async(ctx,next)=>{
    let result = {"success":false,"data":{},"error":{}};

    result = await OrganAction.alldbs();

    ctx.body = result;
}

exports.detailInfor = async(ctx,next)=>{
    let result = {"success":false, "error":{}, "data":{}};
    let hash = ctx.params.hash || "";

    if(hash){

        result = await OrganAction.detailInfor(hash);
            
    }else{
       
        result.error= await ErrorParse('args err');
    }

      
    ctx.body = result;
}

exports.createDB = async(ctx,next)=>{
    let result = {'success':false,'error':{},'data':{}};
    let organ = {};
    organ.hash = ctx.params.hash||"";
    organ.host = ctx.query.host||ctx.request.body.host||"192.168.1.3";
    organ.port = ctx.query.port||ctx.request.body.port||"6541"

    if(organ.hash){
        result = await OrganAction.createDB(organ);

    }else{
        result.error = await ErrorParse('args err');
    }

    ctx.body = result;
}
