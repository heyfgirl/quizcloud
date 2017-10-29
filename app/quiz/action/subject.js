"use strict";
const copy = require("copyto");
const uid = require('uid');
const crypto = require('crypto');
var model = require("../model/loader")();
var ErrorParse = require("../../../Data/tool/error.js")

exports.list = async (orghash, option) => {
    let result = { "success": false, "error": {}, "data": {} };
    try {
        let where = {};
        let attributes = ["id","title","updatedAt","gflag","hash","media","multiple","option","title","score","difficult","desc","createdAt","answer"];       
        where["$or"] =[]; 
        if(option.gflag){
            where["$or"].push({"gflag":option.gflag});            
        }
        if (option.gflags) {
            for(let li of option.gflags){
                where["$or"].push({"gflag":li});
            }        
        }
        if(option.hashs){
            for(let li of option.hashs){
                where["$or"].push({"hash":li});
            }   
            attributes = ["gflag","hash","media","multiple","option","title","score","difficult"];
        }
        /////没有gflage所有都搜出来
        if(where["$or"].length<1){
            where={};
        }
        var SubjectModel = model.getTableModel(orghash, "Subject");
        let length = option.size || 30;
        let page = option.page || 1;
        result["data"] = await SubjectModel.findAndCountAll({
            attributes:attributes,
            order: [['id']],
            where: where,
            limit: length,
            offset: (page - 1) * length,
        });
        result.success = true;
    } catch (error) {
        result["error"] = await ErrorParse(error);
    }
    return result;
};

exports.info = async (orghash, option) => {
    let result = { "success": true, "error": {}, "data": {} };
    try {
        var SubjectModel = model.getTableModel(orghash, "Subject");
        if (option.hash) {
            if (option.title && option.option && option.answer && option.score && option.gflag && option.answer[0]) {
                //有ID有数据=》更新
                if (typeof option.multiple == 'boolean') {
                    if (option.multiple && option.answer.length > 0) {
                        await SubjectModel.update(option, { where: { "hash": option.hash } });
                    } else {
                        if (option.answer.length == 1) {
                            await SubjectModel.update(option, { where: { "hash": option.hash } });
                        } else {
                            result["error"] = await ErrorParse("选项错误");
                            result.success = false;
                            return result;
                        }
                    }
                } else {
                    result["error"] = await ErrorParse("是否多选参数错误");
                    result.success = false;
                    return result;
                }
            }
            //有ID无数据=》查询
            result["data"] = await SubjectModel.findOne({ where: { "hash": option.hash } });
            if (!result["data"]) {
                result["success"] = false;
            }

        } else {
            //无ID有数据=》创建
            option.hash = "sub" + Math.random().toString(35).substr(2, 8);
            if (option.title && option.option && option.answer && option.score && option.gflag && option.answer[0]) {
                if (typeof option.multiple == 'boolean') {
                    if (option.multiple && option.answer.length > 0) {
                        result["data"] = await SubjectModel.create(option);
                    } else {
                        if (option.answer.length == 1) {
                            result["data"] = await SubjectModel.create(option);
                        } else {
                            result["error"] = await ErrorParse("选项错误");
                            result.success = false;
                        }
                    }
                } else {
                    result["error"] = await ErrorParse("是否多选参数错误");
                    result.success = false;
                }
            } else {
                result["error"] = await ErrorParse("error");
                result.success = false;
            }
        }

    } catch (error) {
        result["error"] = await ErrorParse(error);
        result.success = false;
    }
    return result;
};


exports.listgroup=async(orghash,option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        
    }catch(error){
        result["error"] = await ErrorParse(error);                        
    }     
    return result;    
};    

exports.detail = async(orghash,subjectHash)=>{
    let result = { "success":false ,"error":{} ,"data":{} };        
    try{
        let SubjectModel = model.getTableModel(orghash,"Subject");
       
        result["data"] = await SubjectModel.findOne({
           attributes:["title","media","option","multiple","difficult","desc"],
           where:{
                hash:subjectHash
           }
        });
        result.success = true;
    }catch (error){
        result["error"] = await ErrorParse(error);        
    }
    return result;
}
