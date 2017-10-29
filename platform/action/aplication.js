'use strict';
const crypto = require('crypto');
const _ = require("lodash");
const copy = require("copyto");
const uid = require('uid');
const ErrorParse = require("../../Data/tool/error.js")
const Models = require('./../model/index');


exports.create = async(option)=>{

    let AplicationModel = Models.getTableModel('Aplication');
   
    let result = { "success":false ,"error":{} ,"data":{} };
    try{

        let {name} = option;

        let existsed = await AplicationModel.findOne({
            "where":{"name":name}
        });
        //如果不存在新建,否则报错
        if(!existsed){
            option.hash = uid(12);
            let Aplication = await AplicationModel.create(option);
           
            result["data"]= Aplication;
            result["success"]=true;
        }else{
            result["error"] = await ErrorParse("Aplication exited")
        }
    }catch(err){
        result["error"] = await ErrorParse(err)
    }

    return result;
}

exports.list = async (option)=>{
    let AplicationModel = Models.getTableModel('Aplication');
    let AplicationFrontModel = Models.getFrontModel('Aplication');
    let filterKeys = AplicationFrontModel.search;//可搜索字段
    let orderKeys = AplicationFrontModel.order;//可排序字段
    let attributes = AplicationFrontModel.query;//可查询字段
   
    //默认返回值
    let result = {"success":false, "error":{}, "data":{}};
    let resData = {};//返回数据
    try{ 
        let query = {};//查询参数
        query["attributes"] = attributes;
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
        
        let search = await AplicationModel.findAndCountAll(query);

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

// 根据字段精确查询应用信息
exports.info = async (option)=>{

    let AplicationModel = Models.getTableModel('Aplication');
    let AplicationFrontModel = Models.getFrontModel('Aplication');
    let filterKeys = AplicationFrontModel.search;//可搜索字段
   
     let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        let search = {};
        copy(option).pick(attributes).to(search);
        let where = {};
        where["$or"] = [];
        for(let  skey of Object.keys(search)){

            if(search[skey]){
                where["$or"].push({[skey]:search[skey]});
            }
            
        }
        let existAplication = await AplicationModel.findOne({
                "attributes":attributes,
                "where":where
             });
        if(existAplication){
            result["data"]= existAplication;
            result["success"] = true;
        }else{
            result["error"] = await ErrorParse("user not find");
        }
    }catch(error){
        result["error"] = await ErrorParse(error);
    }
    return result;
}

// 更新应用信息（根据hash更新）
exports.update = async (uid,option)=>{

    let AplicationModel = Models.getTableModel('Aplication');
    let AplicationFrontModel = Models.getFrontModel('Aplication');
    let attributes = AplicationFrontModel.query;//可查询字段
   

    let result = { "success":false ,"error":{} ,"data":{} };
    try{
        let resData = {};//返回数据
        if(typeof uid === "number"){
            let newInfo = {};
            // 可以修改 password 
            attributes.push("password");
            copy(option).pick(attributes).to(newInfo)
            let existAplication = await AplicationModel.update(newInfo,{
                "attributs":attributes,
                "where":{"id":uid}
            });
            if(existAplication){
                
                result["data"]= existAplication;
                result["success"]=true;
            }else{
                result["error"] = await ErrorParse("Aplication not find",{})
            }
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["id"]})
        }
    }catch(error){
        result["error"] = await ErrorParse(error)
    }
    return result;
}

exports.remove = async(uid)=>{
    let AplicationModel = Models.getTableModel('Aplication');

    let result = {"success":false, "error":{}, "data":{}};
    try{ 
        if(typeof uid === "number"){
            result.data = await AplicationModel.destroy({"where":{"hash":hash}});
            result.success = true;
        }else{
            result["error"] = await ErrorParse("arg err",{"field":["hash"]});
        }

        
    }catch(e){
        result["error"] = await ErrorParse(error)
    }
    return result;
}