'use srict';
const copy = require('copy-to');
const ErrorParse = require('./../../Data/tool/error');
const {ActiveAction} = require('./../action/index');


//机构向平台提交活动信息
exports.add = async(ctx,nect)=>{
    let result = {'success':false,'error':{},'data':{}};
    let active = {};
    copy(ctx.request.body).pick("path","activename","abstract","begin","end","mode","apphash","appname","temphash","tempname","orghash","orgname").to(active);

    result = await ActiveAction.add(active);

    ctx.body = result;

}


//活动列表
exports.list = async(ctx,next)=>{
    
    let result = {"success":false, "error":{}, "data":{}};

    let option = {};
    //关键字（搜索词 ）  GET/POST
    option["kw"] = ctx.query["kw"] || ctx.request.body["kw"] ||"";
    //过滤字段（默认选择全部 ） POST
    option["filter"] = ctx.request.body["filter"] || [];
    //需要获取的页码数/分页大小  GET/POST
    option["page"] =  ctx.query["page"] || ctx.request.body["page"] || 1;
    option["size"] =  ctx.query["size"] || ctx.request.body["size"] || 10;
    //排序数据 [["name","DESC"],["id","ESC"]]
    let order = ctx.query["order"] || [];

    result = await ActiveAction.list(option);
    
    ctx.body = result;

}

//活动详情

exports.info = async(ctx,next)=>{
    let result = {'success':false,'error':{},'data':{}};

    let activeId = ctx.params['id']||"";

    if(activeId){
        result = await ActiveAction.info(activeId);
    }else{
        result.error = await ErrorParse('args err');
    }

    ctx.body = result;
}