'use strict';
const copy = require('copy-to');
const ErrorParse = require('./../../Data/tool/error');
const {UserAction,OrganAction} = require('./../action/index');


 
//用户列表
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

    result = await UserAction.list(option);
   
    return ctx.body = result;

}


//用于后台管理，root 创建管理员账号
exports.create = async (ctx,next)=>{
    let user = {};
    let result = {"success":false, "error":{}, "data":{}};

    copy(ctx.request.body).pick('username','password','realname','nickname','role','gflag','mobile','email','addr','gender','qq').to(user);

    //检查用户名，密码，手机号非空
    if(!user.username){
        result.error = await ErrorParse("用户名不能为空！");
        return ctx.body = result;
    }else if(!user.password){
        result.error = await ErrorParse("密码不可为空！");
        return ctx.body = result;
    }

    user.role = user.role||"normal";
    result = await UserAction.create(user);
        
    ctx.body = result;
    
}

//用户详情
exports.info = async(ctx,next)=>{

    let result = {"success":false, "error":{}, "data":{}};
    let user = {};

    copy(ctx.request.body).pick('id','username','email','mobil').to(user);
    
    result = await UserAction.info(user);

    ctx.body = result;

}

exports.update = async (ctx,next)=>{
    let user = {};
    let result = {"success":false, "error":{}, "data":{}};

    copy(ctx.request.body).pick('username','password','nickname','userpic','realname','gender','addr','qq').to(user);

    if(user.username){
        result = await UserAction.update(user);
              
    }else{
        result.error = ErrorParse('args err');
    }

    ctx.body = result;
}

exports.remove = async(ctx,next)=>{

    let result = {"success":false, "error":{}, "data":{}};

    let username = ctx.request.body['username'] || "";

    if(username){
             result = await UserAction.remove(username);
    }else{
            result.error= await ErrorParse('args err');
    }

    ctx.body = result;

}

