<template>
    <view class="viewport">
      <!-- 搜索框 -->
      <view class="search">
        <view class="input">
          <text class="icon-search">女靴</text>
        </view>
      </view>
      <!-- 分类 -->
      <view class="categories">
        <!-- 左侧标题滚动组件 -->
        <scroll-view class="primary" scroll-y>
          <view
            v-for="(item, index) in categoryTop"
            :key="item.id"
            class="item"
            :class="{ active: activeIndex === index }"
            @click="activeIndex = index"
          >
            {{ item.name }}
          </view>
        </scroll-view>
        <!-- 右侧滚动组件 -->
        <scroll-view class="secondary" scroll-y>
          <!-- 焦点图 -->
          <Carousel class="banner" height="200rpx" :banners="banners"></Carousel>
          <!-- 区块 -->
          <view class="panel" v-for="item in categorySubList" :key="item.id">
            <view class="title">
              {{ item.name }}
              <navigator
                class="more"
                hover-class="none"
                url="/pages/goods/list/index"
                >全部</navigator
              >
            </view>
            <view class="section">
              <navigator
                v-for="goods in item.goods"
                :key="goods.id"
                hover-class="none"
                :url="`/pages/goods/index?id=${goods.id}`"
              >
                <image :src="goods.picture"></image>
                <view class="name ellipsis">{{ goods.name }}</view>
                <view class="price">
                  <text class="symbol">¥</text>
                  <text class="number">{{ goods.price }}</text>
                </view>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </template>
  <script>
  import { getCategoryTop } from "@/http/category";
  import { getHomeBanner } from "@/http/home";
  export default {
    data() {
      return {
        // 分类数据
        categoryTop: [],
        // 当前显示的菜单下标
        activeIndex: 0,
        // 轮播图
        banners: [],
      };
    },
    computed: {
      // 根据下标和一级分类  计算出 要显示的二级分类数据
      categorySubList() {
        if (this.categoryTop.length) {
          return this.categoryTop[this.activeIndex].children;
        }
  
        return [];
      },
    },
    onLoad() {
      getCategoryTop().then((result) => {
        this.categoryTop = result.result;
      });
  
      // 获取轮播图
      getHomeBanner(2).then((result) => {
        this.banners = result.result;
      });
    },
  };
  </script>
  
  <style lang="scss">
  page {
    height: 100%;
    overflow: hidden;
  }
  .viewport {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .search {
    padding: 0 30rpx 20rpx;
    background-color: #fff;
    .input {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64rpx;
      padding-left: 26rpx;
      color: #8b8b8b;
      font-size: 28rpx;
      border-radius: 32rpx;
      background-color: #f3f4f4;
    }
  }
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  /* 分类 */
  .categories {
    flex: 1;
    min-height: 400rpx;
    display: flex;
  }
  /* 主分类 */
  .primary {
    overflow: hidden;
    width: 180rpx;
    flex: none;
    background-color: #f6f6f6;
    .item {
      height: 96rpx;
      text-align: center;
      line-height: 96rpx;
      font-size: 26rpx;
      color: #595c63;
      position: relative;
      &::after {
        position: absolute;
        left: 42rpx;
        bottom: 0;
        content: "";
        width: 96rpx;
        border-top: 1rpx solid #e3e4e7;
      }
    }
    .active {
      background-color: #fff;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: "";
        width: 8rpx;
        height: 100%;
        background-color: #27ba9b;
      }
    }
  }
  .primary .item:last-child::after,
  .primary .active::after {
    display: none;
  }
  /* 次分类 */
  .secondary {
    background-color: #fff;
    .banner {
      height: 200rpx;
      margin: 30rpx;
      border-radius: 4rpx;
      overflow: hidden;
    }
    .panel {
      margin: 0 30rpx 0rpx;
    }
    .title {
      height: 60rpx;
      line-height: 60rpx;
      color: #333;
      font-size: 28rpx;
      border-bottom: 1rpx solid #f7f7f8;
      .more {
        float: right;
        padding-left: 20rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
    .more {
      &::after {
        font-family: "erabbit" !important;
        content: "\e6c2";
      }
    }
    .section {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 20rpx 0;
      navigator {
        width: 150rpx;
        margin: 0rpx 30rpx 20rpx 0;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
    navigator {
      image {
        width: 126rpx;
        height: 126rpx;
      }
      .name {
        font-size: 26rpx;
        color: #333;
      }
      .price {
        font-size: 18rpx;
        color: #cf4444;
      }
      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
      }
    }
  }
  </style>