<template>
    <view class="payment">
      <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
        <view class="wrap">
          <navigator class="back icon-left" @click="goBack"></navigator>
          <view :class="['title', platform]">支付成功</view>
        </view>
      </view>
  
      <scroll-view
        class="viewport"
        id="scrollView"
        enhanced
        scroll-y
        :show-scrollbar="false"
      >
        <!-- 订单状态 -->
        <view class="overview" :style="{ paddingTop: safeArea.top + 40 + 'px' }">
          <view class="status icon-checked">支付成功</view>
          <view class="buttons">
            <navigator
              hover-class="none"
              class="button"
              open-type="switchTab"
              url="/pages/index/index"
            >
              返回首页
            </navigator>
            <navigator hover-class="none" url="/pages/order/index">
              查看订单
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </template>
  <script>
  import { mapState } from "vuex";
  export default {
    computed: {
      ...mapState(["safeArea", "platform"]),
    },
    data() {
      return {};
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
    },
  };
  </script>
  <style lang="scss">
  .payment {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  
  .navbar {
    width: 750rpx;
    color: #fff;
    background-color: #27ba9b;
  
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }
  
  .navbar .title {
    height: 40px;
    line-height: 30px;
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    opacity: 0;
  }
  
  .navbar .android {
    text-align: left;
    padding-left: 42px;
  }
  
  .navbar .wrap {
    position: relative;
  }
  
  .navbar .back {
    position: absolute;
    left: 10px;
    top: 4px;
    line-height: 1;
    font-size: 23px;
    z-index: 9;
  }
  
  .viewport {
    background-color: #f7f7f8;
  }
  
  .overview {
    line-height: 1;
    padding-bottom: 70rpx;
    color: #fff;
    background-color: #27ba9b;
  }
  
  .overview .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }
  
  .overview .status::before {
    display: block;
    font-size: 110rpx;
    margin-bottom: 20rpx;
  }
  
  .overview .buttons {
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60rpx;
  }
  
  .overview navigator {
    text-align: center;
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #fff;
  
    &:first-child {
      width: 200rpx;
      border-radius: 64rpx;
      border: 1rpx solid #fff;
    }
  }
  </style>
  