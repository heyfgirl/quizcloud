'use strict';
const Sequelize = require('sequelize');
exports.key = "Manager";
exports.name = "管理员";
exports.describe = "机构的管理员表信息";

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
    //用户名
    username: {
        'index': 1,
        'title': '用户名',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        
    
        
        'type': Sequelize.STRING(24),
        'allowNull': false,
        'unique': true,  
    },
    //密码盐
    salt: {
        'index': 1,
        'title': '盐',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': false,
        'unique': false,
    },
    //机构hash
    hash:{
        'index': 1,
        'title': '哈希',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': false,
    },
    // 管理员密码
    password:{
        'index': 1,
        'title': '密码',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        
        
        'type': Sequelize.STRING,
        'allowNull': false,
    },
    // 真实姓名
    realname:{
        'index': 1,
        'title': '姓名',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': false,
    },
    // 手机号
    mobile:{
        'index': 1,
        'title': '手机号',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.CHAR(11),
        'allowNull': false,
    },
    //角色
    role:{
        'index': 1,
        'title': '角色',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.ENUM('root', 'admin'),
        'allowNull': false,
    },
        //性别
    gender:{
        'index': 1,
        'title': '性别',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.ENUM('men', 'women'),
        'allowNull': true,
    },
    //地址
    address:{
       'index': 1,
        'title': '地址',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': true,
    },
    //微信号
    wechat:{
        'index': 1,
        'title': '微信号',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //邮箱
    mailbox:{
        'index': 1,
        'title': '邮箱',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    }
}