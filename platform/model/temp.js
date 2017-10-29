'use strict';

const Sequelize = require('sequelize');
exports.key = "Temp";
exports.name = "模板表";
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

    
    //模板hash
    'hash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': 'hash',
        'index':1,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(12),
        'unique':true,
        'allowNull':false
    },
    
    // 模板名称
    'name':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板名称',
        'index':2,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false
    },

    'abstract':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板简介',
        'index':3,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':true
    },

    'gflag':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板类型',
        'index':4,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':false
    },


    // 模板图片
    'cover':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板图片',
        'index':8,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false,
        'defaultValue':'ss'
    },


    // 存放路径
    'path':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '模板路径',
        'index':5,
        'search':false,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false,
        'defaultValue':'ss'
    },


    // 支持的授权类型（暂不加）
    // 模板价格 


    // 演示地址
    'demourl':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '演示地址',
        'index':6,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false,
        'defaultValue':'ss'
    },
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
    },
    'apphash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '应用hash',
        'index':9,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING(12),
        'allowNull':false
    }
    

};
