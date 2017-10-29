const getters = {
  //app 状态
  sidebar: state => state.app.sidebar,
  livenewsChannels: state => state.app.livenewsChannels,

  //user状态
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  uid: state => state.user.uid,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  auth_type: state => state.user.auth_type,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting


};
export default getters
