'use strict';

'use strict';
const Sequelize = require('sequelize');

exports.key = "Subject";
exports.name = "题目表";
exports.describe = "记录当前机构的所有题目";

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
    // 题目
    'hash':{
        'index': 1,
        'title': 'hash',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,


        'type': Sequelize.STRING(32),
        'allowNull': true,
    },
     // 题目
     'title':{
        'index': 1,
        'title': '题目',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,


        'type': Sequelize.STRING,
        'allowNull': false,
    },
    // 媒体（json数据）
    'media':{
        'index': 1,
        'title': '媒体',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,

        'type': Sequelize.JSON,
        'allowNull': false,  
    },
    // 选项（json）
    'option':{
        'index': 1,
        'title': '选项',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,

        'type': Sequelize.JSON,
        'allowNull': false,  
    },
    
    //是否为多选 ，默认false
    'multiple': {
        'index': 1,
        'title': '是否多选',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.BOOLEAN,
        'allowNull': false,
        'defaultValue':false
    },

    //答案
    'answer':{
        'index': 1,
        'title': '答案',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,

        'type': Sequelize.ARRAY(Sequelize.STRING),
        'allowNull': false,
    },

     //分值
    'score':{
        'index': 1,
        'title': '分值',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.INTEGER,
        'allowNull': false,
        'defaultValue':1
    },

    //难度系数
    'difficult':{
        'index': 1,
        'title': '难度系数',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.INTEGER,
        'allowNull': true,
        'defaultValue':5
    },
    //分组
    'gflag':{
        'index': 1,
        'title': '分组',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,

        'type': Sequelize.STRING,
        'allowNull': true,
    },
        // 描述
    'desc':{
        'index': 1,
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

}

