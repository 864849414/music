<template>
  <div class="search">
    <van-nav-bar left-arrow @click-left="back">
      <template #right>
        <van-icon name="search" size="18" @click="goSearchContent(keywords)" />
      </template>
      <template #title>
        <input type="text" placeholder="请输入要搜索的内容" v-model="keywords" />
      </template>
    </van-nav-bar>

    <!-- 历史记录 -->
    <div class="history" >
      <div class="top clearfix">
        <div class="title fl">历史记录</div>
        <div class="del fr">
          <van-icon name="delete" @click="clearHistory" />
        </div>
      </div>
      <div class="content clearfix">
        <div class="item fl" v-for="(item,index) in historyData" :key="index" @click="goSearchContent(item)">{{item}}</div>
      </div>
    </div>

    <!-- 热搜 -->
    <div class="hot">
      <div class="hot-title">热搜榜</div>
      <div class="hot-content">

        <div class="hot-item" v-for="(item,index) in hotData" :key="index" @click="goSearchContent(item.searchWord)">
          <div class="item-left fl">{{index+1}}</div>
          <div class="item-center fl">
            <div class="item-name clearfix">
              <span class="fl">{{item.searchWord}}</span>
              <img class="auto-img fl" :src="item.iconUrl" v-show="item.iconUrl"/>
            </div>
            <div class="item-desc">{{item.content}}</div>
          </div>
          <div class="item-right fr">{{item.score}}</div>
        </div>
     
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";
export default {
  data() {
    return {
      hotData: [],
      keywords:'',
    };
  },
  created(){
    this.getHotData()
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取热搜
    getHotData() {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true,
      });
      this.axios({
        method: "GET",
        url: "/search/hot/detail",
      })
        .then((result) => {
          this.$toast.clear();
          
          result.data.data.forEach(v=>{
            let data ={
              content:'',
              iconUrl:'',
              score:0,
              searchWord:''
            }
            data.content = v.content
            data.iconUrl = v.iconUrl
            data.score = v.score
            data.searchWord = v.searchWord
            this.hotData.push(data)
          })
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 跳转到搜索内容界面
    goSearchContent(keywords){
      if(keywords == ''){
        return
      }
      this.$store.commit('changeHistoryData',keywords)
      this.$router.push({name:'SearchContent',query:{keywords}})
    },
    

    //清除记录
    clearHistory(){
      this.$store.commit('changeHistoryData')
    }
  },
  computed:{
    historyData(){
      return this.$store.state.historyData
    }
  }
};
</script>

<style lang="less" scoped>
</style>