<template>
    <div class="login-container">
        <Form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 :label-width="80"
                 class="card-box login-form">
            <h3 class="title">系统登录</h3>
            <Form-item prop="email">
                
                
        
                <Input name="email" type="text" v-model="loginForm.email" autoComplete="on" placeholder="用户名">
                    <svgicon slot="prepend" icon="user" width="25" height="25" color="#42b983 #35495e"></svgicon>          
                </Input>
            </Form-item>
            <Form-item prop="password">
                <span class="svg-container"><svgicon icon="pass" width="25" height="25" color="#42b983 #35495e"></svgicon></span>
                <Input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                    登录
                </Button>
            </Form-item>
            <router-link to="/sendpwd" class="forget-pwd">
                忘记密码?(或首次登录)
            </router-link>
        </Form>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        components: {  },
        name: 'login',
        data() {
            const validateEmail = (rule, value, callback) => {

                    callback();

            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能小于6位'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    email: '123456',
                    password: '123456'
                },
                loginRules: {
                    email: [
                        { required: true, trigger: 'blur', validator: validateEmail }
                    ],
                    password: [
                        { required: true, trigger: 'blur', validator: validatePass }
                    ]
                },
                loading: false,
                showDialog: false
            }
        },
        computed: {
            ...mapGetters([
                'auth_type'
            ])
        },
        methods: {
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch('Login', this.loginForm).then(() => {
                            this.loading = false;
                            this.$router.push({ path: '/' });

                        }).catch(err => {
                            console.log(err)
                            this.loading = false;
                            new Error(err)
                            // this.$message.error(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        created() {
            // window.addEventListener('hashchange', this.afterQRScan);
        },
        destroyed() {
            // window.removeEventListener('hashchange', this.afterQRScan);
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoprd>

    .tips{
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
    }
    .login-container {
        @include relative;
        height: 100vh;
        background-color: #2d3a4b;

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }


        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #fff;
        }
    }

</style>
