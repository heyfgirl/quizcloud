'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');

const XLSX = require('xlsx');
const FS = require('fs');
var ErrorParse = require("../../Data/tool/error.js");
const{UserAction,KVstoreAction ,FileAction,FilesAction} = require("../action/index");

/**
 * 创建用户
 */
exports.create = async(ctx,next)=> {
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let option={};
        copy(ctx.request.body).to(option);
        let orgHash = ctx.organ["hash"];
        if(1){  //(this.session["role"] == "admin"|| this.session["role"] == "root")
            if(! option.gender)  option.gender = 'unknown';
            result =  await UserAction.create(option,orgHash);                    
        }else{
            result["error"] = await ErrorParse("没有权限");        
        }
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;   
};
/**
 * 删除用户
 */
exports.remove = async(ctx,next)=> {
    let result = { "success":false ,"error":{} ,"data":{} };    
    try {
        let uid = this.session["uid"];
        let power = (ctx.session["role"]=="admin" || ctx.session["role"]=="root")? true :false;
        if(power){
            let orgHash = ctx.organ["hash"];
            result =  await UserAction.remove(uid,orgHash);
        }else{
            result.error = await ErrorParse("权限不够");
        }
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }  
    return ctx.body = result;   
};
/**
 * 更新用户信息
 * 通过用户账号
 */
exports.updata = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let option = {};
        copy(ctx.request.body).to(option);
        let uid = this.session["uid"];
        // let uid = parseInt(ctx.request.body["uid"]);
        if(ctx.session["role"]=="admin"||ctx.session["role"]=="root"|| this.session["username"] == option["username"]){
            let orgHash = ctx.organ["hash"];            
            result =  await UserAction.update(uid,option,orgHash);            
        }else{
            result.error = await ErrorParse("没有权限");
        }
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;   
};
/**
 * 获取用户列表
 * 一级根据机构
 * 二级活动
 * 每页查询size个用户
 */
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
        if(1){
            result =  await UserAction.list(option,orgHash);
            /////////////////////////////////////////////////
            let TAG1SVALUE = {};
            let TAG1S=await KVstoreAction(orgHash,"User","tag1");
            for(let li of TAG1S.data.value){
                TAG1SVALUE[li.key] = li.name;
            }
            let TAG2SVALUE = {};
            let TAG2S=await KVstoreAction(orgHash,"User","tag2");
            for(let li of TAG2S.data.value){
                TAG2SVALUE[li.key] = li.name;
            }
            let TAG3SVALUE = {};
            let TAG3S=await KVstoreAction(orgHash,"User","tag3");
            for(let li of TAG3S.data.value){
                TAG3SVALUE[li.key] = li.name;
            }
            for(let T of result.data.rows){
                T.tag1 = T.dataValues.tag1 = TAG1SVALUE[T.tag1] ? TAG1SVALUE[T.tag1] : T.tag1;
                T.tag2 = T.dataValues.tag2 = TAG2SVALUE[T.tag2] ? TAG2SVALUE[T.tag2] : T.tag2;
                T.tag3 = T.dataValues.tag3 = TAG3SVALUE[T.tag3] ? TAG3SVALUE[T.tag3] : T.tag3;                
            }  
            /////////////////////////////////////////////////

        }else{
            result["error"] = await ErrorParse("没有权限");                    
        }
    }catch(error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
}
/**
 * 获取用户信息
 */
exports.info=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{       
        let orgHash = ctx.organ["hash"];  
        let option = ctx.request.body;
        result =  await UserAction.info(option,orgHash);
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};

/**
 * 获取用户分组信息
 */
exports.groupinfo=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{       
        let orgHash = ctx.organ["hash"];      
        let option = {};
        copy(ctx.request.body).to(option);   
        let hash = option['hash'];
        let key =  option['key']; 
        result =await KVstoreAction(orgHash,hash,key,option.value);
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};

/**
 * 获取用户分组信息
 */
exports.deleteUserGroup=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{       
        let orgHash = ctx.organ["hash"]; 
        let option={};
        copy(ctx.request.body).to(option);  
        let hash = option['hash'];
        let optionUser = {};
        copy(option).pick(['key','DeleteKey','replaceKey']).to(optionUser);  
        result =await KVstoreAction(orgHash,hash,option.key,option.value);       
        let  resultUser =await UserAction.deleteGroup(optionUser,orgHash);
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;       
};
/**
 * 获取用户分组信息
 */
exports.ListGroup=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{         
        let orgHash = ctx.organ["hash"];      
        let option = {};
        copy(ctx.request.body).to(option);  
        let hash = option['hash'];
        let key = [];
        for(let i of option['key']){
            key.push({key:i});
        }  
        result =await KVstoreAction(orgHash,hash,key);
        let vasss = [{'key':'default','name':'默认分组'}];
        if(result['data'] == false){
            result =await KVstoreAction(orgHash,hash,'tag1',vasss);  
            result =await KVstoreAction(orgHash,hash,'tag2',vasss);   
            result =await KVstoreAction(orgHash,hash,'tag3',vasss);                   
        }
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return ctx.body = result;          
};

/**
 * 导入用户
 */
exports.Import=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{    
        let orgHash = ctx.organ["hash"];    
        let path = ctx.request.body.files.file.path;
        if(path){
            let workbook = XLSX.readFile(path);
            let filedata = JSON.stringify( XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) );
            if(filedata){
                result["data"] = JSON.parse(filedata);
                result["success"] = true;
            }else{
                result["error"] = await ErrorParse("读取文件出错");                            
            }

            ////////// result = await FileAction.import(path);

            if(result["success"]){
                if(1){//(this.session["role"] == "admin"|| this.session["role"] == "root")
                    if(result["data"] instanceof Array){
                        let option = [];
                        for(let li of result["data"]){
                            let row={};
                            row["username"] = li["用户名"]  || row["username"];
                            row["nickname"] = li["昵称"]  || row["nickname"];
                            row["gender"] = li["性别"]  || row["gender"] || "unknown";
                            row["realname"] = li["姓名"]  || row["realname"];
                            row["mobile"] = li["手机"] || row["mobile"];
                            row["address"] = li["地址"] || row["address"]; 
                            row["wechat"] = li["微信号"] || row["wechat"];
                            row["qq"] = li["QQ"] || row["qq"];                        
                            row["mailbox"] = li["邮箱"] || row["mailbox"];
                            row["password"] = li["密码"] || row["password"];
                            option.push(row);
                        }
                        let reqData = {};
                        reqData['role'] = ctx.request.body.fields["role"] || "nomer";
                        reqData['tag1'] = ctx.request.body.fields["tag1"] || "default";
                        reqData['tag2'] = ctx.request.body.fields["tag2"] || "default";
                        reqData['tag3'] = ctx.request.body.fields["tag3"] || "default";
                        reqData['option'] = option;
                        result = await  UserAction.importuser(reqData,orgHash)
                    }else{
                        result["error"] = await ErrorParse("非正常数据");                                                        
                    }
                }else{
                    result["error"] = await ErrorParse("没有权限");                                                        
                }
            }else{
                result["data"] = "文件未识别";                                    
            }
        }else{
            result["data"] = "文件上传失败";                                    
        }
    }catch (error){
        result["error"] = await ErrorParse(error);    
        result["data"] = "文件上传失败";                                            
    }
    return ctx.body = result;          
};
/**
 * 下载示例用户表
 */
exports.download=async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{      
        result = await FileAction.download();
    }catch(error){
        result["error"] = await ErrorParse(error);                        
    }
    return ctx.body = result;              
}
