export const routes = [
  {
    path:'/',
    redirect:'/home'
  },
  {
    path:'/home',
    name:'Home',
    component:()=>import('../views/Home.vue'),
  },
  {
    path:'/menu',
    name:'Menu',
    component:()=>import('../views/Menu.vue')
  },
  {
    path:'/ranking',
    name:'Ranking',
    component:()=>import('../views/Ranking.vue')
  },
  {
    path:'/dayRecommend',
    name:'DayRecommend',
    component:()=>import('../views/DayRecommend.vue')
  },
  {
    path:'/newSong',
    name:'NewSong',
    component:()=>import('../views/NewSong.vue')
  },
  {
    path:'/search',
    name:'Search',
    component:()=>import('../views/Search.vue')
  },
  {
    path:'/searchContent',
    name:'SearchContent',
    component:()=>import('../views/SearchContent.vue')
  },
]