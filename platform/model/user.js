'use strict';

const Sequelize = require('sequelize');
exports.key = "User";
exports.name = "用户表";
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
    // - username  //用户名
    username:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '用户名',
        index:1,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING(24),
        unique:true,
        allowNull:false,

    },
    //用户名转小写存放
    usernamelower:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '用户名(小写)',
        index:1,
        search:false,
        order:false,
        query:false,

        type:Sequelize.STRING(24),
        unique:true,
        allowNull:false,

    },
    // - password  //密码
    password:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '密码',
        search:false,
        order:false,
        query:false,

        type:Sequelize.STRING(32),
        unique:false,
        allowNull:false
    },
    // - salt      //密码加盐
        
    salt:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '密码加盐',
        search:false,
        order:false,
        query:false,

        type:Sequelize.STRING(4),
        unique:false,
        allowNull:false
    },
    // - nickname  //昵称
    nickname:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '昵称',
        index:2,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING(24),
        unique:false,
        allowNull:true,
        validate:{
            len:[0,24]

        }
    },
    // - userpic   //头像
    userpic:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '头像',
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING,
        unique:false,
        allowNull:false,
        defaultValue:"ss"
    },
    // - realname  //真实姓名
    realname:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '真实姓名',
        index:3,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING(24),
        unique:false,
        allowNull:true,
        validate:{
            len:[0,24]  
        }
    },
    // - role     //分组
    role:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '角色',
        index:4,
        search:true,
        order:false,
        query:true,

        type:Sequelize.ENUM('root','admin','normal'),
        unique:false,
        allowNull:false
    },
    gflag:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '分组',
        index:4,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING(24),
        unique:false,
        allowNull:false
    },
    // - gender    //性别
    gender:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '性别',
        index:5,
        search:true,
        order:false,
        query:true,

        type:Sequelize.ENUM('male','female',''),
        unique:false,
        allowNull:true
    },
    // - addr      //住址
    addr:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '住址',
        index:6,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING,
        unique:false,
        allowNull:true
    },
    // - mobile    //手机
    mobile:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '手机',
        index:7,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING(20),
        unique:false,
        allowNull:false,
        validate:{
            isNumeric:true
        }
    },
    // - email     //电子邮箱
    email:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '电子邮箱',
        index:8,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING,
        unique:false,
        allowNull:true,
        validate:{
            isEmail:true
        }
    },
    
    // - qq        //qq账号
    qq:{
        view: ["ALL"],
        edit: ["ALL"],
        title: 'qq账号',
        index:9,
        search:true,
        order:false,
        query:true,

        type:Sequelize.STRING,
        unique:false,
        allowNull:true
    },

    // - state     //账号状态
    state:{
        view: ["ALL"],
        edit: ["ALL"],
        title: '账号状态',
        index:11,
        search:true,
        order:false,
        query:true,

        type:Sequelize.ENUM('logout','normal'),//注销，正常
        unique:false,
        allowNull:false,
        defaultValue:'normal'
    }
};




