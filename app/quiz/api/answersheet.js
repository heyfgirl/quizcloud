'use strict';
const uid  = require('uid');
const copy = require("copyto");
const {AnswersheetAction,SubjectAction} = require('./../action/index');
const {UserAction} = require(__dirname+'./../../../organizations/action');
const ErrorParse = require('./../../../Data/tool/error');
//创建新的答题卷
exports.create = async(ctx,next)=>{

    let result = {'success':false,'result':{},'data':{}};

    let option = {};

    option.userid = ctx.request.body["userid"]||ctx.query['userid']||ctx.session['uid']||"";
    option.paperhash = ctx.request.body['paper']|| ctx.query['paper']||'';
    option.username = ctx.session['realname']||ctx.session["username"]||"";
    option.hash = uid(16);//为答题卷创建hash
    option.start = new Date().getTime();//答题开始时间
    option.state = true;//答题状态
    let orgHash = ctx.organ["hash"]; 

    if(orgHash && option.userid && option.paperhash){
        result = await AnswersheetAction.create(orgHash,option);
        ctx.session["answersheet"] = option.hash;//答题卡创建成功，保存答题卡hash存在session
    }else{
        result.error = await ErrorParse('args err')
    }

    ctx.body = result;
}

exports.answer = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};

    let option = {};
    option.answersheetHash = ctx.request.body['answersheet']|| ctx.query['answersheet']||ctx.session["answersheet"]||"";
    option.questHash = ctx.request.body['question']||ctx.query['question']||'';
    option.answer = ctx.request.body['answer']||ctx.query['answer']||[];


    let orgHash = ctx.organ["hash"]; 
    if(orgHash&&option.answersheetHash&&option.questHash&&option.answer){
        result = await AnswersheetAction.answer(orgHash,option);
    }else{
        result.error = await ErrorParse('args err')
    }

    ctx.body = result;
}

exports.info = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};

    let option = {};
    option.hash = ctx.request.body['answersheet']|| ctx.query['answersheet']||ctx.session["answersheet"]||"";

    let orgHash = ctx.organ["hash"]; 
    if(orgHash&&option.hash){
        result = await AnswersheetAction.info(orgHash,option);
    }else{
        result.error = await ErrorParse('args err')
    }

    ctx.body = result;
}

exports.finish = async(ctx,next)=>{
    
    let result = {'success':false,'data':{},'error':{}};
    let option = {};
    option.hash = ctx.request.body['answersheet']|| ctx.query['answersheet']||ctx.session["answersheet"]||"";
    let orgHash = ctx.organ["hash"];
    if(option.hash){
        result = await AnswersheetAction.finish(orgHash,option);
    }else{
        result.error = await ErrorParse('args err');
    }

    ctx.body = result;

}

//排名
exports.ranking = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    let activeHash = ctx.request.body["activeHash"]||ctx.query["activeHash"]||ctx.path.split("/")[1]||"";
    let orgHash = ctx.organ["hash"]; 
    if(activeHash){
        result = await AnswersheetAction.ranking(orgHash,activeHash);
    }else{
        result.error = await ErrorParse('args err');
    }

    ctx.body = result;
}
///后端王琼
exports.admininfo = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    let option = {};
    option.hash = ctx.request.body['hash']|| ctx.query['hash']||ctx.session["answersheethash"]||"";

    let orgHash = ctx.organ["hash"]; 
    if(orgHash&&option.hash){
        result = await AnswersheetAction.admininfo(orgHash,option);
    }else{
        result.error = await ErrorParse('args err')
    }
    return ctx.body = result;
}


exports.infos = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let option = {};
        option.hash = ctx.request.body['hash']|| ctx.query['hash']||ctx.session["answersheethash"]||"";
        let orgHash = ctx.organ["hash"]; 
        if(orgHash&&option.hash){
            
            result = await AnswersheetAction.admininfo(orgHash,option);
            let answersheetTag = JSON.parse(JSON.stringify(result.data));
            //////通过用户ID查询用户信息到  answersheetTag    =>answersheetTag.userid
            let ops = {};
            ops.id =typeof answersheetTag.userid == "number" ? answersheetTag.userid : parseInt(answersheetTag.userid)  ;
            let user = await UserAction.info(ops,orgHash);
            if(user){
                answersheetTag.user = user.data.nickname;
            }
            if(result.data.answers){
                let answers = result.data.answers;
                let titles = []; 
                if(answers){
                    for(let title of Object.keys(answers)){
                        titles.push(title);             
                    }
                    //获取试卷中题的信息
                    let opt = {};
                    opt.hashs = titles;
                    let response = await SubjectAction.list(orgHash,opt);
                    if(response.success){
                        let answersheet = [];
                        let subjects = response.data.rows;
                        let OBJsubjects ={};
                        ////组装题目信息
                        for(let item of subjects){
                            OBJsubjects[item.hash] = item;
                        }
                        for(let title of Object.keys(answers)){
                            let row = answers[title];
                            row["key"] = title;
                            row["gflag"] = OBJsubjects[title]["gflag"];
                            row["title"] = OBJsubjects[title]["title"];
                            row["option"] = OBJsubjects[title]["option"];
                            row["difficult"] = OBJsubjects[title]["difficult"];
                            row["multiple"] = OBJsubjects[title]["multiple"] ? "多选" : "单选";
                            row["media"] = OBJsubjects[title]["media"];
                            row["score"] = OBJsubjects[title]["score"];
                            row["right"] = answers[title]["right"] ? "正确" : "错误" ;

                            row["rightAnswer"] = answers[title]["rightAnswer"].toString() ;//正确答案
                            row["answer"]  =answers[title]["answer"].toString();//答案
                            answersheet.push(row);                    
                        }
                        delete answersheetTag["answers"];
                        delete answersheetTag["deletedAt"];
                        result["data"]={};
                        result["data"]["answersheetTag"] = answersheetTag;
                        result["data"]["answersheet"] = answersheet;
                        
                    }else{
                        result.error = await ErrorParse('args err')                
                    }
                }else{
                    result.error = await ErrorParse('args err')            
                }
            }else{
                
            }
            
        }else{
            result.error = await ErrorParse('args err')
        }
    }catch(error){
        result.error = await ErrorParse(error)        
    }
    return ctx.body = result;
}

exports.list = async(ctx,next)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let option ={};
        let orghash = ctx.organ["hash"];
        copy(ctx.request.body).to(option);
        option.active = ctx.params.active;
        result =await  AnswersheetAction.list(orghash,option); 
    }catch(error){
        result.error = await ErrorParse('args err')        
    }
    return ctx.body = result;
}
