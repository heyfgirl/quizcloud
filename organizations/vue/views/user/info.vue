<template>
    <div class="app-container">
        <div class="wrapper-content">
            <Row style="background:#fff;padding:0px">
                <Col span="10">
                    <Card shadow class="content">
                        <p slot="title">使用阴影效果的卡片</p>
                        <div class="wrapper-top">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                                <Form-item label="用户名" prop="username">
                                    <Input v-model="formValidate.username" placeholder="请输入账号"></Input>
                                </Form-item>
                                <Form-item label="密码" prop="password">
                                    <Input v-model="formValidate.password" type="password" placeholder="请输入邮箱"></Input>
                                </Form-item>
                                <Form-item label="姓名" prop="realname">
                                    <Input v-model="formValidate.realname" placeholder="请输入真实姓名"></Input>
                                </Form-item>
                                <Form-item label="昵称" prop="nickname">
                                    <Input v-model="formValidate.nickname" placeholder="请输入昵称"></Input>
                                </Form-item>
                                <Form-item label="手机号" prop="mobile">
                                    <Input v-model="formValidate.mobile" placeholder="请输入手机号"></Input>
                                </Form-item>
                                <Form-item label="微信号" prop="wechat">
                                    <Input v-model="formValidate.wechat" placeholder="请输入微信号"></Input>
                                </Form-item>
                                <Form-item label="QQ号" prop="qq">
                                    <Input v-model="formValidate.qq" placeholder="请输入QQ号"></Input>
                                </Form-item>
                                <Form-item label="邮箱号" prop="mailbox">
                                    <Input v-model="formValidate.mailbox" placeholder="请输入微信号"></Input>
                                </Form-item>
                                <Form-item label="角色" prop="role">
                                    <Radio-group v-model="formValidate.role">
                                        <Radio label="admin">admin</Radio>
                                        <Radio label="nomer">普通用户</Radio>
                                    </Radio-group>
                                </Form-item>
                                <Form-item label="性别" prop="gender">
                                    <Radio-group v-model="formValidate.gender">
                                        <Radio label="men">男</Radio>
                                        <Radio label="women">女</Radio>
                                        <Radio label="unknown">未知</Radio>
                                    </Radio-group>
                                </Form-item>

                                <Form-item label="选择分组">
                                    <Row :gutter="16">
                                        <Col span="6" v-for="item in GroupFrom">
                                             <Form-item :label="'分组-'+(item['tag']=='tag1'?'A':item['tag']=='tag2'?'B':'C')" prop="tag1">
                                                <input class="grouptag"  disabled :value="item['groupkv'][formValidate[item['tag']]] ? item['groupkv'][formValidate[item['tag']]]  : '默认分组'"  placeholder="请右侧选择分组信息" readonly="readonly"></input>
                                            </Form-item>
                                        </Col>
                                    </Row>
                                </Form-item>

                                <Form-item label="详细地址" prop="address">
                                    <Input v-model="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                                </Form-item>
                                <Form-item>
                                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                                </Form-item>
                            </Form>
                             <Modal v-model="submit" title="创建用户成功" ok-text="确认" cancel-text="取消" v-on:on-ok="SubmitOK('formValidate')">
                                 <Row>
                                    <Col span="24">用户名: {{formValidate.username}}</Col>
                                    <Col span="24">昵称:  {{formValidate.nickname}}</Col>
                                    <Col span="24">角色:  {{formValidate.role}}</Col>
                                    <Col span="24">TAG:  {{formValidate.tag1}}</Col>
                                </Row>
                            </Modal>
                        </div>           
                    </Card>
                </Col>
                <Col span="6" offset="1">
                    <Card shadow>
                        <Tabs type="card">
                            <Tab-pane  v-for="(GroupObject,Del_GroupIndex) in GroupFrom" :label="'分组'+(GroupObject['tag']=='tag1'?'A':GroupObject['tag']=='tag2'?'B':'C')"> 
                                <div class="group-content" v-if="GroupObject.group">
                                    <draggable v-model="GroupObject['group']" @update="DatadragEnd(Del_GroupIndex)" class="grouplistlab">
                                        <Row class="grouplist"  v-for="(element,index) in GroupObject['group']" :key="element.key">
                                            <!-- 编辑条 -->
                                            <div v-if="element.edit">
                                                <Col span="2"><Icon type="ios-trash-outline" color="red" size="30" @click.native="Deletegroup(Del_GroupIndex,index)" ></Icon></Col>
                                                <Col span="16" class="colpan"  >
                                                    <input v-model="element.name"  :ref="element.key"></input>  
                                                </Col>
                                                <Col span="2"  offset="1"><Icon type="checkmark"color="#3CB371"  @click.native="EditEnd(Del_GroupIndex,index)" size="30"></Icon></Col>
                                                <Col span="2"  offset="1"><Icon type="close" color="#ADADAD" @click.native="EditClose(Del_GroupIndex,index)" size="30"></Icon></Col>
                                            </div>      
                                            <!-- 非编辑条 -->
                                            <div v-if="!element.edit">
                                                <Col span="2"><Icon type="ios-circle-filled" :color="element.key==formValidate[GroupObject.tag] ? 'green' : '#dddee1' " size="20" @click.native="SelectGroup(GroupObject.tag,element.key)"></Icon></Icon> </Col>
                                                <Col span="16" class="colpan">
                                                    <input v-model="element.name"  style="border:none" :readonly="element.readonly" v-on:dblclick ="element.edit=true"></input>
                                                </Col>
                                                <Col span="2" offset="1"><Icon type="compose" @click.native="element.edit=true" size="30"></Icon> </Col> 
                                                <Col span="2"  offset="1"><Icon type="navicon-round" size="30"></Icon></Col>
                                            </div>   
                                            <!-- 展示框 --> 
                                        </Row>
                                    </draggable>
                                    <Button type="primary" @click="AddGroup(Del_GroupIndex)" style="margin-top:15px">新增</Button>
                                </div>
                            </Tab-pane>
                        </Tabs>                    
                      <!-- 添加分组弹框 -->
                        <Modal v-model="modalAdd" title="Add" ok-text="确认" cancel-text="取消" v-on:on-ok="AddOk()">
                                <Input  v-model="modelInput" :placeholder='"请输入分组名称"' ></Input>
                        </Modal>
                        <!-- 删除分组弹框 -->
                        <Modal v-model="modalDelete" title="若删除该分组，请选择将该分组下用户转移至" color="red" ok-text="确认" cancel-text="取消" v-on:on-ok="DeleteOk()">
                            <Row v-for="(element,index) in GroupFrom[Del_GroupIndex]['group']">
                                <Col span="24"><Icon type="ios-circle-filled" :color="element.key==GroupFrom[Del_GroupIndex]['group'][Del_Index]['key']? 'red': element.key!=replaceKey?'#dddee1': 'green' " size="20" @click.native="element.key==GroupFrom[Del_GroupIndex]['group'][Del_Index]['key']? '' : ReplaceDeleteKey(element.key)"></Icon>{{element.name}} </Col>
                             </Row>
                        </Modal>
                    </Card>
                </Col>
                <Col span='6'>
                    <Row v-for="item of GroupFrom">
                        {{item}}
                        </br>
                        </br>
                        </br>
                    </Row>
            
                </Col>
            </Row>    
        </div>
    </div>
</template>
<script>
// 用户名  密码  姓名  昵称  手机  性别  地址  微信号  QQ  邮箱
import { getModel} from 'common/api/model';
import { getUserInfo,CreateUser,UserGroup,DeleteUsergroup,ListGroup } from 'common/api/user';

import draggable from 'vuedraggable'
    export default {
        components: {
            draggable,
        },
        data () {
            return {
                //用户信息存储
                formValidate: {},// username:"",password:"",realname:"",role:"",nickname:"", mobile:"",gender:"", address:"",wechat:"",qq:"",mailbox:"",
                GroupFrom:[{tag:'',group:[],groupcp:[],groupkv:{}}],
                submit:false,
               //增加分组所用数据
                modalAdd:false,
                modelIndex:0,
                modelInput:"",
                //删除分组所用数据
                modalDelete:false,
                Del_GroupIndex:0,
                Del_Index:0,
                replaceKey:"",

                ruleValidate: {
                    username: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    mailbox: [
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '角色不能为空', trigger: 'change' },
                    ],
                    nickname: [
                        { required: true, message: '昵称不能为空', trigger: 'blur' }
                    ],
                    qq: [
                        { type: 'string', message: 'QQ号格式不正确', trigger: 'blur'  }
                    ],
                }
            }
        },
        created() {
            // /api/model/attr?table=User
            getModel('User').then((data) => { 
                if(data.success){
                    let model = {};
                    for(let key of Object.keys(data.data["attributes"])){
                        if(key=="tag1"||key=="tag2"||key=="tag3"){
                            model[key]="default";    
                        }else{
                            model[key]="";
                        }
                    }
                    this.formValidate = model;
                }
                // 获取分组数据
            }).catch(err => {
                    this.$message.error(err);
                    this.loading = false;
            });
            //获取分组信息
            let tag = ['tag1','tag2','tag3'];
            this.GroupList(tag);

        },
        methods: {
            //初始化数据
            GroupList(option){
                ListGroup(option).then((data) => { 
                    let GroupFrom=[{},{},{}];
                    let newlist = [];
                    if(data.data){
                        newlist = data.data;
                    }else{
                        let tag1 = {tag:'tag1',value:[{key:'default',name:'默认分组'}]};
                        let tag2 = {tag:'tag2',value:[{key:'default',name:'默认分组'}]};
                        let tag3 = {tag:'tag3',value:[{key:'default',name:'默认分组'}]};
                        newlist.push(tag1);
                        newlist.push(tag2);
                        newlist.push(tag3);
                    }
                    for(let li of newlist){ 
                        let Obj = {};
                        Obj['tag'] = li['key'];
                        Obj['group'] =[];
                        for(let lis of li['value']){
                            let row ={};
                            row['key']  = lis['key'];
                            row['name'] = lis['name'];
                            row['edit'] = false;
                            row['readonly'] = true;
                            Obj['group'].push(row);
                        }
                        ////////
                        Obj['groupcp'] = [];
                        for(let lis of li['value']){
                            let row ={};
                            row['key']  = lis['key'];
                            row['name'] = lis['name'];
                            row['edit'] = false;
                            row['readonly'] = true;
                            Obj['groupcp'].push(row);
                        }
                        let groupkv = {};
                        for(let lis of li['value']){
                            groupkv[lis['key']] = lis['name'];
                        }
                        Obj['groupkv'] = groupkv;
                        //排序
                        if(Obj['tag'] == 'tag1'){
                            GroupFrom[0] = Obj;
                        }else if(Obj['tag'] == 'tag2'){
                            GroupFrom[1] = Obj;
                        }else if(Obj['tag'] == 'tag3'){
                            GroupFrom[2] = Obj;
                        }
                    }
                    this.GroupFrom = GroupFrom;
                });
            },
            //保存数据
            SaveData(TAG,newGroup,DeleteKey,replaceKey){
                if(replaceKey){
                    console.log(TAG,newGroup,DeleteKey,replaceKey)
                    //删除分组并用replaceKey替换用户的key
                    DeleteUsergroup(TAG,newGroup,DeleteKey,replaceKey).then((data) => { 
                        if(data.data){
                            alert("已将此分组用户转为其他分组")
                        }
                    });
                }else{
                    //更新分组
                    UserGroup(TAG,newGroup).then((data) => { 
                    });
                }
            },
            //存储过滤
            Filter(SingleRowGroup){
                let NEWRowGroup = [];
                for(let li of SingleRowGroup){
                    let row ={};
                    row['key']  = li['key'];
                    row['name'] = li['name'];
                    NEWRowGroup.push(row);
                }
                return NEWRowGroup;
            },
            //同步数据到展示数据与copy数据
            SyncData(TAG_GroupIndex,index,UpdataGroup_Obj){ 
                let GroupFrom = this.GroupFrom;
                let Group = GroupFrom[TAG_GroupIndex]['group'];
                let GroupCP= GroupFrom[TAG_GroupIndex]['groupcp'];
                //同步拷贝分组
                if(index){
                    if(UpdataGroup_Obj){
                        let newGroupCP_OBJ = {};
                        newGroupCP_OBJ['key']  = UpdataGroup_Obj['key'];
                        newGroupCP_OBJ['name'] = UpdataGroup_Obj['name'];
                        newGroupCP_OBJ['edit']  = UpdataGroup_Obj['edit'];
                        newGroupCP_OBJ['readonly'] = UpdataGroup_Obj['readonly'];
                        GroupCP[index] = newGroupCP_OBJ;
                    }else{
                        GroupCP.splice(index,1);
                    }
                    GroupFrom[TAG_GroupIndex]['groupcp'] = GroupCP;
                }else{
                    //拖动同步数据
                    let newGroupCP =[];
                    for(let li of Group){
                        let row ={};
                        row['key']  = li['key'];
                        row['name'] = li['name'];
                        row['edit']  = li['edit'];
                        row['readonly'] = li['readonly'];
                        newGroupCP.push(row);
                    }
                    GroupFrom[TAG_GroupIndex]['groupcp'] = newGroupCP; 
                }
                //同步展示分组
                let newGroupKV = {};
                for(let li of Group){
                    newGroupKV[li['key']] = li['name'];
                }
                GroupFrom[TAG_GroupIndex]['groupkv'] = newGroupKV;
                this.GroupFrom = GroupFrom;
            },
            //删除分组按钮
            Deletegroup(TAG_GroupIndex,index){
                this.modalDelete=true;
                this.Del_GroupIndex = TAG_GroupIndex;
                this.Del_Index = index;
                //在不选择替换key时使用
                this.replaceKey = this.GroupFrom[TAG_GroupIndex]['group'][index]['key'];
            },
            ReplaceDeleteKey(key){
                this.replaceKey = key;
                let TAG = JSON.parse(JSON.stringify(this.GroupFrom[this.Del_GroupIndex]['tag']));
                this.formValidate[TAG] = key;
            },
            //删除确认
            DeleteOk(){
                let GroupFrom = this.GroupFrom;
                let TAG_GroupIndex = this.Del_GroupIndex;
                let index = this.Del_Index;
                let Group = GroupFrom[TAG_GroupIndex]['group'];
                let TAG = GroupFrom[TAG_GroupIndex]['tag'];
                let Del_Group_OBJKey = GroupFrom[TAG_GroupIndex]['group'][index]['key'];
               //被删除的key
                let DeleteKey =  JSON.parse(JSON.stringify(Del_Group_OBJKey));
                let replaceKey = JSON.parse(JSON.stringify(this.replaceKey));
                if(Del_Group_OBJKey == 'default'){
                    alert("默认分组不可删除");
                }else{
                    if(Del_Group_OBJKey == replaceKey){
                        alert("被删除分组不可选择");
                    }else{
                         let DELGroup = [];
                        for(let li in Group){
                            if(li != index){
                                DELGroup.push(Group[li]);
                            }
                        }
                        this.Del_GroupIndex = 0;
                        this.Del_Index = 0;
                        GroupFrom[TAG_GroupIndex]['group'] = DELGroup;
                        this.GroupFrom = GroupFrom;
                        //同步数据
                        this.SyncData(TAG_GroupIndex,index);
                        //过滤数据
                        let newGroup = this.Filter(DELGroup);
                        //存储数据
                        this.SaveData(TAG,newGroup,DeleteKey,replaceKey);
                        this.replaceKey="";
                    }
                }
            },
            //编辑取消
            EditClose(TAG_GroupIndex,index){
                let GroupFrom = this.GroupFrom;
                let Group_OBJ = GroupFrom[TAG_GroupIndex]['group'][index];
                let GroupCP_OBJ = GroupFrom[TAG_GroupIndex]['groupcp'][index];
                Group_OBJ['readonly'] = true;
                Group_OBJ['edit'] = false;
                Group_OBJ['key'] = GroupCP_OBJ['key'];
                Group_OBJ['name'] = GroupCP_OBJ['name'];
                GroupFrom[TAG_GroupIndex]['group'][index] = Group_OBJ;
                this.GroupFrom = GroupFrom;
            },
             //编辑确认
            EditEnd(TAG_GroupIndex,index){
                let GroupFrom = this.GroupFrom;
                let TAG = GroupFrom[TAG_GroupIndex]['tag'];
                let Group = GroupFrom[TAG_GroupIndex]['group'];
                let Group_OBJ = GroupFrom[TAG_GroupIndex]['group'][index];
                Group_OBJ['readonly'] = true;
                Group_OBJ['edit'] = false;
                GroupFrom[TAG_GroupIndex]['group'][index] = Group_OBJ;
                this.GroupFrom = GroupFrom;
                //同步数据
                this.SyncData(TAG_GroupIndex,index,Group_OBJ);
                //过滤数据
                let newGroup = this.Filter(Group);
                //存储数据
                this.SaveData(TAG,newGroup);
            },
            //选择分组
            SelectGroup(tag,key){
                let model = this.formValidate;
                model[tag] = key;
                this.formValidate = model;
            },
            //拖动结束 存储数据
            DatadragEnd(TAG_GroupIndex){
                let GroupFrom = this.GroupFrom;
                let TAG = GroupFrom[TAG_GroupIndex]['tag'];
                let Group = GroupFrom[TAG_GroupIndex]['group'];
                //同步数据
                this.SyncData(TAG_GroupIndex);
                //过滤数据
                let newGroup = this.Filter(Group);
                //存储数据
                this.SaveData(TAG,newGroup);
            },
            //增加分组按钮
            AddGroup(TAG_GroupIndex){
                let GroupFrom = this.GroupFrom;
                this.modalAdd = true;
                this.modelIndex = TAG_GroupIndex;
            },
            //增加分组确定按钮
            AddOk(){
                let GroupFrom = this.GroupFrom;
                if(this.modelInput){
                    let TAG_GroupIndex = this.modelIndex;
                    let newarry = GroupFrom[TAG_GroupIndex]['group'];
                    let TAG = GroupFrom[TAG_GroupIndex]['tag'];
                    let newgroup = {};
                    var I64BIT_TABLE ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
                    let key="kv";
                    for(let i=0;i<6; i++){
                        let ids = Math.ceil(Math.random()*58);
                        key += I64BIT_TABLE[ids];
                    }
                    let id = Math.ceil(Math.random()*999999);
                    let pass = true;
                    for(let kv of newarry){
                        if(kv.key == key){
                            pass =false;
                        }
                    }
                    if(pass){
                        newarry.push({name:this.modelInput,key:key,edit:false,readonly:true});
                        GroupFrom[TAG_GroupIndex]['groupcp'].push({name:this.modelInput,key:key,edit:false,readonly:true});
                        //同步数据
                        this.SyncData(TAG_GroupIndex);
                        //过滤数据
                        let newGroup = this.Filter(newarry);
                        //存储数据
                        this.SaveData(TAG,newGroup);
                    }else{
                        alert("存储失败请重试")
                    }
                }else{

                }
                this.modelInput="";
                this.modelIndex = 0;
            },

            //////////////////////////////
            
            //创建个人信息时存储
            handleSubmit (name) {
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submit = true;
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            SubmitOK(){
                CreateUser(this.formValidate).then((res) => { 
                    if(res.success){
                        this.handleReset('formValidate');
                    }else{
                        alert('存储失败')
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error(err);
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
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
</style>

