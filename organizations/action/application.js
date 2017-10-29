
'use strict';
var _ = require("lodash");
var copy = require("copyto");
const uid  = require('uid');
const Models = require("../model/index")
var ErrorParse = require("../../Data/tool/error.js")
const crypto = require('crypto');
//创建用户
exports.list = async(orgHash,option)=>{
    let result = { "success":false ,"error":{} ,"data":{} };
    try{    
        let UserModel = Models.getTableModel(orgHash,"App");
        let userlist = await UserModel.findAll();
        result["data"] = userlist;
        result["success"] = true;
    }catch(error){
        result["error"] = await ErrorParse(error);                
    }
    return result;    
}