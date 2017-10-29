'use strict';
const  koaBody = require('koa-bodyparser')();
const  koa_Body = require('koa-body');
var model = require("./model/loader")()
const  api = require('./api/index');

const apiRoute =function (route) {
    route.nested('/subject/info').post(koaBody,api.subject.info);    
    route.nested('/subject/list').post(koaBody,api.subject.list);
    route.nested('/subject/create').post(koaBody,api.subject.create);
    route.nested('/subject/group').post(koaBody,api.subject.group);
    route.nested('/subject/file').post(koa_Body({multipart :true}),api.subject.file);
    
    route.nested('/paper/info').post(koaBody,api.paper.info);
    route.nested('/paper/list').post(koaBody,api.paper.list);

    route.nested('/answersheet/list').post(koaBody,api.answersheet.list);
    route.nested('/answersheet/info').post(koaBody,api.answersheet.admininfo);
    route.nested('/answersheet/infos').post(koaBody,api.answersheet.infos);
    

    //通过试卷Id获取试卷内的题目id列表
    route.nested('/questions').post(koaBody,api.paper.questionByPaper);
    route.nested('/question').post(koaBody,api.subject.detail);
    route.nested('/answersheet').post(koaBody,api.answersheet.info);//新建答题卡
    route.nested('/answersheet/new').post(koaBody,api.answersheet.create);//新建答题卡
    route.nested('/answersheet/answer').post(koaBody,api.answersheet.answer);//用户答题
    route.nested('/answersheet/finish').post(koaBody,api.answersheet.finish);
    route.nested('/ranking').post(koaBody,api.answersheet.ranking);
        

}


//一级路由
module.exports = function(app) {
    apiRoute(app.route('/:active/api'));
    // licationRoute(quiz.route('/:active/lication'));
    //活动首页
    app.route("/:active/").all(async (ctx,next)=>{
        return await ctx.render("index.html");
    });
    //答题页
    app.route("/:active/answer").all(async (ctx,next)=>{
        return await ctx.render("answer.html");
    });
    //新闻列表
    app.route("/:active/newslist").all(async (ctx,next)=>{
        return await ctx.render("newsList.html");
    });
    //新闻详情
    app.route("/:active/news").all(async (ctx,next)=>{
        return await ctx.render("news.html");
    });
    app.route("/:active/admin").all(async (ctx,next)=>{
        return await ctx.render("/admin/index.html");
    });
    app.route("/:active/index").all(async (ctx,next)=>{
        var SubjectModel = model.getTableModel(ctx.organ["hash"],"Subject");
        ctx.body = await SubjectModel.findAll();
    });
};