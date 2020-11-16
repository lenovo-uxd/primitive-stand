 <template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <video id="videoel" v-show="!isQrCodeShow" preload="auto" autoPlay></video>
    <div id="overlay"></div>
    <div class="photo-btn" @click="takePhoto" v-if="!hasTookPhoto">
      <img src="/take-photo.png" alt="拍照按钮" />
    </div>
    <div class="show" v-show="false">
      <canvas id="canvas" />
    </div>
    <div class="count" v-show="isCountShow">{{ count }}</div>
    <div class="qrcode-container" v-show="isQrCodeShow">
      <canvas id="qrcode"></canvas>
      <p>扫码下载，立即分享</p>
    </div>
    <div id="paint" v-show="isQrCodeShow"></div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import QRCode from "qrcode";
import { SVG } from '@svgdotjs/svg.js';

export default {
  name: "App",
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      count: 3,
      isCountShow: false,
      hasTookPhoto: false,
      isQrCodeShow: false,
      videoObj: null,
    };
  },
  methods: {
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
          // 停止倒计时
          this.isCountShow = false;
          clearInterval(intervalId);
          this.count = 3;

          // 闪光灯动效
          let overlay = document.getElementById("overlay");
          overlay.style.display = "block";
          setTimeout(() => {
            overlay.style.display = "none";
          }, 100);

          // 停止播放视频流并获取当前画面的base64
          this.videoObj.pause();
          let base64 = this.drawCanvas()
          console.log(base64)

          // 调用api，并绘制svg
          this.$ajax("/demo.svg").then((res) => {
            console.log(res);
            let xmlDoc = this.xmlParse(res.data)
            this.drawSvg(xmlDoc);
          });

          // 绘制二维码并显示
          this.makeCode();
          this.isQrCodeShow = true;
        }
      }, 1000);
    },
    drawSvg(xmlDoc) {
      let collection = xmlDoc.getElementsByTagName("rect");
      let draw = SVG()
        .addTo("#paint")
        .size('100%', '100%');

      for (let i = 0; i < collection.length; i++) {
        setTimeout(this.addRect(draw, collection, i), 50 * i);
      }
    },
    addRect(draw, collection, i) {
      let x = parseFloat(collection[i].attributes.x.value);
      let y = parseFloat(collection[i].attributes.y.value);
      let width = parseFloat(collection[i].attributes.width.value);
      let height = parseFloat(collection[i].attributes.height.value);
      let fill = collection[i].attributes.fill.value;
      let fill_opacity = collection[i].attributes["fill-opacity"].value;

      let ratio1_h = width / 878;
      let ratio2_h = height / 146;

      let ratio1_v = width / 121;
      let ratio2_v = height / 722;

      let rectText_v =
        '<g id="rect"' +
        i +
        ' stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(' +
        x +
        "," +
        y +
        ") scale(" +
        ratio1_v +
        "," +
        ratio2_v +
        ')"><g id="Artboard" transform="translate(-457.000000, -44.000000)" fill-opacity="' +
        fill_opacity +
        '" fill="' +
        fill +
        '" fill-rule="nonzero"><path d="M574.75,673.25 L541.892857,673.25 L541.892857,727.011989 L459.75,727.011989 L459.75,765.25 L574.75,765.25 L574.75,673.25 Z M574.25,565.75 L542.707143,565.75 L542.707143,626.92608 L530.221429,626.92608 L530.221429,570.683555 L502.457143,570.683555 L502.457143,626.92608 L490.792857,626.92608 L490.792857,566.572259 L459.25,566.572259 L459.25,664.75 L574.25,664.75 L574.25,565.75 Z M574.25,517.635714 L521.185714,517.635714 L574.25,474.921429 L574.25,440.75 L459.25,440.75 L459.25,478.864286 L510.014286,478.864286 L459.25,519.771429 L459.25,555.75 L574.25,555.75 L574.25,517.635714 Z M577.25,367.914921 C577.25,359.009162 575.688356,350.708115 572.565068,343.01178 C569.441781,335.315445 565.167808,328.636126 559.743151,322.973822 C554.318493,317.311518 547.962329,312.858639 540.674658,309.615183 C533.622072,306.476355 526.081982,304.856315 518.054385,304.755063 L517.25,304.75 L516.921233,304.75 C508.592466,304.75 500.784247,306.344241 493.496575,309.532723 C486.208904,312.721204 479.880137,317.146597 474.510274,322.808901 C469.140411,328.471204 464.921233,335.123037 461.85274,342.764398 C458.784247,350.405759 457.25,358.679319 457.25,367.585079 C457.25,376.490838 458.811644,384.791885 461.934932,392.48822 C465.058219,400.184555 469.332192,406.863874 474.756849,412.526178 C480.181507,418.188482 486.537671,422.641361 493.825342,425.884817 C500.877928,429.023645 508.418018,430.643685 516.445615,430.744937 L517.25,430.75 L517.578767,430.75 C525.907534,430.75 533.715753,429.155759 541.003425,425.967277 C548.291096,422.778796 554.619863,418.353403 559.989726,412.691099 C565.359589,407.028796 569.578767,400.376963 572.64726,392.735602 C575.715753,385.094241 577.25,376.820681 577.25,367.914921 Z M543.25,367.585616 C543.25,371.311644 542.53692,374.65411 541.110759,377.613014 C539.684599,380.571918 537.764768,383.092466 535.351266,385.174658 C532.937764,387.256849 530.167722,388.873288 527.041139,390.023973 C524.109968,391.10274 521.058272,391.675835 517.886051,391.743258 L517.25,391.75 L516.920886,391.75 C513.520042,391.75 510.283755,391.202055 507.212025,390.106164 C504.140295,389.010274 501.425105,387.421233 499.066456,385.339041 C496.707806,383.256849 494.815401,380.736301 493.389241,377.777397 C491.96308,374.818493 491.25,371.530822 491.25,367.914384 C491.25,364.188356 491.96308,360.84589 493.389241,357.886986 C494.815401,354.928082 496.735232,352.407534 499.148734,350.325342 C501.562236,348.243151 504.332278,346.626712 507.458861,345.476027 C510.390032,344.39726 513.441728,343.824165 516.613949,343.756742 L517.25,343.75 L517.579114,343.75 C520.979958,343.75 524.216245,344.297945 527.287975,345.393836 C530.359705,346.489726 533.074895,348.078767 535.433544,350.160959 C537.792194,352.243151 539.684599,354.763699 541.110759,357.722603 C542.53692,360.681507 543.25,363.969178 543.25,367.585616 Z M575.25,219.366162 L459.25,172.75 L459.25,215.098485 L523.91383,237.421717 L459.25,259.744949 L459.25,302.75 L575.25,256.133838 L575.25,219.366162 Z M577.25,107.914921 C577.25,99.0091623 575.688356,90.7081152 572.565068,83.0117801 C569.441781,75.315445 565.167808,68.6361257 559.743151,62.973822 C554.318493,57.3115183 547.962329,52.8586387 540.674658,49.6151832 C533.622072,46.4763553 526.081982,44.8563151 518.054385,44.7550626 L517.25,44.75 L516.921233,44.75 C508.592466,44.75 500.784247,46.3442408 493.496575,49.5327225 C486.208904,52.7212042 479.880137,57.1465969 474.510274,62.8089005 C469.140411,68.4712042 464.921233,75.1230366 461.85274,82.7643979 C458.784247,90.4057592 457.25,98.6793194 457.25,107.585079 C457.25,116.490838 458.811644,124.791885 461.934932,132.48822 C465.058219,140.184555 469.332192,146.863874 474.756849,152.526178 C480.181507,158.188482 486.537671,162.641361 493.825342,165.884817 C500.877928,169.023645 508.418018,170.643685 516.445615,170.744937 L517.25,170.75 L517.578767,170.75 C525.907534,170.75 533.715753,169.155759 541.003425,165.967277 C548.291096,162.778796 554.619863,158.353403 559.989726,152.691099 C565.359589,147.028796 569.578767,140.376963 572.64726,132.735602 C575.715753,125.094241 577.25,116.820681 577.25,107.914921 Z M543.25,107.585616 C543.25,111.311644 542.53692,114.65411 541.110759,117.613014 C539.684599,120.571918 537.764768,123.092466 535.351266,125.174658 C532.937764,127.256849 530.167722,128.873288 527.041139,130.023973 C524.109968,131.10274 521.058272,131.675835 517.886051,131.743258 L517.25,131.75 L516.920886,131.75 C513.520042,131.75 510.283755,131.202055 507.212025,130.106164 C504.140295,129.010274 501.425105,127.421233 499.066456,125.339041 C496.707806,123.256849 494.815401,120.736301 493.389241,117.777397 C491.96308,114.818493 491.25,111.530822 491.25,107.914384 C491.25,104.188356 491.96308,100.84589 493.389241,97.8869863 C494.815401,94.9280822 496.735232,92.4075342 499.148734,90.3253425 C501.562236,88.2431507 504.332278,86.6267123 507.458861,85.4760274 C510.390032,84.3972603 513.441728,83.8241652 516.613949,83.7567423 L517.25,83.75 L517.579114,83.75 C520.979958,83.75 524.216245,84.2979452 527.287975,85.3938356 C530.359705,86.489726 533.074895,88.0787671 535.433544,90.1609589 C537.792194,92.2431507 539.684599,94.7636986 541.110759,97.7226027 C542.53692,100.681507 543.25,103.969178 543.25,107.585616 Z" id="Shape"></path></g></g>';

      let rectText_h =
        '<g id="rect"' +
        i +
        ' stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(' +
        x +
        "," +
        y +
        ") scale(" +
        ratio1_h +
        "," +
        ratio2_h +
        ')"><g id="Artboard" transform="translate(-302.000000, -352.000000)" fill-opacity="' +
        fill_opacity +
        '" fill="' +
        fill +
        '" fill-rule="nonzero"><path d="M414.6,495 L414.6,455 L348.8,455 L348.8,355 L302,355 L302,495 L414.6,495 Z M545.2,495 L545.2,456.6 L470.8,456.6 L470.8,441.4 L539.2,441.4 L539.2,407.6 L470.8,407.6 L470.8,393.4 L544.2,393.4 L544.2,355 L424.8,355 L424.8,495 L545.2,495 Z M604.2,495 L604.2,430.4 L656.2,495 L697.8,495 L697.8,355 L651.4,355 L651.4,416.8 L601.6,355 L557.8,355 L557.8,495 L604.2,495 Z M786.8,498 C797.6,498 807.666667,496.1 817,492.3 C826.333333,488.5 834.433333,483.3 841.3,476.7 C848.166667,470.1 853.566667,462.366667 857.5,453.5 C861.433333,444.633333 863.4,435.133333 863.4,425 L863.4,425 L863.4,424.6 C863.4,414.466667 861.466667,404.966667 857.6,396.1 C853.733333,387.233333 848.366667,379.533333 841.5,373 C834.633333,366.466667 826.566667,361.333333 817.3,357.6 C808.033333,353.866667 798,352 787.2,352 C776.4,352 766.333333,353.9 757,357.7 C747.666667,361.5 739.566667,366.7 732.7,373.3 C725.833333,379.9 720.433333,387.633333 716.5,396.5 C712.566667,405.366667 710.6,414.866667 710.6,425 L710.6,425 L710.6,425.4 C710.6,435.533333 712.533333,445.033333 716.4,453.9 C720.266667,462.766667 725.633333,470.466667 732.5,477 C739.366667,483.533333 747.433333,488.666667 756.7,492.4 C765.966667,496.133333 776,498 786.8,498 Z M787.2,456.6 C782.666667,456.6 778.6,455.733333 775,454 C771.4,452.266667 768.333333,449.933333 765.8,447 C763.266667,444.066667 761.3,440.7 759.9,436.9 C758.5,433.1 757.8,429.133333 757.8,425 L757.8,425 L757.8,424.6 C757.8,420.466667 758.466667,416.533333 759.8,412.8 C761.133333,409.066667 763.066667,405.766667 765.6,402.9 C768.133333,400.033333 771.2,397.733333 774.8,396 C778.4,394.266667 782.4,393.4 786.8,393.4 C791.333333,393.4 795.4,394.266667 799,396 C802.6,397.733333 805.666667,400.066667 808.2,403 C810.733333,405.933333 812.7,409.3 814.1,413.1 C815.5,416.9 816.2,420.866667 816.2,425 L816.2,425 L816.2,425.4 C816.2,429.533333 815.533333,433.466667 814.2,437.2 C812.866667,440.933333 810.933333,444.233333 808.4,447.1 C805.866667,449.966667 802.8,452.266667 799.2,454 C795.6,455.733333 791.6,456.6 787.2,456.6 Z M967.6,496 L1024.4,355 L972.8,355 L945.6,433.6 L918.4,355 L866,355 L922.8,496 L967.6,496 Z M1103.2,498 C1114,498 1124.06667,496.1 1133.4,492.3 C1142.73333,488.5 1150.83333,483.3 1157.7,476.7 C1164.56667,470.1 1169.96667,462.366667 1173.9,453.5 C1177.83333,444.633333 1179.8,435.133333 1179.8,425 L1179.8,425 L1179.8,424.6 C1179.8,414.466667 1177.86667,404.966667 1174,396.1 C1170.13333,387.233333 1164.76667,379.533333 1157.9,373 C1151.03333,366.466667 1142.96667,361.333333 1133.7,357.6 C1124.43333,353.866667 1114.4,352 1103.6,352 C1092.8,352 1082.73333,353.9 1073.4,357.7 C1064.06667,361.5 1055.96667,366.7 1049.1,373.3 C1042.23333,379.9 1036.83333,387.633333 1032.9,396.5 C1028.96667,405.366667 1027,414.866667 1027,425 L1027,425 L1027,425.4 C1027,435.533333 1028.93333,445.033333 1032.8,453.9 C1036.66667,462.766667 1042.03333,470.466667 1048.9,477 C1055.76667,483.533333 1063.83333,488.666667 1073.1,492.4 C1082.36667,496.133333 1092.4,498 1103.2,498 Z M1103.6,456.6 C1099.06667,456.6 1095,455.733333 1091.4,454 C1087.8,452.266667 1084.73333,449.933333 1082.2,447 C1079.66667,444.066667 1077.7,440.7 1076.3,436.9 C1074.9,433.1 1074.2,429.133333 1074.2,425 L1074.2,425 L1074.2,424.6 C1074.2,420.466667 1074.86667,416.533333 1076.2,412.8 C1077.53333,409.066667 1079.46667,405.766667 1082,402.9 C1084.53333,400.033333 1087.6,397.733333 1091.2,396 C1094.8,394.266667 1098.8,393.4 1103.2,393.4 C1107.73333,393.4 1111.8,394.266667 1115.4,396 C1119,397.733333 1122.06667,400.066667 1124.6,403 C1127.13333,405.933333 1129.1,409.3 1130.5,413.1 C1131.9,416.9 1132.6,420.866667 1132.6,425 L1132.6,425 L1132.6,425.4 C1132.6,429.533333 1131.93333,433.466667 1130.6,437.2 C1129.26667,440.933333 1127.33333,444.233333 1124.8,447.1 C1122.26667,449.966667 1119.2,452.266667 1115.6,454 C1112,455.733333 1108,456.6 1103.6,456.6 Z" id="LENOVO"></path></g></g>';

      let rectText = rectText_h;

      if (width < height) rectText = rectText_v;

      draw.svg(rectText);
    },
    setVideoSrc() {
      // 获取视频流
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      window.URL =
        window.URL || window.webkitURL || window.msURL || window.mozURL;

      // set up video
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(this.setStream);
    },
    setStream(stream) {
      this.videoObj.srcObject = stream;
      this.videoObj.play();
    },
    drawCanvas() {
      let rect = this.videoObj.getBoundingClientRect();
      let vid_width = rect.width;
      let vid_height = rect.height;
      // let canvas = document.getElementById("canvas");
      // console.log([canvas])
      // console.log([])
      console.log(vid_width, vid_height);

      let v = document.getElementById("videoel");
      let c = document.getElementById("canvas");
      let ctx = c.getContext("2d");
      ctx.drawImage(v, 0, 0, vid_width, vid_height);
      return c.toDataURL( 'image/png', 1 );
    },
    makeCode() {
      let qrcode = document.getElementById("qrcode");
      let url = "http://xiaohui.ai";
      QRCode.toCanvas(qrcode, url, function (error) {
        if (error) console.error(error);
        // console.log('success!');
      });
    },
    getRatio() {
      let ratio = 0;
      let screen = window.screen;
      let ua = navigator.userAgent.toLowerCase();
      // console.log(window.screen)
      // console.log(navigator.userAgent.toLowerCase())
      // console.log(window.devicePixelRatio)
      // console.log(screen.deviceXDP)
      // console.log(screen.logicalXDPI)
      // console.log(window.outerWidth)
      // console.log(window.innerWidth)
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      return ratio;
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
      console.log(xmlDoc);
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
  },
  mounted: function () {
    // let ratio = this.getRatio()
    // console.log(ratio)
    this.videoObj = document.getElementById("videoel");
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
  /* margin-top: 60px; */
  /* height: 100%;
  width: 100%;
  position: absolute; */
}
#videoel {
  /* -o-transform: scale(-1.2, 1.2);
  -webkit-transform: scale(-1.2, 1.2);
  transform: scale(-1.2, 1.2);
  -ms-filter: fliph;
  filter: fliph; */
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  object-fit: fill;
  z-index: 0;
  /*IE*/
  /*visibility: hidden;*/
  /* display: none; */
  /* position: relative;
  top:70px; */
}
.show{
  position: fixed;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1920px;
}
#canvas{
  width: 1080px;
  height: 1920px;
}
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.8);
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
#paint{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
