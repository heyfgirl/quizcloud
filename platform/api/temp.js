'use srict';
const copy = require('copy-to');
const ErrorParse = require('./../../Data/tool/error');
const {TempAction} = require('./../action/index');

exports.create = async(ctx,nect)=>{
    let result = {'success':false,'error':{},'data':{}};
    let temp = {};
    copy(ctx.request.body).pick("name","gflag","abstract","path","cover","demourl","version","apphash").to(temp);

    if(!temp.name){
        result.error = await ErrorParse('缺少模板名称');
    }else if(!temp.path){
         result.error = await ErrorParse('缺少模板路径');
    }else if(!temp.version){
        result.error = await ErrorParse('缺少版本号');
    }else if(!temp.appHash){
        result.error = await ErrorParse('选择所属模板');
    }

    result = await TempAction.create(temp);

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
    option["apphash"] = ctx.query["apphash"]||ctx.request.body["apphash"]||"";
    if(option["apphash"]){
        result = await TempAction.list(option);
    }else{
        result.error = await ErrorParse('args err:请传递正确的应用hash')
    }
    
    return ctx.body = result;

}

exports.update = async (ctx,next) =>{ 
    let result = {'success':false,'data':{},'error':{}};
    let hash = ctx.params.hash||"";
    let option = {};
    if(hash){
        copy(ctx.request.body).pick("name","gflag","abstract","path","cover","demourl","version","apphash").to(option);

        await TempAction.update(option);
    }else{
        result.error = await ErrorParse('args err');
    }
    ctx.body = result;
}

exports.remove = async(ctx,next) =>{
    let result = {'success':false,'data':{},'error':{}};
    let hash = ctx.params.hash||"";
    
     if(hash){
        await TempAction.remove(hash);
    }else{
        result.error = await ErrorParse('args err');
    }
    ctx.body = result;

}
