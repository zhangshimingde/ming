const getUserCenterUrl = (argv) => {
    const configs = argv || window.configs;
    if (configs.host.userCenter) {
        return `${configs.host.passport.auth}/connect/authorize/callback?client_id=10000001&redirect_uri=${encodeURIComponent(configs.host.userCenter)}&response_type=code&scope=api&state=STATE`;
    }
    return `${configs.host.passport.auth}/user/center`;
};

export default getUserCenterUrl;
