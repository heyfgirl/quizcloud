'use strict';
const Sequelize = require('sequelize');

exports.key = "Activite";
exports.name = "活动表";
exports.describe = "记录活动的基本存储信息";

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
    // 活动哈希
    'hash':{
        'index': 1,
        'title': '哈希',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':false,
        'query':false,
        'order': false,
        'search':false,
        

        'type': Sequelize.STRING(20),
        'allowNull': false,
        'unique': true,  
    },
    // 所属应用
    'appname':{
        'index': 1,
        'title': '所属应用',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //活动路径(hash)
    'path':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动路径',
        'index':1,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(12),
        'allowNull':false
    },
    // 活动名称/主题
    'name':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动名称',
        'index':2,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false
    },


    //活动简介
    'abstract':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动简介',
        'index':3,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':true
    },

    // 起止时间

    'begin':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动开始时间',
        'index':4,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.DATE
        // 'allowNull':false
    },

    'end':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动结束时间',
        'index':5,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.DATE
        // 'allowNull':false
    },

    // 活动模式
    'mode':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '活动模式',
        'index':6,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.ENUM('public','private')
        // 'allowNull':false
    },

    //应用的hash
    'apphash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用的hash',
        'index':7,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING(12),
        'allowNull':false
    },

    //模板的hash
    'temphash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板引用hash',
        'index':9,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING(12),
        'allowNull':false
    },

    // 模板名称
    'tempname':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板名称',
        'index':10,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':false
    },
};