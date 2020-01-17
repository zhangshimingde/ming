var urlParse = {};
urlParse.query = (url, name) => {
    var reg = new RegExp(`${name}=([^&]+|$)`)
    var ret = url.match(reg);

    if (ret) {
        return ret[1];
    }
    else {
        return null;
    }
}

export default urlParse;