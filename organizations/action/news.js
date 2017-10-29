'use strict';
var _ = require("lodash");
var copy = require("copyto");
const Models = require("../model/index")
var ErrorParse = require("../../Data/tool/error.js")
const crypto = require('crypto');
const uid = require('uid');
const filterKeys = ["title","edit","editid","tag"];//可搜索字段
const orderKeys = ["id","createAt"];//可排序字段
const attributes = ["id","hash","activitehash","title","content","edit","editid","img","recom","click","tag","grop","release"]//支持查询的字段//
const ActiviteAction = require("./activite");

// 列表查询，支持关键字搜索
exports.list =async(option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let query = {};//查询参数
        query["attributes"] = attributes;
        // 分页处理
        let {kw,page,size,filter,order} = option;
        size = parseInt(size) || 20;
        size = size < 100 ? size :100; //最大100
        size = size > 5 ? size :5;   //最小10
        resData["size"] = query["limit"]   = size ;
        resData["page"] = page = parseInt(page) || 1;
        query["offset"] =  size*(page-1);
        // 搜索处理(如果有值采用与默认filter的合集，为空采用默认filter)
        if(filter && filter.length){
            filter = _.intersection(filter,filterKeys);
        }else{
            filter = filterKeys;
        }
        query["where"] ={};
        if(kw){
            let $or = [];
            let $like = "%"+kw+"%";
            for(let fkey of filter){
                let orLike = {};
                orLike[fkey] = {"$like":$like};
                $or.push(orLike);
            }
            query["where"]["$or"]=$or;
        }
        // 排序处理
        if(order &&　order instanceof Array){
            query["order"] = [];
            for(let or of order){
                if(order instanceof Array 
                    && orderKeys.indexOf(or[0]) != -1 
                    && ["DESC","ESC"].indexOf(String(or[1]).toUpperCase()) != -1
                ){
                    query["order"].push(or)
                }
            }
        }
        let NewsModel = Models.getTableModel(orgHash,"News");
        let Newslist = await NewsModel.findAndCountAll(query);

        //遍历将活动名称传入
        let activehashs = [];
        for(let list of Newslist.rows){
            activehashs.push(list.activitehash);
        }
        let ops={};
        ops.activehashs = activehashs;
        let activite = await ActiviteAction.info(orgHash,ops);
        // console.log(activite)
        copy(Newslist).to(resData)
        result["data"] = resData;
        result["success"] = true;
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;
};


exports.newest = async(orgHash,option)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let NewsModel = Models.getTableModel(orgHash,"News");
        result.data.rows = await NewsModel.findAll({
            'attributes':["title","content","release","img"],
            'where':{
                'activitehash':option.activeHash,
                // '$gt':{'grop':Date.now()}
            },
            'order':[["createdAt","DESC"]],
            'limit':2
        });
        result.success = true;

    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}

exports.edit = async(option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        let {title,content,hash} = option;
        if(title&&content){
            let NewsModel = Models.getTableModel(orgHash,"News");   
            let newNews = {};                     
            if(hash){
                await NewsModel.update(option);    
                result["success"] = true;
                newNews =await NewsModel.findOne({where:{"hash":hash}});
                newNews = newNews["dataValues"];          
                delete newNews["updatedAt"];
                delete newNews["deletedAt"];
                delete newNews["createdAt"];
            }else{
                option["hash"] =  Math.random().toString(35).substr(2, 8);
                newNews = await NewsModel.create(option);    
                result["success"] = true;
                newNews = newNews["dataValues"];          
                delete newNews["updatedAt"];
                delete newNews["deletedAt"];
                delete newNews["createdAt"];
            }
            result["data"] = newNews;
        }else{
            result["error"] = await ErrorParse("请填写新闻内容");                            
        }
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return result;
};