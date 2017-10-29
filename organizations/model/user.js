'use strict';
//机构使用者表，用户账号(Salt)。用户密码。机构ID。真实姓名。性别。。。。
const Sequelize = require('sequelize');
exports.key = "User";
exports.name = "机构参与用户数据表";
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
    // 用户账号
    'username':{
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
    //角色
    'role':{
        'index': 2,
        'title': '角色',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.ENUM('root', 'admin','nomer'),
        'allowNull': false,
    },
    
    // (Salt)
    'salt':{
         'index': 3,
        'title': '盐',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':false,
        'query':false,
        'order': false,
        'search':false,
        

        'type': Sequelize.STRING,
        'allowNull': false,
        'unique': false,
    },
    // 用户密码
    'password':{
        'index': 4,
        'title': '密码',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,
        

        'type': Sequelize.STRING,
        'allowNull': false,
    },
    
    // 真实姓名
    'realname':{
        'index': 5,
        'title': '姓名',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': true,
    },
    //昵称
    'nickname':{
       'index': 6,
        'title': '昵称',
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
    'mobile':{
        'index': 7,
        'title': '手机',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.CHAR(11),
        'allowNull': true,
    },
    //性别
    'gender':{
        'index': 8,
        'title': '性别',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':false,
        

        'type': Sequelize.ENUM('men', 'women','unknown'),
        'allowNull': true,
    },
    //地址
    'address':{
        'index': 9,
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
    //微信号
    'wechat':{
        'index': 10,
        'title': '微信号',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': true,
    },
    //qq号
    'qq':{
        'index': 11,
        'title': 'QQ',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING(24),
        'allowNull': true,
    },
    //邮箱
    'mailbox':{
        'index': 12,
        'title': '邮箱',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //标签1
    'tag1':{
        'index': 13,
        'title': '标签1',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //标签2
    'tag2':{
        'index': 14,
        'title': '标签2',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    },
    //标签3
    'tag3':{
        'index': 15,
        'title': '标签3',
        'view': ["ALL"],
        'edit': ["ALL"],

        'show':true,
        'query':true,
        'order': false,
        'search':true,
        

        'type': Sequelize.STRING,
        'allowNull': true,
    }
};