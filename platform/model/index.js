'use strict';
const copy = require("copyto");
const Sequelize = require('sequelize');
//   
//   预留问题：

//   后续需要处理一个动态加载应用的模型的问题，过程一定是先加载应用的信息，然后再初始化
// 




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

//现有的模型名称（文件名，不含.js）
let modelList = ["user", "organ","aplication","temp","active","group","news","file"];

//拷贝到前端模型的属性名
const frontModelKeys = ["key", "name", "describe", "props", "view", "edit"];
//拷贝到前端模型的字段属性名(！！！还要加写)
const frontAttrKeys = ["index", "title", "query", "search", "order", , "width", "align", "fixed", "ellipsis"];
// 拷贝到后端模型的属性名
const backModelKeys = ["key", "options"]
//拷贝到后端模型的字段名(非全部，如果有自定义方法或属性需要再加进来)
//释意          [类型    唯一       主键         自增            描述      引用（外表）   更新hook   删除hook    验证       枚举值   接受空       指定字段名  默认值]
const backAttrKeys = ["type", "unique", "primaryKey", "autoIncrement", "comment", "references", "onUpdate", "onDelete", "validate", "values", "allowNull", "field", "defaultValue"]//


// 加载所有model文件
function loadAllModels() {
    for (let mName of modelList) {
        //加载模型文件
        let model = require("./" + mName);
        model["options"]["comment"] = model["name"];

        //单表的前台数据模型
        let frontModelObj = {};
        frontModelObj["attributes"] = {};
        copy(model).pick(frontModelKeys).to(frontModelObj);

        //单表的后台数据模型
        let backModelObj = {};
        backModelObj["attributes"] = {};
        copy(model).pick(backModelKeys).to(backModelObj);


        let query = [];
        let order = ['id', 'createdAt', 'updatedAt'];
        let search = [];

        for (let mKey of Object.keys(model["attributes"])) {

            let frontAttr = {};
            let backAttr = {};

            let orignAttr = model["attributes"][mKey];
            copy(orignAttr).pick(frontAttrKeys).to(frontAttr);
            copy(orignAttr).pick(backAttrKeys).to(backAttr);

            frontModelObj["attributes"][mKey] = frontAttr;
            backModelObj["attributes"][mKey] = backAttr;

            if (orignAttr["query"]) query.push(mKey);
            if (orignAttr["order"]) order.push(mKey);
            if (orignAttr["search"]) search.push(mKey);
        }

        ModelQueryFields[model["key"]] = frontModelObj["query"] = query;
        ModelOrderFields[model["key"]] = frontModelObj["order"] = order;
        ModelSearchFields[model["key"]] = frontModelObj["search"] = search;


        frontModels[model["key"]] = frontModelObj;
        backModels[model["key"]] = backModelObj;
    }
};


loadAllModels();

// 创建数据库流
let sequelize = new Sequelize("platform", "postgres", "postgres",
    {
        'host': '192.168.1.3',
        'port': '6541',
        'dialect': "postgresql",
        'timezone': '+08:00',
        'pool': {
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
    let s = sequelize.define(key, attributes, options);
    if(model=="File"){
        // s.sync({force:true});
    }
}


// sequelize["models"]["Temp"].belongsTo(sequelize["models"]["App"]);



// sequelize.sync();

// 获取数据库示例
function getSequelize() {
    return sequelize;
};
// 获取模型
function getTableModel(tablename) {
    return sequelize["models"][tablename];
};

//获取前端模型
function getFrontModel(tablename) {
    let model = frontModels[tablename]
    return model;
}

//获取可查询字段（query，在查询时使用）
function getQueryFields(tablename) {
    let fields = ModelQueryFields[tablename];
    return fields || []
}

//获取可排序字段（order）
function getOrderFields(tablename) {
    let fields = ModelOrderFields[tablename];
    return fields || []
}

//获取可搜索字段（search）
function getSeachFields(tablename) {
    let fields = ModelSearchFields[tablename];
    return fields || []
}

module.exports = {
    getSequelize,
    getTableModel,
    getFrontModel,
    getQueryFields,
    getOrderFields,
    getSeachFields
};