<template>
  <div class="dayRecommend">
    <van-nav-bar title="每日推荐" left-arrow @click-left="back" />
    <div class="items-box">
      

      <div class="items-content">
        <div class="items-img">
          <img class="auto-img" :src='pic' >
        </div>
        <div class="item-music">
          <div class="items clearfix" v-for="(item,index) in songData" :key='index' @click="getUrl(item.id,index)">
            <div class="item-img fl">
              <img class="auto-img" :src="item.pic" alt="">
            </div>
            <div class="item-name fl">
              <div class="song-name">{{item.songName}}</div>
              <i class="sq fl"></i>
              <div class="autor-name fl">{{item.autorName}}</div>
            </div>
            <div class="item-play fr">
              <img class="auto-img" src="../assets/images/play.png" >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/less/dayRecommend.less'
import lyricFormat from '../assets/js/lyricFormat'
export default {
  data() {
    return {
      pic:'',
      songData:[
      ],
      listData:{
        url:'',
        pic:'',
        songName:'',
        autorName:'',
        lyric:[]
      }
    };
  },
  created() {
    this.getDayRecommendData();
    this.getBanner();
  },
  methods: {
    back(){
        this.$router.go(-1)
    },
    // 获取日推歌曲数据
    getDayRecommendData() {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      });
      this.axios({
        method: "GET",
        url: "/top/song",
        params: {
          type:7
        }
      })
        .then(result => {
          this.$toast.clear();
          
          let data = result.data.data.slice(0, 10);
          let songs = [];
          data.forEach(v => {
            let o = {
              songName: "",
              autorName: "",
              pic: "",
              id: "",
              url: ""
            };
            o.songName = v.name;
            o.autorName = v.artists[0].name;
            o.pic = v.album.picUrl;
            o.id = v.id;
            o.url = v.mp3Url;
            songs.push(o);
          });
          this.songData = songs;
          
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    //获取banner图片
    getBanner() {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      })
      this.axios({
        url: "/banner"
      })
        .then(result => {
          this.$toast.clear()
          
          this.pic=result.data.banners[5].imageUrl     
          
        })
        .catch(err => {
          this.$toast.clear()
        })
    },
    //获取音乐url
    getUrl(id,index){
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      });

      this.axios({
        method:'GET',
        url:'/song/url',
        params:{
          id
        }
      }).then(res=>{
        this.$toast.clear();
        
        this.listData={
          url:'',
          pic:'',
          songName:'',
          autorName:''
        }
        this.listData.url=res.data.data[0].url
        this.listData.pic=this.songData[index].pic
        this.listData.songName=this.songData[index].songName
        this.listData.autorName=this.songData[index].autorName
        this.getLyric(id)
        this.$store.commit('changeSongInfo',this.listData)
        this.$store.commit('addSongLists',this.listData)
        this.$store.commit('playOrStop',true)
        this.$store.commit('changeIsShow',true)
        
      }).catch(err=>{
        this.$toast.clear();
        
      })
    },

    // 获取歌词
    getLyric(id){
      this.axios({
        method:'GET',
        url:'/lyric',
        params:{
          id
        }
      }).then(result=>{
        
        let data = [];
        let lyrics = result.data.lrc.lyric
        lyricFormat.createLrcObj(lyrics);
        this.listData.lyric= lyricFormat.songInfo.oLRC.ms
        
      }).catch(err=>{
        
      })
    }

  }
};
</script>

<style lang="less" scoped>
</style>