<template>
    <div :class="['layout',{hideSidebar:!sidebar.opened}]">
            <!-- 路由 -->
            <div  class="sidebar">
                <div class="logoPanel">LOGO</div>
                <div class="menuList">
                    <Menu mode="vertical" theme="dark" :default-active="$route.path" width="100%">
                        <template v-for="item in permissionRoutes" v-if="!item.hidden">
                            <Submenu :name="item.name" v-if="!item.noDropdown">
                                <template slot="title">
                                    <i><svgicon slot="prepend" :icon=" item.icon == undefined ? 'qq' : item.icon"  color="#42b983 #35495e"></svgicon></i>
                                    <span >  {{item.name }} </span>
                                </template>
                                <router-link v-for="child in item.children" :key="child.path" v-if="!child.hidden"  class="title-link" :to="item.path+'/'+child.path">
                                    <Menu-item :name="item.path+'/'+child.path"  >
                                        <i><svgicon slot="prepend" :icon="child.icon == undefined ? 'qq' : child.icon" color="#42b983 #35495e"></svgicon></i>
                                        <span >  {{child.name }}</span>
                                    </Menu-item>
                                </router-link>
                            </Submenu>
                            <router-link v-if="item.noDropdown&&item.children&&item.children.length>0" class="title-link" :to="item.path ==='/'?'/':item.path +'/'+item.children[0].path">
                                <Menu-item :name="item.path+'/'+item.children[0].path" >
                                    <i><svgicon slot="prepend" :icon="item.icon == undefined ? 'qq' : item.icon"  color="#42b983 #35495e"></svgicon>          </i>
                                    <span>  {{item.name }} </span>
                                </Menu-item>
                            </router-link>
                        </template>
                    </Menu>
                </div>     
            </div>    
            <div class="mainPanle">
                <!-- 顶栏 -->
                <Affix class="navbar">
                        <Button class="sidebarToggle" :class="{sideOpen:!sidebar.opened}"   type="text" @click="toggleSideBar">
                            <i><svgicon slot="prepend" icon="navicon" width="32" height="32"  color="#aaa"></svgicon></i>
                        </Button>
                        <div class="breadcrumb">
                            <Breadcrumb>    
                                <Breadcrumb-item v-for="(item,index)  in levelList" :key="item.value">                                
                                    <router-link v-if='item.redirect==="noredirect" || index==levelList.length-1' to="" class="no-redirect">{{item.name}}</router-link>
                                    <router-link v-else :to="item.path">{{item.name}}</router-link>
                                </Breadcrumb-item>
                            </Breadcrumb>
                        </div>
                        <div class="toolbar">
                            byebye 
                        </div>
                </Affix>
               <!-- 内容区 -->
                <div class="content">
                    <section class="contentPage" style="min-height: 100%">
                        <transition name="fade" mode="out-in">
                            <router-view :key="key"></router-view>
                        </transition>
                    </section>
                </div>
                <div class="layout-bottom"></div>
                <!-- 页脚
                <div class="layout-copy">
                     {{cyear}}&copy; Hanrea
                </div> -->
            </div>
    </div>
</template>
<script>
    import router from './router';
    import store from 'common/store';
    import permissionRoutes from 'common/utils/permission';
    export default {
        data () {
            return {
                cyear: Date.now(),
                levelList: null,
                permissionRoutes: permissionRoutes.get()
            }
        },
        created() {
            this.getBreadcrumb();
        },
        computed: {
            key() {
                //document.title = this.$route.name;
                return this.$route.name !== undefined
                    ? this.$route.name + +new Date()
                    : this.$route + +new Date()
            },
            sidebar() {
                return this.$store.state.app.sidebar;
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            //生成面包屑
             getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name);
                const first = matched[0];
                if (first && (first.name !== '首页' || first.path !== '')) {
                    matched = [{ name: '首页', path: '/' , icon:'ios-home-outline' }].concat(matched)
                }
                this.levelList = matched;
            }
        },
        // 判断角色，生成左侧菜单
        beforeRouteEnter: (to, from, next) => {
            const roles = store.getters.roles;
            console.log("roles:"+roles)
            setTimeout(function () {
                permissionRoutes.init({
                    roles: store.getters.roles,
                    router: router.options.routes
                });
                next();
            },300)
        },
        watch: {
            $route() {
                this.getBreadcrumb();
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    .layout {
       
        position: relative;
        height: 100%;
        width: 100%;
        padding-left: 200px;
        border: 1px solid #d7dde4;
        border-radius: 4px;
        background: #f5f7f9;    
        overflow: hidden;
        &.hideSidebar {
            padding-left: 70px;
            .sidebar {
                transform: translate(-130px, 0);
                .menuList {
                    transform: translate(130px, 0);
                }
                 .svg-icon{
                    width:24px;
                    height:24px;  
                }
                &:hover {
                    transform: translate(0, 0);
                    .menuList {
                        transform: translate(0, 0);
                    }
                }
            }
        }
        .sidebar {
            width: 200px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 2;
            overflow-x: hidden;
            transition: all .28s ease-out;
            background: #1c2438;
            .svg-icon{
                width:20px;
                height:20px;
                margin-right: 18px;
              
            }
        }
        .menuList {
            transition: all .28s ease-out;
        }
        .mainPanle {
            width: 100%;
            min-height: 100%;
            transition: all .28s ease-out;

            .navbar{
                height: 50px;
                background: #fff;
                box-shadow: 0 1px 1px rgba(0,0,0,.1);
                 .sidebarToggle{
                    float:left;
                    cursor: pointer;
                    transform: rotate(90deg);
                    transition: .38s;
                    transform-origin: 50% 50%;
                }
                .sidebarToggle.sideOpen {
                    transform: rotate(0deg);
                }               
                .breadcrumb{
                    height: 50px;
                    padding-top: 16px;
                    float:left;
                    .ivu-breadcrumb{
                            font-size: 16px;
                    }
                }
                .toolbar{
                    float: right;
                    height: 50px;
                    font-size: 30px;
                }
            }
            .content{
                    min-height: 600px;

                    .contentPage{
                        padding:10px
                    }                 
            }

            .layout-copy{
                    text-align: center;
                    padding: 10px 0 20px;
                    width: 100%;
                    bottom: 0;
                    position: fixed;
                    color: #9ea7b4;
            }
        }
    }
</style>