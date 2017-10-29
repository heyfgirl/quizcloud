<!-- 应用列表 -->
<template>
    <div class="app-container">
        <div class="wrapper-content">
             <Card shadow>
                    <p slot="title">应用管理</p>  
                
               <Row type="flex" justify="start" class="code-row-bg">
                    <ul>
                        <li v-for ='app in apps' class="list">
                            <a><img  :src="app.cover"  class = "cover"/></a>
                            <div class="text"  @click = "showTemps(app.hash)">
                                <span>{{app.name}}</span> 
                                <p>{{app.abstract}}</p>
                            </div>
                            <!-- <div style="margin-top:230px;margin-left:20px;">
                                <Button type="success">编辑</Button>
                                <Button type="info">进入</Button>
                            </div> -->
                        </li>

                        <li class="list">
                            <a><img  src="img/cover_add.png"  class = "cover"/></a>
                            <a class="text"  href = "#/aplication/add" style= "margin:auto;line-height:226px;">
                                <!-- <span>+</span>  -->
                                <p style="text-align:center">添加应用</p>
                            </a>
                        </li>
                        </ul>
                </Row>


                 <Modal
                        v-model="modal"
                        title="应用模板"
                        width = 60
                        >

                        <Row type="flex" justify="start" class="code-row-bg">
                            <ul>
                                <li v-for ='temp in temps' class="list">
                                    <a><img  :src="temp.cover" class = "cover"/></a>
                                    <a class="text" :href="temp.demourl">
                                        <span>{{temp.name}}</span> 
                                        <p>{{temp.abstract}}</p>
                                    </a>

                                </li>
                             </ul>
                        </Row>

                  
                    </Modal>
            </Card>
        </div>
    </div>

    
</template>



<script>
// import modal from 'components/modal.vue';
import { getModel} from 'common/api/model';
import { getApps } from 'common/api/aplication';
import { getTemps} from 'common/api/temp';

export default {
    data() {
        return {
            
            kw: "", //搜索词
            view:"ALL",//检索字段
            
            page: 1,//当前页码 
            size: 20,//分页大小（每页的条数）
            appTotal: 0,//总条目数
            tempTotal: 0,//总条目数
            //数据源，从服务器获取
            apps:[],
            temps:[],
            attributes:{},
            modal: false
            
        }
    },
    // components:{
    //     // modal
    // },
    beforeRouteEnter(to, from, next) {
        //用于处理页面初始化之前的操作
        next(vm => { })
    },
    created() {
       
        // 组件创建完后获取数据，
        this.apps = []
        this.getApps(this.page,this.size,this.kw,);
    },
    //监视变量变化
    watch: {
            // '$route': 'fetchData'//如果路由有变化，会再次执行该方法
    },
    methods: {
      
      
        //页面改变
        onPageChange(page){
            this.page=page;
            this.getList(page);
        },
        //页面大小更改
        onSizeChange(size){
            this.size=size;
            this.getList(this.page,size);
        },
        //获取数据list
        getApps(page,size,kw){
            var params ={};
            params.page = this.page= page || this.page;
            params.kw = kw || this.kw;
            params.size = size || this.size;
            // params.filter = filter || this.filter;
           getApps(params).then((res) =>{
                console.log(res)
                
                this.apps = res.data.rows;
                this.total = res.data.total;
            }).catch(err=>{  
                this.$Message.error({'content':'应用列表获取失败。'});
            });
        },

      
         //显示完整信息
        showTemps(hash) {
           this.modal = true;
            getTemps({'apphash':hash}).then((res) =>{               
                this.temps = res.data.rows;
                this.tempTotal = res.data.total;
            }).catch(err=>{  
                this.$Message.error({'content':'模板列表获取失败。'});
            });
        },

    
    }
}
</script>
<style rel="stylesheet/less" lang="less" scoped>
    .Requestbox {
        display: inline-block;
        float: right;
    }
    .ivu-checkbox-wrapper {
        font-size: 20px;
    }
    .wrapper {
        margin: 0 0 10px 0;
    }

    .list{
        width:175px;
        height:230px;
        border: 2px solid #bfb9b9;
        margin:50px;
        display: inline-block;
        cursor:pointer;
  
    }
   
    .cover{
        width:171px;
        height:226px;
        float:left;
        position:absolute;
    }
    .text{
        width: 171px;
        height: 226px;
        position: absolute;
        opacity: 0;
        color:#fff;
        font: 16px '微软雅黑' bold;
        text-align: center;
        display: block;
        
    }
    .text:hover{
        background-color:#2d8cf0;
         opacity: 0.8;
        -webkit-backface-visibility: hidden;
        -webkit-transition: opacity 0.3s ease-out;
        -moz-transition: opacity 0.3s ease-out;
        -o-transition: opacity 0.3s ease-out;
        transition: opacity 0.3s ease-out;
    }
    .text span{
        text-align: center;
        display: block;
        margin-top: 10px;
    }

    .text p{
        text-align: left;
        padding:10px;
    }
</style>
   