<!-- 活动列表 -->
<template>
    <div class="app-container">
        <div class="wrapper-content">
             <Card shadow>
                <!-- <p slot="title"></p> -->
                <div class="wrapper-top">
                    <!-- <Button class="margin-right-sm" type="primary" @click="$router.push('articles/form')">新增</Button> -->
                    <div class="Requestbox">
                        <Input v-model="kw"  placeholder="请输入对象">
                            <Select v-model="view" slot="prepend" style="width: 80px">
                                <Option v-for="item in filter" :value="item">{{attributes[item]["title"]}}</Option>
                            </Select>
                            <Button slot="append" icon="ios-search"  @click="search"></Button>
                        </Input>
                    </div>
                </div>
                <div class="wrapper">
                    <Checkbox  v-for="item in query" :key="item" v-model="show[item]" @on-change="changeTableColumns">
                        {{attributes[item]["title"]}}
                    </Checkbox>
                </div>
                <Table  border :columns="columns" :height="size>10? tableheight : '' " :data="datas"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="total" :page-size="size" :current='page' show-sizer show-total show-elevator  @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page>
                    </div>
                </div>

                    <Modal
                        v-model="modal"
                        title="活动信息"
                        width:80
                        >
                       
                    <Row :curActive = "curActive"> 
                       
                        <Col span="20" offset="4">
                         
                        <div class = "panel" >
                            <div style = "width:30px"><Icon type="ios-cloud-outline" size = 30></Icon></div>
                            <label class = "label">活动名称：</label>
                            <span class='span'>{{curActive.activename}}</span>
                           
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="ios-compose-outline" size = 30 ></Icon></div>
                            <label class = "label">活动简介：</label>
                            <span class = "span">{{curActive.abstract}}</span>
                        </div>
                        <div class = "panel">
                        
                            <div style = "width:30px"><Icon type="clock" size = 30></Icon></div>
                            <label class = "label">活动开始时间：</label>
                            <span class = "span">{{curActive.begin}}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="clock" size = 30></Icon></div>
                            <label class = "label">活动截止时间：</label>
                            <span class = "span">{{curActive.end }}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="ios-paperplane-outline" size = 30></Icon></div>
                            <label class = "label">活动模式：</label>
                            <span class = "span">{{curActive.mode == "public"?"公开":"私有" }}</span>
                        </div>
                        <div class = "panel" >
                            <div style = "width:30px"><Icon type="ios-pulse" size = 30></Icon></div>
                            <label class = "label">举办单位：</label>
                            <span class='span'>{{curActive.orgname}}</span>
                           
                        </div>
                        
                        <div class = "panel" >
                            <div style = "width:30px"><Icon type="ios-box-outline" size = 30></Icon></div>
                            <label class = "label">所属应用：</label>
                            <span class='span'>{{curActive.appname}}</span>
                           
                        </div>
                        <div class = "panel" >
                            <div style = "width:30px"><Icon type="ios-photos-outline" size = 30></Icon></div>
                            <label class = "label">模板引用：</label>
                            <span class='span'>{{curActive.tempname}}</span>
                           
                        </div>
                      

                    </Col> 
                    </Row>
                    </Modal>
            </Card>
        </div>
    </div>

    
</template>



<script>
import { getModel} from 'common/api/model';
import { getList, getInfo} from 'common/api/active';

export default {
    data() {
        return {
            tableheight:window.innerHeight*0.6,
            query:[],
            show:{},
            kw: "", //搜索词
            view:"ALL",//检索字段
            filter:[],//搜索指定指定（"默认包含全部可检索字段"）
            page: 1,//当前页码 
            size: 20,//分页大小（每页的条数）
            total: 0,//总条目数
            //数据源，从服务器获取
            datas:[],
            order:[],//排序（用于搜索排序）
            columns: [{}],
            attributes:{},
            modal:false,
            curActive:{}
        }
    },

    beforeRouteEnter(to, from, next) {
        //用于处理页面初始化之前的操作
        next(vm => { })
    },
    created() {
        // /api/model/attr?table=User
        getModel('Active').then((data) => { 
            if(data.success){
                console.log(data.data)
                this.query=data.data["query"];
                // this.query.push('id');//加入id
                this.filter=data["data"]["search"];
                //在下拉检索字段添加ALL
                this.filter.unshift("ALL");
                let showcol = {};
                for(let type of this.query){
                    showcol[type]=true;
                }
                this.show = showcol;
                this.attributes=data.data['attributes'];
               
                //在显示title检索字段添加ALL
                this.attributes["ALL"]={"key":"ALL","title":"ALL"};
                this.changeTableColumns();
            }
        });
        // 组件创建完后获取数据，
        this.getActiveList(this.page,this.size,this.kw,);
    },
    //监视变量变化
    watch: {
            // '$route': 'fetchData'//如果路由有变化，会再次执行该方法
    },
    methods: {
        //查询按钮
        search(){
            this.page = 1;
            this.getActiveList("1",this.size,this.kw,this.view);
        },
        //列表获取colums
        changeTableColumns(){
            let sho = [];
            for(let s of Object.keys(this.show)){
                if(this.show[s]) sho.push(s);
            }
            let columns=[];
            for(let col of sho){
                this.attributes[col]["key"]=col;
                columns.push(this.attributes[col]);
            }
            this.columns=columns;
            this.columns.push({                
                key:"cz",
                title:"操作",
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
                                    this.showinfo(params.index)
                                }
                            }
                        }, '查看')
                         
                    ]);
                }
            });
        },
        //页面改变
        onPageChange(page){
            this.page=page;
            this.getUserList(page);
        },
        //页面大小更改
        onSizeChange(size){
            this.size=size;
            this.getUserList(this.page,size).then(res=>{

            }).catch(err=>{
                this.$message.error("列表获取失败，请稍后尝试。");
            });
        },
        //获取数据list
        getActiveList(page,size,kw,filter){
            var params ={};
            params.page = this.page= page || this.page;
            params.kw = kw || this.kw;
            params.size = size || this.size;
            params.filter = filter || this.filter;
            getList(params).then((data) => {
                this.datas = data.data.rows;
                this.total = data.data.count;
            }).catch(err => {
                this.$message.error("列表获取失败，请稍后尝试。");
                this.loading = false;
            });
        },

         showinfo(index) {

             getInfo(this.datas[index].id).then((res) => {
                this.curActive = res.data;
                this.modal = true;
            }).catch(err => {
                this.$message.error("活动信息获取失败，请稍后尝试。");
            });
             
            
        }
       
        
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
    .panel{
        display: flex;
        padding:5px;
    }
    .label{
        padding:8px 10px
    }
    .span{
      padding:8px 0
    }
</style>
