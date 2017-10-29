'use strict';
const Sequelize = require('sequelize');
exports.key = "News";
exports.name = "新闻表";
exports.describe = "传递给下一个请求的信息";

exports.view = ["ALL"]; //浏览权
exports.edit = ["ALL"]; //编辑权

exports.options =  {
    'paranoid': true
};


// iview 表格属性
exports.props = {
    'stripe':true, 
    'highlight-row':true,
    'no-data-text':"没有数据，请调整查询条件",
    'no-filtered-data-text':"无匹配数据，请调整过滤条件"
}


exports.attributes = {
    hash:{
        'index': 1,
        'title': 'Hash',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':false,
        'query':false,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
        'unique': true,          
    },
    
    // 新闻标题
    title:{
        'index': 2,
        'title': '标题',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //新闻内容
    content:{
        'index': 3,
        'title': '内容',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':false,
        'query':false,
        'order': false,
        'search':true,
        

        'type': Sequelize.TEXT,
        'allowNull': true, 
    },
    //编辑者姓名
    edit:{
        'index': 4,
        'title': '编辑',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //真实编辑者ID
    editid:{
        'index': 5,
        'title': '编辑ID',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
     //活动Hash
     activitehash:{
        'index': 5,
        'title': '活动Hash',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    //图片id(封面)
    img:{
        'index': 7,
        'title': '封面',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':false,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //推荐与否
    recom:{
        'index': 8,
        'title': '推荐',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.BOOLEAN,
        'allowNull': true,
    },
    //点击数
    click:{
        'index': 9,
        'title': '浏览',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.INTEGER,
        'allowNull': true,
    },
    //TAG标签
    tag:{
        'index': 10,
        'title': 'TAG',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //分组
    grop:{
        'index': 11,
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
    //发布时间
    release:{
        'index': 11,
        'title': '发布时间',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.DATE,
        'allowNull': true,
    }
};
