<template>
  <div class="ranking">
    <van-nav-bar
      title="排行榜"
      left-arrow
      @click-left="back"
    />
    <div class="ranking-box clearfix">

      <div class="ranking-items clearfix" :style="{backgroundColor:item.color}" v-for='(item,index) in rankingData' :key='index'>
        <div class="item-left fl">{{item.title}}</div>
        <div class="item-right fl">
          <div class="song" v-for='(v,i) in item.content[0]' :key='i'>{{i+1}}.{{v.first}}--{{v.second}}</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/less/ranking.less'
  export default {
    data(){
      return{
        rankingData:{
          newSong:{
            title:'新歌榜',
            content:[
            ],
            color:'#48dcde'
          },
          hotSong:{
            title:'热歌榜',
            content:[],
            color:'#f55a7f'
          },
          originalSong:{
            title:'原创歌曲榜',
            content:[],
            color:'#03a9f4'
          },
          upSong:{
            title:'飙升榜',
            content:[],
            color:'#9e82d2'
          },
         
        }
      }
    },
    created(){
      this.getRankingData()
    },
    methods:{
      back(){
        this.$router.go(-1)
      },
      getRankingData(){
        this.axios({
          url:'/toplist/detail',
          
        }).then(result=>{
          
          // this.rankingData.upSong.content.push(result.data.list[0].tracks)
          // this.rankingData.newSong.content.push(result.data.list[1].tracks)
          // this.rankingData.originalSong.content.push(result.data.list[2].tracks)
          // this.rankingData.hotSong.content.push(result.data.list[3].tracks)
          // this.rankingData.saySong.content.push(result.data.list[4].tracks)
          let index=0
          for(let k in this.rankingData){
            
            this.rankingData[k].content.push(result.data.list[index].tracks)
            index++
          }
        }).catch(err=>{
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>