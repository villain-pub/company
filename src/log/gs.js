const userAgent = navigator.userAgent.toLowerCase();
let gs = {
    Browse: function () {
        let browser = {};
        let s;
        (s = userAgent.match(new RegExp("msie ([\\d.]+)"))) ? browser.ie = s[1] : (s = userAgent.match(new RegExp("firefox\/([\\d.]+)"))) ? browser.firefox = s[1] : (s = userAgent.match(new RegExp("chrome\/([\\d.]+)"))) ? browser.chrome = s[1] : (s = userAgent.match(new RegExp("opera.([\\d.]+)"))) ? browser.opera = s[1] : (s = userAgent.match(new RegExp("version\/([\\d.]+)"))) ? browser.safari = s[1] : 0;
        let temp = {};
        if (browser.ie) {
            temp = {
                clientType: 'IE',
                clientVersion: browser.ie,
            };
        } else {
            if (browser.firefox) {
                temp = {
                    clientType: 'firefox',
                    clientVersion: browser.firefox,
                };
            } else {
                if (browser.chrome) {
                    temp = {
                        clientType: 'chrome',
                        clientVersion: browser.chrome,
                    };
                } else {
                    if (browser.opera) {
                        temp = {
                            clientType: 'opera',
                            clientVersion: browser.opera,
                        };
                    } else {
                        if (browser.safari) {
                            temp = {
                                clientType: 'safari',
                                clientVersion: browser.safari,
                            };
                        } else {
                            temp = {
                                clientType: 'unknown',
                                clientVersion: 0,
                            };
                        }
                    }
                }
            }
        }
        return temp;
    },
    /** 获得操作系统***/
    ClientOs: function () {
        let isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
        let isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
        if (isMac) { return 'Mac' }
        let isUnix = (navigator.platform == 'X11') && !isWin && !isMac;
        if (isUnix) { return 'Unix' }
        let isLinux = (String(navigator.platform).indexOf('Linux') > -1);
        if (isLinux) { return 'Linux' }
        if (isWin) {
            let isWin2K = userAgent.indexOf('windows nt 5.0') > -1 || userAgent.indexOf('windows 2000') > -1;
            if (isWin2K) { return 'Win2000' }
            let isWinXP = userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows xp') > -1;
            if (isWinXP) { return 'WinXP' }
            let isWin2003 = userAgent.indexOf('windows nt 5.2') > -1 || userAgent.indexOf('windows 2003') > -1;
            if (isWin2003) { return 'Win2003' }
            let isWinVista = userAgent.indexOf('windows nt 6.0') > -1 || userAgent.indexOf('windows vista') > -1;
            if (isWinVista) { return 'WinVista' }
            let isWin7 = userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1;
            if (isWin7) { return 'Win7' }
        }
        return navigator.platform || 'unknown';
    },
    clientBrand: function () {
        let os = {
            brand: 'unknown',
            version: 'unknown',
        };
        try {
            if (userAgent.indexOf('android') > -1) {
                let brand = userAgent.match(new RegExp("(?<=\\().*?(?=\\))"))[0];
                let version = userAgent.match(new RegExp("(?<=android ).*?(?=;)"))[0];
                os = {
                    brand: brand.split(';')[2] || 'unknown',
                    version: version || 'unknown',
                };
            }
            if (userAgent.indexOf('iphone') > -1) {
                let brand = userAgent.match(new RegExp("(?<=mobile\\/).*?(?= )"))[0];
                let version = userAgent.match(new RegExp("(?<=os).*?(?=like)"))[0];
                os = {
                    brand: brand || 'unknown',
                    version: version || 'unknown',
                };
            }
        } catch (error) {
            console.log(error);
        }
        return os;
    },
};
export default gs;
