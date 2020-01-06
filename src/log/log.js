/*!
 * gcb log
 * version 1.0.0
 * @author zjl
 */
import gs from './gs';
import md5 from 'md5';
const defaultOptions = Symbol('defaultOptions');
export default class Log{
    /**
     * 日志
     * @param options 请求头
     * @param headers 请求头
     * @param data 发送的日志数据 {appName,source} appName-应用名称 1:工程宝 2:官网 3:工友宝 4:嘟嘟； source-数据来源 1:android原生 2:ios原生 3:H5 4:web
     * @param host 接口地址域名 web端 web H5 mobile
     * @param authKey 加密key
     */
    constructor(options = {}) {
        let {headers = {}, data = {}, host = 'mobile', authKey = 'mDg99j@XZ#'} = options;
        // 参数
        let {appName = 1, source = 4} = data;
        const _default = {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {},
        };
        headers = Object.assign({}, headers, {'Content-Type': 'application/json'});
        this[defaultOptions] = Object.assign({}, _default, {headers, data: {appName, source}, host, authKey});
        this.enterPageTime = new Date();
        init.call(this);
    }
    
    /**
     *  设置埋点数据
     * @param buridType 埋点类型 1:页面 2:按钮(事件)
     * @param pageFlag 页面标志：项目英文名称+路由 ps:gcb-web/taskPush
     * @param eventFlag 事件标志：项目类型+项目路由+事件按钮名称 ps:activity/taskPush/去发布任务
     * @param clickTime 点击时间   YYYY-MM-DD HH:mm:ss.S
     * @param enterPageTime 页面进入时间
     * @param otherData 其他扩展的埋点数据
     */
    setData({buridType, pageFlag, eventFlag, enterPageTime, ...otherData}) {
        if (enterPageTime instanceof Date) {
            this.enterPageTime = new Date(enterPageTime);
        }
        let data = this[defaultOptions].data;
        data.buridType = buridType;
        pageFlag && (data.pageFlag = pageFlag);
        eventFlag && (data.eventFlag = eventFlag);
        this[defaultOptions].data = Object.assign({}, data, otherData);
        return this;
    }
    
    send() {
        let {data = {}} = this[defaultOptions];
        if (!data.buridType) {
            // eslint-disable-next-line no-throw-literal
            throw 'buridType is not set';
        }
        if (data.buridType === 1 && !data.pageFlag) {
            // eslint-disable-next-line no-throw-literal
            throw 'pageFlag is not set';
        }
        if (data.buridType === 2 && !data.eventFlag) {
            // eslint-disable-next-line no-throw-literal
            throw 'eventFlag is not set';
        }
        let xhr = new XMLHttpRequest();
        xhr.open('post', this[defaultOptions].host + '/buried/buriedData/push', true);
        const {headers} = this[defaultOptions];
        for (let headersKey in headers) {
            let headerValue = headers[headersKey];
            xhr.setRequestHeader(headersKey, headerValue);
        }
        let sendData = {};
        if (data.buridType === 1) {
            // 页面埋点
            sendData = {
                pageFlag: data.pageFlag,
                stayTime: new Date() - this.enterPageTime,
                clickTime: format(new Date(this.enterPageTime), 'YYYY-MM-DD HH:mm:ss.S'),
            };
            delete data.eventFlag;
        } else if (data.buridType === 2) {
            // 事件埋点 发送数据的当前时间为点击事件
            sendData = {
                eventFlag: data.eventFlag,
                clickTime: format(new Date(), 'YYYY-MM-DD HH:mm:ss.S'),
            };
            delete data.pageFlag;
        }
        sendData = Object.assign({}, data, sendData);
        xhr.send(JSON.stringify({dataList:[sendData]}));
    }
}
// window.gcbLog = Log;
function init() {
    // 初始化信息
    let formatToday = format(new Date(), 'YYYYMMDD');
    let browser = gs.Browse();
    let clientOs = gs.ClientOs();
    let clientBrand = gs.clientBrand();
    this[defaultOptions]['headers'] = Object.assign({}, this[defaultOptions].headers, {
        Authorization: `gcb-buried ${md5(formatToday + '' + this[defaultOptions].authKey)}`,
        clientType: browser.clientType,
        clientVersion: browser.clientVersion,
        deviceBrand: clientBrand.brand,
        deviceModel: '',
        deviceSystem: clientOs,
        deviceSystemVersion: clientBrand.version,
    });
}
function format(date, fmt) {
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'D+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds(), // 毫秒
    };
    if (/(Y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt;
}
