'use strict';
const Questions = require('./questions');
const Subjects  = require('./subject');
//获取试卷
function getQuestion(){
    let questionsid = ctx.request.body["questionsid"];
    let result ={};
    result["data"]["sbjects"]=[];
    let questions =Questions.questionsinfo;
    if(questions["trandom"]){
        let i = questions["tnumber"];
        let cout = 0;
        let js = [];
        while(i>0){
            let t = Math.floor(Math.random()*questions["total"]);
            for(let s in js){
                if(js[s]==t){
                    cout = 1;
                }
            }
            if(0==cout){
                js.push(t);
                ctx.request.body["subjectid"] = questions["question"][t];
                result["data"]["sbjects"].push(Subjects.subjectinfo(ctx));
                i--;
            }
        }
    }
}