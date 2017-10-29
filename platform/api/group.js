'use strict';
const copy = require('copyto');
const ErrorParse = require('./../../Data/tool/error');
const {GroupAction} = require('./../action/index');

exports.update = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    let option = {};
    option.type = ctx.request.body['type']||"";
    let groups = ctx.request.body['value']||[];
    option.delKey = ctx.query['delKey']||ctx.request.body['delKey']||"";

    // if(delKey){//删除分组
    //     let await
    // }

    //检查用户提交的分组
    // console.log(typeof groups)
    if( groups instanceof Array && groups.length>0){
        option.groups = [];

        for(let group of groups){
            // console.log(typeof group)
            if(typeof group === 'object' && group.key && group.name){

                if(group.key == 'normal')continue;//不复制默认分组
                let newGroup = {};
                copy(group).pick('key','name').to(newGroup);
                newGroup.edit = false;
                newGroup.readonly = false;
                option.groups.push(newGroup);
            }
        }
        option.groups.unshift({'key':'normal','name':'默认分组','edit':false,'readonly':true});//每次修改统一添加默认分组
        result = await GroupAction.update(option);//更新分组

    }else{
        result.error = await ErrorParse('args err')
    }

    ctx.body = result;
}

exports.list = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    let type = ctx.request.body['type']||ctx.query['type']||"";

    if(type){
        result = await GroupAction.list(type);
    }else{
        result.error = await ErrorParse('args err')
    }
    ctx.body = result;
}

exports.create = async (ctx,next) =>{
    let result = {'success':false,'data':{},'error':{}};
    
    let option = {};
    option.type = ctx.request.body['type']||ctx.query['type']||"";
    option.name = ctx.request.body['name']||ctx.query['name']||""
    if(option.type&&option.name){
        result = await GroupAction.create(option);
    }else{
        result.error = await ErrorParse('args err')
    }
    ctx.body = result;
}

exports.delete = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    let group = ctx.request.body['key']||ctx.query['key']||"";

    if(group){

    }
}