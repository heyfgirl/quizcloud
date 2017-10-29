'use strict';
const Sequelize = require('sequelize');

exports.key = "App";
exports.name = "应用表";
exports.describe = "记录应用的基本存储信息";

exports.view = ["ALL"]; //浏览权
exports.edit = ["ALL"]; //编辑权

// 数据库表属性
exports.options =  {
    paranoid: true
};


// iview 表格属性
exports.props = {
    'stripe':true, 
    'highlight-row':true,
    'no-data-text':"没有数据，请调整查询条件",
    'no-filtered-data-text':"无匹配数据，请调整过滤条件"
}


exports.attributes = {
    // 应用哈希
    'hash':{
        'index': 1,
        'title': '哈希',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(20),
        'allowNull': false,
        'unique': true,  
    },
    //应用名
    'name':{
        'index': 2,
        'title': '应用名',
        'view': ["ALL"],
        'edit': ["ALL"],

       'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false, 
    },
    //应用介绍
    'explain':{
        'index': 3,
        'title': '介绍',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
        'unique': true,  
    },
    //应用名
    'img':{
        'index': 4,
        'title': '图片',
        'view': ["ALL"],
        'edit': ["ALL"],

       'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
    },
};