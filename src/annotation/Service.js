import React from 'react';
import FLayoutService from '../service/FLayoutService';
import AsideMenuService from '../service/AsideMenuService';
import UserCenterService from '../service/UserCenterService';
import BasicInfoService from '../service/BasicInfoService';
import CustomSettingService from '../service/CustomSettingService';
import TabsService from '../service/TabsService';

const ServicesMatch = {
    FLayoutService,
    AsideMenuService,
    UserCenterService,
    BasicInfoService,
    CustomSettingService,
    TabsService,
};

export default function Service(name) {
    return (Target) => {
        return (props) => {
            const newProps = Object.assign({}, props);
            if (Object.hasOwnProperty.call(ServicesMatch, name)) {
                const ServiceClass = ServicesMatch[name];
                if (typeof ServiceClass === 'function') {
                    newProps.service = new ServiceClass();
                }
            }
            return (<Target {...newProps} />);
        };
    };
}
