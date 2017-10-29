define(['vue'],function(Vue){
    var anscard = Vue.extend({
        template:`
            <div class="answer-card">
                <h5>答题卡</h5>
                <div class="answer-list">
                <a v-for="(row,index) in rows" @click="getQuestHash(row.hash,row.questNumb)" :class="{ansRight:row.right === true,ansWrong:row.right===false,current:(index+1)===questid}">{{row.questNumb}}</a>
                </div>
            </div>
        `,
        props:['questid'],
        data(){
            return {
                rows:[],
                lastIndex:1
            }
        },
        methods:{
            //传给父组件questID事件
            getQuestHash:function(questHash,questNumb,curAnswers,maxQuestCount){
                /**
                 * questHash:题目hash
                 * questNumb：题号
                 * right：是否正确
                 * maxQuestCount:题目数
                 */
                this.$emit('changequest',questHash,questNumb,curAnswers,maxQuestCount);
            },
            //获取用户答题情况
            getAnswerSheet:function(){
                
            },

            getQuestsByPaper:function(){
                var hash = "ys77f08w";
                $.post("./api/answersheet",{answersheet:'wjtlpdok3t6'},res=>{
                    if(res.success){
                        this.rows = res.data.answers;
                        var curQuestNumb = parseInt(res.data.curquest);
                        this.getQuestHash(this.rows[curQuestNumb-1]["hash"],this.rows[curQuestNumb-1]["questNumb"],this.rows[curQuestNumb-1]["right"],this.rows.length);
                    }else{
                        alert("列表获取失败")
                    }
                })
            }
        },
        created(){
            this.getQuestsByPaper();
        },
        watch:{
            questid:function(){
                
                if(this.questid<this.rows.length+1&&this.questid>0){
        
                    this.getQuestHash(this.rows[this.questid-1]['hash'],this.questid,this.rows[0]["right"],this.rows.length);
                }
            }
        }

    });

    Vue.component("anscard",anscard);

    return anscard;
});