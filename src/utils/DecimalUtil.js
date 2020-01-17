const isNumber = (str) => {
    return (/^\-?\d+(\.?\d+)?$/g).test(str);
};

const createZero = (length) => {
    const zeroArr = [];
    for (let i = 0; i < length; i++) {
        zeroArr.push('0');
    }
    return zeroArr.join('');
};

const toThousands = (num) => {
    let thNum = num;
    if (num && num.indexOf) {
        const dotIndex = num.indexOf('.');
        if (dotIndex > 0) {
            thNum = `${num.slice(0, dotIndex).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')}${num.slice(dotIndex)}`;
        } else {
            thNum = num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
        }
    }
    return thNum;
};


const transferDecimal = (num = '', length = 2, round = true, prefixChar = '', thousandBit = false) => {
    let decimalStr = `${num}`;
    let result = decimalStr;
    if (isNumber(decimalStr)) {
        // 负数
        const isNegative = decimalStr.indexOf('-') === 0;
        if (isNegative) {
            decimalStr = decimalStr.slice(1);
        }
        const dotIndex = decimalStr.indexOf('.');
        // 有小数点
        if (dotIndex > -1) {
            // 原有小数位
            const originDecimal = decimalStr.slice(dotIndex + 1);
            // 小数位小于等于保留的位数，此时不用四舍五入
            if (originDecimal.length <= length) {
                result = `${decimalStr}${createZero(length - originDecimal.length)}`;
            } else {
                const originInt = decimalStr.slice(0, dotIndex);
                const originIntLen = originInt.length;
                const isSmallThanZero = originInt === '0' && originIntLen === 1;
                const endLen = isSmallThanZero ? originIntLen + length - 1 : originIntLen + length;
                const intNum = Number(decimalStr) * (10 ** originDecimal.length); // 转换成整数
                let tempNum = `${intNum}`.slice(0, endLen);
                // 四舍五入
                if (round) {
                    const nextDecimal = decimalStr.slice(dotIndex + length + 1, dotIndex + length + 2);
                    if (+nextDecimal >= 5) {
                        tempNum = +tempNum + 1;
                    }
                }
                tempNum = `${tempNum}`;
                const fArr = tempNum.split('');
                if (isSmallThanZero) {
                    fArr.unshift(createZero(1));
                    tempNum = fArr.join('');
                }
                result = `${tempNum.slice(0, originIntLen)}.${tempNum.slice(originIntLen)}`;
            }
        } else {
            result = length > 0 ? `${decimalStr}.${createZero(length)}` : decimalStr;
        }
        if (isNegative) {
            result = `-${result}`;
        }
        // 千分位处理
        if (thousandBit) {
            result = toThousands(result);
        }
        result = prefixChar ? `${prefixChar}${result}` : result;
        return result;
    }
    return num;
};

export default transferDecimal;
