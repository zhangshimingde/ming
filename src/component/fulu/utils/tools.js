import { updateLocale } from "moment";

// 获取地址栏参数
var commonFun = {};
commonFun.GetQueryString = function (paramStr, name) {
  if (!paramStr) {
    return;
  }
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = paramStr.match(reg);
  if (r != null) return decodeURIComponent(r[2]); return null;
}

//判断有无SUP应用
commonFun.hasSUP = function () {
  var flag = false;
  // SUP应用 : appId: "10000071"
  var authApps = window.authApps;
  for(var i=0; i<authApps.length; i++){
    if(authApps[i] == "10000071"){
      flag = true;
      break;
    }
  }
  return flag;
}

//获取当前用户拥有的应用
commonFun.getAuthApps = function () {
  var arr = [];
	var allApps = window.allApps;
  var authApps = window.authApps;
	for(var i=0; i<authApps.length; i++){
    var app = authApps[i];
    if(app == '10000049'){
      //用户中心
      continue;
    }
		for(var j=0; j<allApps.length; j++){
			if(allApps[j].appId == app){
				arr.push({
					appId: allApps[j].appId,
					appName: allApps[j].appName
				});
			}
		}
	}
	return arr;
}

//格式化时间
commonFun.formatTodayDate = function (date) {
  var d = date ? new Date(date) : new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return {
    beginTime:[year, month, day].join('-') + ' ' + '00:00:00',
    endTime:[year, month, day].join('-') + ' ' + '23:59:59',
    today:[year, month, day].join('-')
  }
}

//格式化金额
commonFun.formatMoney=function(s, n) {
  if(s==='' || s=='underfined') {
    return;
  }
  n = n > 0 && n <= 20 ? n : 4;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
  var t = "";
  for (let i = 0; i < l.length; i++) {
  t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

commonFun.IEVersion = function () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge';//edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1;//不是ie浏览器
  }
}
// 验证身份证有效性
commonFun.IdentityCodeValid = function (code) {
  let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  let pass = true;

  if (!code || !/\d{17}[\d|x]/i.test(code)) {
    pass = false;
  }

  else if (!city[code.substr(0, 2)]) {
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != code[17]) {
        pass = false;
      }
    }
  }
  return pass;
}

commonFun.getDomain = function() {
  const m = location.host.match(/\.[\w_-]+\.[\w_-]+$/);
  if (m) {
    return location.host.slice(m.index);
  }
};

export default commonFun;