'use strict';
const Sequelize = require('sequelize');

exports.key = "File";
exports.name = "文件表";
exports.describe = "记录文件存储信息";

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
    // 文件哈希
    'hash':{
        'index': 1,
        'title': '哈希',
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
    //图片访问地址
    'address':{
        'index': 2,
        'title': '地址',
        'view': ["ALL"],
        'edit': ["ALL"],

       'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true, 
    },
    //文件真实路径
    'path':{
        'index': 3,
        'title': '路径',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //文件描述
    'describe':{
        'index': 4,
        'title': '描述',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        
        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //文件大小
    'size':{
        'index': 5,
        'title': '大小',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //文件名
    'name':{
        'index': 6,
        'title': '描述',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        
        'type': Sequelize.STRING,
        'allowNull': false,
    },    
    //文件存储名
    'storaname':{
        'index': 7,
        'title': '描述',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        
        'type': Sequelize.STRING,
        'allowNull': false,
    }
};