'use strict';

const Sequelize = require('sequelize');
exports.key = "Active";
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
    'activename':{
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
        'title': 'hash',
        'index':7,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING(12),
        'allowNull':false
    },
    
    // 应用名称
    'appname':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '所属应用',
        'index':8,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
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
        'title': '模板引用',
        'index':10,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':false
    },
    
    //机构hash
   'orghash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '机构hash',
        'index':11,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING(12),
        'allowNull':false
    },

     // 机构名称 
    'orgname':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '举办单位',
        'index':12,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'allowNull':false
    }
    
    
};
