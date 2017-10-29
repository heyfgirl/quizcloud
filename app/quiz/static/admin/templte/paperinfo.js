var paperinfo = Vue.extend({
    template: '#paperinfo',
    data: function() {
        return {
            formValidate:{
                active:"",
                difficult:1,
                questrandom:false,
                answrandom:false,
                private:"full",
                total:null,
                time:60,
                desc:"",
                score:0,
                total_score:0,

                queststore:[],    
                ids:"",
                
                randomquest:[],
                quests:"",

                random_total:0,
                Nrandom_total:0,
            },
            ruleValidate:{
            },
            data: [],
            datacp: [],
            
            titles:[],
            targetKeys:[],
            listStyle: {
                width: '40%',
                height: '600px'
            },
            group:[],
            showgroup:{},
            notshowgroup:{},

            subjects:{},

            score:0,//每题分数
            questrandom:false,            
            random_total:0,
            Nrandom_total:0,
        }
    },
    watch:{
        targetKeys(curVal,oldVal){            
            if(curVal){         
                this.formValidate.ids = curVal.toString();      
                this.formValidate.Nrandom_total = this.Nrandom_total = curVal.length; 
                this.formValidate.total_score =   this.formValidate.Nrandom_total*this.formValidate.score;
                
                if(Object.keys(this.subjects).length === 0 && this.subjects.constructor === Object){
                    console.log("为空")
                }else{
                     ///求难度系数平均值
                     let targetKeys = JSON.parse(JSON.stringify(this.targetKeys));
                     var sum=0;
                     for(let li of targetKeys){
                         sum+=parseInt(this.subjects[li]["difficult"]);                    
                     };
                     targetKeys.length = targetKeys.length | 1;
                     let avg=Math.ceil(sum/(targetKeys.length));  
                     this.formValidate.difficult = avg;
                }
            }
        },

        questrandom(curVal){
            let hash = this.$route.query.hash;            
            this.formValidate.questrandom = curVal;
            if(hash){
                if(curVal){
                    this.random_total =  this.formValidate.random_total || 0;  
                    if(this.random_total == 0){
                        this.formValidate.random_total =this.random_total = this.formValidate.total_score=0;
                    }else{
                        this.formValidate.total_score =   this.random_total*this.formValidate.score;                                            
                    }                      
                }else{                    
                    this.Nrandom_total =  this.formValidate.Nrandom_total || 0;           
                    if(this.Nrandom_total == 0){
                        this.formValidate.Nrandom_total =this.Nrandom_total = this.formValidate.total_score=0; 
                    }else{
                        this.formValidate.total_score =   this.Nrandom_total*this.formValidate.score;                                                                
                    }                            
                }
            }else{                
                if(curVal){
                    this.formValidate.random_total = this.random_total = 0;  
                    this.formValidate.total_score =   this.random_total*this.formValidate.score;                                            
                }else{
                    this.formValidate.Nrandom_total = this.Nrandom_total = this.targetKeys.length;  
                    this.formValidate.total_score =   this.Nrandom_total*this.formValidate.score;                                                                
                }
            }
        },

        score(curVal,oldVal){
            if(curVal>0){
                if(this.questrandom){
                    this.formValidate.score = this.score = curVal;
                    this.formValidate.total_score =   this.formValidate.random_total*this.formValidate.score;
                }else{
                    this.formValidate.score = this.score = curVal;
                    this.formValidate.total_score =   this.formValidate.Nrandom_total*this.formValidate.score;
                }        
            }else{
                this.formValidate.total_score =  this.formValidate.score = this.score = 0; 
            }
        },

        random_total(curVal,oldVal){
            if(curVal>0){
                this.formValidate.random_total =   this.random_total;
                this.formValidate.total_score =   this.formValidate.random_total*this.formValidate.score;
            }else{
                this.formValidate.total_score = this.random_total = this.formValidate.random_total = 0;                
            }
        },
        Nrandom_total(curVal,oldVal){            
            if(curVal>0){
                this.formValidate.Nrandom_total = this.Nrandom_total;
                this.formValidate.total_score =   this.formValidate.Nrandom_total*this.formValidate.score;
            }else{
                this.formValidate.total_score = this.Nrandom_total = this.formValidate.Nrandom_total = 0;                
            }
        },
    },

    created(){
        this.total = this.formValidate.total;
        let active = window.location.pathname.split("/")[1];
        this.formValidate.active = active;
        //获取右侧题库列表
        let that = this;

        let notshowgroup={};
        group().then(function(response){
            let value = response.data.value;
            that.group = value;
            let option={};
            option.gflags = value;
            for(let va of value){
                that.showgroup[va] = true;
                notshowgroup[va] = false;
            }
            that.notshowgroup = notshowgroup;
            that.GetSubjects(option);
        }).catch(function(error){
            console.log(error);       
        });

        ///通过hash获取数据
        let hash = this.$route.query.hash;
        if(hash){
            let option = {};
            option.hash = hash;
            console.log(hash)
            PaperInit(option).then(function(res){
                console.log(res)
                if(res.success){
                    that.formValidate = res.data;         
                    //外部监听数据           
                    that.questrandom = that.formValidate.questrandom;
                    that.score = that.formValidate.score;
                    that.formValidate.total_score = JSON.parse(JSON.stringify(that.formValidate.total*that.formValidate.score));
                    
                    if(that.formValidate.queststore){
                        that.targetKeys = that.formValidate.queststore;   
                    }else{
                        that.targetKeys = [];     
                        that.formValidate.quests = that.formValidate.randomquest.toString();  
                        for(let li of that.formValidate.randomquest){
                            that.notshowgroup[li]=true;
                        }                                        
                    }
                    if(that.questrandom){
                        that.random_total = that.formValidate.random_total =JSON.parse(JSON.stringify(that.formValidate.total));                        
                    }else{
                        that.Nrandom_total = that.formValidate.Nrandom_total =JSON.parse(JSON.stringify(that.formValidate.total));                                                
                    }
                }
            }).catch(function(error){
                console.log(error);    
                router.push({ path: 'paperlist'});                                                                                    
            });
        }else{
             //展示活动
    
        }
    },
    methods:{
        ChangeGroup_random(){
            let option = {};
            let value = [] ;
            for(let group of Object.keys(this.notshowgroup)){
                if(this.notshowgroup[group]){
                    value.push(group);
                }
            }
            this.formValidate.randomquest = value;
            this.formValidate.quests = value.toString();
        },

        ChangeGroup(){
            let option = {};
            let value = [] ;
            for(let group of Object.keys(this.showgroup)){
                if(this.showgroup[group]){
                    value.push(group);
                }
            }
            option.gflags = value;
            let data = [];
            for(let item of this.datacp){
                for(let li of value){
                    if(li == item.gflag){
                        data.push(item);
                        break;
                    }
                }
            }
            this.data = data;
        },
        GetSubjects(option){
            let that = this;
            Getlist(option).then(function(res){
                if(res.success){
                    let data = res.data.rows;
                    let mockData = [];
                    let subjects = {};
                    for(let li of data){
                        subjects[li.hash] = JSON.parse(JSON.stringify(li));
                        mockData.push({
                            key: li.hash,
                            gflag:li.gflag,
                            label: li.title,
                            description:  li.id.toString()+"-"+li.gflag+"-"+ li.title+"-"+"难度系数"+"("+li.difficult+")",
                        });
                    }  
                    that.subjects = subjects;
                    
                    ///求难度系数平均值
                    let targetKeys = JSON.parse(JSON.stringify(that.targetKeys));
                    var sum=0;
                    for(let li of targetKeys){
                        sum+=parseInt(that.subjects[li]["difficult"]);                    
                    };

                    targetKeys.length = targetKeys.length | 1;                    
                    var avg=Math.ceil(sum/targetKeys.length);           
                    that.formValidate.difficult = avg;
                    

                    that.titles = ["全选中","全取消"];
                    that.data = mockData;
                    that.datacp = JSON.parse(JSON.stringify(mockData));                    
                }
            }).catch(function(error){
                console.log(error);   
            });
        },
        handlesuccess(){
            let option={};
            let that = this;
            option = this.formValidate;
            option.queststore=this.targetKeys;
            PaperInit(option).then(function(res){
                console.log(res)
                if(res.success){
                    router.push({ name: 'paperlist', params: { "size": that.$route.params.size,"page":that.$route.params.page}});                                                           

                }
            }).catch(function(error){
                that.$Notice.error({
                    title: '提交失败',
                    desc: "请检查数据完整性",
                });
            });
        },
        render (item) {
            return item.description;
        },
        handleChange (newTargetKeys, direction, moveKeys) {
            this.targetKeys = newTargetKeys;                
        },
        filterMethod (data, query) {
            return data.description.indexOf(query) > -1;
        }
    },
});