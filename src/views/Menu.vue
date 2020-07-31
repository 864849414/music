<template>
  <div class="menu">
    <van-nav-bar title="歌单" left-arrow @click-left="back"  />
    <div class="items-box">
      <div class="items-content clearfix">
        <div class="items-title" >
            
          <div class="mask" :style="{backgroundImage:'url('+menuInfo.pic+')'}"></div>
          <div class="mask1" ></div>

          <img class="auto-img fl" :src="menuInfo.pic" />
          <div class="items-info fl">
            <div class="title">{{menuInfo.name}}</div>
            <div class="subscriber">
              <div class="subImg fl">
                <img class="auto-img" :src="menuInfo.subPic" alt />
              </div>
              <div class="nickName fl">{{menuInfo.nickName}}</div>
            </div>
            <div class="desc">{{menuInfo.desc}}</div>
          </div>
        </div>

        <div class="item-music">
          <div class="items clearfix" v-for="(item,index) in songData" :key="index" @click='getUrl(item.id,index)'>
            <div class="item-img fl">
              <img class="auto-img" :src="item.pic" alt />
            </div>
            <div class="item-name fl">
              <div class="song-name">{{item.songName}}</div>
              <i class="sq fl"></i>
              <div class="autor-name fl">{{item.autorName}}</div>
            </div>
            <div class="item-play fr">
              <img class="auto-img" src="../assets/images/play.png"  />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
import lyricFormat from '../assets/js/lyricFormat'
export default {
  data() {
    return {
      menuInfo: {
        id: "",
        name: "",
        pic: "",
        desc: "",
        subPic: "",
        nickName: "",
      },
      songData: [],
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
    this.menuInfo.id = this.$route.query.id;
    this.getMenuData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取歌单数据
    getMenuData() {
      
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true,
      });
      this.axios({
        method: "GET",
        url: "/playlist/detail",
        params: {
          id: this.menuInfo.id,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          this.menuInfo.name = result.data.playlist.name;
          this.menuInfo.pic = result.data.playlist.coverImgUrl;
          this.menuInfo.desc = result.data.playlist.description;
          this.menuInfo.subPic = result.data.playlist.subscribers[0].avatarUrl;
          this.menuInfo.nickName = result.data.playlist.subscribers[0].nickname;
          result.data.playlist.tracks.forEach((v) => {
            let o = {
              songName: "",
              autorName: "",
              url: "",
              pic: "",
              id: "",
            };
            o.songName = v.name
            o.autorName = v.ar[0].name;
            o.pic = v.al.picUrl;
            o.id = v.id;
            this.songData.push(o);
          });
          
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
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
          autorName:'',
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
        this.listData.lyric = lyricFormat.songInfo.oLRC.ms
      }).catch(err=>{
        
      })
    },

    
  },
};
</script>

<style lang="less" scoped>
</style>