var info = Vue.extend({
    template: '#info',
    data: function() {
        return {
            formItem:{
                title:"",
                media:{},
                option:{A:"",B:"",C:"",D:""},
                multiple:false,
                score:1,
                answer:[],
                difficult:5,
                gflag:"",
                desc:""
            },
            ruleValidate:{
                'title': [
                    { required: true, message: '题目不能为空', trigger: 'blur' }
                ],
                'option': [
                    { required: true, message: 'A答案不能为空', trigger: 'blur' }
                ],
                'B': [
                    { required: true, message: 'B答案不能为空', trigger: 'blur' }
                ],
            },
            group:[],
            optionList: [
                {
                    value: 'A',
                    label: 'A选项'
                },
                {
                    value: 'B',
                    label: 'B选项'
                },
                {
                    value: 'C',
                    label: 'C选项'
                },
                {
                    value: 'D',
                    label: 'D选项'
                }
            ],
            answer1: [],
            answer2: "",

            mediatypelist:["图片","视频","音频"],
            mediatype:"",
            uploadimgList: [],
            visible:false,
            imgViewurl:"",

            
            uploadaudioList:[
                {
                    'name' : 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'http://www.w3school.com.cn//i/horse.ogg',
                    'status':'finished'                        
                    
                },
                {
                    'name' : 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'http://www.w3school.com.cn//i/horse.ogg',
                    'status':'finished'                        
                    
                }
            ],
            base:{},

        }
    },
    watch:{
        mediatype:function(){
        }
    },
    mounted () {
        let that = this;
        let formItem={};
        let option={};   
        option.hash =   this.$route.query.hash;
        option.gflag = this.$route.query.gflag;
        if(option.gflag){
            if(option.hash){
                //获取数据给填充；
                getsubject(option).then(function(res){
                    if(res.success){
    /////////////////////////////////////////
                        that.base = JSON.parse(JSON.stringify(res.data.base));
                        that.base = res.data.base;
                        that.base["activitehash"] =  that.base["activite"]["hash"];
                        that.base["activiteid"] =  that.base["activite"]["id"];
                        that.base["activitename"] =  that.base["activite"]["name"];
                        console.log(res.data)
                        delete res.data["base"];
    /////////////////////////////////////////
                        formItem = res.data;  
                        that.formItem = formItem;  
                        that.mediatype  = that.formItem.media.type;
                        if(that.mediatype == "图片"){
                            that.uploadimgList  = that.formItem.media.data;                                
                        }
                        if(that.formItem.multiple){
                            that.answer1 = that.formItem.answer;
                        }else{
                            that.answer2 = that.formItem.answer[0];                            
                        }
                    }
                    that.formItem.gflag = option.gflag;  
                    console.log(option.gflag)
                    
                    if(that.formItem.media.type == "图片"){
                        that.uploadimgList = that.$refs.upload.fileList = that.formItem.media.data;
                    }                    
                }).catch(function(error){
                    console.log(error)
                    that.formItem.gflag = option.gflag;                    
                })
            }else{
                that.formItem.gflag = option.gflag;                  
            }
        }else{
            router.push({ path: 'questionbank'})
        }
        
    },
    created() {
        
    },
    methods: {
        changemode(status){
            if(status){
                console.log(this.$refs)
                
                console.log(this.$refs.multipleopt)
                // #bbbec4
            }else{

            }
        },
        handleView(file){
            this.visible = true;
            this.imgViewurl= file.response.url;
        },
        handleRemove(file){
            console.log(file)
            const fileList = this.$refs.upload.fileList;
            console.log(fileList)
            
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file, fileList){
            console.log(res)
            console.log(fileList)
            console.log(this.$refs.upload.fileList)
            this.uploadimgList = fileList;            
        },
        create(){
            let option = {};
            let that = this;
            option = this.formItem;
            option.answer = [];
            if(!this.formItem.multiple){
                option.answer.push(this.answer2);
            }else{
                option.answer=this.answer1;           
            }
            if(this.mediatype == "图片"){
                option.media["type"] = "图片";
                option.media["data"] = this.uploadimgList;                
            }else if(this.mediatype == "视频"){
                // option.media["type"] = "音频";
                // option.media["data"] = this.uploadaudioList; 
            }

            console.log(option)
            getsubject(option).then(function(res){
                console.log(res)
                console.log(res.data.gflag)
                if(res.success){
                    router.push({ name: 'list', query: { "gflag": res.data.gflag},params:{"size": that.$route.params.size,"page":that.$route.params.page}});                                                           
                }
            }).catch(function(error){
                that.$Message.error('对方不想说话，并且向你抛出了一个异常');
            });
        },
        submit(){     
        },
    }

})