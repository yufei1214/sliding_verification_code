var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var puppeteer = require('puppeteer');
(function () { return __awaiter(_this, void 0, void 0, function () {
    // 你无需理解参数都是什么作用
    function easeOutBounce(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    }
    var browser, page, coordinateShift, handleDrag;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    headless: false,
                    defaultViewport: {
                        width: 1200,
                        height: 800,
                    },
                    args: [
                        '--no-sandbox',
                        '--disable-web-security',
                        "--window-size=1600,800",
                    ],
                    devtools: true,
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                // 跳转到掘金登录页面
                return [4 /*yield*/, page.goto('https://juejin.cn/login')];
            case 3:
                // 跳转到掘金登录页面
                _a.sent();
                // 等待密码登录按钮出现
                return [4 /*yield*/, page.waitForSelector('.other-login-box .clickable')];
            case 4:
                // 等待密码登录按钮出现
                _a.sent();
                // 点击密码登录按钮
                return [4 /*yield*/, page.click('.other-login-box .clickable')];
            case 5:
                // 点击密码登录按钮
                _a.sent();
                // 等待账号密码输入框出现
                return [4 /*yield*/, page.waitForSelector('.input-group input[name="loginPhoneOrEmail"]')];
            case 6:
                // 等待账号密码输入框出现
                _a.sent();
                // 输入手机号码和密码
                return [4 /*yield*/, page.type('.input-group input[name="loginPhoneOrEmail"]', '15000000000')];
            case 7:
                // 输入手机号码和密码
                _a.sent();
                return [4 /*yield*/, page.type('.input-group input[name="loginPassword"]', 'codexu666')];
            case 8:
                _a.sent();
                // 点击登录按钮
                return [4 /*yield*/, page.click('.panel .btn')];
            case 9:
                // 点击登录按钮
                _a.sent();
                // 等待验证码 img 标签加载（注意这里还没有加载完成图片）
                return [4 /*yield*/, page.waitForSelector('#captcha-verify-image')];
            case 10:
                // 等待验证码 img 标签加载（注意这里还没有加载完成图片）
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return __awaiter(_this, void 0, void 0, function () {
                        var image, canvas, ctx, imageData, data, h, w, index, r, g, b, maxChangeCount, coordinateShift, w, changeCount, h;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    image = document.querySelector('#captcha-verify-image');
                                    canvas = document.createElement('canvas');
                                    canvas.width = image.width;
                                    canvas.height = image.height;
                                    ctx = canvas.getContext('2d');
                                    // 等待图片加载完成
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            image.onload = function () {
                                                resolve(null);
                                            };
                                        })];
                                case 1:
                                    // 等待图片加载完成
                                    _a.sent();
                                    // 将验证码图片绘制到画布上
                                    ctx.drawImage(image, 0, 0, image.width, image.height);
                                    imageData = ctx.getImageData(0, 0, image.width, image.height);
                                    data = [];
                                    for (h = 0; h < image.height; h++) {
                                        data.push([]);
                                        for (w = 0; w < image.width; w++) {
                                            index = (h * image.width + w) * 4;
                                            r = imageData.data[index] * 0.2126;
                                            g = imageData.data[index + 1] * 0.7152;
                                            b = imageData.data[index + 2] * 0.0722;
                                            // 这里做二值化处理，如果要展示图片，rgb 赋值 255 或者 0
                                            if (r + g + b > 100) {
                                                data[h].push(1);
                                            }
                                            else {
                                                data[h].push(0);
                                            }
                                        }
                                    }
                                    maxChangeCount = 0;
                                    coordinateShift = 0;
                                    for (w = 0; w < image.width; w++) {
                                        changeCount = 0;
                                        for (h = 0; h < image.height; h++) {
                                            // 对比相邻的两个值是否是 1 和 0
                                            if (data[h][w] == 0 && data[h][w - 1] == 1) {
                                                changeCount++;
                                            }
                                        }
                                        if (changeCount > maxChangeCount) {
                                            maxChangeCount = changeCount;
                                            coordinateShift = w;
                                        }
                                    }
                                    // 这就是我们最后要计算滑块运动的距离。
                                    return [2 /*return*/, coordinateShift];
                            }
                        });
                    }); })];
            case 11:
                coordinateShift = _a.sent();
                handleDrag = function () { return __awaiter(_this, void 0, void 0, function () {
                    var drag, dragBox, dragX, dragY, totalSteps, stepTime, i, t, easeT, newX, newY;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, page.$('.secsdk-captcha-drag-icon')];
                            case 1:
                                drag = _a.sent();
                                return [4 /*yield*/, drag.boundingBox()];
                            case 2:
                                dragBox = _a.sent();
                                dragX = dragBox.x + dragBox.width / 2 + 2;
                                dragY = dragBox.y + dragBox.height / 2 + 2;
                                return [4 /*yield*/, page.mouse.move(dragX, dragY)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, page.mouse.down()];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, page.waitForTimeout(300)];
                            case 5:
                                _a.sent();
                                totalSteps = 100;
                                stepTime = 5;
                                i = 0;
                                _a.label = 6;
                            case 6:
                                if (!(i <= totalSteps)) return [3 /*break*/, 10];
                                t = i / totalSteps;
                                easeT = easeOutBounce(t, 0, 1, 1);
                                newX = dragX + coordinateShift * easeT - 5;
                                newY = dragY + Math.random() * 10;
                                return [4 /*yield*/, page.mouse.move(newX, newY, { steps: 1 })];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, page.waitForTimeout(stepTime)];
                            case 8:
                                _a.sent();
                                _a.label = 9;
                            case 9:
                                i++;
                                return [3 /*break*/, 6];
                            case 10: 
                            // 松手前最好还是等待一下，这也很符合真实操作
                            return [4 /*yield*/, page.waitForTimeout(800)];
                            case 11:
                                // 松手前最好还是等待一下，这也很符合真实操作
                                _a.sent();
                                return [4 /*yield*/, page.mouse.up()];
                            case 12:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, handleDrag()];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
