<template>
    <view class="viewport">
      <!-- 顶部背景 -->
      <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
        <view class="back icon-left" @click="goBack"></view>
        <view class="title">个人信息</view>
      </view>
      <scroll-view scroll-y>
        <!-- 头像 -->
        <view class="avatar" @tap="changeAvatar">
          <image :src="memberProfile.avatar" mode="aspectFill" />
          <text>点击修改头像</text>
        </view>
        <view class="form">
          <view class="form-item">
            <text class="label">账号</text>
            <!-- 账号名不能修改，用 text 组件展示 -->
            <text>{{ memberProfile.account }}</text>
          </view>
          <view class="form-item">
            <text class="label">昵称</text>
            <!-- 输入框通过 v-model 双向绑定修改数据 -->
            <input v-model="memberProfile.nickname" />
          </view>
          <view class="form-item">
            <text class="label">性别</text>
            <radio-group @change="genderChange">
              <label class="radio">
                <radio
                  value="男"
                  color="#27ba9b"
                  :checked="memberProfile.gender === '男'"
                />
                男
              </label>
              <label class="radio">
                <radio
                  value="女"
                  color="#27ba9b"
                  :checked="memberProfile.gender === '女'"
                />
                女
              </label>
            </radio-group>
          </view>
          <view class="form-item">
            <text class="label">出生日期</text>
            <picker
              @change="handleBirthdayChange"
              mode="date"
              start="1900-01-01"
              end="2022-01-01"
            >
              <view>{{ memberProfile.birthday || "请选择日期" }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">城市</text>
            <picker @change="handleFullLocationChange" mode="region">
              <view>{{ memberProfile.fullLocation || "请选择城市" }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">职业</text>
            <!-- 输入框通过 v-model 双向绑定修改数据 -->
            <input v-model="memberProfile.profession" placeholder="请填写职业" />
          </view>
          <!-- 提交按钮 -->
          <view class="button" @click="handleSubmitForm">保 存</view>
        </view>
      </scroll-view>
    </view>
  </template>
  
  <script>
  /* 
  1 修改头像
     1 给头像绑定点击事件 - 对应处理函数  changeAvatar
     2 调用小程序 内置的  选择图片-拍照的API  chooseImage
     3 返回 选择图片的临时地址  上传给后端接口 - 完成头像上传 - 头像修改功能
     4 修改成功之后， 重新发送一次请求 获取最新数据  显示出来 
   */
  import { mapState } from "vuex";
  import { getMembeProfile } from "@/http/profile";
  export default {
    data() {
      return {
        // 会员信息
        memberProfile: null,
      };
    },
    computed: {
      ...mapState(["safeArea"]),
      // 标签用的 memberProfile
      // 存vuex  profile     两个数据对应不上！！！
    },
    onLoad() {
      this.getMemberProfile();
    },
    methods: {
      async getMemberProfile() {
        const result = await getMembeProfile();
        this.memberProfile = result.result;
      },
      // 修改头像
      async changeAvatar() {
        // uni api promise 有返回值   数组
        const [imgErr, imgResult] = await uni.chooseImage({
          count: 1, // 只能选择一张图片
        });
        // 获取临时的图片地址 内存图片地址
        const tempFilePath = imgResult.tempFilePaths[0];
        // 将这张图片 上传到 后端接口中 完成  头像修改功能
        // ！！！小程序中 发起普通的网络请求 和 文件上传 是用不同的API -  不像以前web的ajax
        const [uploadErr, uploadResult] = await uni.uploadFile({
          // 简写（当初在拦截器中统一设置了）
          url: "/member/profile/avatar",
          filePath: tempFilePath,
          name: "file",
        });
        // 获取最新数据
        this.getMemberProfile();
      },
      // 修改性别
      genderChange(event) {
        // console.log(event);
        this.memberProfile.gender = event.detail.value;
      },
      // 修改生日
      handleBirthdayChange(event) {
        // console.log(event);
        this.memberProfile.birthday = event.detail.value;
      },
      // 区域地址修改
      handleFullLocationChange(event) {
        // 数组  [1000021,200012,30003]   省 市  区 编码 相等
        const { code } = event.detail;
  
        //  vue  针对data中的数据-对象， 如果 新增了属性， vue 无法做到 监听 ，
        // 无法 做到 对新增数据的 双向绑定
        // this.memberProfile.provinceCode = code[0];
        // this.memberProfile.cityCode = code[1];
        // this.memberProfile.countyCode = code[2];
  
        // 如果 写代码   发现   点语法不生效 并且 是新增属性   解决方法 $set
        // 修改成 $set 的方式 才能实现 后期双向绑定
        this.$set(this.memberProfile, "provinceCode", code[0]);
        this.$set(this.memberProfile, "cityCode", code[1]);
        this.$set(this.memberProfile, "countyCode", code[2]);
      },
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
    },
  };
  </script>
  
  <style lang="scss">
  page {
    height: 100%;
    overflow: hidden;
    background-color: #f4f4f4;
  }
  .viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url(https://static.botue.com/erabbit/static/images/order_bg.png);
    background-size: auto 392rpx;
    background-repeat: no-repeat;
  }
  .navbar {
    .title {
      height: 40px;
      line-height: 32px;
      text-align: center;
      font-size: 17px;
      font-weight: 500;
      color: #fff;
    }
    .back {
      position: absolute;
      left: 20rpx;
      top: 22px;
      font-size: 23px;
      z-index: 9;
      color: #fff;
    }
  }
  .avatar {
    text-align: center;
    padding: 20rpx 0 40rpx;
    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
    }
    text {
      display: block;
      padding-top: 20rpx;
      line-height: 1;
      font-size: 26rpx;
      color: #fff;
    }
  }
  .form {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
    .form-item {
      display: flex;
      height: 96rpx;
      line-height: 46rpx;
      padding: 25rpx 10rpx;
      background-color: #fff;
      font-size: 28rpx;
      border-bottom: 1rpx solid #ddd;
      &:last-child {
        border: none;
      }
      .label {
        width: 180rpx;
        color: #333;
      }
      input {
        flex: 1;
        display: block;
        height: 46rpx;
      }
      .radio {
        display: inline-block;
        height: 46rpx;
        margin-right: 20rpx;
        vertical-align: middle;
      }
      radio {
        transform: scale(0.7) translateY(-2px);
      }
      picker {
        flex: 1;
      }
    }
  }
  .button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
  </style>