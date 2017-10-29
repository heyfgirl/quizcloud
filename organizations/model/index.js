'use strict';
const copy = require("copyto");
const Sequelize = require('sequelize');

//存储提给给前端的数据模型
var frontModels = {};
//存储提供给后端的模型缓存
var backModels = {};
// 可排序字段（order）
var ModelOrderFields = {};
// 可查询字段（query）
var ModelQueryFields = {};
// 可搜索字段（search）
var ModelSearchFields = {};

//拷贝到前端模型的属性名
const frontModelKeys = ["key", "name", "describe", "props", "view", "edit"];
//拷贝到前端模型的字段属性名(！！！还要加写)
const frontAttrKeys = ["index", "title", "query", "search", "order", , "width", "align", "fixed", "ellipsis"];
// 拷贝到后端模型的属性名
const backModelKeys = ["key", "options"]
//拷贝到后端模型的字段名(非全部，如果有自定义方法或属性需要再加进来)
//释意          [类型    唯一       主键         自增            描述      引用（外表）   更新hook   删除hook    验证       枚举值   接受空       指定字段名  默认值]
const backAttrKeys = ["type", "unique", "primaryKey", "autoIncrement", "comment", "references", "onUpdate", "onDelete", "validate", "values", "allowNull", "field", "defaultValue"]//


//所有的模型keys(与定义保持一致)
var originModelKeys =[];
// 存储所有的模型key（小写，用于检查重复）
var lowercaseKeys =[];



// 注册模型
function separateModel(model) {

    // 检查是否重复
    let mkey = model["key"];
    model["options"]["comment"] = model["name"];
    let frontModelObj = {};
    frontModelObj["attributes"] = {};
    copy(model).pick(frontModelKeys).to(frontModelObj);
    let backModelObj = {};
    backModelObj["attributes"] = {};
    copy(model).pick(backModelKeys).to(backModelObj);
    let query = [];
    let order = [];
    let search = [];
    for (let akey of Object.keys(model["attributes"])) {
        let frontAttr = {};
        let backAttr = {};
        let orignAttr = model["attributes"][akey];
        copy(orignAttr).pick(frontAttrKeys).to(frontAttr);
        copy(orignAttr).pick(backAttrKeys).to(backAttr);
        frontModelObj["attributes"][akey] = frontAttr;
        backModelObj["attributes"][akey] = backAttr;
        if (orignAttr["query"]) query.push(akey);
        if (orignAttr["order"]) order.push(akey);
        if (orignAttr["search"]) search.push(akey);
    }
    ModelQueryFields[model["key"]] = frontModelObj["query"] = query;
    ModelOrderFields[model["key"]] = frontModelObj["order"] = order;
    ModelSearchFields[model["key"]] = frontModelObj["search"] = search;
    frontModels[model["key"]] = frontModelObj;
    backModels[model["key"]] = backModelObj;
}


//加载机构的模型（文件名，不含.js）
let modelList = ["news", "file", "user", "kvstore","activite","application"];
function loadSysModels() {
    for (let key of modelList) {
        let model = require("./" + key);
        separateModel(model);
    }
}
loadSysModels();





// 模拟数据库(模拟数据)
var databases = [
    {
        'host': '192.168.1.3',
        'port': '6541',
        'hash': "orgbeo5cg",
        'pass': "oo3gt2"
    },
    {
        'host': '192.168.1.3',
        'port': '6541',
        'hash': "orgv0vh3b",
        'pass': "m8sdo8"
    },
];


//存储所有实例
var allModelInstances = {};
// 链接  1000个用4秒 //// 500个2305（2011）(2180)///10个58毫秒// console.log(new Date().getTime());
/////////启动时候链接所有机构数据库

// 模型注册完毕，开始初始化模型
function complete(callback){
    // 按照顺序初始化model
    try{
        for (let db of databases) {
            // 创建数据库流
            let sequelize = new Sequelize(db.hash, db.hash, db.pass,
                {
                    host: db.host,
                    port: db.port,
                    dialect: "postgresql",
                    timezone: '+08:00',
                    pool: {
                        max: 5,
                        min: 0,
                        idle: 10000
                    },
                }
            )
            // await sequelize.authenticate();测试链接
            // 定义实例模型
            for (let model of Object.keys(backModels)) {
                let { key, attributes, options } = backModels[model];
                //  console.log({key,attributes,options})
                let s = sequelize.define(key, attributes, options);
                if(model=="Paper"){
                    // s.sync({force:true});
                }
            
            }
            // sequelize.sync({force:true});
            allModelInstances[db.hash] = sequelize;
        }
        console.log("加载数据库")
        exp["regist"] = null;
        delete  exp["regist"];
        callback(exp)
    }catch(error){
        console.log(error);
    }
}

//获取所有数据库实例
function getALLInstances() {
    return allModelInstances;
};
//根据机构hash获取数据库实例
function getInstance(orghash) {
    return allModelInstances[orghash];
};

//返回哈希为orghash,数据表名为tablename的该机构的的数据表模型实例
function getTableModel(orghash, tablename) {

    let model = allModelInstances[orghash];

    return model["models"][tablename];
};

//前端模型
function getFrontModel(key) {
    let model = frontModels[key]
    return model;
}

//获取可查询字段（query，在查询时使用）
function getQueryFields(orghash, tablename) {
    let fields = ModelQueryFields[orghash][tablename];
    return fields || []
}

//获取可排序字段（order）
function getOrderFields(orghash, tablename) {
    let fields = ModelOrderFields[orghash][tablename];
    return fields || []
}

//获取可搜索字段（search）
function getSeachFields(orghash, tablename) {
    let fields = ModelSearchFields[orghash][tablename];
    return fields || []
}

var exp = {
    getALLInstances,
    getInstance,
    getTableModel,
    getFrontModel,
    getQueryFields,
    getOrderFields,
    getSeachFields,



    // KV数据库
    KVStore: function (org,hash, key, value) {

    }, 

    // List数据库
    ListStore: function (org,hash, key, value) {

    },

    // 模型注入方法
    regist: separateModel,

    //注入完成初始化模型
    complete:complete
    
};

module.exports = exp;