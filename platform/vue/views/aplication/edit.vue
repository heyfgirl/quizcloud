<template>
    <div class="app-container">
        <div class="wrapper">
            应用信息编辑
        </div>
    </div>
</template>
<style scoped>
    .wrapper{
        width: 800px;
        margin: 30px auto;
    }
</style>
<template>
    <div class="app-container">
        <div class="wrapper-content">
            <Row style="background:#eee;padding:20px">
                <Col span="10">
                    <Card shadow class="content">
                        <!-- <p slot="title">使用阴影效果的卡片</p> -->
                        <div class="wrapper-top">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                                <Form-item label="应用 hash" prop="hash">
                                    <Input v-model="formValidate.hash" placeholder="hash 自动生成" disabled></Input>
                                </Form-item>
                                <Form-item label="应用名称" prop="name">
                                    <Input v-model="formValidate.name" placeholder="应用名称"></Input>
                                </Form-item>
                                <Form-item label="选择分组">
                                    <Row :gutter="16">
                                         <Col span="6">
                                            <Dropdown style="margin-left: 20px" > 
                                                <Button type="primary">
                                                    {{selectedGroupName}}
                                                    <Icon type="arrow-down-b"></Icon>
                                                </Button>
                                                <Dropdown-menu slot="list">
                                                    <Dropdown-item v-for="group in groups"  @click.native = "setOrgGroup(group)">{{group.name}}</Dropdown-item>
                                                </Dropdown-menu>
                                            </Dropdown>

                                        </Col> 
                                    </Row>
                                </Form-item> 

                              
                                <Form-item label="应用简介" prop="abstract">
                                    <Input v-model="formValidate.abstract" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="机构简介"></Input>
                                </Form-item>

                                <Form-item label="应用来源" prop="author">
                                    <Input v-model="formValidate.author" placeholder="应用来源"></Input>
                                </Form-item>
                                <Form-item label="icon" prop="icon">
                                    <Input v-model="formValidate.icon" placeholder="icon"></Input>
                                </Form-item>
                               
                                <Form-item label="应用封面" prop="cover" class = "cover">
                                    <div  >
                                        <img :src="formValidate.cover" >
                                    <Upload action="/mapi/aplication/upload/cover" :on-success="coverUploadOk" header="">
                                        <Button type="ghost" icon="ios-cloud-upload-outline">上传应用封面</Button>
                                    </Upload>
                                    </div>
                                    
                                </Form-item>
                                <Form-item label="应用版本" prop="version">
                                    <Input v-model="formValidate.version" placeholder="应用版本号"></Input>
                                </Form-item>
                                
                                <Form-item>
                                    <Button type="primary" @click="createApp()" v-if="isNew">提交</Button>
                                    <Button type="primary" @click="updateOrgan()" v-else = "!isNew">修改</Button>
                                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                                </Form-item>
                            </Form>
                        </div>           
                    </Card>
                </Col>
                 <Col span="12" offset="1">
                    <Card shadow>
                        <Tabs type="card">
                            <Tab-pane  label="应用分组"> 
                                <div class="group-content" v-if="groups">
                                    <draggable v-model="groups" @update="DatadragEnd()" class="grouplistlab">
                                        <Row class="grouplist"  v-for="(group,index) in groups" :key="group.key">
                                            <!-- 编辑条 -->
                                             <div v-if="group.edit"> 
                                            <!-- <div> -->
                                                <Col span="2"><Icon type="ios-trash-outline" size="30" @click.native="Deletegroup(index)" ></Icon></Col>
                                                <Col span="16" class="colpan" >
                                                    <input v-model="group.name"  :ref="group.key" disabled v-if='group.readonly'></input>  
                                                    <input v-model="group.name"  :ref="group.key" v-else='!group.readonly'></input> 
                                                </Col>
                                                <Col span="2"  offset="1"><Icon type="checkmark" @click.native="EditEnd(index)" size="30"></Icon></Col>
                                                <Col span="2"  offset="1"><Icon type="close" @click.native="EditClose()" size="30"></Icon></Col>
                                            </div>      
                                            <!-- 非编辑条 -->
                                             <div v-if="!group.edit">
                                                <Col span="16" class="colpan">
                                                    <input v-model="group.name"  style="border:none" :readonly="group.readonly" v-on:dblclick ="group.edit=true"></input>
                                                </Col>
                                                <Col span="2" offset="1"><Icon type="compose" @click.native="group.edit=true" size="30"></Icon> </Col> 
                                                <Col span="2"  offset="1"><Icon type="navicon-round" size="30"></Icon></Col>
                                            </div>    
                                            <!-- 展示框 --> 
                                        </Row>
                                    </draggable>
                                    <Button type="primary" @click="AddGroup()" style="margin-top:15px">新增</Button>
                                </div>
                            </Tab-pane>
                        </Tabs>                    
                      <!-- 添加分组弹框 -->
                         <Modal v-model="modalAdd" title="新建" ok-text="确认" cancel-text="取消" v-on:on-ok="AddOk()">
                                <Input  v-model="newGroup" :placeholder='"请输入分组名称"' ></Input>
                        </Modal> 
                         <!-- 删除分组弹框  -->
                          <Modal v-model = "confirm" 
                            title="删除"  
                            ok-text="确认" 
                            cancel-text="取消"
                            content:
                            v-on:on-ok="DeleteOk(curIndex)">
                            <Row>
                            <Col span="20" offset="2">确定删除该分组？该分组下的数据将全部转移到默认分组下。</Col>
                            </Row>
                        </Modal>  
                    </Card>
                </Col> 
             
               
            </Row>    
        </div>
    </div>
</template>
<script>
// 用户名  密码  姓名  昵称  手机  性别  地址  微信号  QQ  邮箱
import { getModel} from 'common/api/model';
import { getAppInfo,createApp,updateApp} from 'common/api/aplication';
import { getGroups,updateGroups,createGroup} from 'common/api/group';

// import draggable from 'vuedraggable'
    export default {
        components: {
            // draggable,
        },
        data () {
            return {
                //机构信息存储
                formValidate: {
                    gflag:'normal',
                    cover:'/logo.png'
                },//提交数据
                groups:[{'key':'normal','name':'默认分组','edit':false,'readonly':true}],//缓存分组数据
                groupsMirror:[],//groups镜像，拷贝
                selectedGroupKey:"normal",//选定分组的key
                selectedGroupName:"默认分组",//选定分组的name
                modalAdd:false,//增加分组modal
                newGroup:"",//新建分组
                curGroupIndex:0,//当前分组坐在数组坐标
                confirm:false,//删除分组modal
                isNew:true,//是否为新建,true：新建

                ruleValidate: {
                    name: [
                        { required: true, message: '请填写应用名称', trigger: 'blur' }
                    ],
                    gflag: [
                        { required: true, message: '分组不能为空', trigger: 'change' }
                    ],
                    author: [
                        { required: true, message: '请填写应用来源', trigger: 'blur' }
                    ],
                    cover: [
                        { required: true, message: '请上传应用封面', trigger: 'blur' }
                    ],
                    version: [
                        { required: true, message: '请填写应用版本信息', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
          
            this.GroupList();
            //  let hash = this.$route.params.hash||"";
          
            // if(hash){
               
            //     this.isNew = false;
            //     getOrganInfo(hash).then(res=>{
            //         this.formValidate = res.data;
            //     });
            // }

        },
        methods: {

            copyArr(arr){
               return arr.slice();
            },
            //初始化数据
            GroupList(){
                getGroups({'type':'Aplication'}).then((res) => { 
             
                    this.groups = res.data.groups;
                    this.groupsMirror = this.copyArr(this.groups);
                  
                    
                }).catch(err=>{
                  this.$Message.error({content:"列表获取失败，请稍后尝试"});
                });
            },
           
            // //删除分组按钮
            Deletegroup(index){
               this.confirm = true;
               this.curGroupIndex = index;
            },
          
            // //删除确认
            DeleteOk(){
              this.groups.splice(this.curGroupIndex,1);
              updateGroups({'type':'Aplication','value':this.groups}).then(function(res){
                 
                }).catch(function(e){
                    this.$Message.error({content:"删除失败，请稍后尝试"});
                });
                
            },
            //编辑取消
            EditClose(){
               this.GroupList();
            },
             //编辑确认
            EditEnd(index){
                this.groups[index]['edit'] = false;
                updateGroups({type:"Aplication","value":this.groups}).then(function(res){
                   this.$Message.success({content:"修改成功。"});
                }).catch(res=>{
                    this.$Message.error({content:"创建失败，请稍后尝试"});
                });

            },
           
            // //拖动结束 存储数据
            DatadragEnd(TAG_GroupIndex){
                 updateGroups({type:"Aplication","value":this.groups}).then(function(res){
                    
                }).catch(function(e){
                    this.$Message.error({content:"分组修改失败，请稍后尝试"});
                });
            },
            // //增加分组按钮
            AddGroup(){
                this.modalAdd = true;
            },
            // //增加分组确定按钮
            AddOk(){

                createGroup({'type':'Aplication',"name":this.newGroup.trim()}).then(function(res){
  
                    getGroups({'type':'Aplication'});
                    this.$Message.success({content:"创建成功。"});
                 
                }).catch(err=>{
                   this.$Message.error({content:"创建失败，请稍后尝试"});
                });
            },

            
            //创建应用时存储
            createApp () {
                createApp(this.formValidate).then(res=>{
                    this.$Message.success({content:"创建成功。"});
                }).catch(err=>{
                   this.$Message.error({content:"创建失败，请稍后尝试。"});
                });
            },
            updateApp () {
                updateApp(this.formValidate.hash,this.formValidate).then(res=>{
            
                }).catch(err=>{
                   this.$Message.error({content:"信息修改失败，请稍后尝试。"});
                });
            },
            setOrgGroup(group){
                this.formValidate.gflag = group['key'];
                this.selectedGroupName = group['name']
            },
            //重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //封面上传

            coverUploadOk(response){
               this.formValidate.cover = response.data.cover;
            }


            

        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
input[disabled]{
    background: #f3f3f3;
    opacity:1;
    cursor: not-allowed;
}
.group-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
}
.group-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}
.grouplist{
    list-style: none;
    margin: 1px;
    border: 1px solid #dddee1;
    padding: 10px;
}  
.grouplistlab{
    overflow-y: scroll;
    height: 600px;
} 
.colpan{
    line-height: 228%;
}
.buttntwo {
text-align: right;
}
input {
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
}

.cover img{
    border: 2px silver solid;
    width:171px;
    height:226px;
    margin-left: 20px;
}
.cover button{
    margin-left:40px;
}
</style>

