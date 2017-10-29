<!-- 用户列表 -->
<template>
    <div class="app-container">
        <div class="wrapper-content">
            <Row>
                <Col span="12">
                    <Card shadow>
                        <p slot="title">使用阴影效果的卡片</p>
                        <div class="wrapper-top">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                                <FormItem label="活动名称" prop="name">
                                    <Input v-model="formValidate.name" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                                </FormItem>
                                <FormItem label="活动路径" prop="path">
                                    <Input v-model="formValidate.path" placeholder="请输入"></Input>
                                </FormItem>
                                <FormItem label="开始时间">
                                        <DatePicker type="datetime" v-model="formValidate.begin" placeholder="选择日期和时间" style="width: 200px"></DatePicker>
                                </FormItem>
                                 <FormItem label="结束时间">
                                        <DatePicker type="datetime" v-model="formValidate.begin" placeholder="选择日期和时间" style="width: 200px"></DatePicker>
                                </FormItem>
                                <FormItem label="模式" prop="mode">
                                    <RadioGroup v-model="formValidate.mode">
                                        <Radio label="public">公开</Radio>
                                        <Radio label="private">不公开</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem label="介绍" prop="abstract">
                                    <Input v-model="formValidate.abstract" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Card>
                </Col>
                <Col span="12">
                    <Card shadow>
                        <p slot="title">使用阴影效果的卡片</p>
                        <div class="wrapper-top">
                            选择应用类型
                            <Select v-model="formValidate.apphash" label-in-value @on-change="onchange" style="width:200px">
                                <Option v-for="item in apps" :value="item.key"  :key="item.key">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </Card>
                    <Card shadow>
                        <div class="wrapper-top">
                            选择模板类型
                            <Select v-model="formValidate.temphash" label-in-value @on-change="onchangetemp" style="width:200px">
                                <Option v-for="item in temps" :value="item.key"  :key="item.key">{{ item.name }}</Option>
                            </Select>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import {getAppList} from 'common/api/auth';
////hash   appname  path  name  abstract  begin  end  mode  apphash  temphash  tempname
    export default {
        data () {
            return {
                formValidate: {
                    temphash:"",
                    tempname:"",
                    name: '',
                    path: '',
                    begin: new Date(),
                    end:    new Date(),
                    mode: "public",
                    abstract: '',
                    apphash:"",
                    appname:""
                },
                apps:[{key:""}],
                temps:[{key:"123",name:"这个模板"}],
                ruleValidate: {
                    name: [
                        { required: true, message: '活动名不能为空', trigger: 'blur' }
                    ],
                },
            }
        },
        created(){
            let that = this;
            getAppList().then(function(res) {
                if(res.success){
                    let apps = [];
                    for(let li of res.data){
                        let row = {};
                        row.key = li.hash;
                        row.name= li.name;
                        apps.push(row);
                    }
                    that.apps = apps;
                }
            }).catch(function(error){
                console.log(error);
            });
        },
        methods: {
            onchangetemp(obj_option){
                 this.formValidate.tempname = obj_option.label;
            },
            onchange(obj_option){
                this.formValidate.appname = obj_option.label;
                console.log(this.formValidate)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    let params = {};
                    params = this.formValidate;
                    if (valid) {
                        this.$store.dispatch('Create',params).then((data) => {

                            this.$Message.success('提交成功!');
                        }).catch(err => {
                            this.$message.error(err);
                            this.loading = false;
                        });

                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  
</style>
