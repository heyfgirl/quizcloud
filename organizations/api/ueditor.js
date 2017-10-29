'use strict';
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var ErrorParse = require("../../Data/tool/error.js");
const{FileAction} = require("../action/index");
const path = require('path');
var static_url = __dirname+"/../vue/dist/static";
//判断是否为空
var isEmpty = function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

exports.init = async(ctx,next)=>{
    let result = { "success":false ,"error":{} ,"data":{} };  
    try{
        let orgHash = ctx.organ["hash"];
        let option = {};
        let base = {};
        if (ctx.query.action === 'config') {
            return  ctx.body = ueditorConfig;
        }else{
            if(ctx.request.body.files && ctx.request.body.files.file){
                option.filetmpdir = ctx.request.body.files.file.path;
                option.filename = ctx.request.body.files.file.name;
                option.filesize = ctx.request.body.files.file.size;
                option.filetype = ctx.request.body.files.file.type;
                base = isEmpty(ctx.request.body.fields) ?  ctx.base:ctx.request.body.fields ;
    
                let res =  await FileAction(orgHash,option,base);
                
                if(res.success){
                    if(ctx.query.action === 'uploadfile'){
                        
                    }else{
                        let restult = {};
                        restult["url"] =  res["data"]["address"];
                        restult["name"] = res["data"]["name"];
                        restult["originalName"] = res["data"]["name"];
                        restult["size"] = res["data"]["size"];
                        restult["type"] = res["data"]["type"];
                        restult["state"] = "SUCCESS";
                        return ctx.body = restult;
                        // {
                        //     "originalName":"demo.jpg",
                        //     "name":"demo.jpg",
                        //     "url":"upload\/demo.jpg",
                        //     "size":"99697",
                        //     "type":".jpg",
                        //     "state":"SUCCESS"
                        // }
                    }
                }
            }else{
    
            }
        }
    }catch(error){

    } 
};