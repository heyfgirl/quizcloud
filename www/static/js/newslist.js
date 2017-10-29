var app = new Vue({
    el: '#app',
    data: {
        newslist:[],
        recomlist:[],
        kw:"",
        page:1, ///当前页面
        total:1, ////总个数
    },
    created(){
        let kws = window.location.search.split("kw=");
        this.kw = kws[1] ? decodeURI(kws[1]) : "";
        let that = this;  
        //获取新闻列表     
        this.SearchNewsList(); 
        ////获取推荐
        $.ajax({ 
            url: "/api/news/recom", 
            type:"get",
            success:function(res){
                if(res.success){
                    that.recomlist = res.data;
                }else{
                    alert("错误！！");                    
                }
            },
            error:function(e){
                alert("错误！！");
            }
        });

    },
    methods: {
        GetNewsList(){
            let that = this;  
            $.ajax({ 
                url: "/api/news/list", 
                type:"post",
                data:{"page":that.page,"kw":that.kw,"size":5,"filter":["title","content","edit"]},
                success:function(res){
                    if(res.success){
                        res.data.rows.forEach((item, i) => {
                        });
                        that.newslist = res.data.rows;
                        that.total = res.data.count;
                    }else{
                        alert("错误的返回！！");                    
                    }
                },
                error:function(e){
                    alert("错误！！" + e);
                }
            });
        },
        SearchNewsList(){
            let that = this;  
            $.ajax({ 
                url: "/api/news/list", 
                type:"post",
                data:{"page":that.page,"kw":that.kw,"size":5,"filter":["title","content","edit"]},
                success:function(res){
                    if(res.success){
                        res.data.rows.forEach((item, i) => {
                        });
                        that.newslist = res.data.rows;
                        that.total = res.data.count;
                        $("#pages").page({
                            pages:Math.ceil(that.total / 5), //得到总页数
                            jump:function(context){
                                that.page = context.option.curr;
                                that.GetNewsList();
                            }
                        });
                    }else{
                        alert("错误的返回！！");                    
                    }
                },
                error:function(e){
                    alert("错误！！" + e);
                }
            });
        }
    }
})

