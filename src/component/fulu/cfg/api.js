export default {
    authCode: '/api/authorization_code',
    // getUserInfo: '/api/passport/getuserinfo',
    getUserInfo: '/api/User/userinfo',
    auth: '/oauth/authorize',
    userinfo: '/api/Member/current',
    getAuthApps: '/api/User/apps',   // 获取所有已经授权的应用
    getAllApps: '/api/App',
    getAuthMenus: '/api/User/authorizeData', // 获取所有已经授权的应用,
    logout: '/user/logout',
    msgTotal: '/api/Message/MemberMessageTotal', 
    register: '/api/Member/register',   // 将通行证的用户注册到商户控制台
    balance: '/api/Finance/GetBalance',
    userMerchants: '/api/User/merchants', // 获取登录账号的商户（管理的和加入的）
    createMerchants: '/api/Merchant', // 创建商户
    updateMerchantRemark: '/api/Merchant', // 编辑商户备注信息
    getMechantInfo: '/api/Merchant', // 获取商户上下文
    AffiliatedCompanyList: '/api/UserCenter/GetAffiliatedCompanyList',
    AuthMerchantByCopy: '/api/usercenter/SelectCopyMemberAuthentication', //选择新增同属商户主体认证
    joinTeam: '/api/Partner/jointeam',
    getInviterInfo: '/api/Merchant/InviteMerchantInfo',   // 根据邀请码获取商户信息
    existRole: '/api/User/existsRoles',
    getAffiliatedPersonalList: '/api/UserCenter/GetAffiliatedPersonalList',
    getCustomerNotify: '/api/Public/GetAbnormalOrderCount', // 获取客服系统消息通知
    getMemberInfo: '/api/Finance/Member/GetMemberInfo', // 获取商户信息
    getFinAccount: '/api/Finance/GetFinAccount', // 获取财务信息
}