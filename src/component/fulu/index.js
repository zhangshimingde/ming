import Flayout from './Flayout';
import Page403 from './error/Page403';
import Page404 from './error/Page404';
import Page500 from './error/Page500';
import axios, { handleErrCallBack, handleErrNavCallBack } from './utils/request';

Flayout.Page403 = Page403;
Flayout.Page404 = Page404;
Flayout.Page500 = Page500;
Flayout.axios = axios;

// module.exports = {
//     Flayout,
// }

export default Flayout;

export {
    handleErrCallBack,
    handleErrNavCallBack,
};
