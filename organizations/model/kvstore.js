'use strict';
const Sequelize = require('sequelize');

exports.key = "KVstore";
exports.name = "通用数据存储表";
exports.describe = "记录通用数据的存储信息";

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
    // 哈希
    'hash':{
        'index': 1,
        'title': '哈希',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(32),
        'allowNull': false,
        'unique': false,  
    },
    'key':{
        'index': 2,
        'title': 'Key',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(32),
        'allowNull': false,
        'unique': false,  
    },
    'value':{
        'index': 3,
        'title': 'Value',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.TEXT,
        'allowNull': false,
        'unique': false,  
    }
};