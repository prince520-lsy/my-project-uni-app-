<template>
    <view class="viewport">
      <!-- 推荐封面 -->
      <view class="cover">
        <image :src="bannerPicture"></image>
      </view>
      <!-- tab栏 -->
      <view class="tabs">
        <text
          class="text"
          v-for="(item, index) in recommendList"
          :key="index"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          {{ item.subTypes.title }}
        </text>
      </view>
      <!-- 列表内容 -->
      <scroll-view
        scroll-y
        class="scroll-view"
        @scrolltolower="handleScrolltolower"
        v-for="(item, index) in recommendList"
        :key="index"
        v-show="activeIndex === index"
      >
        <view class="goods">
          <navigator
            hover-class="none"
            class="navigator"
            v-for="goods in item.goodsItems.items"
            :key="goods.id"
            :url="`/pages/goods/index?id=${goods.id}`"
          >
            <image class="thumb" :src="goods.picture"></image>
            <view class="name ellipsis">{{ goods.name }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ goods.price }}</text>
            </view>
          </navigator>
        </view>
        <view class="loading">正在加载...</view>
      </scroll-view>
    </view>
  </template>
  <script>
  import { getHomeRecommend } from "@/http/home";
  export default {
    data() {
      return {
        // 背景大图
        bannerPicture: "",
        // 当前显示的tab栏
        activeIndex: 0,
        // 列表数据
        recommendList: [],
      };
    },
    async onLoad({ type }) {
      // 存放页面标题 和 获取数据的url
      const urlMap = {
        1: { title: "特惠推荐", url: "/home/preference/mutli" },
        2: { title: "爆款推荐", url: "/home/inVogue/mutli" },
        3: { title: "一站买全", url: "/home/oneStop/mutli" },
        4: { title: "领券中心", url: "/home/new/mutli" }, // 后端未提供，暂用新鲜好物url
        5: { title: "新鲜好物", url: "/home/new/mutli" },
      };
  
      // 获取当前type对应的数据  将它设置成一个全局变量 this
      this.currentInfo = urlMap[type];
      // console.log(currentInfo);
  
      // 动态的设置 页面的标题
      uni.setNavigationBarTitle({ title: this.currentInfo.title });
  
      // 发送请求获取对应的数据
      const result = await getHomeRecommend(this.currentInfo.url);
      console.log(result);
  
      // 设置背景大图
      this.bannerPicture = result.result.bannerPicture;
      // 构造数据列表
      this.recommendList = result.result.subTypes.map((v) => {
        // 获取 subTypes id对应的数据
        const id = v.id;
        // id 就是 goodsItem的key，根据key获取对应的值
        const value = result.result.goodsItems[id];
  
        return {
          // tab栏要的数据 构造好
          subTypes: v,
          // 商品列表相关的数据
          goodsItems: value,
        };
      });
      console.log(this.recommendList);
    },
    methods: {
      // 滚动条触底事件
      async handleScrolltolower() {
        // 先知道当前是对哪组数据做分页
        const currentShow = this.recommendList[this.activeIndex];
        // 判断还有没有下一页数据
        // 拿当前页码和总页数比较  ||   拿当前数组长度 和 总条数做比较
        const { page, pages } = currentShow.goodsItems;
        if (page >= pages) {
          uni.showToast({ title: "没有更多数据啦", icon: "none" });
          return;
        }
  
        // 根据接口要求，构造参数
        const data = {
          // tab项的id
          subType: currentShow.subTypes.id,
          page: page + 1,
          pageSize: 10,
        };
  
        // 重新发送请求
        const result = await getHomeRecommend(this.currentInfo.url, data);
        // console.log(result);
  
        // 实现 新旧数据的合并  重点！！
        // 获取新数据对应的goodsItems对象
        // const obj= result.result.goodsItems;
        // const id = currentShow.subTypes.id;
        // const newGoodsItems =obj[id];
        const newGoodsItems = result.result.goodsItems[currentShow.subTypes.id];
        // console.log("新数据");
        // console.log(newGoodsItems);
  
        // 直接覆盖  全部覆盖
        // this.recommendList[this.activeIndex].goodsItems = newGoodsItems;
        this.recommendList[this.activeIndex].goodsItems = {
          ...newGoodsItems,
          // items:[...旧的items,...新的items]
          items: [
            ...this.recommendList[this.activeIndex].goodsItems.items,
            ...newGoodsItems.items,
          ],
        };
      },
    },
  };
  </script>
  
  <style lang="scss">
  page {
    height: 100%;
    background-color: #f4f4f4;
  }
  .viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 180rpx 0 0;
    position: relative;
  }
  .cover {
    width: 750rpx;
    height: 225rpx;
    border-radius: 0 0 40rpx 40rpx;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
  }
  .tabs {
    display: flex;
    justify-content: space-evenly;
    height: 100rpx;
    line-height: 90rpx;
    margin: 0 20rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
    color: #333;
    background-color: #fff;
    position: relative;
    z-index: 9;
    .text {
      margin: 0 20rpx;
      position: relative;
    }
    .active {
      &::after {
        content: "";
        width: 40rpx;
        height: 4rpx;
        transform: translate(-50%);
        background-color: #27ba9b;
        position: absolute;
        left: 50%;
        bottom: 24rpx;
      }
    }
  }
  .scroll-view {
    flex: 1;
    overflow: hidden;
  }
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx 20rpx;
    .navigator {
      width: 345rpx;
      padding: 20rpx;
      margin-top: 20rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .thumb {
      width: 305rpx;
      height: 305rpx;
    }
    .name {
      height: 88rpx;
      font-size: 26rpx;
    }
    .price {
      line-height: 1;
      color: #cf4444;
      font-size: 30rpx;
    }
  }
  .goods .symbol,
  .goods .decimal {
    font-size: 70%;
  }
  </style>