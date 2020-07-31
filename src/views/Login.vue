<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-text="注册"
      right-text="关闭"
      left-arrow
      @click-left="goRegister"
      @click-right='goHome'
    />

    <div class="items-box">
      <div class="items-img">
        <img class="auto-img" src="../assets/images/music.png" alt />
      </div>

      <div class="items-content">
        <van-form>
          <van-field
            v-model="phone"
            label="手机号码"
            placeholder="手机号码"
            :rules="[{ required: true, message: '请填写手机号码' }]"
          />
          <van-field
            v-model="password"
            :type="isShow?'text':'password'"
            label="密码"
            placeholder="密码"
            :right-icon="isShow? 'eye-o':'closed-eye'"
            @click-right-icon="toggleShow"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="login">登录</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/less/login.less'
export default {
  data(){
    return{
      phone:'',
      password:'',
      isShow:false,
    }
  },
  created(){
    this.$store.state.isShow = false;
  },
  methods:{
    goRegister(){
      this.$router.push({name:'Register'})
    },
    goHome(){
      this.$router.push({name:'Home'})
    },
    //切换密码显示隐藏
    toggleShow() {
      this.isShow = !this.isShow;
    },
    // 登录
    login(){
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true
      });
      this.axios({
        method:'GET',
        url:'/login/cellphone',
        params:{
          phone:this.phone,
          password:this.password
        }
      }).then(res=>{
        this.$toast.clear()
        
        if(res.data.code==502){
          this.$toast(res.data.msg)
        }
        if(res.data.code==200){
          localStorage.setItem('__TK',res.data.token)
          this.$router.push({name:'Home'})
        }
      }).catch(err=>{
        this.$toast.clear()
        
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>