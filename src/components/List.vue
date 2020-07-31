<template>
  <div class="list">
    <div class="list-content">

      <div class="item clearfix" v-for="(item,index) in songLists" :key="index">
        <div class="item-name fl clearfix" @click="checkSong(item,index)">
          <div class="songName fl">{{item.songName}}</div>
          <div class="autorName fl">-{{item.autorName}}</div>
        </div>
        <span class="del fr" @click="del(index)">X</span>
      </div>

    </div>
  </div>
</template>

<script>
import '../assets/less/list.less'
  export default {
    data(){
      return{

      }
    },
    methods:{
      // 选择歌曲
      checkSong(item,index){
        this.$store.commit('changeSongInfo',item)
        this.$emit('getIndex',index)
      },
      // 删除歌曲
      del(index){
        this.$store.commit('removeSongLists',index)
      }
    },
    computed:{
      songLists(){
        return this.$store.state.songLists
      },
      
    }
  }
</script>

<style lang="less" scoped>

</style>