'use strict';
const copy = require("copyto");
const uid  = require('uid');
var ErrorParse = require("../../Data/tool/error.js");
const{FileAction} = require("../action/index");
const path = require('path');
var ueditorConfig = require(path.join(__dirname+'/../vue/dist/ueditor/ueditor.config.json'));//公共方法

//判断是否为空
var isEmpty = function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
module.exports = async(ctx,next)=>{
  //orgHash,file,filename,encoding,mimetype,storepath
    try{
        let option = {};
        let base = {};  

        if (ctx.query.action === 'config') {
            return  ctx.body = ueditorConfig;
        }
        ///filesize,filename,filetmpdir,filetype
        
        if(ctx.request.body.files && ctx.request.body.files.file){
            option.filetmpdir = ctx.request.body.files.file.path;
            option.filename = ctx.request.body.files.file.name;
            option.filesize = ctx.request.body.files.file.size;
            option.filetype = ctx.request.body.files.file.type;
            base = isEmpty(ctx.request.body.fields) ?  ctx.base : ctx.request.body.fields ;
            let res =  await FileAction(option,base);
            if(res.success){
                if(ctx.query.action === 'UeditorUpload'){
                    let restult = {};
                    restult["url"] =  res["data"]["address"];
                    restult["name"] = res["data"]["name"];
                    restult["originalName"] = res["data"]["name"];
                    restult["size"] = res["data"]["size"];
                    restult["type"] = res["data"]["type"];
                    restult["state"] = "SUCCESS";
                    return ctx.body = restult;
                // }else if(ctx.query.action === 'uploadfile'){
                    
                    

                }else if(ctx.query.action === 'uploadfile'){
                    let restult = {};
                    restult["url"] =  res["data"]["address"];
                    restult["hash"] = res["data"]["hash"];
                    return ctx.body = restult;
                }
            }
        }else{

        }
    }catch(error){
        
    }
    // if(Object.keys(result["error"]).length === 0){
    //     return ctx.body=result["data"];            
    // }else{
    //     ctx.body=result;                    
    // }   
};

