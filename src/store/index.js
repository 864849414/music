import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShow:false,
    isPlay:false,
    songInfo:{
      // url:'',
      // pic:'',
      // songName:'',
      // autorName:'',
      // lyric:[],
    },
    songLists:[],
    banner:[],
    //当前时间
    currentTime:0,
    // 总时间
    allTime:0,
    historyData:[],
    
  },
  mutations: {
    playOrStop(state,boolen){
      state.isPlay = boolen
    },
    changeIsShow(state,boolen){
      state.isShow = boolen
    },
    getBanner(state,data){
      state.banner.push(data)
    },
    changeHistoryData(state,data){
      if(!data){
        state.historyData =[];
      }else if(state.historyData.indexOf(data)==-1){
        state.historyData.push(data)
      }
    },
    changeSongInfo(state,data){
      state.songInfo =data
    },
    addSongLists(state,data){
      for(let i =0;i<state.songLists.length;i++){
        if(data.url == null){
          return
        }
        if(state.songLists[i].url.indexOf(data.url)!=-1){
          return;
        }
      }
      state.songLists.push(data)
    },
    removeSongLists(state,index){
      state.songLists.splice(index,1)
    }
                 
    
  },
  actions: {
  },
  modules: {
  }
})
