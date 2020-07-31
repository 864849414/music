<template>
  <div id="app">
    <router-view></router-view>
    <van-tabbar v-show="isShow">
      <div class="music-play clearfix">
        <div class="music-img fl">
          <img class="auto-img" :src="songInfo.pic" />
        </div>
        <div class="name fl">
          <div class="music-name">{{songInfo.songName}}</div>
          <div class="auto-name">{{songInfo.autorName}}</div>
        </div>
        <div class="fr right clearfix">
          <div class="up fl">
            <img class="auto-img" src="./assets/images/left2.png" alt="" @click="up">
          </div>
          <div class="stop-play fl">
            <van-circle v-model="currentRate" :rate="percent" layer-color='#999' color='green' :speed="100" size='30px' class="circle"/>
            <img
              class="auto-img"
              :src="require('./assets/images/'+(isPlay?'stop1.png':'play1.png'))"
              @click="playOrStop"
            />
          </div>
          <div class="next fl">
            <img class="auto-img" src="./assets/images/right2.png" alt="" @click="next">
          </div>
          <div class="more fr">
            <img class="auto-img" src="./assets/images/list2.png" alt="" @click="showList">
          </div>
        </div>
      </div>
      <audio
        class="audio"
        ref="musicAudio"
        :src="songInfo.url"
        controls="controls"
      >Your browser does not support the audio tag.</audio>

      <!-- 弹出层 -->
      <van-cell class="cell" @click="showPopup"></van-cell>
      <van-popup class="popup auto-img" v-model="show" >
        <div class="popup-box">
          <div class="mask" :style="{'backgroundImage':'url('+songInfo.pic+')'}"></div>

          <div class="content">
            <van-row>
              <van-col span="4">
                <div class="back">
                  <img src="./assets/images/left.png" @click="closePopup" />
                </div>
              </van-col>
              <van-col span="16">
                <div class="name">
                  <div class="songName">{{songInfo.songName}}</div>
                  <div class="autorName">{{songInfo.autorName}}</div>
                </div>
              </van-col>
              <van-col span="4">
                <div class="share">
                  <img class="auto-img" src="./assets/images/share.png" alt />
                </div>
              </van-col>
            </van-row>

            <div class="popup-content">
              <div class="screen" @click="toggleIsShowLyric">
                <div class="player" v-show='!showLyric'>
                  <div class="plybtn"></div>
                  <div class="cd"></div>
                  <div class="music-pic">
                    <img class="auto-img" :src="songInfo.pic" alt />
                  </div>
                </div>
                  <!-- 歌曲 -->
                <div class="lyric" ref="lyric" v-show="showLyric">
                    
                  <div class="lyric-item" v-for="(item,index) in songInfo.lyric" :key="index">{{item.c}}</div>
                   
                </div>
                
              </div>

              <div class="footer">
                <!-- 进度条 -->
                <div class="progress clearfix">
                  <div class="current-time fl">{{currentMin}}:{{currentSec}}</div>
                  <div class="bar fl">
                    <van-progress
                      color="white"
                      track-color="#999"
                      :percentage="percent"
                      stroke-width="3"
                      :show-pivot="false"
                    />
                  </div>
                  <div class="allTime fl">{{allMin}}:{{allSec}}</div>
                </div>

                <div class="footer-btn clearfix">
                  <div class="model fl">
                    <img src="./assets/images/xunhuan.png" alt />
                  </div>
                  <div class="left-btn fl">
                    <img src="./assets/images/left1.png" alt @click="up" />
                  </div>
                  <div class="playStop fl">
                    <img
                      :src="require('./assets/images/'+(isPlay?'stop2.png':'play2.png'))"
                      @click="playOrStop"
                    />
                  </div>
                  <div class="right-btn fl">
                    <img src="./assets/images/right1.png" alt @click="next" />
                  </div>
                  <div class="menu fl">
                    <img src="./assets/images/list.png" alt @click="showList" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>

      <van-popup class="listPopup auto-img" v-model="isShowList" position="bottom" >
        <List @getIndex='getIndex'></List>
      </van-popup>
    </van-tabbar>
  </div>
</template>

<script>
import "./assets/less/app.less";
import List from '../src/components/List'
export default {
  data() {
    return {
      musicAudio: "",
      show: false,
      currentTime: 0,
      allTime: 0,
      currentMin: "00",
      currentSec: "00",
      allMin: "00",
      allSec: "00",
      percent: 0,
      musicLyric:"",
      timer: null,
      // 显示歌词
      showLyric:false,
      currentRate:0,
      isShowList:false,
      i:0,
    };
  },
  components:{
    List
  },
  created() {
    this.$nextTick(() => {
      this.musicAudio = this.$refs.musicAudio;
      this.musicAudio.autoplay = true;
    });
    
  },
  methods: {
    // 切换播放停止
    playOrStop() {
      if (!this.$store.state.isPlay) {
        // 暂停的时候
        this.musicAudio.play();
        this.$store.commit("playOrStop", true);
      } else {
        // 播放的时候
        this.musicAudio.pause();
        this.$store.commit("playOrStop", false);
      }
      
    },
    //弹出播放页
    showPopup() {
      this.show = true;
    },
    // 弹出歌曲列表
    showList(){
      this.isShowList=true
    },
    closePopup() {
      this.show = false;
      this.showLyric=false
    },
    
    // 监听歌曲进度变化
    songChange() {
      if (this.$store.state.isPlay) {
        this.timer = setInterval(() => {
          // 总时间
          this.allTime = this.musicAudio.duration.toFixed(3);
          // 当前时间
          this.currentTime = this.musicAudio.currentTime.toFixed(3);
          // 
          
          // 

          // 当前分秒
          this.currentMin = Math.floor(Math.floor(this.currentTime) / 60);
          this.currentMin =
            this.currentMin < 10 ? "0" + this.currentMin : this.currentMin;
          this.currentSec = Math.floor(this.currentTime) % 60;
          this.currentSec =
            this.currentSec < 10 ? "0" + this.currentSec : this.currentSec;
          // 
          // 

          // 总分秒
          this.allMin = Math.floor(Math.floor(this.allTime) / 60);
          this.allMin = this.allMin < 10 ? "0" + this.allMin : this.allMin;
          this.allSec = Math.floor(this.allTime) % 60;
          this.allSec = this.allSec < 10 ? "0" + this.allSec : this.allSec;

          this.percent = Math.floor((this.currentTime / this.allTime) * 100);
          if(!this.percent){
            this.percent = 0
          }
          // 
          

          if(this.currentTime == this.allTime){
            clearInterval(this.timer)
            this.percent = 0
            this.$store.commit('playOrStop',false)
          }
        }, 1000);
        
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 切换歌词页面
    toggleIsShowLyric(){
      this.showLyric = !this.showLyric
    },
    //获取下标
    getIndex(i){
      this.i = i;
    },
    // 下一首
    next(){
      if(this.i == this.$store.state.songLists.length -1){
        
        return;
      }
      this.currentRate ==0
      this.i++;
      this.$store.commit('changeSongInfo',this.$store.state.songLists[this.i])
    },
    // 上一首
    up(){
      if(this.i==0){
        return
      }
      this.currentRate ==0
      this.i--;
      this.$store.commit('changeSongInfo',this.$store.state.songLists[this.i])
    }

  },
  computed: {
    isShow() {
      return this.$store.state.isShow;
    },
    isPlay() {
      return this.$store.state.isPlay;
    },
    songInfo(){
      return this.$store.state.songInfo
    }
  },
  watch: {
    // 监听是否播放
    isPlay: "songChange",
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

.fl {
  float: left;
}
.fr {
  float: right;
}
.auto-img {
  width: 100%;
  display: block;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.van-nav-bar__title,
.van-nav-bar .van-icon {
  color: #989696;
}
.van-nav-bar__text {
  color: #989696;
}
</style>
