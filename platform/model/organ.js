'use strict';

const Sequelize = require('sequelize');
exports.key = "Organ";
exports.name = "机构表";
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

    
    //机构hash，充当机构数据库名
    'hash':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': 'hash',
        'index':3,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(12),
        'unique':true,
        'allowNull':false
    },
    // 节点 （IP或域名）
    'node':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '节点',
        'index':3,
        'search':true,
        'order':false,
        'query':true,
        'type':Sequelize.STRING(32),
        'allowNull':false,
        'defaultValue':"default"
    },
    // 数据库主机地址 （IP或域名）
    'host':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '主机',
        'index':3,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':true
    },
    'port':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '端口',
        'index':4,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.INTEGER,
        'allowNull':true
    },
    // 数据库账号
    'username':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '账号',
        'index':5,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':true
    },
    // 数据库密码
    'password':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '密码',
        'index':6,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(32),
        'allowNull':true
    },
    // - orgname       //机构名称
    'orgname':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '机构名称',
        'index':1,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(24),
        'unique':false,
        'allowNull':false,
        'validate':{
            'len':[0,24],
        }
    },
    // - gflag         //机构类型分组
    'gflag':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '分组',
        'index':7,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'unique':false,
        'allowNull':false
    },
     // - telephone     //机构办公室联系电话
    'telephone':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '办公室电话',
        'index':8,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(20),
        'unique':false,
        'allowNull':true
    },

    // - proposer      //申请人姓名称呼
    'proposer':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '申请人',
        'index':9,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(24),
        'unique':false,
        'allowNull':false,
        'validate':{
            len:[0,24]  
        }
    },
    
    // - mobile        //申请人联系方式
    'mobile':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '申请人联系方式',
        'index':10,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(20),
        'unique':false,
        'allowNull':false,
        'validate':{
            'isNumeric':true
        }
    },
   
    // - email         //电子邮箱
    'email':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '电子邮箱',
        'index':11,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'unique':false,
        'allowNull':true,
        'validate':{
            'isEmail':true
        }
    },


    // - abstract      //机构简介
    'abstract':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '机构简介',
        'index':14,
        'search':true,
        'order':false,
        'query':false,

        'type':Sequelize.TEXT,
        'unique':false,
        'allowNull':true
    },

    // - domain        //系统默认分配域名
    'subdomain':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '子域名', 
        'index':12,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'unique':true,
        'allowNull':true
    },
    // - customdomain   //用户自定义域名
    'customdomain':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '自定义子域名',
        'index':13,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING,
        'unique':true,
        'allowNull':true
    },
    // - quali_img     //资质认证图片上传路径
    'qualification':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '资质认证图片',
        'index':15,
        'search':false,
        'order':false,
        'query':false,

        'type':Sequelize.STRING,
        'unique':false,
        'allowNull':false,
        'defaultValue':"ss"

    },
    // - state         //申请状态
    'state':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '申请状态',
        'index':16,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.ENUM('auditing','approved','unapproved'),//审核中，审核通过，审核未通过
        'unique':false,
        'allowNull':false,
        'defaultValue':"auditing"
    },
    //审核意见
    // 'tips':{
    //     'view': ["ALL"],
    //     'edit': ["ALL"],
    //     'title': '审核意见',
    //     'index':17,
    //     'search':false,
    //     'order':false,
    //     'query':true,

    //     'type':Sequelize.TEXT,//审核中，审核通过，审核未通过

    // }

};
