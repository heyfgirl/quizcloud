
"use strict";
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
const PaperAction = require('../action/index').PaperAction;
const KVstoreAction = require('../../../organizations/action').KVstoreAction;
const FilesAction = require('../../../organizations/action').FilesAction;

var ErrorParse = require("../../../Data/tool/error.js");


exports.list = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let option ={};
        let orghash = ctx.organ["hash"];
        copy(ctx.request.body).to(option);
        option.active = ctx.params.active;
        // console.log(ctx);
        result =await  PaperAction.list(orghash,option); 
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    ctx.body=result;
};
exports.info = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let option ={};
        let orghash = ctx.organ["hash"];
        copy(ctx.request.body).to(option);
        result =await  PaperAction.info(orghash,option); 
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    ctx.body=result;
};

exports.questionByPaper = async(ctx,next)=>{
    let paperHash = ctx.request.body['paperHash']||"";

    let result = {'success':'false','error':{},'data':{}};
    let orgHash = ctx.organ["hash"]; 
    if(paperHash&&orgHash){
        result = await PaperAction.questIdsByPaper(orgHash,paperHash);
    }else{
        result.error = await ErrorParse("args err");
    }

    ctx.body = result;

}

