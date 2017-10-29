<!-- 用户列表 -->
<template>
    <div class="app-container">
        <div class="wrapper-content">
             <Card shadow>
                <p slot="title">使用阴影效果的卡片</p>
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
                        title="机构信息审核"
                        width=60
                        @on-ok="ok"
                        @on-cancel="cancel"
                        ok-text='通过'
                        cancel-text='拒绝'>

                    <Row :curOrgan = "curOrgan"> 
                       
                        <Col span="20" offset="2">
                        <div class = "panel" >
                            <div style = "width:30px"><Icon type="cloud" size = 30></Icon></div>
                            <label class = "label">机构名称：</label>
                            <span class='span'>{{curOrgan.orgname}}</span>
                           
                        </div>
                         <div class = "panel">
                           <div style = "width:30px"><Icon type="document-text" size = 30></Icon></div>
                            <label class = "label">机构简介：</label>
                            <span class = "span">{{curOrgan.abstract}}</span>
                        </div>
                         <div class = "panel">
                           <div style = "width:30px"><Icon type="crop" size = 30></Icon></div>
                            <label class = "label">系统分配子域名：</label>
                            <span class = "span">{{curOrgan.subdomain }}</span>
                        </div>
                        <div class = "panel">
                           <div style = "width:30px"><Icon type="at" size = 30></Icon></div>
                            <label class = "label">自定义子域名：</label>
                            <span class = "span">{{curOrgan.customdomain }}</span>
                        </div>
                        
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="android-call" size = 30 ></Icon></div>
                            <label class = "label">办公电话：</label>
                            <span class = "span">{{curOrgan.telephone}}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="ios-person" size = 30></Icon></div>
                            <label class = "label">申请人：</label>
                            <span class = "span">{{curOrgan.proposer}}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="iphone" size = 30></Icon></div>
                            <label class = "label">申请人手机：</label>
                            <span class = "span">{{curOrgan.mobile }}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="email" size = 30></Icon></div>
                            <label class = "label">电子邮箱：</label>
                            <span class = "span">{{curOrgan.email }}</span>
                        </div>
                        <div class = "panel">
                            <div style = "width:30px"><Icon type="android-image" size = 30></Icon></div>
                            <label class = "label">资质证明：</label>
                            <img :src ='curOrgan.qualification' style= "width:175px;height:230px;"/>
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
import {getList,getOrganInfo,audit} from 'common/api/organ';

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
            curOrgan:[]
        }
    },
    beforeRouteEnter(to, from, next) {
        //用于处理页面初始化之前的操作
        next(vm => { })
    },
    created() {
        // /api/model/attr?table=User
        getModel('Organ').then((data) => { 
            if(data.success){
                console.log(data.data)
                this.query=data.data["query"];
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
        this.getOrganList(this.page,this.size,this.kw,);
    },
    //监视变量变化
    watch: {
            // '$route': 'fetchData'//如果路由有变化，会再次执行该方法
    },
    methods: {
        //查询按钮
        search(){
            this.page = 1;
            this.getOrganList(this.page,this.size,this.kw,this.view);
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
                                    // window.open('/organ/'+ this.datas[params.index].hash +'/detail')
                                }
                            }
                        }, '审核'),
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    // this.showinfo(params.index)
                                    location.href = '#/organ/update/'+ this.datas[params.index].hash ;
                                }
                            }
                        }, '编辑')
                    ]);
                }
            });
        },
        //页面改变
        onPageChange(page){
            this.page=page;
            this.getOrganList(page);
        },
        //页面大小更改
        onSizeChange(size){
            this.size=size;
            this.getOrganList(this.page,size);
        },
        //获取数据list
        getOrganList(page,size,kw,filter){
            var params ={};
            params.page = this.page= page || this.page;
            params.kw = kw || this.kw;
            params.size = size || this.size;
            params.filter = filter || this.filter;
           
            getList(params).then((res) =>{
                
                this.datas = res.data.rows;
                this.total = res.data.total;
            }).catch(err=>{

                this.$Message.error({'content':'查询失败'})

            });
          
        },
        showinfo(index) {

            getOrganInfo(this.datas[index]["hash"]).then((res) => {
            
            this.curOrgan = res.data;
            this.modal = true;
        }).catch(err => {
            this.$Message.error({'content':'查询失败'})
        });
        },
            
        ok(){
            // console.log()
            audit(this.curOrgan.hash,{'state':true}).then(res=>{

            }).catch(error=>{
                this.$Message.error({'content':'审核失败，请稍后尝试。'})
            });
        },
        cancel(){
            audit(this.curOrgan.hash,{'state':false}).then(res=>{

            }).catch(error=>{
                this.$Message.error({'content':'审核失败，请稍后尝试。'})
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
