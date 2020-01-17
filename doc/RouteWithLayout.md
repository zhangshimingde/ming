#### RouteWithLayout

1.model注册

import { PublicLayout } from 'fl-pro';

app.model(PublicLayout);


2.router配置

import RouteWithLayout, { FLayout } from 'fl-pro';

...

 const PublicLayout = FLayout(app);

 or

 const PublicLayout = FLayout(app, ContentPage); // 可以配置欢迎首页

...