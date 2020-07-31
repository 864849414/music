<template>
  <div class="home">
    <van-nav-bar title="音乐馆">
      <template #left>
        <van-icon name="wap-nav" size="18" />
      </template>
      <template #right>
        <van-icon name="search" size="18" @click='goSearch'/>
      </template>
    </van-nav-bar>

    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for='(item,index) in bannerData' :key="index"><img class="auto-img" :src="item" alt="" ></van-swipe-item>

    </van-swipe>

    <div class="home-tag clearfix">
      <div
        class="item-box fl"
        v-for="(item,index) in tagData"
        :key="index"
        @click="goType(item.name)"
      >
        <div class="item">
          <img class="auto-img" :src="require('../assets/images/'+item.url)" />
          <div class="item-text">{{item.title}}</div>
        </div>
      </div>
    </div>

    <div class="home-recommend">
      <van-cell title="推荐歌单" />
      <div class="recommend-items clearfix">
        <div class="item-box fl" v-for="(item,index) in songMenu" :key="index" @click="goMenu(item)">
          <div class="item">
            <img class="auto-img" :src="item.picUrl" alt />
            <div class="item-text">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  data() {
    return {
      tagData: [
        {
          title: "排行",
          url: "a3.png",
          name: "Ranking"
        },
        {
          title: "新推",
          url: "a5.png",
          name: "NewSong"
        },
        {
          title: "日推",
          url: "a6.png",
          name: "DayRecommend"
        },

      ],
      songMenu: [],
      bannerData: []
    };
  },
  created() {
    this.getSongMenu();
    this.getBanner();
    this.bannerData = this.$store.state.banner.slice(0,4)
  },
  methods: {
    // 获取歌单
    getSongMenu() {
      this.axios({
        url: "/personalized"
      })
        .then(result => {
          
          let menu = result.data.result.slice(0, 6);
          
          this.songMenu = menu;
        })
        .catch(err => {
          
        });
    },
    // 跳转到其他类型
    goType(name) {
      this.$router.push({ name });
    },
    //获取banner图片
    getBanner() {
      if(this.$store.state.banner.length!=0){
        
        return;
      }
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
          
          result.data.banners.forEach(v=>{
            this.$store.commit('getBanner',v.imageUrl)
          })
          this.bannerData = this.$store.state.banner.slice(0,4)
          
          
        })
        .catch(err => {
          this.$toast.clear()
          
        })
    },
    // 跳转到歌单
    goMenu(item){
      this.$router.push({name:'Menu',query:{id:item.id}})
    },
    //跳转搜索
    goSearch(){
      this.$router.push({name:'Search'})
    }
  }
};
</script>

<style lang="less" scoped>
</style>