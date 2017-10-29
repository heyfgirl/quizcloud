'use strict';

/********    Test 使用   *****/
const fs = require('fs');
const Log = require('log');
// const logger = new Log('debug',fs.createWriteStream('./error.log',{flags: 'a+'}));
/****************************/


//错误定义json文件
const ErrorMap = require("./error.json");
const ErrorKeys = Object.keys(ErrorMap);
const CodeHash = ErrorKeys.reduce( function(acc,curv,curi) {
   acc[ErrorMap[curv]["code"]] =  curv;
   return acc;
},{});


/**
 * 格式化错误 接收各类错误类型并统一处理，统一返回json错误对象
 * @param err    string | number | Error
 * @param option Object  {ctx ,msg , field  , }  扩展属性 
 * @returns {}  error object
 */
 
module.exports = async function parse(err,option) {
    let revert = {};
    if(typeof err === "number"){
        if(CodeHash.hasOwnProperty(err)){
            revert = ErrorMap[CodeHash[err]]
        }
    }else if(typeof err === "string"){
        if(ErrorKeys.indexOf(err.toUpperCase())){
            revert = ErrorMap[err.toUpperCase()];
        }
    }else{
        err = err ||{};
        //Sequelize 错误处理
        if(typeof err ==="object" && err["name"] && err["name"].indexOf("Sequelize") === 0){
            revert = ErrorMap[err["name"].toUpperCase()]
        }
        //Sequelize 报错字段
        if(typeof err ==="object" && err["errors"] && typeof err["errors"] === "arrray" && revert){
            revert["error"]["field"] = [];
            for(let error of err["errors"]){
                if(error["path"] && revert["error"]["field"].indexOf(error["path"]) === -1){
                    revert["error"]["field"].push(error["path"]);
                }
            }
        }
    }

    //未记录错误处理
    if(! revert){
        revert =  ErrorMap["UNKNOW"]
    }
    // 日志存储
    // if(revert.hasOwnProperty("errid") && revert["errid"] ==true ){
    //     if(revert["code"]!== 5001){
    //         //数据库记录
    //     }else{
    //         //文件记录
    //         logger.error(JSON.stringify(revert));
    //     } 
    // }

    return revert
};

