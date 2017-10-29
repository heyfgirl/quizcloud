var app = new Vue({
    el: '#app',
    data: {
        title:"",
        content:"",
        edit:"",
        release:new Date(),
        click:0,
        paging:{left:{},right:{}},
        recomlist:[],
        hash:"",
        kw:"",
    },
    created(){
        let that = this;
        let hash = window.location.search;  
        this.hash = hash; 
        if(!hash) location.href = "/newslist";
        $.ajax({ 
            url: "/api/news/info"+hash, 
            type:"get",
            // data:{hash:"123456"},
            success:function(res){
                if(res.success){                                        
                    // console.log(res);
                    let news = res.data;
                    that.title = news["title"];
                    that.message = news["message"];
                    that.content = news["content"];
                    that.edit = news["edit"];
                    that.release = news["release"];
                    that.click = news["click"];
                    that.paging = news["paging"];
                    that.Click(news["click"]);
                }else{
                    location.href = "/newslist";                    
                }
            },
            error:function(e){
                if(!hash) location.href = "/newslist";                
            }
        });

        ////获取推荐
        $.ajax({ 
            url: "/api/news/recom", 
            type:"get",
            success:function(res){
                // console.log(res)
                if(res.success){
                    that.recomlist = res.data;
                }else{
                    alert("错误！！推荐数据");  
                }
            },
            error:function(e){
                alert("错误！！推荐异常");
            }
        });

        //点击量API


    },
    methods: {
        SearchNewsList: function () {
            location.href='/newslist?kw='+this.kw;
        },
        Click(click){
            let that = this;
            $.ajax({ 
                url: "/api/news/click"+that.hash,
                type:"post",
                data:{"click": click},
                success:function(res){
                    // console.log(res)
                    if(res.success){
                        that.click = res.data.click;
                    }else{
                        alert("错误！！点击数据");  
                    }
                },
                error:function(e){
                    alert("错误！！点击异常");
                }
            });
        },
    }
})
