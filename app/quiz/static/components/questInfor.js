define(['vue','jquery'],function(Vue,jquery){
    var quest = Vue.extend({
        template:`
        <div class="question-txt">
            <p>9、<span>（{{questType}}）</span>{{curQuest.title}}</p>
            <ul id="optList">
                <li v-for="(opt,index) in opts" @click="selected(index)" :class="{selected:opt.selected}"><span><i></i></span><p>{{opt.key+". "+ opt.value}}</p></li>
            </ul>
            <div class="answers-btn" id='large-btn' v-if="!curQuest.mobile">
            
                <span>上一题</span>
                <span class="submit" @click="submit">提交</span>
                <span>下一题</span>
            </div> 
            <div id='samll-btn' class="mobile-submit" v-else>
                <span >提交</span>
            </div>
            
        </div>
        `,
        props:['questid'],
        data(){
            return {
                //当前题目
                curQuest:{},
                questions:[{
                    id:1,
                    title:"世界上最长的河流？",
                    options:[{key:"A",value:"长江"},{key:"B",value:"亚马逊"},{key:"C",value:"尼罗河"},{key:"D",value:"黄河"}],
                    multiple:false,//多选
                    mobile:true, 
                    media:"imgs",
                    desc:'《道路交通安全法》第一百零一条： 造成交通事故后逃逸的，由公安机关交通管 理部门吊销机动车驾驶证，且终生不得重新 取得机动车驾',
                    difficulty:3
                },{
                    id:2,
                    title:"世界上最高的山是？",
                    options:[{key:"A",value:"喜马拉雅"},{key:"B",value:"泰山"},{key:"C",value:"黄山"},{key:"D",value:"华山"}],
                    multiple:false,//多选
                    mobile:true, 
                    media:"imgs",
                    desc:'《道路交通安全法》第一百零一条： 造成交通事故后逃逸的，由公安机关交通管 理部门吊销机动车驾驶证，且终生不得重新 取得机动车驾',
                    difficulty:2
                }],//模拟题库

            };
        },
        computed:{
            questType:function(){
                return this.curQuest.multiple?"多选题":"单选题";
            },
            opts:function(){
               for(let key in this.curQuest.options){
                   //为每个选项添加样式类的控制属性
                   this.curQuest.options[key].selected = false;
                   this.curQuest.options[key].right = false;
                   this.curQuest.options[key].wrong = false;
               }
               return this.curQuest.options;
            }
        },
        methods:{
            submit(){
                //获取用户选择的答案
                var selectedAnswer = [];
                for(var opt in opts){
                    if(opt.selected){
                        selectedAnswer.push(opt.key);
                    }
                }
                
                // let 
                this.$emit('submit',selectedAnswer())
            }, 
            selected(index){
                
                // alert(index)
                // console.log(this.opts)
                // this.opts[index].selected = true;

            },
            //检查用户答案是否正确
            // checkAnswer(){
            //     if(opt.length == answer.length){
            //         for(var i=0;i<opt.length;i++){
            //             if(answer.indexOf(opt[i])<0)return false;
            //         }
            //         return true;
            //     }else{
            //         return false;
            //     }
                
            // },
          
            getQuestionById(questID){
                // $.get('./api/quests',function(data){
                //     // console.log(data)
                // });
                // return 
                this.curQuest = {
                    title:"世界上最长的河流1？",
                    options:[{key:"A",value:"长江"},{key:"B",value:"亚马逊"},{key:"C",value:"尼罗河"},{key:"D",value:"黄河"}],
                    multiple:false,//多选
                    mobile:true, 
                    media:"imgs",
                    desc:'《道路交通安全法》第一百零一条： 造成交通事故后逃逸的，由公安机关交通管 理部门吊销机动车驾驶证，且终生不得重新 取得机动车驾',
                    difficulty:3
                }
               
            }
           

        },
        created(){
            // this.getPath();
            this.getQuestionById(this.questid);
            
        },
        watch:{
            questid:function(){
                //监视props:questid变化，加载对应questid的题目内容
                this.getQuestionById(this.questid);
            }
        }

    });

    Vue.component('quest-txt',quest);

    return quest;
});