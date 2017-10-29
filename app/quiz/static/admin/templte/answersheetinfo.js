// const _ = require('lodash');
var answersheetinfo = Vue.extend({
    components: { expandRow },        
    template: '#answersheetinfo',
    data: function() {
        return {
            columnsTag:[
                { 
                    key:"user",
                    title:"答卷人",
                    width: 150,
                    align: 'center',
                },
                { 
                    key:"score",
                    title:"得分",
                    width: 150,
                    align: 'center',
                },
                { 
                    key:"start",
                    title:"开始时间",
                    width: 150,
                    align: 'center',
                },
                { 
                    key:"end",
                    title:"结束时间",
                    width: 150,
                    align: 'center',
                },
                { 
                    key:"papertime",
                    title:"使用时间",
                    width: 150,
                    align: 'center',
                },
                {
                    title:"返回",
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        router.push({ name: 'answersheetlist', params: {"size": this.$route.params.size,"page":this.$route.params.page}});                                                                           
                                    }
                                }
                            }, '返回'),
                        ]);
                    }
                }
                
            ],
            Tag:[{}],

            columns:[ 
                {
                    title: '题目ID',
                    align: 'center',                    
                    key: 'questNumb',
                    width: 100,
                },
                {
                    title: '所属题库',
                    align: 'center',                    
                    key: 'gflag',
                    width: 150,
                },
                {
                    title: '题目内容',
                    align: 'center',                    
                    key: 'title',
                },
                {
                    title: '是否单选',
                    align: 'center',                    
                    key: 'multiple',
                    width: 100,
                },
                {
                    title: '所选答案',
                    align: 'center',                    
                    key: 'answer',
                    width: 100,
                },
                {
                    title: '是否正确',
                    align: 'center',                    
                    key: 'right',
                    width: 100,
                },
                {
                    title: '正确答案',
                    align: 'center',                    
                    key: 'rightAnswer',
                    width: 100,
                },
                {
                    title:"查看答案",
                    type: 'expand',
                    width: 150,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row.option
                            }
                        })
                    }
                }
            ],
            answers:[{}],
        }
    },
    created(){
        console.log(this.$route)
        let that = this;
        let hash = this.$route.query.hash;
        if(hash){
            let option={};
            option.hash = hash;
            //获取答卷详情    .toTimeString()
            GetAnswerSheetInits(option).then(function(res){
                if(res.success){
                    console.log(res);
                    that.answers = res.data.answersheet;
                    let Tagdata = new Array(res.data.answersheetTag);
                    that.Tag = Tagdata;
                    console.log(res.data)
                }
            }).catch(function(err){
                router.push({ name: 'answersheetlist', params: {"size": that.$route.params.size,"page":that.$route.params.page}});                                                                           
            });
        }else{
            router.push({ path: 'answersheetlist'});                                                                    
        }
    }
});