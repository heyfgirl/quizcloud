
var list = Vue.extend({
    template: '<div><i-Table border :columns="columns" :data="subjects"></i-Table>'+
                ' '+
                '<div style="margin: 10px;overflow: hidden">'+
                '<Button type="primary" size="large" @click="addtData">新增</Button> '+
                '<div style="float: right;"><Page :total="total" :page-size="size" :current="page" show-sizer show-total show-elevator  @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page></div></div></div>',//
    data: function() {
        return {
            page: 1,//当前页码 
            size: 10,//分页大小（每页的条数）
            total: 0,//总条目数
            columns: [{}],
            subjects: [{}],
        }
    },
    created(){
        let that = this;
        console.log(this.$route.query.gflag)

        this.size = this.$route.params.size || 10;
        this.page = this.$route.params.page || 1;
        
        getModel('Subject').then(function(res){
            let columns = [];
            console.log(res)
            if(res.success){
                for(let li of Object.keys(res.data.attributes)){
                    let Singlerow = {};    
                    Singlerow = res.data.attributes[li];                    
                    Singlerow["key"] = li;
                    if(li=="answer" || li=="multiple" || li=="score" ||li== "difficult"||li== "answer"){
                        Singlerow["width"] = 100;                        
                    }
                    if(li == "gflag"){
                        Singlerow["width"] = 150;                                                
                    }
                    if(Singlerow.search){
                        columns.push(Singlerow);                        
                    }
                };
                columns.push({
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        console.log(params.row)
                                        router.push({ name: 'info', query: { "gflag": params.row.gflag,"hash": params.row.hash},params:{"size":that.size,"page":that.page}})
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                });
                that.columns = columns;                
            }
        }).catch(function(error){
            that.$message.error("haha");
        });

        this.Getlist();
    },
    methods: {
        addtData(){
            let gflag = this.$route.query.gflag;
            console.log(gflag)
            if(gflag){
                router.push({ path: 'info', query: { "gflag": gflag}})                
            }else{
                router.push({ 'name': 'questionbank',query: { "parent": 'list'}});
            }
        },
        onSizeChange(pageindex){
            console.log(pageindex)
            this.size = pageindex;
            this.Getlist();
        },
        onPageChange(pagesize){
            console.log(pagesize)
            this.page = pagesize;
            
            this.Getlist();            
        },
        //
        editable:function(e,field,user){
            this.$editable(e,function(value){
                    // 这里做ajax请求
                    //如果数据没有被修改这个回调方法不会执行
                });
        },
        Getlist:function(){
            let option ={};
            option.gflag = this.$route.query.gflag;
            option.size = this.size || 10;
            option.page = this.page || 1;

            console.log(option)
            let that =this;
            console.log(option)
            Getlist(option).then(function(res){
                let data = [];
                if(res.success){
                    data = res.data.rows;
                    for(let li of data){
                        li["multiple"]  = li["multiple"] ? "多选" : "单选";
                    }
                    that.total = res.data.count;   
                    that.subjects = data;                
                    console.log(data)
                    
                }

            }).catch(function(error){
                console.log(error);
            });
        },
        Addlist:function(){

        }
    }

})
