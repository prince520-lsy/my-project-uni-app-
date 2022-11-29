<template>
    <view class="category-head-mutli">
      <scroll-view scroll-x @scroll="handleCategory">
        <view class="scroll-wrap">
          <view class="category-head-mutli-item">
            <navigator v-for="item in categoryHeadMutli" :key="item.id">
              <image mode="widthFix" :src="item.icon"></image>
              <text>{{ item.name }}</text>
            </navigator>
          </view>
        </view>
      </scroll-view>
      <view class="scroll-bar">
        <view
          class="scroll-bar-inner"
          :style="{ transform: `translateX(${scrollLeft})` }"
        ></view>
      </view>
    </view>
  </template>
  
  <script>
  import { mapState } from "vuex";
  export default {
    props: ["categoryHeadMutli"],
    computed: {
      ...mapState(["safeArea"]),
    },
    data() {
      return {
        scrollLeft: 0,
      };
    },
    methods: {
      handleCategory(e) {
        // 获取当前滚动的距离  scrollLeft
        // 将 scrollLeft 和  一个屏幕的宽度  除法运算，来获得 对应百分比
        // 把百分比 设置 给 滑块   transform:translateX()      translateX 写百分比单位的话 相对于自身的宽度
        const scrollLeft = e.detail.scrollLeft;
        // console.log(scrollLeft);
        // 知道我们当前的屏幕有多宽
        const screenWidth = this.safeArea.width;
  
        // 获取 对应滑动的比例
        const rate = (scrollLeft / screenWidth) * 100 + "%";
  
        // 设置变量
        this.scrollLeft = rate;
      },
    },
  };
  </script>
  
  <style lang="scss">
  .category-head-mutli {
    background-color: #f7f7f8;
    position: relative;
    padding-bottom: 30rpx;
    .scroll-wrap {
      width: 200%;
    }
    .category-head-mutli-item {
      width: 50%;
      display: flex;
      flex-wrap: wrap;
      navigator {
        text-align: center;
        width: 20%;
        padding: 15rpx;
  
        image {
          width: 100rpx;
          display: block;
          margin: 0 auto;
        }
        text {
          font-size: 26rpx;
          color: #666;
        }
      }
    }
    .scroll-bar {
      position: absolute;
      bottom: 15rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 100rpx;
      height: 8rpx;
      background-color: #e2e2e2;
      z-index: 200;
      .scroll-bar-inner {
        width: 50%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #00c09b;
      }
    }
  }
  </style>