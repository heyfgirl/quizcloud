var answersheetlist = Vue.extend({
    template: '#answersheetlist',
    data: function() {
        return {
            page: 1,//当前页码 
            size: 10,//分页大小（每页的条数）
            total: 0,//总条目数
            columns: [{}],
            answetsheetlist: [{}],
        }
    },
    created(){
        let that = this;

        console.log(this.$route)

        this.size = this.$route.params.size || 10;
        this.page =  this.$route.params.page || 1;
    
        getModel('AnswerSheet').then(function(res){
            let columns = [];
            if(res.success){
                for(let li of Object.keys(res.data.attributes)){
                    let Singlerow = {};    
                    Singlerow = res.data.attributes[li];                        
                    Singlerow["key"] = li;
                    // if(li=="userid" || li=="score" || li=="papertime" ||li== "curquest"||li== "total"||li=="answerdcount"||li=="state" ){
                    //     Singlerow["width"] = 100;                        
                    // }
                    if(li=="start"||li=="end"){
                        Singlerow["width"] = 200;        
                    }
                    if(Singlerow.search){
                        columns.push(Singlerow);                        
                    }
                };
                columns.splice(0,0,{key:"username",title:"答卷人用户名"})                                
                columns.splice(0,0,{key:"usernick",title:"答卷人"})                
                columns.push({
                    title:"展开",
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
                                        router.push({ name: 'answersheetinfo',query:{ "hash": params.row.hash},params:{"size":that.size,"page":that.page}});                                        
                                    }
                                }
                            }, '查看'),
                        ]);
                    }


                });
                that.columns = columns;                
            }
        });

        this.GetAnswerList();
    },
    methods:{
        onPageChange(pageindex){
            this.page = pageindex;
            this.GetAnswerList();
        },
        onSizeChange(size){
            this.size = size;
            this.GetAnswerList();
        },
        GetAnswerList(){
            let that = this;
            let option = {};
            option.size = this.size || 10;
            option.page = this.page || 1;

            console.log(option)
            GetAnswerSheetList(option).then(function(res){
                console.log(res)
                if(res.success){
                    that.answetsheetlist = res.data.rows;     
                    that.total = res.data.count;           
                }
            }).catch(function(error){
                console.log(error);
            });
        },
    }
});