<template>
    <div class="app-container">
        <div class="wrapper-content">
            <Row style="background:#fff;padding:0px">
               <Col span="12">
                    <Card shadow>
                        <p slot="title">使用阴影效果的卡片</p>
                            <div class="selectd">
                                <Row class="seclctrow">
                                    <Col span="4">
                                        <span>选择角色：</span>
                                    </Col>
                                    <Col span="6">
                                        <Select v-model="rolemodel" style="">
                                            <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="4">
                                        <span>选择分组：</span>
                                    </Col>
                                    <Col span="4">
                                        分组A：
                                        <Select v-model="tag1model" style="">
                                            <Option v-for="item in tag1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col> 
                                    <Col span="4"offset="2">
                                        分组B：
                                        <Select v-model="tag2model" style="">
                                            <Option v-for="item in tag2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                     </Col>
                                    <Col span="4"offset="2">
                                        分组C：
                                        <Select v-model="tag3model" style="">
                                            <Option v-for="item in tag3" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </div>                        
                        <div class="wrapper-top">
                            <p class="uploadfile"> 
                                <Upload
                                    multiple
                                    :show-upload-list="false"
                                    :on-success="importsuccess"
                                    :before-upload="handleUpload"
                                    :format="['xls','xlsx']"
                                    :on-format-error="handleFormatError"
                                    :data="{'role':rolemodel,'tag1':tag1model,'tag2':tag2model,'tag3':tag3model}"
                                    type="drag"
                                    action="/api/user/import?action=uploadfile">
                                    <div style="padding: 20px 0">
                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                        <p>请先选择即将上传的用户角色以及分组，再点击或将文件拖拽到这里上传</p>
                                    </div>
                                </Upload>
                            </p>
                            <p class="submitbtn" v-if="file !== null">已上传文件：{{ file.name }}
                            </p>
                            <p class="prompt">
                                提示：
                                </br>
                                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 请使用模板文件（<a href="" target="_blank">点击下载</a>）来添加数据。
                            </p>
                            <p class="message" v-if="succe">
                                提示：<span :style="message ? 'color:green' : '' ">{{message ? "成功插入如下用户："+message : "消息"}}</span>
                            </p>
                            <p class="warn" v-if="!succe">
                                警告：{{message ? message : "消息"}} 请参照右侧示例，修正文件后重新上传！
                            </p>
                        </div>
                    </Card>
                </Col>
                <Col span="12">
                    <Card shadow>
                        <p slot="title">使用阴影效果的卡片</p>
                        <div class="wrapper-top wrapper-top-example">
                            <p slot="title" style="font-size:20px;color:red;padding-bottom:5px">如下图示例：</p>
                            <p class="uploadfile"> 
                                <Table border :columns="columns1" :data="data1"></Table>
                            </p>
                        </div>
                        <div class="concet">
                            <p slot="title" style="font-size:20px;color:red;padding-bottom:5px">上传文件格式：</p>
                            <p class="uploadfile"> 
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传文件必须是以<span style="color:red">.xls</span>或者<span style="color:red">.xlsx</span>为后缀的EXCEL格式，必填选项为<span style="color:red">用户名</span>，<span style="color:red">密码</span>以及<span style="color:red">昵称</span>。
                                </br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 用户名：每个用户拥有<span style="color:red">唯一</span>用户名，可使用<span style="color:red">字母</span>与<span style="color:red">数字</span>，且必须<span style="color:red">包含字母</span>。
                                </br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                性&nbsp;&nbsp;&nbsp;&nbsp;别：男性请填<span style="color:red">男</span>或<span style="color:red">men</span>，女性请填<span style="color:red">女</span>或<span style="color:red">women</span>。
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>  
        </div>
    </div>
</template>
<script>
import XLSX  from 'xlsx';
import {UserGroup} from 'common/api/user';

export default {
    components: {
    },
    data () {
        return {
            roleList: [
                {
                    value: 'admin',
                    label: '管理员'
                },
                {
                    value: 'nomer',
                    label: '普通用户'
                },
            ],
            rolemodel: 'nomer',

            tag1:[],
            tag1model: 'default',
            tag2:[],
            tag2model: 'default',
            tag3:[],
            tag3model: 'default',

            uploadprocess:"",
            message:"",
            file :null,
            succe:true,
            ////实例
            columns1: [
                {
                    title: '姓名',
                    key: 'realname'
                },
                {
                    title: '用户名',
                    key: 'username'
                },
                {
                    title: '密码',
                    key: 'password'
                },
                {
                    title: '昵称',
                    key: 'nickname'
                },
                {
                    title: '性别',
                    key: 'gender'
                },
                 {
                    title: '手机',
                    key: 'mobile'
                },
            ],
            data1: [
                {
                    realname: '地士',
                    username: 'ssxddd',
                    address: '海淀',
                    password:'123456',
                    nickname:"豆腐干",
                    mobile:"13700854855",
                    gender:"男",

                },
                {
                    realname: '张小刚',
                    username: 'zxg222225',
                    address: '海淀',
                    password:'123456',
                    nickname:"咱们的好朋友",
                    mobile:"13700854855",
                    gender:"女",
                },
                {
                    realname: '李小红',
                    username: 'like3330',
                    address: '上海市浦东',
                    password:'987654321',
                    nickname:"邻家女孩",
                    mobile:"13700854855",
                    gender:"男",
                },
            ]
        }
    },
    computed:{

    },
    created() {
        this.selectgroup('tag1')
        this.selectgroup('tag2')
        this.selectgroup('tag3')
    },
    methods: {
        selectgroup(option){
            UserGroup(option).then((res) => { 
                let valueList = res.data.value;
                let NewTagList = [];
                for(let li of valueList){
                    let row ={};
                    row["value"] = li["key"];
                    row["label"] = li["name"];
                    NewTagList.push(row);
                }
                this.$data[option] = NewTagList;
            })
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 xls 或 xlsx 格式的图片。'
            });
        },
        handleUpload(file){
            this.file =file;
            return true;
        },
        importsuccess(response, file, fileList){
            console.log(response)
            if(response.success){
                this.message = JSON.stringify(response["data"]);
                this.succe=true;
                this.$Message.success('上传成功');
            }else{
                this.succe=false;
                this.message = response["error"]+ JSON.stringify(response["data"]);
                this.$Message.error('上传失败');
            }
        },
    }
}
</script>
<style scoped>
    .wrapper-top{
        margin: 50px;
    }
    .wrapper-top-example{
        margin:0;
    }
    .uploadfile{
    }
    .submitbtn{
        margin-top: 10px;
        color:green;
    }  
    .prompt{
        background: #dddee1;
        border: 1px solid #ccc;
        margin-top: 10px;
        padding: 20px;
    }
    .message{
        word-wrap:break-word;
        margin-top: 10px;
        padding: 20px;
        border:3px dashed #DDDDDD;
    }
    .warn{
        
        word-wrap:break-word;
        margin-top: 10px;
        padding: 20px;
        color:red;
        border:3px dashed 	#FF3030;
    }
    .upload-drag{
        background: #fff;
        border: 1px dashed #dddee1;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color .2s 
    }
    .upload-drag >input{
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;

        opacity: 0;
        font-family: inherit;
        font-size: inherit;
        display: block;
        height: 100%;
        position: absolute;
        float: left;
        width: 100%;
        background: transparent;
    }
    .selectd {
        margin: 50px 50px 0 50px;
    }
    .seclctrow{
        margin-bottom: 20px;
    }
    .concet {
        padding-top: 85px;
    }
</style>
