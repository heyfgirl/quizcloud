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
                <Table  ref="table" border :columns="columns" :height="size>10? tableheight : '' " :data="datas"></Table>
                
                <div style="margin: 10px;overflow: hidden">
                    <Button type="primary" size="large" @click="exportData()"><Icon type="ios-download-outline"></Icon> 导出用户数据</Button>
                    <div style="float: right;">
                        <Page :total="total" :page-size="size" :current='page' show-sizer show-total show-elevator  @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import { getModel} from 'common/api/model';
import { UserGroup } from 'common/api/user';

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
        }
    },
    beforeRouteEnter(to, from, next) {
        //用于处理页面初始化之前的操作
        next(vm => { })
    },
    created() {
        // /api/model/attr?table=User
        getModel('User').then((data) => { 
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
        }).catch(err => {
                this.$message.error(err);
                this.loading = false;
        });
        // 组件创建完后获取数据，
        this.getUserList(this.page,this.size,this.kw,);
    },
    //监视变量变化
    watch: {
            // '$route': 'fetchData'//如果路由有变化，会再次执行该方法
    },
    methods: {
        //导出数据
        exportData(){
            this.$refs.table.exportCsv({
                filename: '用户数据',
                original: false
            });
        },
        //查询按钮
        search(){
            this.page = 1;
            this.getUserList(1,this.size,this.kw,this.view);
        },
        //列表获取colums
        changeTableColumns(){
            let showkey = [];
            for(let s of Object.keys(this.show)){
                if(this.show[s]) showkey.push(s);
            }
            let columns=[];
            for(let col of showkey){
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
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.remove(params.index)
                                }
                            }
                        }, '删除')
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
            this.getUserList(this.page,size);
        },
        //获取数据list
        getUserList(page,size,kw,filter){
            var params ={};
            params.page = this.page= page || this.page;
            params.kw = kw || this.kw;
            params.size = size || this.size;
            params.filter = filter || this.filter;
            this.$store.dispatch('getUserList',params).then((res) => {
                console.log(res)
                this.datas = res.data.rows;
                this.total = res.data.count;
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
            }).catch(err => {
                this.$message.error(err);
                this.loading = false;
            });
        },
        //显示完整信息
        showinfo(index) {
            this.$Modal.info({
                title: '用户信息',
                content: `姓名：${this.datas[index].username}<br>年龄：${this.datas[index].relaname}<br>地址：${this.datas[index].mobile}`
            })
        },
        //移除
        remove(index) {
            alert("删除"+index)
            this.datas.splice(index, 1);
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
</style>
