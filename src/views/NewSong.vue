<template>
  <div class="newSong">
    <van-nav-bar title="新歌推荐" left-arrow @click-left="back" />
    <van-tabs v-model="active" @change="toggleType">
      <van-tab :title="item.title" v-for="(item,index) in typeData" :key="index">
        <div class="items-box">
          <div class="items-content">
            <div class="items-img">
              <img class="auto-img" :src='pic' />
            </div>
            <div class="item-music">
              <div
                class="items clearfix"
                v-for="(item1,index1) in songData"
                :key="index1"
                @click="play(index1)"
              >
                <div class="item-img fl">
                  <img class="auto-img" :src="item1.pic" />
                </div>
                <div class="item-name fl">
                  <div class="song-name">{{item1.songName}}</div>
                  <i class="sq fl"></i>
                  <div class="autor-name fl">{{item1.autorName}}</div>
                </div>
                <div class="item-play fr">
                  <img class="auto-img" src="../assets/images/play.png">
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../assets/less/newSong.less";
import lyricFormat from '../assets/js/lyricFormat'
export default {
  data() {
    return {
      active: 0,
      typeData: [
        { title: "华语" },
        { title: "欧美" },
        { title: "韩国" },
        { title: "日本" }
      ],
      songData: [],
      pic:'',
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
    this.getNewSongData();
    
    this.pic = this.$store.state.banner[4]
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //获取最新歌曲数据
    getNewSongData() {
      let type = 7;
      if (this.active == 1) {
        type = 96;
      } else if (this.active == 2) {
        type = 16;
      } else if (this.active == 3) {
        type = 8;
      }
      
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      });
      this.axios({
        method: "GET",
        url: "/top/song",
        params: {
          type
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
    //切换标签
    toggleType() {
      this.getNewSongData();
    },
    // 播放
    play(index) {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      });

      this.axios({
        method:'GET',
        url:'/song/url',
        params:{
          id:this.songData[index].id
        }
      }).then(res=>{
        this.$toast.clear();
        
        this.listData = {
          url:'',
          pic:'',
          songName:'',
          autorName:'',
          lyric:[]
        }
        this.listData.url = res.data.data[0].url
        this.listData.pic = this.songData[index].pic
        this.listData.songName = this.songData[index].songName
        this.listData.autorName = this.songData[index].autorName
        this.getLyric(this.songData[index].id)
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
        this.listData.lyric = lyricFormat.songInfo.oLRC.ms
      }).catch(err=>{
        
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>