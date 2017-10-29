'use strict';

const Sequelize = require('sequelize');
exports.key = "Group";
exports.name = "分组表";
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

    
    //类型
    'type':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '类型',
        'index':0,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.STRING(12),
        'unique':true,
        'allowNull':false
    },
    
    // 分组内容
    'value':{
        'view': ["ALL"],
        'edit': ["ALL"],
        'title': '分组内容',
        'index':1,
        'search':true,
        'order':false,
        'query':true,

        'type':Sequelize.ARRAY(Sequelize.TEXT),
        'allowNull':false
    }
};
