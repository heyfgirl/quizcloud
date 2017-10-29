'use strict';
const Sequelize = require('sequelize');

exports.key = "Paper";
exports.name = "试卷表";
exports.describe = "存储试卷";


exports.view = ["ALL"]; //浏览权
exports.edit = ["ALL"]; //编辑权



// 数据库表属性
exports.options = {
    paranoid: true
};


// iview 表格属性
exports.props = {
    'stripe': true,
    'highlight-row': true,
    'no-data-text': "没有数据，请调整查询条件",
    'no-filtered-data-text': "无匹配数据，请调整过滤条件"
}


exports.attributes = {
    'hash':{
        'index': 1,
        'title': 'HASH',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,

        'type': Sequelize.STRING(32),
        'allowNull': true,
    },
    // 活动Hash
    "active":{
        'index': 1,
        'title': '活动HASH',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,


        'type': Sequelize.STRING,
        'allowNull': true,        
    },
    

    //难度系数（1~10,取均值）
    'difficult': {
        'index': 1,
        'title': '难度系数',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,


        'type': Sequelize.INTEGER,
        'validate': {
            isInt: true,
            min:0,
            max:10,
        }
    },
   

    //描述信息
    'desc': {
        'index': 1,
        'title': '描述',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,


        'type': Sequelize.STRING,
    },


    //是否私有（半私有，全私有）
    'private': {
        'index': 1,
        'title': '是否私有',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.ENUM('full', 'semi'),
    },
    
    //题目IDS
    'queststore': {
        'index': 1,
        'title': '题目',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':false,
        'order': false,
        'search':false,

        'type': Sequelize.ARRAY(Sequelize.STRING),
    },

    //题库IDS
    'randomquest': {
        'index': 1,
        'title': '题库',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':false,
        'order': false,
        'search':false,

        'type': Sequelize.ARRAY(Sequelize.STRING),
    },


    //试卷图片
    'media': {
        'index': 1,
        'title': '媒体',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,

        'type': Sequelize.JSON,
    },


    //随机题目
    'questrandom': {
        'index': 1,
        'title': '随机题目',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.BOOLEAN,
        'allowNull': false,
    },


    //随机答案
    'answrandom': {
        'index': 1,
        'title': '随机答案',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.BOOLEAN,
        'allowNull': false,
    },

    //题目总数
    'total': {
        'index': 1,
        'title': '题目总数',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.INTEGER,
        'allowNull': false,
    },

    //每题分数
    'score': {
        'index': 1,
        'title': '每题分数',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.INTEGER,
        'allowNull': false,
    },

    
    //限制时间
    'time': {
        'index': 1,
        'title': '限制时间',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.BIGINT,
        'allowNull': true,
    }
};
