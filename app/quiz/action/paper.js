"use strict";
const copy = require("copyto");
const uid  = require('uid');
const crypto = require('crypto');
var model = require("../model/loader")();
var ErrorParse = require("../../../Data/tool/error.js")

exports.list = async(orghash,option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let where={};
        where["active"] = option["active"];
        var PaperModel = model.getTableModel(orghash,"Paper");
        let length =option.size || 20;
        let page =option.page || 1;
        result["data"] = await PaperModel.findAndCountAll({
            // attributes:[],
            where:where,
            limit: length,
            offset: (page-1)*length,
        });
        result.success = true;
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return result;
};

exports.info = async(orghash,option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };      
    try{
        console.log(option)
        let options = {};      
        if(option.questrandom){
            option.total = option.random_total;                
            copy(option).pick("active","hash","answrandom","media","desc","difficult","private","questrandom","randomquest","score","time","total").to(options);            
        }else{
            option.total = option.Nrandom_total;   
            copy(option).pick("active","hash","answrandom","media","desc","difficult","private","questrandom","queststore","score","time","total").to(options);                            
        }
        options.difficult = typeof options.difficult == "number" ? options.difficult : parseInt(options.difficult);
        options.score = typeof options.score == "number" ? options.score : parseInt(options.score);
        options.total = typeof options.total == "number" ? options.total : parseInt(options.total);
        options.time = typeof options.time == "number" ? options.time : parseInt(options.time);
        
        var PaperModel = model.getTableModel(orghash,"Paper");  

        if(options.hash){
            if((options.queststore||options.randomquest)&&options.score&&options.total){
                if(options.queststore || options.randomquest){
                    await PaperModel.update(options,{where:{hash:options.hash}});                    
                }else{
                    result["error"] = await ErrorParse("无内容"); 
                    return result;                    
                }
            }
            result["data"] = (await PaperModel.findOne({where:{hash:options.hash}})).dataValues;
            result["success"] = true;
        }else{
            options.hash = "paper" + (Math.random().toString(35).substr(2, 9));
            if((options.queststore|| options.randomquest)&&options.total){
                let data = await PaperModel.create(options);
                result["data"] = data.dataValues;
                result["success"] = true;                
            }else{
                result["error"] = await ErrorParse("error");                        
            }
        }
        delete result["data"]["deletedAt"]; 
        delete result["data"]["id"]; 
        delete result["data"]["updatedAt"]; 
        delete result["data"]["createdAt"]; 
        
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return result;
};

exports.questIdsByPaper = async(orgHash,paperHash)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let PaperModel = model.getTableModel(orgHash,"Paper");
        result.data = await PaperModel.findOne({
                attributes:["queststore"],
                where:{
                    "hash":paperHash
                }
        });

        result.success = true; 

    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}

