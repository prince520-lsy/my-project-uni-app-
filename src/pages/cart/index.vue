<template>
    <view class="main">
      <!-- 内容列表 -->
      <scroll-view scroll-y class="viewport">
        <!-- 购物车列表 -->
        <template v-if="profile">
          <!-- 优惠提示 -->
          <view class="tips">
            <text class="label">满减</text>
            <text class="desc">满1件, 即可享受9折优惠</text>
          </view>
          <view class="blank" v-if="carts.length === 0">
            购物车还是空的，快来挑选好货吧
          </view>
          <!-- 购物车商品 -->
          <view class="carts">
            <uni-swipe-action>
              <uni-swipe-action-item
                class="swipe-cell"
                v-for="item in carts"
                :key="item.skuId"
              >
                <navigator
                  hover-class="none"
                  :url="'/pages/goods/index?id=' + item.id"
                  class="card"
                >
                  <text
                    :class="[
                      'checkbox',
                      `icon-${item.selected ? 'checked' : 'ring'}`,
                    ]"
                    @tap.stop="changeSelected(item.skuId)"
                  ></text>
                  <!-- 商品缩略图 -->
                  <image class="thumb" :src="item.picture"></image>
                  <view class="meta">
                    <!-- 商品名称 -->
                    <view class="name ellipsis">{{ item.name }}</view>
                    <!-- 商品类型 -->
                    <view class="type ellipsis">{{ item.attrsText }}</view>
                    <!-- 价格 -->
                    <view class="price"> ¥{{ item.price }} </view>
                    <!-- 商品数量，阻止冒泡 -->
                    <view class="quantity" @tap.stop="() => {}">
                      <text @tap="changeCount(item.skuId, -1)" class="text"
                        >-</text
                      >
                      <input class="input" type="text" :value="item.count" />
                      <text @tap="changeCount(item.skuId, 1)" class="text"
                        >+</text
                      >
                    </view>
                  </view>
                </navigator>
  
                <template v-slot:right>
                  <view class="swipe-cell-action">
                    <button class="collect-button">移入收藏</button>
                    <button @tap="deleteCart(item.skuId)" class="delete-button">
                      删除
                    </button>
                  </view>
                </template>
              </uni-swipe-action-item>
            </uni-swipe-action>
          </view>
        </template>
  
        <view class="blank" v-else>
          <text>登后后可查看购物车中的商品</text>
          <navigator url="/pages/login/index" hover-class="none">
            <button class="button">去登录</button>
          </navigator>
        </view>
        <!-- 状态提示 -->
      </scroll-view>
  
      <!-- 底部操作栏 -->
      <!-- 内容列表 -->
  
      <!-- 底部操作栏 -->
      <view class="toolbar" v-if="profile && carts.length !== 0">
        <text
          class="all"
          :class="{ checked: isSelectedAll }"
          @tap="changeSelectedAll"
          >全选</text
        >
        <text class="text">合计:</text>
        <text class="amount">{{ selectedCartsPrice }}</text>
        <!-- 操作按钮 -->
        <view class="buttons">
          <view
            class="button payment"
            @click="goToOrderCreate"
            :class="{ disabled: selectedCartsCount === 0 }"
          >
            去结算({{ selectedCartsCount }})
          </view>
          <view class="button collect">移入收藏</view>
          <view class="button delete">删除</view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import { getMemberCart, putMemberCart } from "@/http/cart";
  export default {
    computed: {
      ...mapState("user", ["profile"]),
      // 勾选了的购物车数组
      selectedCarts() {},
      // 是否全选
      isSelectedAll() {},
      // 勾选的商品总价
      selectedCartsPrice() {},
      // 勾选的商品熟练
      selectedCartsCount() {},
    },
    data() {
      return {
        // 购物车数组
        carts: [],
      };
    },
    onLoad() {
      // 先判断有没有登录信息 才去发送请求
      if (this.profile) {
        // 发送请求获取购物车数组
        this.loadData();
      }
    },
    methods: {
      async loadData() {
        const result = await getMemberCart();
        this.carts = result.result;
      },
      // 切换商品选中状态
      async changeSelected(skuId) {
        // 根据skuId来找到它所在数组的下标
        const index = this.carts.findIndex((v) => v.skuId === skuId);
        // 获取它对应的选中状态 取反
        const selected = !this.carts[index].selected;
        // 拼接参数 发送给后端
        await putMemberCart(skuId, { selected });
        // 假设成功 给出提示
        // 重新获取最新的数据
        this.loadData();
      },
    },
  };
  </script>
  
  <style lang="scss">
  page {
    background-color: #f7f7f8;
    height: 100%;
  }
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .viewport {
    min-height: 400rpx;
  }
  /* 顶部工具栏 */
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 30rpx;
    font-size: 26rpx;
    color: #262626;
    background-color: #fff;
    .extra {
      display: flex;
      align-items: center;
      height: 24rpx;
      border-left: 1rpx solid #bfbfbf;
      .edit {
        padding: 0 30rpx;
      }
      .menu {
        width: 9rpx;
        height: 9rpx;
        padding: 14rpx;
        border-radius: 50%;
        background-color: #262626;
        background-clip: content-box;
        position: relative;
        &::before {
          left: 0;
        }
        &::after {
          right: 0;
        }
      }
    }
  }
  .topbar .extra .menu::before,
  .topbar .extra .menu::after {
    position: absolute;
    top: 50%;
    content: "";
    width: 6rpx;
    height: 4rpx;
    background-color: #8c8c8c;
    transform: translateY(-50%);
    border-radius: 4rpx;
  }
  /* 优惠提示 */
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 30rpx;
    font-size: 26rpx;
    color: #666;
    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }
  .carts {
    padding: 0 20rpx;
    .card {
      display: flex;
      padding: 20rpx 20rpx 20rpx 80rpx;
      border-radius: 10rpx;
      background-color: #fff;
      position: relative;
      .checkbox {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 100%;
        font-size: 40rpx;
        color: #444;
      }
      .icon-checked {
        color: #27ba9b;
      }
      .thumb {
        width: 170rpx;
        height: 170rpx;
      }
      .meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20rpx;
      }
      .name {
        height: 72rpx;
        font-size: 26rpx;
        color: #444;
      }
      .type {
        line-height: 1.8;
        padding: 0 15rpx;
        font-size: 24rpx;
        align-self: flex-start;
        border-radius: 4rpx;
        color: #888;
        background-color: #f7f7f8;
      }
      .price {
        line-height: 1;
        font-size: 26rpx;
        color: #444;
        margin-bottom: 2rpx;
      }
      .warning {
        color: #cf4444;
        font-size: 24rpx;
      }
      .quantity {
        position: absolute;
        bottom: 20rpx;
        right: 5rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 220rpx;
        height: 48rpx;
        .text {
          height: 100%;
          padding: 0 20rpx;
          font-size: 32rpx;
          color: #444;
        }
        .input {
          height: 100%;
          text-align: center;
          border-radius: 4rpx;
          font-size: 24rpx;
          color: #444;
          background-color: #f6f6f6;
        }
      }
    }
    .swipe-cell {
      display: block;
      margin-top: 20rpx;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  /* 购物车商品 */
  /* 购物车状态提示 */
  .blank {
    padding: 100rpx 0 60rpx;
    text-align: center;
    color: #444;
    font-size: 26rpx;
    .button {
      width: 240rpx !important;
      height: 60rpx;
      line-height: 60rpx;
      margin-top: 25rpx;
      font-size: 26rpx;
      border-radius: 60rpx;
      color: #fff;
      background-color: #27ba9b;
      &::after {
        display: none;
      }
    }
  }
  /* 吸底工具栏 */
  .toolbar {
    position: relative;
    padding: 32rpx 20rpx 28rpx;
    border-top: 1rpx solid #ededed;
    border-bottom: 1rpx solid #ededed;
    background-color: #fff;
    .all {
      margin-left: 25rpx;
      font-size: 14px;
      color: #444;
      &::before {
        font-family: "erabbit" !important;
        content: "\e6cd";
        font-size: 36rpx;
        margin-right: 8rpx;
        vertical-align: -4rpx;
      }
    }
    .checked {
      &::before {
        content: "\e6cc";
        color: #27ba9b;
      }
    }
    .text {
      margin-right: 8rpx;
      margin-left: 32rpx;
      color: #444;
      font-size: 14px;
    }
    .amount {
      font-size: 20px;
      color: #cf4444;
      vertical-align: -1px;
      &::before {
        content: "￥";
        font-size: 12px;
      }
      .decimal {
        font-size: 12px;
      }
    }
    .buttons {
      position: absolute;
      right: 10rpx;
      top: 50%;
      display: flex;
      justify-content: space-between;
      text-align: center;
      line-height: 72rpx;
      font-size: 13px;
      color: #fff;
      transform: translateY(-50%);
      .button {
        width: 240rpx;
        margin: 0 10rpx;
        border-radius: 72rpx;
      }
    }
    .payment {
      background-color: #27ba9b;
    }
    .disabled {
      opacity: 0.6;
    }
    .delete {
      display: none;
      background-color: #27ba9b;
    }
    .collect {
      display: none;
      background-color: #ffa868;
    }
  }
  .swipe-cell-action {
    display: flex;
    height: 100%;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }
    .collect-button {
      background-color: #ffa868;
    }
    .delete-button {
      background-color: #cf4444;
    }
  }
  </style>
  