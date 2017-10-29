"use strict";
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
const SubjectAction = require('../action/index').SubjectAction;
const KVstoreAction = require('../../../organizations/action').KVstoreAction;
const FilesAction = require('../../../organizations/action').FilesAction;

var ErrorParse = require("../../../Data/tool/error.js")

exports.list = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let option ={};
        let orghash = ctx.organ["hash"];
        copy(ctx.request.body).to(option);
        result =await  SubjectAction.list(orghash,option); 
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    ctx.body=result;
};

exports.info = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let orghash = ctx.organ["hash"];        
        // 获取数据
        let option = {};
        copy(ctx.request.body).to(option);
        result =await  SubjectAction.info(orghash,option);     
        result["data"] = result["data"]["dataValues"];     
        result["data"]["base"] = ctx.base;
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    ctx.body=result;
};


exports.group=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let option={};
        copy(ctx.request.body).to(option);        
        option.hash = ctx.params.active;
        let orghash = ctx.organ["hash"];
        ////let hashs =    获取机构全部活动的hash 
        option.key = "questionbank";
        result =await  KVstoreAction(orghash,option.hash,option.key,option.value);                                                                              
    }catch(error){
        result["error"] = await ErrorParse(error);                        
    }   
    ctx.body=result;    
};    
exports.file=async(ctx,next)=>{
    //orgHash,file,filename,encoding,mimetype,storepath
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let orgHash = ctx.organ["hash"];     
        if(ctx.query.action === 'uploadfile'){
            console.log( ctx.request.body.fields);
            if(ctx.request.body.files && ctx.request.body.files.file){
                let file = ctx.request.body.files.file.path;
                let filename = ctx.request.body.files.file.name;
                let encoding = ctx.request.body.files.file.size;
                let mimetype = ctx.request.body.files.file.type;
                var static_url = __dirname+"/../static/";
                var storepath = "file";    
                result =  await FilesAction(static_url,orgHash,file,filename,encoding,mimetype,storepath);
            }else{
                result["error"] = await ErrorParse("error");                                                    
            }
        }else{
            result["error"] = await ErrorParse("error");                                    
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                        
    }
    if(Object.keys(result["error"]).length === 0){
        return ctx.body=result["data"];            
    }else{
        ctx.body=result;                    
    }   
}; 

exports.detail = async (ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    let subjectHash = ctx.request.body['hash']||"";
    let orgHash = ctx.organ["hash"];     
    if(subjectHash&&orgHash){
        result = await SubjectAction.detail(orgHash,subjectHash);
    }else{
        result.error = await ErrorParse('args err');
    }

    ctx.body = result;
    
}