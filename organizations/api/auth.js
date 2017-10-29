'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var ErrorParse = require("../../Data/tool/error.js")
const{UserAction } = require("../action/index");
/**
 * 用户登陆
 * GET和POST都支持
 */
exports.login = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try {
        let username = ctx.query["username"] || ctx.request.body["username"] || "";
        let password = ctx.query["password"] || ctx.request.body["password"] || "";
        if(!(username&&password)){
            result.error = await ErrorParse("缺少账号密码");
        }else{
            let orgHash = ctx.organ["hash"]            
            result =  await UserAction.login(username,password,orgHash);
        }
        return ctx.body = result;
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;   
};
/**
 * 登出
 */
exports.logout=async(ctx,next)=>{
}
/**
 * 修改密码
 */
exports.repass=async(ctx,next)=>{
}
/**
 * 修改信息
 */
exports.regist=async(ctx,next)=>{
}