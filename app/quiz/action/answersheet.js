"use strict";
const copy = require("copyto");
const uid  = require('uid');
const Models = require("../model/loader")();
const ErrorParse = require("../../../Data/tool/error.js")
const _ = require('lodash');

//开始答题，创建答题卡
const {PaperAction} = require('../action/index');
exports.create = async(orgHash,option)=>{
    let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
    let PaperModel = Models.getTableModel(orgHash,'Paper');
    let result ={'success':false,'data':{},'error':{}};
    try{
        let paper = await PaperModel.findOne({where:{hash:option.paperhash}});//查询试卷信息
        if(paper && paper.dataValues){
            option.papertime = parseInt(paper.dataValues.time);//考试时
            option.totalpoints = parseInt(paper.dataValues.total);//试卷总分间
            if(paper.dataValues.queststore.length>0){
                //预先加载题目答案属性，为空则未回答
                var quests = {};
                for(let index in paper.dataValues.queststore){
                    let questNumb = parseInt(index)+1;
                    let quest = {"questNumb":questNumb,"answer":[],"right":"","rightAnswer":[]};
                    let key = paper.dataValues.queststore[index];
                    quests[key] = quest;
    
                }
                option.answers = quests;//试卷题目
                option.totalquest = paper.dataValues.queststore.length;//试题数量
    
                result = await AnswersheetModel.create(option);
                result.success = true;
    
                
            }else{
                result.error = await ErrorParse("该试卷中未找到试题信息");
                return result;
            }
            
        }
    }catch(e){
        result = await ErrorParse(e);
    }
    return result;




}
//提交验证答案
exports.answer = async(orgHash,option)=>{
    let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
    let SubjectModel = Models.getTableModel(orgHash,"Subject");
    let result ={'success':false,'data':{},'error':{}};
    try{
        let quest = await SubjectModel.findOne({'where':{'hash':option.questHash}});
        let answersheet = await AnswersheetModel.findOne({'where':{'hash':option.answersheetHash}});
        if(quest&&quest.dataValues){
            let rightAnswer = _.sortBy(quest.dataValues.answer);
            option.answer = _.sortBy(option.answer);
            let rightAnswerString = rightAnswer.join("").toUpperCase();
            let answerString = option.answer.join("").toUpperCase();
          
            let ansRecord = answersheet.dataValues.answers;
            if(ansRecord[option.questHash]['answer'].length>0){
                return result.error = await ErrorParse("该题已完成作答，请勿重复答题。");
            }
            ansRecord[option.questHash]['answer'] = option.answer;//记录用户答案
            ansRecord[option.questHash]['rightAnswer'] = rightAnswer;//记录正确答案
            ansRecord[option.questHash]['right'] = answerString == rightAnswerString?true:false; //记录答案状态
            let curquest = ansRecord[option.questHash]['questNumb']||1;//记录答题进度
            let answerdcount = parseInt(answersheet.dataValues.answerdcount)+1;//记录已答题量
            await AnswersheetModel.update({'answers':ansRecord,'curquest':curquest,'answerdcount':answerdcount},{'where':{'hash':option.answersheetHash}});

            result.success = true;
            result.data = ansRecord[option.questHash];
            
        }else{
            result.error = await ErrorParse("未找到试题信息");
        }
        
    }catch(e){
        result.error = await ErrorParse(e);
    }

    return result;
}

exports.info = async(orgHash,option)=>{
    let result = {'success':false,'data':{},'error':{}};
    
    try{
        let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
        let answersheet = await AnswersheetModel.findOne({'where':{'hash':option.hash}});
        if(answersheet&&answersheet.dataValues){

            let answers = answersheet.dataValues.answers;
            // {
            //     "sub4ctq1i2w": {
            //         "answer": [],
            //         "questNumb": 4,
            //         "right": "",
            //         "rightAnswer": []
            //     }
            // }
            //解析json对象，返回特定的数组格式数据
            let res= {};
            res.answers = [];
            for(let key of Object.keys(answers)){
                let ans = {};
                ans.hash = key;
                ans.answer = answers[key]["answer"].join('').toUpperCase();
                ans.right = answers[key]["right"];
                ans.questNumb = parseInt(answers[key]["questNumb"]);
                ans.rightAnswer = answers[key]["rightAnswer"].join('').toUpperCase();
                res.answers.push(ans);
            }
            res.answers = _.orderBy(res.answers,function(data){ 
                return parseInt(data.questNumb);
            });

            res.curquest = answersheet.dataValues.curquest;//答题进度
            res.examTime = parseInt(answersheet.dataValues.papertime);//考试时长
            res.remainTime = Math.ceil((res.examTime - (new Date().getTime() - answersheet.dataValues.start))/1000);
            res.remainTime = res.remainTime>0 ?res.remainTime:0;//当前考试剩余时长
            res.examTime = Math.ceil(res.examTime/(60*1000));//考试时长
            res.answeredcount = parseInt(answersheet.dataValues.answerdcount);//已答题数量

            result.data = res;
            result.success = true;
        }else{
            result.error = await ErrorParse("未找到答题信息");
        }
        
    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}
//结束考试，计算得分
exports.finish = async(orgHash,option)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
        let answersheet = await AnswersheetModel.findOne({'where':{'hash':option.hash}});
        let {answers,totalpoints,totalquest,start} = answersheet.dataValues;
        let rightCount = 0;//答对题目的数量

        for(let ans of Object.keys(answers)){
            rightCount = answers[ans]['right']==true?rightCount+1:rightCount;
        }

        let score = totalpoints * (rightCount/totalquest).toFixed(3);
        let during = Math.ceil((new Date().getTime()-start)/1000);//考试用时
        await AnswersheetModel.update({'state':false,'score':score,'duing':during},{'where':{'hash':option.hash}});//结束考试，修改最终得分
        
        result.data = {score:score,duing:duing};
        result.success = true;
    }catch(e){

        result.error = await ErrorParse(e);
    }

    return result;
}

exports.ranking = async(orgHash,activeHash)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
        let PaperModel = Models.getTableModel(orgHash,"Paper");
        let {hash} = await PaperModel.findOne({where:{active:activeHash}});
        result.data.rows  = await AnswersheetModel.findAll({
            attributes:["username","score","during","papertime","totalquest","answerdcount","totalpoints"],
            order:[["score","desc"],["during","asc"]],
            where:{
                paperhash:hash
            }
        });

        result.success = true;

    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;
}


///后台王琼


exports.admininfo = async(orgHash,option)=>{
    let result = {'success':false,'data':{},'error':{}};
    let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
    try{
        let answersheet = await AnswersheetModel.findOne({'where':{'hash':option.hash}});
        if(answersheet&&answersheet.dataValues){
            result["data"] = answersheet.dataValues;
            result["success"] = true;
        }else{
            result.error = await ErrorParse("未找到答题信息");
        }

    }catch(e){
        result.error = await ErrorParse(e);
    }
    return result;

}

exports.list = async(orgHash,option)=>{
    let result = {'success':false,'data':{},'error':{}};
    try{
        let where={};
        //通过活动hash获取试卷hash 来取得试卷的信息
        let PaperModel = Models.getTableModel(orgHash,"Paper");
        let paperlist = [];
        //当传入有试卷的hash时，只去除此试卷的答卷
        if(option.paperhash){
            paperlist.push({"hash": option.paperhash});
        }else{
            paperlist = await PaperModel.findAll({where:{"active":option.active}});            
        }
        if(paperlist){
            let paperhashs = [];
            for(let li of paperlist){
                paperhashs.push(li.hash);
            }
            where["$or"]=[];
            for(let li of paperhashs){
                where["$or"].push({"paperhash": li});
            }

   
            let AnswersheetModel = Models.getTableModel(orgHash,"AnswerSheet");
            let length =option.size || 20;
            let page =option.page || 1;
            result["data"] = await AnswersheetModel.findAndCountAll({
                attributes:["answerdcount","curquest","end","hash","paperhash","papertime","score","start","state","total","userid"],
                where:where,
                limit: length,
                offset: (page-1)*length,
            });
            if(result["data"]){
                // 获取答卷人信息
                let userids = [];
                for(let li of result["data"].rows){
                    userids.push(li.userid);
                }

                let urswhere = {};
                urswhere["$or"]=[];
                for(let li of userids){
                    urswhere["$or"].push({"id":parseInt(li)});
                }
                let UserModel = Models.getTableModel(orgHash,'User');
                let userdata = await UserModel.findAll({'where':urswhere});
                let users ={};
                for(let li of userdata){
                    users[li.id] = {};
                    users[li.id].nickname = li.nickname;  
                    users[li.id].gender = li.gender;        
                    users[li.id].username = li.username;        
                    users[li.id].mobile = li.mobile;                            
                }
                for(let li of result["data"].rows){
                    li.usernick = li.dataValues.usernick = users[li.userid].nickname;                    
                    li.username = li.dataValues.username = users[li.userid].username;
                    li.gender = li.dataValues.gender = users[li.userid].gender;
                    li.mobile = li.dataValues.mobile = users[li.userid].mobile;
                }
                result.success = true;                     
            }else{
                result.error = await ErrorParse("无数据");                                    
            }
        }else{
            result.error = await ErrorParse("111");                    
        }
    }catch(error){
        result.error = await ErrorParse(error);        
    }
    return result;

}
