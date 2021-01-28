<template>
  <div id="app">
    <div id="inputTextSvg" width="80%" height="200px"></div>
    <div
      :class="
        pageIndex == 0 || pageIndex == 5 ? 'show' + pageIndex : 'show1234'
      "
    >
      <canvas id="canvas" width="1080px" height="1920px" />
    </div>
    <video
      :class="
        pageIndex == 0 || pageIndex == 5 ? 'screen' + pageIndex : 'screen1234'
      "
      preload="auto"
      src="/video/screen.mp4"
      autoplay
      loop
      muted
    />
    <video
      id="videoel"
      :class="
        pageIndex == 0 || pageIndex == 5 ? 'video' + pageIndex : 'video1234'
      "
      preload="auto"
      autoPlay
    ></video>
    <img
      class="title"
      :src="'/picture/title' + pageIndex + '@x3.png'"
      alt="magic draw"
    />
    <div
      id="paint"
      v-show="pageIndex >= 4"
      :style="
        pageIndex == 5
          ? 'transform: scale(0.8); transform-origin: 50% 35%;'
          : ''
      "
    ></div>
    <img
      class="decor-bottom"
      src="/picture/decor-bottom.png"
      v-show="pageIndex == 0"
    />
    <img
      :class="
        pageIndex == 0 || pageIndex == 5 ? 'machine' + pageIndex : 'machine1234'
      "
      src="/picture/machine@x3.png"
      alt="machine"
    />
    <img
      class="decor-top"
      src="/picture/decor-top.png"
      v-show="pageIndex == 0"
    />
    <img
      class="count"
      v-if="count <= 3 && count >= 1"
      :src="'/picture/count' + count + '@x3.png'"
    />
    <div id="overlay"></div>
    <div class="input-container" v-show="pageIndex == 3">
      <input
        id="input"
        :value="input"
        class="input"
        @input="onInputChange"
        placeholder="输入名字"
        autocomplete="off"
      />
      <SimpleKeyboard
        @onChange="onChange"
        @onKeyPress="onKeyPress"
        :input="input"
      />
    </div>
    <img
      :class="
        pageIndex == 0 || pageIndex == 5
          ? 'bottom-info' + pageIndex
          : 'bottom-info1234'
      "
      :src="'/picture/infobottom' + pageIndex + '@x3.png'"
      alt="info bottom"
    />
    <canvas v-show="pageIndex == 5" id="qrcode"></canvas>
    <img
      :class="
        pageIndex == 0 || pageIndex == 5 ? 'btn0' + pageIndex : 'btn01234'
      "
      @click="next"
      :src="'/picture/btn0' + pageIndex + '@x3.png'"
      alt="button"
    />
    <img
      :class="
        pageIndex == 0 || pageIndex == 5
          ? 'back-btn' + pageIndex
          : 'back-btn1234'
      "
      @click="back"
      src="/picture/back-normal@x3.png"
      alt="button"
    />
    <img
      :class="pageIndex == 0 || pageIndex == 5 ? 'btn' + pageIndex : 'btn1234'"
      @click="next"
      :src="'/picture/btn' + pageIndex + '@x3.png'"
      alt="button"
    />

    <div v-show="false">
      <audio id="button-audio" src="/audio/button.mp3" preload />
      <audio id="count-audio" src="/audio/count.mp3" preload />
      <audio id="keyboard-audio" src="/audio/keyboard.mp3" preload />
      <audio id="shoot-audio" src="/audio/shoot.mp3" preload />
    </div>
  </div>
</template>

<script>
import SimpleKeyboard from "./components/SimpleKeyboard.vue";
import QRCode from "qrcode";
import { SVG } from "@svgdotjs/svg.js";
// eslint-disable-next-line no-unused-vars
import { WebGLImageFilter } from "./lib/webgl-image-filter";
// import tracking from "./lib/tracking.js";
// import tracking from "./lib/tracking-min.js";
// import "./lib/face-min.js";
// import {GIF,URL} from "./lib/gif.js";
import axios from "axios";
const CancelToken = axios.CancelToken;

export default {
  name: "App",
  components: {
    SimpleKeyboard,
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
      cancelAjax: null,
    };
  },
  methods: {
    next(e) {
      if (this.pageIndex == 4) {
        return;
      }
      document.getElementById("button-audio").play();
      this.pageIndex += 1;
      if (this.pageIndex >= 6) {
        // document.getElementById("draw").remove();
        // document.getElementById("videoel").style.display="block";
        // location.reload();
        this.pageIndex -= 6;
      }
      switch (this.pageIndex) {
        case 0: {
          document.getElementById("paint").innerHTML = "";
          document.getElementById("videoel").style.opacity = 0;
          this.$nextTick(function () {
            // DOM 现在更新了
            // `this` 绑定到当前实例
            document.getElementsByClassName("show0")[0].style.opacity = 0;
            document.getElementsByClassName("btn00")[0].style.opacity = 1;
            document.getElementsByClassName("btn0")[0].style.display = "none";
            document.getElementsByClassName("back-btn0")[0].style.display =
              "none";
          });
          // console.log(document.getElementsByClassName("show")[0])

          this.input = "";
          break;
        }
        case 1: {
          document.getElementById("videoel").play();
          document.getElementById("videoel").style.opacity = 1;
          setTimeout(() => {
            document.getElementsByClassName("btn1234")[0].style.display =
              "block";
            document.getElementsByClassName("back-btn1234")[0].style.display =
              "block";
            document.getElementsByClassName("btn01234")[0].style.opacity = 0;
          }, 900);
          break;
        }
        case 2: {
          let btn = e.target;
          setTimeout(() => {
            btn.src = "/picture/btn1-pressed@x3.png";
          }, 50);

          setTimeout(() => {
            btn.src = "/picture/btn2@x3.png";
          }, 200);
          this.takePhoto();
          break;
        }
        case 3: {
          // 显示键盘，输入文字

          location.replace("tabkey:");
          setTimeout(() => {
            document.getElementById("input").focus();
          }, 5000);

          break;
        }
        case 4: {
          let btn = e.target;
          setTimeout(() => {
            btn.src = "/picture/btn3-pressed@x3.png";
          }, 50);
          setTimeout(() => {
            btn.src = "/picture/btn4@x3.png";
          }, 200);
          this.drawSvg();
          break;
        }
        case 5: {
          // let paint = document.getElementById("paint");
          // paint.style = "transform: scale(0.8); transform-origin: 50% 80%;";
          // // 绘制二维码并显示
          // this.makeCode();
          break;
        }
      }
      // document.getElementsByClassName("machine")[0].style="transform: scale(1.22)"
    },
    back(e) {
      let btn = e.target;
      setTimeout(() => {
        btn.src = "/picture/back-pressed@x3.png";
      }, 50);
      setTimeout(() => {
        btn.src = "/picture/back-normal@x3.png";
      }, 200);
      document.getElementById("button-audio").play();
      if (this.pageIndex == 4) {
        return;
      }
      this.pageIndex -= 1;
      switch (this.pageIndex) {
        case 0: {
          document.getElementById("paint").innerHTML = "";
          document.getElementById("videoel").style.opacity = 0;
          document.getElementsByClassName("btn1234")[0].style.display = "none";
          document.getElementsByClassName("back-btn1234")[0].style.display =
            "none";
          document.getElementsByClassName("btn01234")[0].style.opacity = 1;
          this.$nextTick(function () {
            // DOM 现在更新了
            // `this` 绑定到当前实例
            document.getElementsByClassName("show0")[0].style.opacity = 0;
            document.getElementsByClassName("btn00")[0].style.opacity = 1;
          });
          this.input = "";
          break;
        }
        case 1: {
          this.input = "";
          document.getElementById("videoel").play();
          document.getElementById("videoel").style.opacity = 1;
          if (typeof this.cancelAjax === `function`) {
            this.cancelAjax();
            this.cancelAjax = null;
          }
          if (this.xmlDoc != null) {
            this.xmlDoc = null;
          }
          break;
        }
        case 2: {
          this.pageIndex -= 1;
          this.input = "";
          document.getElementById("videoel").play();
          if (typeof this.cancelAjax === `function`) {
            this.cancelAjax();
            this.cancelAjax = null;
          }
          if (this.xmlDoc != null) {
            this.xmlDoc = null;
          }
          break;
        }
        case 3: {
          // 显示键盘，输入文字
          break;
        }
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
      document.getElementById("count-audio").play();
      // 更新倒计时
      let intervalId = setInterval(() => {
        document.getElementById("count-audio").play();
        this.count -= 1;
        if (this.count <= 0) {
          // 闪光灯动效
          let overlay = document.getElementById("overlay");
          overlay.style.display = "block";
          document.getElementById("shoot-audio").play();
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
          this.next();
        }
      }, 1000);
    },
    drawSvg() {
      // 如果数据还没获取到，每0.5s尝试一次
      if (this.xmlDoc == null) {
        setTimeout(() => {
          this.drawSvg();
        }, 500);
        return;
      }
      let collection = this.xmlDoc.getElementsByTagName("rect");
      let draw = SVG().addTo("#paint").size("100%", "100%");
      draw.attr("id", "draw");
      document.getElementById("videoel").style.opacity = 0;
      if (this.textObj == null || this.input == "") {
        this.input = "LENOVO";
        this.setText();
      }
      for (let i = 0; i < collection.length; i++) {
        setTimeout(() => {
          document.getElementsByClassName("show1234")[0].style.opacity =
            i / collection.length;
          this.addRect(draw, collection, i);
        }, 50 * i);
      }
      setTimeout(() => {
        this.pageIndex += 1;
        let paint = document.getElementById("paint");
        paint.style = "transform: scale(0.8); transform-origin: 50% 80%;"; // 绘制二维码并显示
        this.$nextTick(() => {
          document.getElementsByClassName("back-btn5")[0].style.display =
            "none";
        });

        this.makeCode();
      }, 50 * collection.length);
      this.xmlDoc = null;
      this.drawGif(collection.length);
    },
    drawGif(length) {
      // console.log(typeof GIF)
      var img = new Image();
      var gif = new GIF({
              workers: 2,
              quality: 10,
            });
      // for (let i = 0; i < length; i+=10) {
        setTimeout(() => {
          var svg = document.getElementById("paint").children[0].innerHTML;
          // console.log(svg);

          //svg内容
          // img.src = "data:image/svg+xml," + unescape(encodeURIComponent(svg)); //svg内容中可以有中文字符
          img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));//svg内容中可以有中文字符
          console.log(img);
          img.onload = () => {
            console.log("on;oa")
            document.body.appendChild(img)
            // add an image element
            gif.addFrame(img, {delay: 50});

            // or a canvas element
            // gif.addFrame(paint);

            // or copy the pixels from a canvas context
            // gif.addFrame(ctx, {copy: true});

            gif.on("finished", function (blob) {
              console.log("finished")
              window.open(URL.createObjectURL(blob));
            });

            gif.render();
          };
        }, 500);
      // }
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

      let text = this.textObj.text();
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
      // var constraints = { audio: false, video: { width: 360, height: 480 } };

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
      let _this = this;
      var settings = {
        url: "http://localhost:3000/getsvg",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ data: base64 }),
        cancelToken: new CancelToken(function executor(c) {
          _this.cancelAjax = c;
        }),
      };
      axios(settings).then((res) => {
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
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      // canvas.setAttribute("id","face-location")
      // document.getElementById("app").appendChild(canvas)
      // 设置宽高度为等同于要压缩图片的尺寸
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight);
      //将img绘制到画布
      context.drawImage(
        document.getElementById("canvas"),
        0,
        0,
        targetWidth,
        targetHeight
      );

      var tracker = new window.tracking.ObjectTracker("face");
      // const tracker = new window.tracking.ObjectTracker("face");
      // tracker.setStepSize(1.7);
      // console.log(img)
      window.tracking.track(canvas, tracker);
      console.log(window.tracking);
      tracker.on("track", function (event) {
        console.log(event);
        event.data.forEach(function (rect) {
          console.log(rect);
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
      document.getElementById("keyboard-audio").play();
      this.setText();
    },
    onKeyPress(button) {
      console.log("button", button);
    },
    onInputChange(input) {
      // this.input = input.target.value.toUpperCase();
      this.input = input.target.value;
      this.setText();
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
  transition: all 1s;
  background: transparent url(/picture/background.png) center center no-repeat;
  /* margin-top: 60px; */
  /* height: 100%;
  width: 100%;
  position: absolute; */
}

#inputTextSvg {
  position: fixed;
  bottom: 20%;
  left: 13%;
}
/* #videoel {
  transform: scale(1.065);
  transform-origin: 50% -250%;
} */
.screen0 {
  transition: all 1s;
  width: 63%;
  position: fixed;
  left: 18.5%;
  top: 17%;
}
.screen1234 {
  transition: all 1s;
  width: 78%;
  position: fixed;
  left: 11%;
  top: 9%;
  opacity: 0;
}
.screen5 {
  transition: all 1s;
  width: 63%;
  position: fixed;
  left: 18.5%;
  top: 17%;
  opacity: 0;
}
.video0 {
  transition: all 1s;
  transform: scale(0.9);
  top: 15%;
  left: 13%;
  /* transform-origin: 50% -250%; */
  opacity: 0;
  position: fixed;
}
.video1234 {
  transition: all 1s;
  transform: scale(1.065);
  position: fixed;
  top: 11%;
  left: 12%;
  opacity: 1;
}
.video5 {
  transition: all 1s;
  transform: scale(0.9);
  top: 10%;
  left: 13%;
  /* transform-origin: 50% -250%; */
  opacity: 0;
  position: fixed;
}
.show0 {
  position: fixed;
  left: 10.09%;
  top: 10%;
  width: 862px;
  height: 1150px;
  opacity: 0;
}
.show1234 {
  position: fixed;
  left: 10.09%;
  top: 10%;
  width: 862px;
  height: 1150px;
  opacity: 0;
}
.show5 {
  position: fixed;
  left: 10.09%;
  top: 10%;
  width: 862px;
  height: 1150px;
  opacity: 1;
  transform: scale(0.8);
  transform-origin: 50% 35%;
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
#qrcode {
  position: fixed;
  /* display: inline; */
  left: 40.74%;
  bottom: 4%;
  width: 200px !important;
  height: 200px !important;
}
#paint {
  transition: all 1s;
  position: fixed;
  width: 79.815%;
  height: 59.896%;
  left: 10.09%;
  top: 10%;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
}
.container {
  width: 100%;
  height: 100%;
}

.decor-top {
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
}
.decor-bottom {
  position: fixed;
  bottom: 0;
  display: block;
  width: 100%;
}

.title {
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  /* width: 1080px; */
  /* height: 324px; */
}
.machine0 {
  transition: all 1s;
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
}
.machine1234 {
  position: fixed;
  top: 0;
  display: block;
  width: 100%;
  /* transform-origin: 50% 58%; */
  transition: all 1s;

  transform: scale(1.22) translateY(-2%);
  /* transform-origin: 50% 58%; */
}
.machine5 {
  transition: all 1s;
  position: fixed;
  top: -5%;
  display: block;
  width: 100%;
}
.count {
  position: fixed;
  /* height: 20.26%; */
  width: 36.02%;
  top: 28%;
  left: 31.99%;
}

.input-container {
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
  background: black;
  color: white;
  opacity: 0.7;
}

.simple-keyboard {
  font-size: 32px;
  max-width: 100%;
  background: black;
}
.hg-theme-default .hg-button {
  background: black;
  color: cadetblue;
}
.btn00 {
  transition-property: width, left, bottom, position;
  transition-duration: 1s, 1s, 1s, 1s;
  width: 68.8%;
  /* height: 134px; */
  position: fixed;
  bottom: 18%;
  left: 15.6%;
  /* opacity: 1; */
}
.btn01234 {
  transition: all 1s;
  width: 85%;
  /* height: 134px; */
  position: fixed;
  bottom: 13.5%;
  left: 7.5%;
  /* opacity: 0; */
}
.btn05 {
  transition: all 1s;
  position: fixed;
  width: 68.8%;
  bottom: 23%;
  left: 15.6%;
  opacity: 0;
}
.btn0 {
  /* transition: all 1s; */
  width: 64.86%;
  /* height: 134px; */
  position: fixed;
  bottom: 12.8%;
  left: 27.6%;
  display: none;
}
.btn1234 {
  /* transition: all 1s; */
  width: 64.86%;
  /* height: 134px; */
  position: fixed;
  bottom: 13.5%;
  left: 27.6%;
  display: none;
}
.btn5 {
  transition: all 1s;
  width: 68.8%;
  /* height: 134px; */
  position: fixed;
  bottom: 23%;
  left: 15.6%;
  opacity: 1;
}
.back-btn0 {
  width: 16.26%;
  /* height: 134px; */
  position: fixed;
  bottom: 18%;
  left: 15.6%;
  display: none;
}
.back-btn1234 {
  width: 19.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 13.5%;
  left: 7.5%;
  display: none;
}
.back-btn5 {
  transition: all 1s;
  display: none;
}
.bottom-info0 {
  transition: all 1s;
  width: 29.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 5%;
  left: 35%;
}
.bottom-info1234 {
  transition: all 1s;
  width: 29.54%;
  /* height: 134px; */
  position: fixed;
  bottom: 1.6%;
  left: 35%;
}
.bottom-info5 {
  transition: all 1s;
  width: 19.23%;
  /* height: 134px; */
  position: fixed;
  bottom: 1.5%;
  left: 40.385%;
}
</style>
