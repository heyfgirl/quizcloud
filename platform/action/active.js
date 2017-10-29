'use strict';
const _ = require("lodash");
const copy = require("copyto");
const ErrorParse = require("../../Data/tool/error.js");
const Models = require('./../model/index');

exports.add = async(option)=>{
    let result = {"success":false,"error":{},"data":{}};

    let ActiveModel = Models.getTableModel("Active");
    try{
        result.data = await ActiveModel.create(option);
        result.success = true;
    }catch(e){
        result.error = await ErrorParse(e);
    }
    
    return result;

}

exports.list = async (option)=>{
    let ActiveModel = Models.getTableModel("Active");
    let attributes = Models.getQueryFields("Active");
    let filterKeys = Models.getSeachFields("Active");
    let orderKeys = Models.getOrderFields("Active");
    //默认返回值
    let result = {"success":false, "error":{}, "data":{}};
    let resData = {};//返回数据
    try{ 
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
                    && ["DESC","ESC"].indexOf(String(or[1]).toUpperCase()) != -1
                ){
                    query["order"].push(or)
                }
            }
        }
        
        let search = await ActiveModel.findAndCountAll(query);

        resData["total"] =search["count"];
        resData["rows"] = search["rows"];
        result["data"] = resData;
        result["success"] = true;
        
    }catch(error){
        //未知错误
        console.log(error)

        result["code"] = -1;
        result["msg"] ="页面加载出错";
        result["error"] = await ErrorParse(error);

    }
    return result;
}

exports.info = async (activeId)=>{
    let result = {'success':false,'error':{},'data':{}};

    try{
        let ActiveModel = Models.getTableModel('Active');

        let active = await ActiveModel.findOne({'where':{'id':activeId}});

        if(active){
            // active.dataValues.mode = active.dataValues.mode == "public"?"公开":"私有";
            result.data = active;
            result.success = true;
        }else{
            result.error = await ErrorParse('active not found');
        }

    }catch(e){
        result.error = await ErrorParse(e);
    }

    return result;
}