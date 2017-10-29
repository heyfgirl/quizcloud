var paperlist = Vue.extend({
    template: '#paperlist',
    data: function() {
        return {
            page: 1,//当前页码 
            size: 10,//分页大小（每页的条数）
            total: 0,//总条目数
            columns: [{}],
            paperlist: [{}],
        }
    },
    created(){
        let that = this;

        this.size = this.$route.params.size || 10;
        this.page =  this.$route.params.page || 1;
        
        getModel('Paper').then(function(res){
            let columns = [];
            if(res.success){
                for(let li of Object.keys(res.data.attributes)){
                    let Singlerow = {};    
                    Singlerow = res.data.attributes[li];                    
                    Singlerow["key"] = li;
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
                                        // console.log(params.row)
                                        router.push({ name: 'paperinfo',query: { "hash": params.row.hash},params:{"size":that.size,"page":that.page}});
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
        });
        this.GetPaperList();

    },
    methods: {
        addtData(){
            router.push({ "path": 'paperinfo'});
        },
        onPageChange(pageindex){
            this.page = pageindex;
            this.GetPaperList();
        },
        onSizeChange(size){
            this.size = size;
            this.GetPaperList();
        },
        GetPaperList(){
            let that = this;
            let option = {};
            option.size = this.size || 10;
            option.page = this.page || 1;
            getpaperList(option).then(function(res){
                let data = [];
                if(res.success){
                    data = res.data.rows;
                    for(let li of data){
                        li["private"]  = (li["private"] == "full") ? "私有" : "半私有";
                        li["questrandom"]  = li["questrandom"] ? "随机" : "统一";
                        li["answrandom"]  = li["answrandom"]  ? "随机" : "统一";
                    }
                    that.total = res.data.count;
                    that.paperlist = data;                    
                }else{
                    that.$Message.error('数据异常');                    
                }
            }).catch(function(error){
                that.$Message.error(error);
            });
        }
    }
})