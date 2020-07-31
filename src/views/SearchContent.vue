<template>
  <div class="searchContent">
    <van-nav-bar left-arrow @click-left="back">
      <template #right>
        <van-icon name="search" size="18" @click="getSearchData(keywords)"/>
      </template>
      <template #title>
        <input type="text" placeholder="请输入要搜索的内容" v-model="keywords" />
      </template>
    </van-nav-bar>

    <div class="content">
      <div class="title">单曲</div>
      <div class="content-items">

        <div class="item clearfix" v-for="(item,index) in songData" :key="index" @click="getUrl(item.id,index)">
          <div class="item-content fl">
            <div class="item-name">{{item.name}}</div>
            <div class="item-info clearfix fl">
              <i class="sq fl"></i>
              <div class="autor-name fl">{{item.autorName}}-</div>
              <div class="album fl">{{item.albumName}}</div>
            </div>
          </div>

          <div class="item-play fr">
            <img class="auto-img" src="../assets/images/play.png" />
          </div>
        </div>
     
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/searchContent.less";
import lyricFormat from '../assets/js/lyricFormat'
export default {
  data() {
    return {
      keywords: "",
      songData:[],
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
    this.keywords = this.$route.query.keywords;
    this.getSearchData(this.keywords);
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 搜索
    getSearchData(keywords) {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true,
      });
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keywords,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          this.$store.commit('changeHistoryData',keywords)
          this.songData=[];
          result.data.result.songs.forEach(v=>{
            let o={
              id:null,
              name:'',
              autorName:'',
              albumName:''
            }
            o.id = v.id;
            o.name = v.name;
            o.autorName = v.artists[0].name;
            o.albumName = v.album.name
            this.songData.push(o)
          })
          
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
          lyric:[]
        }
        this.listData.url=res.data.data[0].url
        this.listData.songName=this.songData[index].name
        this.listData.autorName=this.songData[index].autorName
        this.getLyric(id)
        this.getSongDetail(id)
        
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

    // 获取详情
    getSongDetail(ids){
      this.axios({
        method:'GET',
        url:'/song/detail',
        params:{
          ids
        }
      }).then(result=>{
        
        this.listData.pic = result.data.songs[0].al.picUrl
       
      }).catch(err=>{
        
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>