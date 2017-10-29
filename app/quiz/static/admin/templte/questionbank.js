var questionbank = Vue.extend({
    template: '#questionbank',
    data: function() {
        return {
            addgroupmodal:false,
            deletemodal:false,
            inputgroup:"",
            group:[],
            delstegroup:"",
        }
    },
    created(){
        let that = this;        
        group().then(function(res){
            if(res.success){
                if(res.data.value){
                    that.group = res.data.value;
                }
            }
        });
    },
    methods:{
        Delete(item){
            if(item){
                this.deletemodal = true;
                this.delstegroup =item;
            }
        },
        DeleteOK(){
            let that = this;
            let groupitem = this.group;   
            groupitem.splice(this.group.indexOf(this.delstegroup),1);
            let option = {};                
            option.value = JSON.parse(JSON.stringify(groupitem));
            group(option).then(function(res){
                if(res.success){
                    console.log(res)
                    that.group = JSON.parse(JSON.stringify(res.data.value));
                    
                }
            }).catch(function(error){
                console.log(error)
            });
        },
        JumpInit(key){
            console.log(key)
            let parent = this.$route.query.parent;
            if(parent == "list"){
                router.push({ path: 'init', query: { "gflag": key}});                                
            }else{
                router.push({ path: 'list', query: { "gflag": key }});                
            }
        },
        AddGroup(){
            let that = this;
            let option = {};
            let power = 1;
            option.value = JSON.parse(JSON.stringify(this.group));
            if(this.inputgroup && this.inputgroup.indexOf(" ") == -1){
                // option["key"] = 'tag'+ Math.random().toString(35).substr(2, 6);
                console.log(option.value)
                for(let input of option.value){
                    if(input == this.inputgroup){
                        power=0;
                        break;
                    }
                }
                if(power){
                    let value =JSON.parse(JSON.stringify(this.inputgroup));
                    option.value.push(value);
                    group(option).then(function(res){
                        if(res.success){
                            that.group = JSON.parse(JSON.stringify(res.data.value));
                        }
                    }).catch(function(error){
                        console.log(error)
                    });
                }else{
                    //重复
                    this.$Message.warning('创建失败');
                    this.$Message.error('重复创建');
                }
            }else{
                //格式不正确
                this.$Message.warning('创建失败');                
                this.$Message.error('分组格式不正确');
            }
        },
    }
});