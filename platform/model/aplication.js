'use strict';

const Sequelize = require('sequelize');
exports.key = "Aplication";
exports.name = "应用表";
exports.describe = "传递给下一个请求的信息";

exports.view = ["ALL"]; //浏览权
exports.edit = ["ALL"]; //编辑权

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

    //应用hash
    'hash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': 'hash',
        'index':0,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(12),
        'unique':true,
        'allowNull':false
    },
    
    // 应用名称
    'name':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用名称',
        'index':1,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(64),
        'allowNull':false
    },
    'gflag':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用类型',
        'index':4,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':false
    },
   'abstract':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用简介',
        'index':2,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':true
    },
    'author':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用来源',
        'index':3,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':true
    },

    // 应用icon图片

    'icon':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': 'icon',
        'index':5,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false,
        'defaultValue':'ss'
    },

    // 应用封面图片
    'cover':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用封面',
        'index':6,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false,
        'defaultValue':'ss'
    },

        // 版本信息
    'version':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '版本信息',
        'index':7,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(16),
        'allowNull':false
    }
    
    // 支持的授权类型（暂不加）

};
