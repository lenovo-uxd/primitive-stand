<template>
  <div id="app">
    <div class="input-page" v-if="isInputing">
      <div id="inputTextSvg" width="80%" height="200px"></div>
      <p>width:{{ textWidth }}</p>
      <p>height:{{ textHeight }}</p>
      <input
        type="text"
        name="diyText"
        @input="setText"
        placeholder="请输入自定义字符"
      />
      <button @click="onConfirm">确认</button>
      <br /><br /><br /><br />
      <div class="input-file">
        <input type="file" @change="previewFile" /><br />
        <img src="" height="200" /><br />
        <button @click="onConfirm2">确认</button>
      </div>
    </div>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div v-show="!isInputing">
      <div class="show" v-show="false">
        <canvas id="canvas" width="1080px" height="1920px" />
      </div>
      <video
        id="videoel"
        v-show="!isQrCodeShow"
        preload="auto"
        autoPlay
      ></video>
      <div id="overlay"></div>
      <div id="paint"></div>
      <div class="photo-btn" @click="takePhoto" v-if="!hasTookPhoto">
        <img src="/take-photo.png" alt="拍照按钮" />
      </div>

      <div class="count" v-show="isCountShow">{{ count }}</div>
      <div class="qrcode-container" v-show="isQrCodeShow">
        <canvas id="qrcode"></canvas>
        <p>扫码下载，立即分享</p>
      </div>
      <div class="loader" v-if="hasTookPhoto && !isCountShow && !isQrCodeShow">
        <div class="loader-inner">
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import QRCode from "qrcode";
import { SVG } from "@svgdotjs/svg.js";
// eslint-disable-next-line no-unused-vars
import { WebGLImageFilter } from './lib/webgl-image-filter'

export default {
  name: "App",
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      isInputing: true,
      // 包含text的svg对象
      textSvgObj: null,
      // text元素对象
      textObj: null,
      textWidth: 0,
      textHeight: 0,
      // input的值
      inputValue: "",
      count: 3,
      isCountShow: false,
      hasTookPhoto: false,
      isQrCodeShow: false,
      videoObj: null,
      maxHeight: 500,
    };
  },
  methods: {
    setText() {
      // console.log(e)
      this.inputValue = document
        .getElementsByTagName("input")[0]
        .value.toUpperCase();
      if (this.textObj == null) {
        this.textObj = this.textSvgObj.text(this.inputValue);
      } else {
        this.textObj.clear();
        this.textObj.text(this.inputValue);
      }

      // console.log(this.textObj.node.outerHTML)
      // console.log(this.textObj.path())
      // console.log(this.textObj.textPath())
      // console.log(this.textObj.node.getBoundingClientRect())
      let rect = this.textObj.node.getBoundingClientRect();
      this.textWidth = rect.width;
      this.textHeight = rect.height;
      // this.textHeight = 100
    },
    onConfirm() {
      this.isInputing = false;
      // this.setVideoSrc()
    },
    onConfirm2() {
      this.isInputing = false;
      this.hasTookPhoto = true;
      this.isCountShow = false;
      this.videoObj.style.display = "none";
      let base64 = document.querySelector("img").src;
      this.getSvg(base64);
      // this.setVideoSrc()
    },
    takePhoto() {
      // this.drawCanvas()
      // 隐藏拍照按钮
      this.hasTookPhoto = true;
      // 显示倒计时
      this.isCountShow = true;
      // 更新倒计时
      let intervalId = setInterval(() => {
        this.count -= 1;
        if (this.count <= 0) {
          // 闪光灯动效
          let overlay = document.getElementById("overlay");
          overlay.style.display = "block";
          setTimeout(() => {
            overlay.style.display = "none";
          }, 150);

          // 停止倒计时
          this.isCountShow = false;
          clearInterval(intervalId);
          this.count = 3;

          // 停止播放视频流并获取当前画面的base64
          this.videoObj.pause();
          // eslint-disable-next-line no-unused-vars
          let base64 = this.drawCanvas();
          // console.log(base64)
          // 调用api，并绘制svg
          this.getSvg(base64);
        }
      }, 1000);
    },
    drawSvg(xmlDoc) {
      let collection = xmlDoc.getElementsByTagName("rect");
      let draw = SVG().addTo("#paint").size("100%", "100%");

      for (let i = 0; i < collection.length; i++) {
        setTimeout(() => {
          this.addRect(draw, collection, i);
        }, 50 * i);
      }
    },
    addRect(draw, collection, i) {
      // console.log(i)
      let x = parseFloat(collection[i].attributes.x.value);
      let y = parseFloat(collection[i].attributes.y.value);
      let width = parseFloat(collection[i].attributes.width.value);
      let height = parseFloat(collection[i].attributes.height.value);
      let fill = collection[i].attributes.fill.value;
      // eslint-disable-next-line no-unused-vars
      let fill_opacity = collection[i].attributes["fill-opacity"].value;
      // eslint-disable-next-line no-unused-vars
      let length = collection.length;

      // let ratio1_h = width / 878;
      // let ratio2_h = height / 146;

      // let ratio1_v = width / 121;
      // let ratio2_v = height / 722;

      // y -= this.textHeight*0.09;

      let ratio1_h = width / this.textWidth;
      let ratio2_h = height / this.textHeight;
      // let ratio2_h = height / (this.textHeight*0.82);

      // let ratio1_v = width / (this.textHeight*0.82);
      let ratio1_v = width / this.textHeight;
      let ratio2_v = height / this.textWidth;

      let ratio = 1920 / this.maxHeight;
      x *= ratio;
      y *= ratio;
      width *= ratio;
      height *= ratio;
      ratio1_h *= ratio;
      ratio1_v *= ratio;
      ratio2_h *= ratio;
      ratio2_v *= ratio;

      let rect = draw.rect({
        width: width,
        height: height,
        x: x,
        y: y,
      });
      rect.attr("id", "rect" + i);
      rect.attr("fill-rule", "nonzero");

      let group = draw.group();
      group.attr("id", "rect" + i);
      group.attr("fill-rule", "nonzero");

      rect.attr("fill", fill);
      rect.attr("fill-opacity", 0.1);

      group.attr("fill", fill);
      group.attr("fill-opacity", 0.4 + i / length / 5);

      let text = this.textObj.text() == "" ? "LENOVO" : this.textObj.text();
      group.plain(text);

      if (width > height) {
        // 水平
        group.attr(
          "transform",
          "translate(" +
            x +
            "," +
            (y + height * 0.82) +
            ") scale(" +
            ratio1_h +
            "," +
            ratio2_h +
            ")"
        );
      } else {
        // 垂直
        group.attr(
          "transform",
          "translate(" +
            x +
            "," +
            y +
            ") scale(" +
            ratio1_v +
            "," +
            ratio2_v +
            ") rotate(90)"
        );
      }
    },
    setVideoSrc() {
      // 想要获取一个最接近 1280x720 的相机分辨率
      var constraints = { audio: false, video: { width: 608, height: 1080 } };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
          this.videoObj.srcObject = mediaStream;
          this.videoObj.onloadedmetadata = (e) => {
            console.log(e);
            this.videoObj.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        }); // 总是在最后检查错误
    },
    drawCanvas() {
      let rect = this.videoObj.getBoundingClientRect();
      let vid_width = rect.width;
      let vid_height = rect.height;
      // 压缩图片
      // 最大尺寸限制
      const maxWidth = this.maxHeight;
      const maxHeight = this.maxHeight;
      // 需要压缩的目标尺寸
      let targetWidth = vid_width,
        targetHeight = vid_height;
      // 等比例计算超过最大限制时缩放后的图片尺寸
      if (vid_width > maxWidth || vid_height > maxHeight) {
        if (vid_width / vid_height > 1) {
          // 宽图片
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (vid_height / vid_width));
        } else {
          // 高图片
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (vid_width / vid_height));
        }
      }
      // 创建画布
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // 设置宽高度为等同于要压缩图片的尺寸
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight);
      //将img绘制到画布
      context.drawImage(this.videoObj, 0, 0, targetWidth, targetHeight);

      let filter = null;
      let filteredCanvas = document.getElementById("canvas");
      try {
        // in this case, filteredImage is an existing html canvas
        filter = new WebGLImageFilter({canvas: filteredCanvas});
        console.log(filter)
      }
      catch( err ) {
        console.log(err)
       }

      // .. filters setup here
      // filter.addFilter('hue', 180);
      filter.addFilter('brightness', 0.2);
      filter.addFilter('contrast', 0.3);
      filter.addFilter('saturation', -0.3);
      filter.apply(canvas); 
      // let filteredImage = filter.apply(canvas); 
      // console.log(filteredImage)



      // hue,保留了底层的亮度（luma）和色度（chroma），同时采用了顶层的色调（hue）。
      // saturation,保留底层的亮度（luma）和色调（hue），同时采用顶层的色度（chroma）。
      // color,保留了底层的亮度（luma），同时采用了顶层的色调(hue)和色度(chroma)。
      // luminosity,保持底层的色调（hue）和色度（chroma），同时采用顶层的亮度（luma）。

      // 调整饱和度
      // context.globalCompositeOperation = "saturation";
      // context.fillStyle = "hsl(0,10%,50%)";
      // context.fillRect(0, 0, targetWidth, targetHeight); // apply the comp filter
      // 调整亮度
      // context.globalCompositeOperation = "luminosity";
      // context.fillStyle = "hsl(0,100%,100%)"; 
      // context.fillRect(0, 0, targetWidth, targetHeight); // apply the comp filter
      // 调整色调
      // context.globalCompositeOperation = "hue";
      // context.fillStyle = "hsl(100%,0,0)"; // saturation at 100%
      // context.fillRect(0, 0, targetWidth, targetHeight); // apply the comp filter

      // context.globalCompositeOperation = "source-over"; // restore default comp
      // 获取画布上的图像像素矩阵
      // 获取到的数据为一维数组，包含图像的RGBA四个通道数据
      // var imgData = context.getImageData(0,0,canvas.width,canvas.height).data;
      // console.log(imgData)
      // var imgArr = [];
      // for (var i = 0; i < imgData.length; i += 4) {
      //   imgArr.push(imgData[i], imgData[i + 1], imgData[i + 2]);
      // }
      // console.log(imgArr)
      return filteredCanvas.toDataURL("image/png", 1);
    },
    makeCode() {
      let qrcode = document.getElementById("qrcode");
      let url = "http://xiaohui.ai";
      QRCode.toCanvas(qrcode, url, function (error) {
        if (error) console.error(error);
        // console.log('success!');
      });
    },
    xmlParse(text) {
      let xmlDoc = null;
      let parser = null;
      try {
        //Internet Explorer
        // eslint-disable-next-line no-undef
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(text);
      } catch (e) {
        try {
          //Firefox, Mozilla, Opera, etc.
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(text, "text/xml");
        } catch (e) {
          alert(e.message);
        }
      }
      // console.log(xmlDoc);
      return xmlDoc;
      // let errorMessage = xmlDoc.getElementsByTagName("ErrorMessage")[0]
      //   .textContent;
      // let printVersion = xmlDoc.getElementsByTagName("PrintVersion")[0]
      //   .textContent;

      // let objDate = {};
      // objDate.errorInfo = errorMessage;
      // objDate.versionInfo = printVersion;
      // console.log(objDate);
      // return objDate;
    },
    previewFile() {
      var preview = document.querySelector("img");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();

      reader.onloadend = function () {
        preview.src = reader.result;
        // console.log(preview.src);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }
    },
    getSvg(base64) {
      var settings = {
        url: "http://localhost:3000/getsvg",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ data: base64 }),
      };
      this.$ajax(settings).then((res) => {
        console.log(res);
        let xmlDoc = this.xmlParse(res.data.data);
        this.drawSvg(xmlDoc);
        // 绘制二维码并显示
        this.makeCode();
        this.isQrCodeShow = true;
      });
    },
  },
  mounted: function () {
    // let ratio = this.getRatio()
    // console.log(ratio)
    this.videoObj = document.getElementById("videoel");
    this.textSvgObj = SVG().addTo("#inputTextSvg").size("100%", "100%");
    this.setVideoSrc();
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
  font-size: 100px;
  font-weight: bold;
  font-family: fantasy;
  /* margin-top: 60px; */
  /* height: 100%;
  width: 100%;
  position: absolute; */
}
.input-page {
  /* font-size: 100px; */
  width: 100%;
  height: 100%;
  position: absolute;
}
.input-page div {
  width: 100%;
  height: 200px;
  position: relative;
}
.input-page input {
  /* display: block; */
  width: 71%;
  height: 100px;
  font-size: 62px;
  position: relative;
}
.input-page button {
  /* display: block; */
  width: 15%;
  font-size: 60px;
  height: 100px;
  position: relative;
}
#videoel {
  /* -o-transform: scale(-1.2, 1.2);
  -webkit-transform: scale(-1.2, 1.2);
  transform: scale(-1.2, 1.2);
  -ms-filter: fliph;
  filter: fliph; */
  /* position: absolute;
  width: 1280px;
  height: 720px;
  left: 0;
  top: 0;
  object-fit: fill;
  z-index: 0;
  transform: scale(4.7); */
  /*IE*/
  /*visibility: hidden;*/
  /* display: none; */
  /* position: relative;
  top:70px; */
  /* position: fixed;
  left: 0;
  top: 0; */
  transform: scale(1.78,1.78);
  transform-origin: center 0 0;
}
.show {
  position: fixed;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1920px;
}
#canvas {
  width: 1080px;
  height: 1920px;
}
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.3);
  display: none;
  /* z-index: 10; */
}
.photo-btn {
  position: fixed;
  bottom: 10%;
  width: 100%;
  /* height: 100px; */
  /* fill: antiquewhite; */
  text-align: center;
}
.count {
  position: fixed;
  top: 30%;
  font-size: 500px;
  color: rgb(190, 11, 11);
  text-align: center;
  width: 100%;
}
.qrcode-container {
  position: fixed;
  right: 20px;
  bottom: 30px;
  padding: 5px;
  background: white;
}
.qrcode-container p {
  font-size: 25px;
  margin-block-start: 0;
}
#qrcode {
  width: 300px !important;
  height: 300px !important;
}
#paint {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.loader {
  /* background: #000; */
  /* background: radial-gradient(#222, #000); */
  /* background: rgba(255, 255, 255, 0.8); */
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 99999;
}

.loader-inner {
  bottom: 0;
  height: 60px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
}

.loader-line-wrap {
  animation: spin 2000ms cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
  box-sizing: border-box;
  height: 50px;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  transform-origin: 50% 100%;
  width: 100px;
}
.loader-line {
  border: 4px solid transparent;
  border-radius: 100%;
  box-sizing: border-box;
  height: 100px;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
}
.loader-line-wrap:nth-child(1) {
  animation-delay: -50ms;
}
.loader-line-wrap:nth-child(2) {
  animation-delay: -100ms;
}
.loader-line-wrap:nth-child(3) {
  animation-delay: -150ms;
}
.loader-line-wrap:nth-child(4) {
  animation-delay: -200ms;
}
.loader-line-wrap:nth-child(5) {
  animation-delay: -250ms;
}

.loader-line-wrap:nth-child(1) .loader-line {
  border-color: hsl(0, 80%, 60%);
  height: 90px;
  width: 90px;
  top: 7px;
}
.loader-line-wrap:nth-child(2) .loader-line {
  border-color: hsl(60, 80%, 60%);
  height: 76px;
  width: 76px;
  top: 14px;
}
.loader-line-wrap:nth-child(3) .loader-line {
  border-color: hsl(120, 80%, 60%);
  height: 62px;
  width: 62px;
  top: 21px;
}
.loader-line-wrap:nth-child(4) .loader-line {
  border-color: hsl(180, 80%, 60%);
  height: 48px;
  width: 48px;
  top: 28px;
}
.loader-line-wrap:nth-child(5) .loader-line {
  border-color: hsl(240, 80%, 60%);
  height: 34px;
  width: 34px;
  top: 35px;
}

@keyframes spin {
  0%,
  15% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
