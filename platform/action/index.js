// exports.index = async(ctx,next)=>{

//     ctx.body = '平台首页';
// };
const UserAction = require('./user');
const OrganAction = require('./organ');
const AuthAction = require('./auth');
const FrontAction = require('./front');
const AplicationAction = require('./aplication');
const TempAction = require('./temp');
const ActiveAction = require('./active');
const GroupAction = require('./group');
const NewsAction = require('./news');
const FileAction = require('./file');


module.exports = {UserAction,OrganAction,AuthAction,FrontAction,AplicationAction,TempAction,ActiveAction,GroupAction,NewsAction,FileAction};  
