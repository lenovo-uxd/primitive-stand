 <template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <video id="videoel" preload="auto" loop playsInline autoPlay>
    </video>
    <div id="overlay"></div>
    <div class="photo-btn" @click="takePhoto" v-if="!hasTookPhoto">
      <img src="/take-photo.png" alt="拍照按钮"/>
    </div>
    <div class="show"  v-show="hasTookPhoto">
      <canvas id="canvas"/>
    </div>
    <div class="count" v-show="isCountShow">{{count}}</div>
    <div class="qrcode-container" v-show="hasTookPhoto">
      <canvas id="qrcode"></canvas>
      <p>扫码下载，立即分享</p>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import QRCode from 'qrcode'

export default {
  name: 'App',
  // components: {
  //   HelloWorld
  // }
  data(){
    return {
      count: 3,
      isCountShow: false,
      hasTookPhoto: false,
      videoObj: null
    }
  },
  methods:{
    takePhoto(){
      this.hasTookPhoto = true;
      this.isCountShow = true;
      let intervalId = setInterval(()=>{
        this.count -= 1;
        if(this.count <= 0){
          let overlay = document.getElementById("overlay");
          overlay.style.display = "block";
          setTimeout(()=>{
            overlay.style.display = "none";
          },100)
          this.videoObj.pause();
          this.count = 3;
          clearInterval(intervalId);
          this.isCountShow = false;
          let vid_width = this.videoObj.width;
          let vid_height = this.videoObj.height;
          let canvas = document.getElementById("canvas");
          let ctx = canvas.getContext('2d');
          ctx.drawImage(this.videoObj, 0, 0, vid_width, vid_height);
          this.makeCode();
        }
      }, 1000)
    },
    setVideoSrc() {
      this.videoObj = document.getElementById('videoel');
      // 获取视频流
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

      // set up video
      navigator.mediaDevices.getUserMedia({
          video: true
      }).then(this.setStream);
    },
    setStream(stream){
      this.videoObj.srcObject = stream;
      this.videoObj.play();
    },
    makeCode(){
      let qrcode = document.getElementById("qrcode")
      let url = "http://xiaohui.ai";
      QRCode.toCanvas(qrcode, url, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    }
  },
  mounted: function(){
    this.setVideoSrc()
  }
}
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
  /* z-index: 0; */
  /*IE*/
  /*visibility: hidden;*/
  /* display: none; */
  /* position: relative;
  top:70px; */
}
#canvas{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* z-index: 10; */
}
#overlay{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.8);
  display: none;
  /* z-index: 10; */
}
.photo-btn{
  position: fixed;
  bottom: 10%;
  width: 100%;
  /* height: 100px; */
  /* fill: antiquewhite; */
  text-align: center;
}
.count{
  position: fixed;
  top: 30%;
  font-size: 500px;
  color: rgb(190, 11, 11);
  text-align: center;
  width: 100%;
}
.qrcode-container{
  position: fixed;
  right: 20px;
  bottom: 30px;
  padding: 5px;
  background: white;
}
.qrcode-container p{
  font-size: 25px;
  margin-block-start: 0;
}
#qrcode{
  width: 300px;
  height: 300px;
}
</style>
