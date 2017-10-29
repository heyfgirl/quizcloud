'use strict';

require.config({
    paths:{
        "jquery":"jquery.min",
        "vue":"vue",
        "topheader":"../components/header"
    }

});


require(['vue','topheader'],function(Vue,topheader){
  
    var app = new Vue({
        el:"#app",
        data:function(){
            return {
                activeHash:"",
                mobile:false,//低分辨率模式
                newsList:[],
                rankingList:[]
            }
        },
        computed:{
            
        }, 
        components:{

            topheader
        },
        methods:{
            trimTags(string){
                /<[\s\S]+>([\s\S]+?)<\/[\s\S]+>/.test(string);
                return RegExp.$1;
            },
            getActiveHash(){
                 return location.pathname.split('/')[1];
            },
            getNews(){
                $.post("./api/news",{active:this.activeHash},res=>{
                    if(res.success){
                        this.newsList = res.data.rows;
                    }
                });
            },
            ranking(){
                $.post("./api/ranking",{},res=>{
                    if(res.success){
                        this.rankingList = res.data.rows;
                    }
                }); 
            }
          
        }
        ,
   
        created(){
            this.activeHash = this.getActiveHash();
            this.getNews();
            this.ranking();
        }
    });
})





