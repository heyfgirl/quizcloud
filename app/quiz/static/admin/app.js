


const routes = [
    {name:"list", path: '/list', component: list },
    {name:"info", path: '/info', component: info },
    {name:"paperlist", path: '/paperlist', component: paperlist },    
    {name:"questionbank", path: '/questionbank', component: questionbank },
    {name:"paperinfo", path: '/paperinfo', component: paperinfo },    
    {name:"answersheetlist", path: '/answersheetlist', component: answersheetlist },    
    {name:"answersheetinfo", name:"answersheetinfo", path: '/answersheetinfo', component: answersheetinfo },    
    {name:"expandRow", path: '/expandRow', component: expandRow },    
    
]
const router = new VueRouter({
    routes
})



var App = Vue.extend({})
const app = new Vue({
    router
}).$mount('#app')
// const app = new Vue({
//     el:"#app",
//     router
// })
