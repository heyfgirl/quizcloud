//授权
'use strict';

const Sequelize = require('sequelize');
exports.key = "Accredit";
exports.name = "授权表";
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

    'hash':{
        'view':['ALL'],
        'edit':['ALL'],
        'ttle':'授权hash'
    }
   
};
