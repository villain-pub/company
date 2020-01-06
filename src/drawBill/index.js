///api/web/file/download?uuid=9c224123-6c81-3cfc-a0a3-49939197de29
console.log(11)
var Promise = require('es6-promise').Promise;
 export default function drawBill(elementId,imageConfig,scale = 1, callback) {
    var canvas=document.getElementById(elementId);
    let text = canvas.innerHTML;
    var ctx=canvas.getContext("2d");
    let imgsFn = [];
    Object.keys(imageConfig).forEach(key =>{
        imgsFn.push(loadImg(imageConfig[key],key))
    })
    Promise.all(imgsFn).then(res => {
        let bgImg = res[0].image;
        canvas.setAttribute('width', bgImg.width * scale);
        canvas.setAttribute('height', bgImg.height * scale);
        res.forEach(item => {
            drawImg(item.image,item.key)
        });
        drawText();
        callback({data:canvas.toDataURL("image/png")});
    }).catch(err =>{
        callback({error:err})
    });
    function drawImg(img, key) {
        switch (key) {
            case 'bg':
                drawBg(img);
                break;
            case 'avatar':
                drawAvatar(img);
                break;
        }
    }
    function drawBg(img,) {
        ctx.drawImage(img,0,0,img.width ,img.height,0,0,img.width * scale,img.height * scale);
    }
    // 绘制头像
    function drawAvatar(img) {
        let {avatar = {}} = imageConfig;
        // 设置头像默认位置
        let {startX = 1200, startY = 350,radius = 100,height = 200, width = 200} = avatar;
        ctx.beginPath();
        ctx.arc(startX * scale, startY * scale, radius * scale, 0, 2*Math.PI);
        ctx.save();
        // 剪切形状
        ctx.clip();
        let dw = width * scale;
        let dh = height * scale;
        let dx = startX * scale - dw/2;
        let dy = startY * scale - dh/2;
        ctx.drawImage(img, 0, 0, img.width ,img.height,dx, dy, width * scale, height *scale);
        ctx.restore();
        ctx.closePath();
    }
    function drawText() {
        ctx.font=`${200 * scale}px Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text,90 * scale,1000 * scale);
    }
    function loadImg(img,key) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.setAttribute('crossorigin', 'anonymous');
            image.src = img.src;
            image.onload = function () {
                resolve({image,key})
            }
            if(image.complete){
                resolve({image,key})
            }
        })
        
    }
}
