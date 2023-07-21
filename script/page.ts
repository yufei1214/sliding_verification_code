const puppeteer = require('puppeteer');

(async ()=>{
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1200,
            height: 800,
        },
        args: [
            '--no-sandbox',
            '--disable-web-security',
            `--window-size=1600,800`,
        ],
        devtools: true,
    });
    const page = await browser.newPage();
    // 跳转到掘金登录页面
    await page.goto('https://juejin.cn/login');
    // 等待密码登录按钮出现
    await page.waitForSelector('.other-login-box .clickable');
    // 点击密码登录按钮
    await page.click('.other-login-box .clickable');
    // 等待账号密码输入框出现
    await page.waitForSelector('.input-group input[name="loginPhoneOrEmail"]');
    // 输入手机号码和密码
    await page.type('.input-group input[name="loginPhoneOrEmail"]', '15000000000');
    await page.type('.input-group input[name="loginPassword"]', 'codexu666');
    // 点击登录按钮
    await page.click('.panel .btn');
    // 等待验证码 img 标签加载（注意这里还没有加载完成图片）
    await page.waitForSelector('#captcha-verify-image');
    // 调用 evaluate 可以在浏览器中执行代码，最后返回我们需要的滑动距离
    const coordinateShift = await page.evaluate(async () => {
        // 从这开始就是在浏览器中执行代码，已经可以看到我们用熟悉的 querySelector 查找标签
        const image = document.querySelector('#captcha-verify-image') as HTMLImageElement;
        // 创建画布
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        // 等待图片加载完成
        await new Promise((resolve) => {
            image.onload = () => {
                resolve(null);
            };
        });
        // 将验证码图片绘制到画布上
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // 获取画布上的像素数据
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        /**
         * 第一段循环，图片灰度+二值化处理
        * */
        // 将像素数据转换为二维数组，处理灰度、二值化，将像素点转换为0（黑色）或1（白色）
        const data: number[][] = [];
        for (let h = 0; h < image.height; h++) {
            data.push([]);
            for (let w = 0; w < image.width; w++) {
                // ×4 是因为 rgba 4 个值，图片是 jpg 格式，不存在透明，所以我们忽略 a 值
                const index = (h * image.width + w) * 4;
                // 灰度计算公式，如果要实现灰度效果，要把 rgb 结果相加，再赋值到 rgb
                const r = imageData.data[index] * 0.2126;
                const g = imageData.data[index + 1] * 0.7152;
                const b = imageData.data[index + 2] * 0.0722;
                // 这里做二值化处理，如果要展示图片，rgb 赋值 255 或者 0
                if (r + g + b > 100) {
                    data[h].push(1);
                } else {
                    data[h].push(0);
                }
            }
        }
        /**
         * 第二段循环，计算识别的位置
        * */
        // 计算每一列黑白色像素点相邻的个数，找到最多的一列，大概率为缺口位置
        let maxChangeCount = 0;
        let coordinateShift = 0;
        for (let w = 0; w < image.width; w++) {
            let changeCount = 0;
            for (let h = 0; h < image.height; h++) {
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
        return coordinateShift;
    });

    // 你无需理解参数都是什么作用
    function easeOutBounce(t: number, b: number, c: number, d: number) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    }
    // 有了运动轨迹曲线，我们就可以实现拖拽逻辑了：
    this.handleDrag = async () =>{
        const drag = await page.$('.secsdk-captcha-drag-icon');
        const dragBox = await drag.boundingBox();
        const dragX = dragBox.x + dragBox.width / 2 + 2;
        const dragY = dragBox.y + dragBox.height / 2 + 2;

        await page.mouse.move(dragX, dragY);
        await page.mouse.down();
        await page.waitForTimeout(300);

        // 定义每个步骤的时间和总时间
        const totalSteps = 100;
        const stepTime = 5;

        for (let i = 0; i <= totalSteps; i++) {
            // 当前步骤占总时间的比例
            const t = i / totalSteps;
            // 使用easeOutBounce函数计算当前位置占总距离的比例
            const easeT = easeOutBounce(t, 0, 1, 1);

            const newX = dragX + coordinateShift * easeT - 5;
            const newY = dragY + Math.random() * 10;

            await page.mouse.move(newX, newY, { steps: 1 });
            await page.waitForTimeout(stepTime);
        }
        // 松手前最好还是等待一下，这也很符合真实操作
        await page.waitForTimeout(800);
        await page.mouse.up();

        try {
            // 等待校验成功的元素出现，原博主写的是 captcha_verify_message-success，我试的时候已经变成pass了
            await page.waitForSelector('.captcha_verify_message-pass', {
                timeout: 1000,
            });
        } catch (error) {
            await page.waitForTimeout(500);
            // 再次执行上面的代码
            await this.handleDrag();
        }
    }
    await this.handleDrag();
})();
