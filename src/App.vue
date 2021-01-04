<template>
  <div id="app">
    <!-- <div class="bg">
      <img src="/picture/background@x3.png" alt="背景图"/>
    </div> -->
    <div class="welcome" v-if="pageIndex == 0">
      <img class="title" src="/picture/title0@x3.png" alt="magic draw"/>
      <img class="machine" src="/picture/machine@x3.png" alt="machine"/>
      <img class="decor" src="/picture/decoration1@x3.png" alt="decoration"/>
      <img class="bottom-info" src="/picture/infobottom1@x3.png" alt="info bottom"/>
      <img class="btn" @click="next" src='/picture/try-normal@x3.png' alt="try now"/>
    </div>
    <div class="shoot" v-show="pageIndex >= 1 && pageIndex <= 4">
      <div id="inputTextSvg" width="80%" height="200px"></div>
      <div class="show" v-show="true">
        <canvas id="canvas" width="1080px" height="1920px" />
      </div>
      <video
        id="videoel"
        preload="auto"
        autoPlay
      ></video>
      <img class="title" :src="'/picture/title'+pageIndex+'@x3.png'" alt="magic draw"/>
      <img class="machine" src="/picture/machine@x3.png" alt="machine"/>
      <img class="count" v-if="count<=3 && count >= 1" :src="'/picture/count'+count+'@x3.png'"/>
      <div id="overlay"></div>
      <div class="input-container" v-show="pageIndex == 3">
        <input
          :value="input"
          class="input"
          @input="onInputChange"
          placeholder="输入名字"
        >
        <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
      </div>
      <img class="btn"  @click="next" :src="'/picture/btn'+pageIndex+'@x3.png'" alt="button"/>
      <img class="back-btn"  @click="back" src="/picture/back-normal@x3.png" alt="button"/>
      <img class="bottom-info" src="/picture/infobottom1@x3.png" alt="info bottom"/>
    </div>
    <div id="paint" v-if="pageIndex >= 4" :style="pageIndex==5?'transform: scale(0.8); transform-origin: 50% 35%;':''"></div>
    <div class="thanks" v-show="pageIndex == 5">
      <img class="title" src="/picture/title5@x3.png" alt="magic draw"/>
      <img class="machine" src="/picture/machine@x3.png" alt="machine"/>
      <img class="btn"  @click="next" src='/picture/try-normal@x3.png' alt="try now"/>
      <!-- <div class="qrcode-container"> -->
        <canvas id="qrcode"></canvas>
      <!-- </div> -->
      <img class="bottom-info" src="/picture/infobottom2@x3.png" alt="info bottom"/>
    </div>
    
    <!--
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
    </div> -->
  </div>
</template>

<script>
import SimpleKeyboard from './components/SimpleKeyboard.vue'
import QRCode from "qrcode";
import { SVG } from "@svgdotjs/svg.js";
// eslint-disable-next-line no-unused-vars
import { WebGLImageFilter } from "./lib/webgl-image-filter";
// import tracking from "./lib/tracking.js";
import tracking, { ObjectTracker } from './lib/tracking';
import "./lib/face-min.js";

export default {
  name: "App",
  components: {
    SimpleKeyboard
  },
  data() {
    return {
      pageIndex: 0,
      isInputing: true,
      // 包含text的svg对象
      textSvgObj: null,
      // text元素对象
      textObj: null,
      textWidth: 0,
      textHeight: 0,
      // input的值
      input: "",
      count: 4,
      videoObj: null,
      maxHeight: 500,
      xmlDoc: null,
    };
  },
  methods: {
    next(){
      this.pageIndex += 1;
      if(this.pageIndex >= 6){
        // document.getElementById("draw").remove();
        // document.getElementById("videoel").style.display="block";
        location.reload();
        this.pageIndex -= 6;
      }
      switch(this.pageIndex){
        case 2:{
          this.takePhoto()
          break
        }
        case 3:{
          // 显示键盘，输入文字
        }
        case 4:{
          this.drawSvg();
          break
        }
        case 5:{
          let paint = document.getElementById("paint")
          paint.style="transform: scale(0.8); transform-origin: 50% 80%;"
          // 绘制二维码并显示
          this.makeCode();
          break
        }
      }
      // document.getElementsByClassName("machine")[0].style="transform: scale(1.22)"
    },
    back(){
      this.pageIndex -= 1;
      if(this.pageIndex == 2){
        this.pageIndex -=1;
        document.getElementById("videoel").play()
      }
    },
    setText() {
      // console.log(e)
      // this.input = document
      //   .getElementsByTagName("input")[0]
      //   .value.toUpperCase();
      if (this.textObj == null) {
        this.textObj = this.textSvgObj.text(this.input);
      } else {
        this.textObj.clear();
        this.textObj.text(this.input);
      }

      let rect = this.textObj.node.getBoundingClientRect();
      this.textWidth = rect.width;
      this.textHeight = rect.height;
      // this.textHeight = 100
    },
    takePhoto() {
      // this.drawPhoto()
      // 显示倒计时
      this.count = 3;
      // 更新倒计时
      let intervalId = setInterval(() => {
        this.count -= 1;
        if (this.count <= 0) {
          // 闪光灯动效
          let overlay = document.getElementById("overlay");
          overlay.style.display = "block";
          setTimeout(() => {
            overlay.style.display = "none";
          }, 500);

          // 停止倒计时
          clearInterval(intervalId);
          this.count = 4;

          // 停止播放视频流并获取当前画面的base64
          this.videoObj.pause();
          // eslint-disable-next-line no-unused-vars
          let base64 = this.drawPhoto();
          this.getFaceLocation();
          // console.log(base64)
          // 调用api，并绘制svg
          this.getSvg(base64);
          this.next()
        }
      }, 1000);
    },
    drawSvg() {
      // 如果数据还没获取到，每0.5s尝试一次
      if(this.xmlDoc == null){
        setTimeout(()=>{
          this.drawSvg()
        },500)
        return
      }
      let collection = this.xmlDoc.getElementsByTagName("rect");
      let draw = SVG().addTo("#paint").size("100%", "100%");
      draw.attr("id","draw")
      document.getElementById("videoel").style.display="none";
      for (let i = 0; i < collection.length; i++) {
        setTimeout(() => {
          document.getElementsByClassName("show")[0].style.opacity=i/collection.length;
          this.addRect(draw, collection, i);
        }, 50 * i);
      }
      this.xmlDoc = null;
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

      let ratio = 1150 / this.maxHeight;
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

      let text = this.textObj == null ? "LENOVO" : this.textObj.text();
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
      var constraints = { audio: false, video: { width: 810, height: 1080 } };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
          this.videoObj.srcObject = mediaStream;
          this.videoObj.onloadedmetadata = (e) => {
            // console.log(e);
            this.videoObj.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        }); // 总是在最后检查错误
    },
    drawPhoto() {
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
      // console.log(targetWidth,targetHeight)
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
        filter = new WebGLImageFilter({ canvas: filteredCanvas });
      } catch (err) {
        console.log(err);
      }

      // 调整图像参数
      // filter.addFilter('hue', 180);
      filter.addFilter("brightness", 0.2);
      filter.addFilter("contrast", 0.3);
      filter.addFilter("saturation", -0.3);
      filter.apply(canvas);

      return filteredCanvas.toDataURL("image/png", 1);
    },
    makeCode() {
      let qrcode = document.getElementById("qrcode");
      // console.log(qrcode)
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
        // console.log(res);
        this.xmlDoc = this.xmlParse(res.data.data);
      });
    },
    getFaceLocation() {
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
      context.drawImage(document.getElementById('canvas'), 0, 0, targetWidth, targetHeight);

      var tracker = new window.tracking.ObjectTracker("face");
      // const tracker = new window.tracking.ObjectTracker("face");
      tracker.setStepSize(1.7);
      // console.log(img)
      tracking.track(canvas, tracker);

      tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          console.log(rect)
          // window.plot(rect.x, rect.y, rect.width, rect.height);
        });
      });
    },
    getCompetence() {
      let flag = true;
      const _this = this;
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");

      const tracker = new window.tracking.ObjectTracker("face");
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      // 启动摄像头初始化
      this.trackerTask = window.tracking.track("#canvas", tracker);
      tracker.on("track", function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function (rect) {
          context.strokeStyle = "#ff0000";
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
      });
    },
    onChange(input) {
      this.input = input.toUpperCase();
      this.setText()
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      // this.input = input.target.value.toUpperCase();
      this.input = input.target.value;
      this.setText()
    }
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
  background: transparent url(/picture/background@x3.png) center center no-repeat;
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
.shoot #inputTextSvg {
  position: fixed;
  bottom: 10%;
  left: 11%;
}
.input-page button {
  /* display: block; */
  width: 15%;
  font-size: 60px;
  height: 100px;
  position: relative;
}
#videoel {
  transform: scale(1.065);
  transform-origin: 50% -250%;
}
.show {
  position: fixed;
  left: 10.09%;
  top: 10%;
  width: 862px;
  height: 1150px;
  opacity: 0;
}
#canvas {
  width: 862px;
  height: 1150px;
}
#overlay {
  position: fixed;
  width: 862px;
  height: 1150px;
  left: 10.09%;
  top: 10%;
  background: rgba(255, 255, 255, 0.5);
  display: none;
  /* z-index: 10; */
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
  margin-block-next: 0;
}
#qrcode {
  position: fixed;
  /* display: inline; */
  left: 40.74%;
  bottom: 4%;
  width: 200px !important;
  height: 200px !important;
}
#paint {
  position: fixed;
  width: 79.815%;
  height: 59.896%;
  left: 10.09%;
  top: 10%;
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
body{
  width: 100%;
  height: 100%;
  margin: 0;
}
.welcome{
  width: 100%;
  height: 100%;
}
.welcome .title{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  /* width: 1080px; */
  /* height: 324px; */
}
.welcome .machine{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
}
.welcome .decor{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
}
.welcome .btn{
  width: 68.8%;
  /* height: 134px; */
  position: fixed;
  bottom: 18%;
  left: 15.6%;
}
.welcome .bottom-info{
  width: 29.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 5%;
  left: 35%;
}
.shoot{
  width: 100%;
  height: 100%;
}
.shoot .title{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  /* width: 1080px; */
  /* height: 324px; */
}
.shoot .machine{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  transition: all 5s ease-out;
  transform: scale(1.22);
  transform-origin: 50% 58%;
}
.shoot .count {
  position: fixed;
  height: 20.26%;
  top: 28%;
  left: 40.555%;
}

.shoot .input-container{
  position: fixed;
  width: 79.815%;
  left: 10.09%;
  bottom: 30%;
}
input {
  text-align: center;
  width: 100%;
  height: 200px;
  padding: 20px;
  font-size: 80px;
  border: none;
  box-sizing: border-box;
}

.simple-keyboard {
  font-size: 32px;
  max-width: 100%;
}

.shoot .btn{
  width: 64.86%;
  /* height: 134px; */
  position: fixed;
  bottom: 12.8%;
  left: 27.2%;
}
.shoot .back-btn{
  width: 19.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 12.8%;
  left: 7.5%;
}
.shoot .bottom-info{
  width: 29.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 1.6%;
  left: 35%;
}
.thanks{
  width: 100%;
  height: 100%;
}
.thanks .title{
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  /* width: 1080px; */
  /* height: 324px; */
}
.thanks .machine{
  position: fixed;
  top: -5%;
  display: block;
  width: 100%;
}
.thanks .btn{
  width: 68.8%;
  /* height: 134px; */
  position: fixed;
  bottom: 23%;
  left: 15.6%;
}
.thanks .bottom-info{
  width: 19.23%;
  /* height: 134px; */
  position: fixed;
  bottom: 1.5%;
  left: 40.385%;
}
</style>
