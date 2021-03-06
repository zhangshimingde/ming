import React, { PureComponent } from 'react';
import './index.less';

const appIconDefault = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgZmlsbD0iY3VycmVudENvbG9yIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggZD0iTTQ3LjkgNjcuMnY2LjFsLjEuM2MuNSAxLjQgMS44IDIuNCAzLjIgMi40aDI4LjljMS43IDAgMy4xLTEuMyAzLjMtMi45di01LjhjMC0uOC0uMy0xLjUtLjctMi4yLS41LS43LTEuMS0xLjMtMS44LTEuNi0uMy0uMS00LjktMi4xLTEwLTMuMi42LS41IDEuMS0xLjEgMS42LTEuNyAxLjEtMS41IDEuNy0zLjMgMS43LTUuMnYtMi43YzAtMi44LTEuNC01LjUtMy42LTcuMS0xLjUtMS4xLTMuMy0xLjctNS4yLTEuNy00LjkgMC04LjkgNC04LjkgOC45djIuN2MwIDIuOSAxLjQgNS40IDMuNCA3LTQuOSAxLjEtOS4xIDIuOS05LjQgMy0xLjUuNS0yLjYgMi4xLTIuNiAzLjd6TTY0LjkgMTA5Yy0yMC45IDAtMzguNy0xMy42LTQ1LTMyLjUgMi4yLTEuOCAzLjYtNC42IDMuNi03LjcgMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTBjMCA0LjMgMi43IDcuOSA2LjUgOS4zIDcuMSAyMy42IDI5IDQwLjkgNTQuOSA0MC45IDYuOSAwIDEzLjctMS4yIDIwLjItMy42bC0zLjUtOS40Yy01LjQgMi0xMSAzLTE2LjcgM3pNMTIyLjMgNjEuNmMwLTExLjUtMy40LTIyLjYtOS44LTMyLjFsLTguMyA1LjZjNS4zIDcuOCA4LjEgMTcgOC4xIDI2LjUgMCAxMS4yLTQgMjEuOS0xMSAzMC4zLS41LS4xLTEtLjEtMS41LS4xLTUuNSAwLTEwIDQuNS0xMCAxMHM0LjUgMTAgMTAgMTAgMTAtNC41IDEwLTEwYzAtMS4zLS4zLTIuNS0uNy0zLjcgOC40LTEwLjIgMTMuMi0yMy4xIDEzLjItMzYuNXpNMTA1LjMgMTkuOGMwLTUuNS00LjUtMTAtMTAtMTAtMS40IDAtMi44LjMtNCAuOC04LjEtNC4yLTE3LjEtNi40LTI2LjQtNi40LTI1LjQgMC00OCAxNy01NS4xIDQxLjNsOS42IDIuOEMyNS4yIDI4LjIgNDQgMTQuMiA2NC45IDE0LjJjNy4yIDAgMTQuMSAxLjYgMjAuNCA0LjZ2MWMwIDUuNSA0LjUgMTAgMTAgMTBzMTAtNC41IDEwLTEweiI+PC9wYXRoPjwvc3ZnPg==';
const menuIconDefault = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIGNsYXNzPSIiIGRhdGEtaWNvbj0ic2V0dGluZyIgd2lkdGg9IjFlbSIgaGVpZ2h0PSIxZW0iIGZpbGw9IndoaXRlIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggZD0iTTkyNC44IDYyNS43bC02NS41LTU2YzMuMS0xOSA0LjctMzguNCA0LjctNTcuOHMtMS42LTM4LjgtNC43LTU3LjhsNjUuNS01NmEzMi4wMyAzMi4wMyAwIDAgMCA5LjMtMzUuMmwtLjktMi42YTQ0My43NCA0NDMuNzQgMCAwIDAtNzkuNy0xMzcuOWwtMS44LTIuMWEzMi4xMiAzMi4xMiAwIDAgMC0zNS4xLTkuNWwtODEuMyAyOC45Yy0zMC0yNC42LTYzLjUtNDQtOTkuNy01Ny42bC0xNS43LTg1YTMyLjA1IDMyLjA1IDAgMCAwLTI1LjgtMjUuN2wtMi43LS41Yy01Mi4xLTkuNC0xMDYuOS05LjQtMTU5IDBsLTIuNy41YTMyLjA1IDMyLjA1IDAgMCAwLTI1LjggMjUuN2wtMTUuOCA4NS40YTM1MS44NiAzNTEuODYgMCAwIDAtOTkgNTcuNGwtODEuOS0yOS4xYTMyIDMyIDAgMCAwLTM1LjEgOS41bC0xLjggMi4xYTQ0Ni4wMiA0NDYuMDIgMCAwIDAtNzkuNyAxMzcuOWwtLjkgMi42Yy00LjUgMTIuNS0uOCAyNi41IDkuMyAzNS4ybDY2LjMgNTYuNmMtMy4xIDE4LjgtNC42IDM4LTQuNiA1Ny4xIDAgMTkuMiAxLjUgMzguNCA0LjYgNTcuMUw5OSA2MjUuNWEzMi4wMyAzMi4wMyAwIDAgMC05LjMgMzUuMmwuOSAyLjZjMTguMSA1MC40IDQ0LjkgOTYuOSA3OS43IDEzNy45bDEuOCAyLjFhMzIuMTIgMzIuMTIgMCAwIDAgMzUuMSA5LjVsODEuOS0yOS4xYzI5LjggMjQuNSA2My4xIDQzLjkgOTkgNTcuNGwxNS44IDg1LjRhMzIuMDUgMzIuMDUgMCAwIDAgMjUuOCAyNS43bDIuNy41YTQ0OS40IDQ0OS40IDAgMCAwIDE1OSAwbDIuNy0uNWEzMi4wNSAzMi4wNSAwIDAgMCAyNS44LTI1LjdsMTUuNy04NWEzNTAgMzUwIDAgMCAwIDk5LjctNTcuNmw4MS4zIDI4LjlhMzIgMzIgMCAwIDAgMzUuMS05LjVsMS44LTIuMWMzNC44LTQxLjEgNjEuNi04Ny41IDc5LjctMTM3LjlsLjktMi42YzQuNS0xMi4zLjgtMjYuMy05LjMtMzV6TTc4OC4zIDQ2NS45YzIuNSAxNS4xIDMuOCAzMC42IDMuOCA0Ni4xcy0xLjMgMzEtMy44IDQ2LjFsLTYuNiA0MC4xIDc0LjcgNjMuOWEzNzAuMDMgMzcwLjAzIDAgMCAxLTQyLjYgNzMuNkw3MjEgNzAyLjhsLTMxLjQgMjUuOGMtMjMuOSAxOS42LTUwLjUgMzUtNzkuMyA0NS44bC0zOC4xIDE0LjMtMTcuOSA5N2EzNzcuNSAzNzcuNSAwIDAgMS04NSAwbC0xNy45LTk3LjItMzcuOC0xNC41Yy0yOC41LTEwLjgtNTUtMjYuMi03OC43LTQ1LjdsLTMxLjQtMjUuOS05My40IDMzLjJjLTE3LTIyLjktMzEuMi00Ny42LTQyLjYtNzMuNmw3NS41LTY0LjUtNi41LTQwYy0yLjQtMTQuOS0zLjctMzAuMy0zLjctNDUuNSAwLTE1LjMgMS4yLTMwLjYgMy43LTQ1LjVsNi41LTQwLTc1LjUtNjQuNWMxMS4zLTI2LjEgMjUuNi01MC43IDQyLjYtNzMuNmw5My40IDMzLjIgMzEuNC0yNS45YzIzLjctMTkuNSA1MC4yLTM0LjkgNzguNy00NS43bDM3LjktMTQuMyAxNy45LTk3LjJjMjguMS0zLjIgNTYuOC0zLjIgODUgMGwxNy45IDk3IDM4LjEgMTQuM2MyOC43IDEwLjggNTUuNCAyNi4yIDc5LjMgNDUuOGwzMS40IDI1LjggOTIuOC0zMi45YzE3IDIyLjkgMzEuMiA0Ny42IDQyLjYgNzMuNkw3ODEuOCA0MjZsNi41IDM5Ljl6TTUxMiAzMjZjLTk3LjIgMC0xNzYgNzguOC0xNzYgMTc2czc4LjggMTc2IDE3NiAxNzYgMTc2LTc4LjggMTc2LTE3Ni03OC44LTE3Ni0xNzYtMTc2em03OS4yIDI1NS4yQTExMS42IDExMS42IDAgMCAxIDUxMiA2MTRjLTI5LjkgMC01OC0xMS43LTc5LjItMzIuOEExMTEuNiAxMTEuNiAwIDAgMSA0MDAgNTAyYzAtMjkuOSAxMS43LTU4IDMyLjgtNzkuMkM0NTQgNDAxLjYgNDgyLjEgMzkwIDUxMiAzOTBjMjkuOSAwIDU4IDExLjYgNzkuMiAzMi44QTExMS42IDExMS42IDAgMCAxIDYyNCA1MDJjMCAyOS45LTExLjcgNTgtMzIuOCA3OS4yeiI+PC9wYXRoPjwvc3ZnPg==';

class FuluIcon extends PureComponent {
    constructor(props) {
        super(props);
        this.icon = React.createRef();
        this.onError = this.onError.bind(this);
    }
    onError() {
        const { showDefault = true, iconType = 'app' } = this.props;
        if (showDefault) {
            this.icon.current.src = iconType === 'app' ? appIconDefault : menuIconDefault;
        }
		this.icon.current.onerror = null;
    }
    deleteUrlProtocol(url) {
        if (url) {
            if (url.startsWith('https:') || url.startsWith('http:')) {
                return url.slice(url.indexOf(':') + 1);
            }
            return url;
        } 
        return url;
    }
    render() {
        const { width = 18, height = 18, src, showDefault, iconType, ...rest } = this.props;
        const cls = src && src.slice(src.lastIndexOf('.') + 1) === 'svg' && iconType === 'menu' ? 'white-icon anticon' : 'img-icon';
        return (
            <img
                src={this.deleteUrlProtocol(src)}
                width={width}
                ref={this.icon}
                height={height}
                className={cls}
                onError={this.onError}
                {...rest}
            />
        );
    }
}

export default FuluIcon;