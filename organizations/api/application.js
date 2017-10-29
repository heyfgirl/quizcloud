'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var ErrorParse = require("../../Data/tool/error.js")
const{AppAction} = require("../action/index");
////////应用列表//////////
exports.list = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let orgHash = ctx.organ["hash"];    
        let option = {};
        result = await AppAction.list(orgHash,option);
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;
};