'use strict';
const crypto = require('crypto');
const _ = require("lodash");
const copy = require("copyto");
const uid = require('uid');
const ErrorParse = require("../../Data/tool/error.js")
const Models = require('./../model/index');

exports.list = async (option)=>{
    let NewsModel = Models.getTableModel('News');
    let NewsFrontModel = Models.getFrontModel('News');
    let filterKeys = NewsFrontModel.search;//可搜索字段
    let orderKeys = NewsFrontModel.order;//可排序字段
    let attributes = NewsFrontModel.query;//可查询字段
   
    //默认返回值
    let result = {"success":false, "error":{}, "data":{}};
    let resData = {};//返回数据
    try{ 
        let query = {};//查询参数
        query["attributes"] =filterKeys;
        // 分页处理
        let {kw,page,size,filter,order} = option;
        size = parseInt(size) || 20;
        size = size < 100 ? size :100; //最大100
        size = size > 10 ? size :10;   //最小10
        resData["size"] = query["limit"]   = size ;
        resData["page"] = page = parseInt(page) || 1;
        query["offset"] =  size*(page-1);

        // 搜索处理(如果有值采用与默认filter的合集，为空采用默认filter)
        // if((filter && filter.length) && (filter != "ALL")){
        //     filter = _.intersection(filter,filterKeys);
        // }else{
        //     filter = filterKeys;
        // }
        if(filter.constructor==Array && filter.length){
            filter = _.intersection(filter,filterKeys);
        }else if(filter == "ALL"){
            filter = _.difference(filterKeys,["recom","click","release"]);
        }else{
            filter = new Array(filter);            
        }

        query["where"] ={};

        if(kw){
            let $or = [];
            let $like = "%"+kw+"%";
            for(let fkey of filter){
                let orLike = {};
                orLike[fkey] = {"$like":$like};
                $or.push(orLike)
            }
            query["where"]["$or"]=$or;
        }
         

        // 排序处理
        if(order &&　order instanceof Array){
            query["order"] = [];
            for(let or of order){
                if(order instanceof Array 
                    && orderKeys.indexOf(or[0]) != -1 
                    && ["DESC","ASC"].indexOf(String(or[1]).toUpperCase()) != -1
                ){
                    query["order"].push(or)
                }
            }
        }
        query["order"] = [];                
        query["order"].push(["updatedAt","DESC"]);



        let search = await NewsModel.findAndCountAll(query);

        resData["total"] =search["count"];
        resData["rows"] = search["rows"];
        result["data"] = resData;
        result["success"] = true;
        result["code"] = 0;
        
    }catch(error){
        //未知错误
        console.log(error)

        result["code"] = -1;
        result["msg"] ="页面加载出错";
        result["success"] = false;
        result["error"] = await ErrorParse(error);

    }
    return result;
  
}


exports.edit = async(option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };    
    try{
        let {title,content,hash,edit,release} = option;
        let NewsModel = Models.getTableModel("News");   
        let newNews = {}; 
        if(hash){
            if(title&&content){
                if(edit&&release){
                    await NewsModel.update(option,{where:{"hash":hash}});     
                }else{
                    result["error"] = await ErrorParse("没有");                
                    return result;                    
                }
            }                              
            result["success"] = true;                                
            newNews =await NewsModel.findOne({where:{"hash":hash}});
            newNews = newNews["dataValues"];          
            delete newNews["updatedAt"];
            delete newNews["deletedAt"];
            delete newNews["createdAt"]; 
        }else{
            option["hash"] =  Math.random().toString(35).substr(2, 8);
            if(title&&content&&edit&&release){
                newNews = await NewsModel.create(option);    
                result["success"] = true;
                newNews = newNews["dataValues"];          
                delete newNews["updatedAt"];
                delete newNews["deletedAt"];
                delete newNews["createdAt"];
            }else{
                result["error"] = await ErrorParse("缺少数据");                                
            }                
        }
        result["data"] = newNews; 
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return result;
};