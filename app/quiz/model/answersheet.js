
'use strict';
const Sequelize = require('sequelize');

exports.key = "AnswerSheet";
exports.name 

 = "答卷表";
exports.describe = "存储答卷";


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

        //答题卡
        'hash':{
            'index': 1,
            'title': 'hash',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':false,
            'query':true,
            'order': false,
            'search':false,

            'type': Sequelize.STRING(16),
            'allowNull': false,
        },
       //答卷人ID
        'userid':{
            'index': 1,
            'title': '答卷人',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':false,
            'query':true,
            'order': false,
            'search':false,

            'type': Sequelize.STRING,
            'allowNull': false
        },
        //答卷人姓名
        'username':{
            'index': 1,
            'title': '答卷人',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.STRING,
            'allowNull': false
        },
        //试卷ID
        'paperhash':{
            'index': 1,
            'title': '试卷hash',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':false,
            'query':true,
            'order': false,
            'search':false,

            'type': Sequelize.STRING(16),
            'allowNull': false,
        },
        //试卷总分
        'totalpoints':{
            'index': 1,
            'title': '总分',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.INTEGER,
            'allowNull': false,
            'defaultValue':0
        },

        //总得分
        'score':{
            'index': 1,
            'title': '总得分',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.FLOAT,
            'allowNull': false,
            'defaultValue':0
        },
        //答题开始时间
        'start':{
            'index': 1,
            'title': '开始时间',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.DATE,
            'allowNull': false,
        },
        //考试用时
        'during':{
            'index': 1,
            'title': '考试用时',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.BIGINT,
            'defaultValue':0
        },
         //答卷总时长
         'papertime':{
            'index': 1,
            'title': '答卷总时长',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.BIGINT,
            'allowNull': false,
        },
        /**提交答案
         * JSON
         * 【1】题目ID
         * 【2】题目答案
         * 【3】是否正确
         */
        
        'answers':{
            'index': 1,
            'title': '提交答案',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':false,

            'type': Sequelize.JSON,
            'allowNull': false,
        },
        //试卷中当前答题的序号
        'curquest':{
            'index': 1,
            'title': '答题进度',
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
        //试卷题量
        'total':{
            'title': '总题量',
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
        //已答题数量
        'answerdcount':{
            'title': '已答题',
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
        'state':{
            'title': '状态',
            'view': ["ALL"],
            'edit': ["ALL"],
    
            'show':true,
            'query':true,
            'order': false,
            'search':true,

            'type': Sequelize.BOOLEAN,
            'allowNull': false,
            'defaultValue':false//FALSE:未答完，TRUE:已答完
        }
        
}
