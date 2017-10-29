'use strict';

require.config({
    paths:{
        "jquery":"jquery.min",
        "vue":"vue",
        "topheader":"../components/header"
    }

});


require(['vue','topheader'],function(Vue,topheader){
  
    var app = new Vue({
        el:"#app",
        data:function(){
            return {
               curQuest:{},//当前题目内容
               questHash:"",//当前题hash
               questNumb:1,//当前题号
               ansList:[],//答案列表
               examTime:0,//考试时长
               remainTime:"00:00",//剩余时间转字符串
               time:0,//剩余时间
               mobile:false,//低分辨率模式
               answeredCount:0,//当前做题数
               total:0//总题数
               
            }
        },
        computed:{
            //多选or单选
            questType(){
                return this.curQuest.multiple?"多选题":"单选题";
            },
           //难度系数
            yellowstars(){
                var stars = [];
                for(var i=0;i< parseInt(this.curQuest.difficult) ;i++){
                    stars.push(i);
                }
                return stars;
            },
            //难度系数
            greystars(){
                var stars = [];
                for(var i=0;i< 5 - (this.curQuest.difficult);i++){
                    stars.push(i);
                }
                return stars;
            }
        },
        components:{
            topheader
        },
        methods:{
            //根据当前题号获取题目
            getQuestionByQuestNumb(index){
                //获取题号，hash
                this.questHash = this.ansList[index]["hash"];
                this.questNumb = index+1;
                //关闭答题卡遮罩
                if(this.mobile){
                    var lay = document.getElementById('lay');
                    var ansCard = document.getElementById('ansCard');
                    lay.setAttribute("style","display:none");
                    ansCard.setAttribute("style","display:none");
                }
               
                $.post('./api/question',{hash:this.questHash},res=>{

                    if(res.success){
                  
                        var opt = res.data.option;
                        var options=[];

                        // $.post()

                        if(this.ansList[index].right===true){

                            for(var key of Object.keys(opt)){
                                var option = {};
                                option.key = key;
                                option.value = opt[key];
                                option.right = this.ansList[index]["rightAnswer"].indexOf(key)>-1?true:"";
                                options.push(option);
                            }
                            
                        }else if(this.ansList[index].right===false){

                            for(var key of Object.keys(opt)){
                                var option = {};
                                option.key = key;
                                option.value = opt[key];
                                option.selected = false;
                                var right = this.ansList[index]["rightAnswer"].indexOf(key)>-1;
                                var wrong = this.ansList[index]["answer"].indexOf(key)>-1;
                                if(right){
                                    option.right = true;                                
                                }else if(!right&&wrong){
                                    option.right = false;
                                }
                               
                                options.push(option);
                            }

                        }else{
                            for(var key of Object.keys(opt)){
                                var option = {};
                                option.key = key;
                                option.value = opt[key];
                                option.selected = false;
                                options.push(option);
                            }
                        }
                        
                        

                        res.data.option = options;
                        this.curQuest = res.data;

                    }else{
                        alert("获取数据失败");
                    }
                   
                });  
            },
            //获取试卷内容
            getQuestsByCard(hash,callback){
                
                $.post("./api/answersheet",{answersheet:hash},res=>{
                    if(res.success){
                        this.ansList = res.data.answers;
                        this.questNumb = parseInt(res.data.curquest);
                        this.questHash = res.data.answers[this.questNumb-1]["hash"];
                        this.examTime = res.data.examTime;
                        this.time = res.data.remainTime;
                        this.answeredCount = res.data.answeredcount;
                        this.total = this.ansList.length;
                      
                        callback();
                        
                    }else{
                        alert("列表获取失败")
                    }
                })
            },
         
            //上一题
            preQuest(){
                this.questNumb = this.questNumb>1?this.questNumb-1:this.questNumb;
                this.getQuestionByQuestNumb(this.questNumb-1);
            },
            //下一题
            nextQuest(){
                this.questNumb = this.questNumb < this.ansList.length ?this.questNumb+1:this.ansList.length;
                this.getQuestionByQuestNumb(this.questNumb-1);
            },
            //题目选择
            selected(index){

               //更新dom渲染（选项列表）
                if(this.curQuest.multiple){
                    //多选
                    var opt = this.curQuest["option"][index];
                    opt.selected = !opt.selected;
                    Vue.set(this.curQuest["option"],index,opt);

                }else{
                    //单选
                    var opts = this.curQuest["option"];
                    var newOpts = [];
                    for(var i in opts){
                        opts[i]["selected"]= i==index?true:false;
                        newOpts.push(opts[i]);
                    }
                    this.curQuest.option = newOpts;
                }
            },
            //提交答案
            submitAnswer(){
                //收取答案
                var answersheetHash = 'l7djwbodfll';
                var answers = [];
                var opts = this.curQuest["option"];
                for(var opt of opts){
                    if(opt.selected){
                        answers.push(opt.key);
                    }
                    
                }

                if(answers.length>0){
                    $.post('./api/answersheet/answer',{
                        'answersheet':answersheetHash,
                        'question':this.questHash,
                        'answer':answers||[]
                    },res=>{
                        if(res.success){
                            //前台缓存答题情况
                            var ans = this.ansList[this.questNumb-1];
                            ans.right = res.data.right;
                            ans.rightAnswer = res.data.rightAnswer;
                            ans.answer = res.data.answer;
                            this.ansList[this.questNumb-1] = ans;

                            //答题进度
                            this.answeredCount++;
                        }
                    });
                }else{
                    alert("请选择答案");
                }
            },
            //低分辨情况下展示答题卡
            showCard(){
                this.mobile = true;//低分辨率
                var lay = document.getElementById('lay');
                var ansCard = document.getElementById('ansCard');
                lay.setAttribute("style","display:block");
                ansCard.setAttribute("style","display:block");
            }
        }
        ,
   
        created(){
            //获取当前试卷题目列表
            this.getQuestsByCard("l7djwbodfll",()=>{
                this.getQuestionByQuestNumb(this.questNumb-1);

                 // 准备页面答题倒计时
                var timer = setInterval(()=>{
                    let timeString = "00:00";
                    if(this.time<=0){
                        clearInterval(timer)
                    }else{
                        this.time--;
                    };
                    
                    let minute = Math.ceil(this.time/60);
                    let second = this.time%60;
                    timeString = (minute<10?"0"+minute:minute) + ":" + (second<10?"0"+second:second);
                    this.remainTime = timeString;
                    
                },1000);
            });

           

        }
    });
})





