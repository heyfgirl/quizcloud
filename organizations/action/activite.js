'use strict';
var _ = require("lodash");
var copy = require("copyto");
const Models = require("../model/index")
var ErrorParse = require("../../Data/tool/error.js")
const crypto = require('crypto');
const filterKeys = ["name","abstract","appname"];//可搜索字段
const orderKeys = ["id","createAt"];//可排序字段
const attributes = ["id","hash","appname","path","name","abstract","begin","end","mode","apphash","temphash","tempname"]//支持查询的字段//
// 列表查询，支持关键字搜索
exports.list =async(option,orgHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let query = {};//查询参数
        // query["attributes"] = attributes;
        // 分页处理
        let {kw,page,size,filter,order} = option;
        size = parseInt(size) || 20;
        size = size < 100 ? size :100; //最大100
        size = size > 10 ? size :10;   //最小10
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
        let ActiviteModel = Models.getTableModel(orgHash,"Activite");
        let Newslist = await ActiviteModel.findAndCountAll(query);
        copy(Newslist).to(resData)
        for(let res of resData.rows){
            if(res.mode == "public"){
                res.mode = "公用";
            }else if(res.mode == "private"){
                res.mode = "私有";
            }
        }
        result["data"] = resData;
        result["success"] = true;
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;
};

exports.info =async(orgHash,option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let ResData = {};
        let ActiviteModel = Models.getTableModel(orgHash,"Activite");        
        if( !option.activehashs ){
            if(option.hash){
                if(option.abstract&&option.appname&&option.mode){
                    ///都存在更改
                    await ActiviteModel.update(option);
                }
                ///有hash没有内容则查询
                ResData = await ActiviteModel.findOne({"where":{"hash":option.hash}});                
            }else{
                option.hash = "act" + Math.random().toString(35).substr(2, 9);
                if(option.abstract&&option.appname&&option.mode){
                    await ActiviteModel.create(option);                            
                }else{
                    result["error"] = await ErrorParse("error");                
                }
                ResData = await ActiviteModel.findOne({"where":{"hash":option.hash}});                            
            }
            if(ResData){
                result["data"] = ResData;
                result["success"] = true;
            }
        }else{

            



        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;    
}