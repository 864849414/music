<template>
  <div class="register">
    <van-nav-bar
      title="注册"
      left-text="登录"
      right-text="关闭"
      left-arrow
      @click-left="goLogin"
      @click-right="goHome"
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
            @change="checkPhone"
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
          <van-field
            v-model="nickname"
            type="text"
            label="昵称"
            placeholder="昵称"
            :rules="[{ required: true, message: '请填写昵称' }]"
          />
          <van-field
            v-model="captcha"
            center
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
            @keyup="checkCaptcha"
          >
            <template #button>
              <van-button
                size="small"
                :disabled="isSend"
                @click="getCaptcha"
                type="primary"
              >{{text}}</van-button>
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" >注册</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/register.less";
export default {
  data() {
    return {
      isShow: false,
      phone: "",
      password: "",
      nickname: "",
      captcha: "",
      isSend: false,
      text: "发送验证码",
      isRegister: true,
      //验证码是否一致
      captchaIsTrue: false,
    };
  },
  created() {
    this.$store.state.isShow = false;
  },
  methods: {
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },
    //切换密码显示隐藏
    toggleShow() {
      this.isShow = !this.isShow;
    },
    // 获取验证码
    getCaptcha() {
      if (this.isRegister) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        orbidClick: true,
      });
      this.axios({
        method: "GET",
        url: "/captcha/sent",
        params: {
          phone: this.phone,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          this.isSend = true;
          let time = 5;
          let timer = setInterval(() => {
            time--;
            this.text = time + "秒后在发送";
            if (time == 0) {
              this.text = "发送验证码";
              this.isSend = false;
              clearInterval(timer);
            }
          }, 1000);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //验证手机号是否被注册
    checkPhone() {
      this.axios({
        method: "GET",
        url: "/cellphone/existence/check",
        params: {
          phone: this.phone,
        },
      })
        .then((result) => {
          
          if (result.data.exist == -1) {
            this.$toast("该手机可以注册");
            this.isRegister = false;
          } else {
            this.$toast("该手机已被注册");
            this.isRegister = true;
          }
        })
        .catch((err) => {
          
        });
    },

    // 验证 验证码
    checkCaptcha() {
      if(this.captcha.length<4){
        return;
      }
      this.axios({
        method: "GET",
        url: "/captcha/verify",
        params: {
          phone: this.phone,
          captcha: this.captcha,
        },
      })
        .then((result) => {
          
          if (result.data.code == 200) {
            //验证码通过
            this.captchaIsTrue = true;
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 注册
    // register() {
    //  //验证码通过时,注册
    //   if (this.captchaIsTrue) {
    //     this.axios({
    //       method: "GET",
    //       url: "/register/cellphone",
    //       parmas: {
    //         captcha: this.captcha,
    //         phone: this.phone,
    //         password: this.password,
    //         nickname: this.nickname,
    //       },
    //     })
    //       .then((result) => {
    //         
    //         this.$toast('注册成功')
    //         this.$router.push({name:'Login'})
    //       })
    //       .catch((err) => {
    //         
    //       });
    //   }else{
    //     this.$toast('验证码错误')
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
</style>