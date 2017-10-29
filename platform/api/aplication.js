'use srict';
const fs = require('fs');
const path = require('path');
const copy = require('copy-to');
const ErrorParse = require('./../../Data/tool/error');
const {AplicationAction} = require('./../action/index');

exports.create = async(ctx,nect)=>{
    let result = {'success':false,'error':{},'data':{}};
    let aplication = {};
    copy(ctx.request.body).pick("name","gflag","abstract","author","cover","icon","version").to(aplication);

    if(!aplication.name){
        result.error = await ErrorParse('缺少应用名称');
    }else if(!aplication.author){
         result.error = await ErrorParse('缺少应用作者（来源');
    }else if(!aplication.version){
        result.error = await ErrorParse('缺少版本号');
    }

    result = await AplicationAction.create(aplication);

    ctx.body = result;

}


//应用列表
exports.list = async (ctx,next)=>{
    let result = {"success":false, "error":{}, "data":{}};

    let option = {};
    //关键字（搜索词 ）  GET/POST
    option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
    //过滤字段（默认选择全部 ） POST
    option["filter"] =   ctx.request.body["filter"] || [];
    //需要获取的页码数/分页大小  GET/POST
    option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1 ;
    option["size"] =  ctx.query["size"] || ctx.request.body["size"] || 10;
    //排序数据 [["name","DESC"],["id","ESC"]]
    let order = ctx.query["order"] || [];

    result = await AplicationAction.list(option);
    
    return ctx.body = result;

}

exports.update = async (ctx,next) =>{
    let result = {'success':false,'data':{},'error':{}};
    let hash = ctx.params.hash||"";
    let option = {};
    if(hash){
        copy(ctx.request.body).pick("name","gflag","abstract","author","cover","icon","cover","version").to(option);

        await AplicationAction.update(option);
    }else{
        result.error = await ErrorParse('args err');
    }
    ctx.body = result;
}

exports.remove = async(ctx,next) =>{
    let result = {'success':false,'data':{},'error':{}};
    let hash = ctx.params.hash||"";
    
     if(hash){
        await AplicationAction.remove(hash);
    }else{
        result.error = await ErrorParse('args err');
    }
    ctx.body = result;

}

exports.coverUpload = async(ctx,next)=>{

    let result = {'success':false,'data':{},'error':{}};

    try{
        let orginPath = ctx.request.body.files.file.path;
        let extname = path.extname(ctx.request.body.files.file.name);
        let staticPath = 'static/img/'+ new Date().toLocaleDateString();
        let dirPath = path.join(__dirname , './../vue/dist/',staticPath);//文件夹路径
        if(extname&&orginPath){
            if(!fs.existsSync(dirPath))fs.mkdirSync(dirPath);//创建文件夹
            let file = new Date().getTime() + extname;//文件名
            let savePath = dirPath +'/'+ file;//文件保存路径
            let readStream = fs.createReadStream(orginPath);
            let writeStream = fs.createWriteStream(savePath);
            readStream.pipe(writeStream);
            result.data = {"cover":staticPath+'/'+ file};//返回静态文件访问路径

            result.success = true;
        }else{ 
            result.error = await ErrorParse('应用封面上传失败。')
        }
        
    
    }catch(err){
        result.error = await ErrorParse('应用封面上传失败。')
    }
    ctx.body = result;
 

}
