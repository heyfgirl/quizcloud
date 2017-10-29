const Models = require('./../model/index');
const uid = require('uid');
//初始化数据库 api
exports.init = async (ctx,next)=>{
    //清空数据库
    
    const UserModel = Models.getTableModel('User');
    const OrganModel = Models.getTableModel('Organ');
    // await UserModel.destroy({where:{}});
    await OrganModel.destroy({where:{}});
    // console.log("数据库已清空！");

    let users = [
        {username:'admin',usernamelower:'admin',salt:"adsb",password:"a861f35b92cb56966beb62b4667024e2",role:"admin",nickname:"管理员",realname:"管理员",mobile:"13912237500"},
        {username:'jack',usernamelower:'jack',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912237542"},//pass:123456
        {username:'lily',usernamelower:'lily',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912237532"},
        {username:'lisa',usernamelower:'lisa',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912237522"},
        {username:'jack1',usernamelower:'jack1',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912232112"},
        {username:'jack2',usernamelower:'jack2',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"1391437552"},
        {username:'jack3',usernamelower:'jack3',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13911237552"},
        {username:'jack4',usernamelower:'jack4',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"12112237552"},
        {username:'jack5',usernamelower:'jack5',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912232552"},
        {username:'jack6',usernamelower:'jack6',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912120552"},
        {username:'jack7',usernamelower:'jack7',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13122237552"},
        {username:'jack8',usernamelower:'jack8',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912222552"},
        {username:'jack9',usernamelower:'jack9',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13933337552"},
        {username:'jack10',usernamelower:'jack10',salt:"aaaa",password:"3d9188577cc9bfe9291ac66b5cc872b7",role:"normal",nickname:"夕阳西下",realname:"杰克",mobile:"13912237112"},
    ];

    let organs= [
        {"hash":uid(8),"orgname":"上海市图书馆","proposer":"jack","mobile":"13764525161","gflag":"normal"},
        {"hash":uid(8),"orgname":"无锡市图书馆","proposer":"jack","mobile":"13764525162","gflag":"normal"},
        {"hash":uid(8),"orgname":"南通市图书馆","proposer":"jack","mobile":"13764525163","gflag":"normal"},
        {"hash":uid(8),"orgname":"苏州市图书馆","proposer":"jack","mobile":"13764525164","gflag":"normal"},
        {"hash":uid(8),"orgname":"扬州市图书馆","proposer":"jack","mobile":"13764525165","gflag":"normal"},
        {"hash":uid(8),"orgname":"杭州市图书馆","proposer":"jack","mobile":"13764525166","gflag":"normal"},
        {"hash":uid(8),"orgname":"常州市图书馆","proposer":"jack","mobile":"13764525167","gflag":"normal"},
        {"hash":uid(8),"orgname":"南京市图书馆","proposer":"jack","mobile":"13764525168","gflag":"normal"}

        
    ]
    //let organ
    // let organs = [

    // ];

    // await UserModel.bulkCreate(users);
    await OrganModel.bulkCreate(organs);
    console.log("表User导入成功！")


}