'use strict';
var _ = require("lodash");
var copy = require("copyto");
const uid  = require('uid');
const Models = require("../model/index")
var ErrorParse = require("../../Data/tool/error.js")
const crypto = require('crypto');
const filterKeys = ["hash","key","value"];//可搜索字段
const orderKeys = [];//可排序字段
const attributes = ["hash","key","value"]//支持查询的字段//

module.exports= async(orgHash,hash,key,value)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let KVstoreModel = Models.getTableModel(orgHash,"KVstore"); 
        let where={};
        where["hash"] = hash;       
        if(typeof key ==="string"){
            let resData = {};            
            // 一个值更新或查询
            where["key"] = key; 
            if(value){
                let newInfo = {};                
                newInfo['value'] = JSON.stringify(value);
                newInfo['hash'] = hash;
                newInfo['key'] = key;                
                // 更新值
                let res_d = await KVstoreModel.findOne({'where':where});
                if(res_d){
                    await KVstoreModel.update(newInfo,{'where':where});                    
                }else{
                    await KVstoreModel.create(newInfo,{'where':where});   
                }
            }
            // 拉取最新的值
            let Data = await KVstoreModel.findOne({"attributes":attributes,"where":where});
            if(Data){
                resData = Data["dataValues"];
                resData['value'] =JSON.parse(resData['value']);  
                result['data'] = resData;
                result['success'] = true;                        
            }else{
                result['data'] = false;
                result['success'] = true;            
            }
        }else{
            // 查询多个key的值，不支持更新
            // 拉去多个值
            let resData = [];            
            where["$or"] =[]; 
            for(let li of key){
                where["$or"].push(li);
            }
            let Data = await KVstoreModel.findAll({"attributes":attributes,'where':where}); 
            if(Data.length>0){
                for(let li of Data){
                    let Datali = li['dataValues'];
                    let newObj = {};
                    newObj['hash']= Datali.hash;
                    newObj['key']= Datali.key;            
                    newObj['value'] = JSON.parse(Datali['value']);
                    resData.push(newObj);
                }
                result['data'] = resData;
                result['success'] = true;
            }else{
                result['data'] = false;
                result['success'] = true;            
            }   
        }
    }catch(error){
        result["error"] = await ErrorParse(error);         
    }
    return result;
}