import React from 'react';
import { Breadcrumb } from 'antd';

class BreadCrumb extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log(this.props, 111)
  }
  getIndex = (pathname) => {
    let arrIndex = [];
    for (let index = 0; index < pathname.length; index++) {
      const element = pathname[index];
      if (element === '/') {
        if (index === 0) {
          arrIndex.push('/');
        } else {
          arrIndex.push(pathname.substr(0, index));
        }
      }
    }
    arrIndex.push(pathname);
    return arrIndex;
  }
  setBreadcrumb = () => {
    let { breadCrumbText = '', history: { location: { pathname } }, breadCrumbList } = this.props;
    if (breadCrumbList) {
      return breadCrumbList;
    }
    let breadcrumbTextArr = breadCrumbText.split('/');
    breadcrumbTextArr[0] = '首页';
    let pathnameArr = this.getIndex(pathname);
    let breadcrumbList = [];
    breadcrumbTextArr.map((item, index) => {
      breadcrumbList.push({
        name: item,
        link: (index === 1 || index === breadcrumbTextArr.length - 1) ? false : true,
        path: pathnameArr[index]
      });
    });
    return breadcrumbList;
  }
  toLink = (pathName) => {
    this.props.history.push(pathName);
  }
  render() {
    let breadcrumbList = this.setBreadcrumb();
    return (
      <div className="bread-crumbs" >
        <Breadcrumb>
          {breadcrumbList.map((item, index) =>
            <Breadcrumb.Item key={item.name}>
              {item.link ? <a onClick={() => this.props.history.push(item.path)}>{item.name}</a> : item.name}
            </Breadcrumb.Item>
          )}
        </Breadcrumb >
      </div>

    );
  }
}

export default BreadCrumb;
