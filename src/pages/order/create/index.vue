<template>
    <view class="order-create">
      <scroll-view scroll-y class="viewport">
        <!-- 收货地址 -->
        <navigator
          class="shipment"
          hover-class="none"
          url="/pages/my/address/index?from=order"
          v-if="selectedAddress"
        >
          <view class="user">
            {{ selectedAddress.receiver }} {{ selectedAddress.contact }}
          </view>
          <view class="address">
            {{ selectedAddress.fullLocation }}{{ selectedAddress.address }}
          </view>
          <text class="icon icon-right"></text>
        </navigator>
  
        <!-- 没有收货地址 -->
        <navigator
          class="shipment"
          hover-class="none"
          url="/pages/my/address/index?from=order"
          v-else
        >
          <view class="address"> 请选择收货地址 </view>
          <text class="icon icon-right"></text>
        </navigator>
  
        <!-- 商品信息 -->
        <view class="goods">
          <navigator
            v-for="item in orderPre.goods"
            :key="item.skuId"
            :url="`/pages/goods/index?id=${item.id}`"
            class="item"
            hover-class="none"
          >
            <image class="cover" :src="item.picture"></image>
            <view class="meta">
              <view class="name ellipsis">
                {{ item.name }}
              </view>
              <view class="type">{{ item.attrsText }}</view>
              <view class="price">
                <view class="actual">
                  <text class="symbol">¥</text>{{ item.payPrice }}
                </view>
                <view class="original">
                  <text class="symbol">¥</text>{{ item.price }}
                </view>
              </view>
              <view class="quantity">x{{ item.count }}</view>
            </view>
          </navigator>
        </view>
  
        <!-- 配送及支付方式 -->
        <view class="related">
          <view class="item">
            <text class="text">配送时间</text>
            <text class="picker icon-fonts">{{ payments[0].text }}</text>
          </view>
          <view class="item">
            <text class="text">支付方式</text>
            <text class="picker icon-fonts">{{ shipments[0].text }}</text>
          </view>
          <view class="item">
            <text class="text">买家备注</text>
            <input
              v-model="buyerMessage"
              cursor-spacing="30"
              placeholder="建议留言前先与商家沟通确认"
            />
          </view>
        </view>
  
        <!-- 支付金额 -->
        <!-- 支付金额 -->
        <view class="settlement">
          <view class="item">
            <text class="text">商品总价: </text>
            <text class="number">
              <text class="symbol">¥</text>
              {{ orderPre.summary.totalPrice }}元
            </text>
          </view>
          <view class="item">
            <text class="text">运费: </text>
            <text class="number">
              <text class="symbol">¥</text>
              {{ orderPre.summary.postFee }}
            </text>
          </view>
          <!-- 如果有折扣，渲染折扣金额，没有折扣就不渲染了，免得用户伤心 -->
          <view class="item" v-if="orderPre.summary.discountPrice > 0">
            <text class="text">折扣: </text>
            <text class="number danger">
              <text class="symbol">-¥</text>
              {{ orderPre.summary.discountPrice }}
            </text>
          </view>
        </view>
      </scroll-view>
  
      <!-- 底部工具 -->
      <view class="toolbar">
        <view class="amount">
          <text class="symbol">¥</text>
          <text class="number">{{ orderPre.summary.totalPayPrice }}</text>
        </view>
        <view @click="submitForm" class="button">提交订单</view>
      </view>
    </view>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import { getMembeOrderPre, postMembeOrder } from "@/http/order";
  export default {
    computed: {
      ...mapState("address", ["selectedAddress"]),
    },
    data() {
      return {
        // 预付订单列表
        orderPre: null,
        // 配送时间
        payments: [
          {
            id: 1,
            text: "时间不限 (周一至周日)",
          },
          {
            id: 2,
            text: "工作日送 (周一至周五)",
          },
          {
            id: 3,
            text: "周末配送 (周六至周日)",
          },
        ],
        // 支付方式
        shipments: [
          {
            id: 1,
            text: "在线支付",
          },
          {
            id: 2,
            text: "货到付款",
          },
        ],
        // 买家留言
        buyerMessage: "",
      };
    },
    async onShow() {
      const result = await getMembeOrderPre();
      this.orderPre = result.result;
      console.log(result);
    },
    methods: {
      // 提交订单
      async submitForm() {
        // 判断有没有收货地址
        if (!this.selectedAddress) {
          return uni.showToast({ title: "您还没有选择地址", icon: "none" });
        }
        // 拼接参数 来创建订单 postMembeOrder
        const data = {
          //  所选地址Id
          addressId: this.selectedAddress.id,
  
          //  买家留言
          buyerMessage: this.buyerMessage,
  
          //  配送时间类型，1为不限，2为工作日，3为双休或假日
          deliveryTimeType: 1,
  
          //  商品集合[ 商品信息 ]
          goods: this.orderPre.goods.map((v) => ({
            skuId: v.skuId,
            count: v.count,
          })),
  
          //  支付渠道：支付渠道，1支付宝、2微信--支付方式为在线支付时，传值，为货到付款时，不传值
          payChannel: 2,
  
          //  支付方式，1为在线支付，2为货到付款
          payType: 1,
        };
        await postMembeOrder(data);
        // 创建成功 跳转到 订单详情页面
        uni.showToast({ title: "订单创建成功" });
        setTimeout(() => {
          console.log("跳转到订单详情");
          uni.navigateTo({ url: "/pages/order/detail" }); // 还没有创建
        }, 1500);
      },
    },
  };
  </script>
  
  <style lang="scss">
  .safe-area-bottom {
    background-color: #fff;
  }
  .order-create {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background-color: #f4f4f4;
  }
  
  .viewport {
    padding-top: 20rpx;
  }
  
  .shipment {
    padding: 30rpx 30rpx 25rpx 84rpx;
    margin: 0 20rpx;
    font-size: 26rpx;
    border-radius: 10rpx;
    background: url(https://static.botue.com/erabbit/static/images/locate.png)
      20rpx center / 50rpx no-repeat #fff;
    position: relative;
  }
  
  .shipment .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }
  
  .shipment .user {
    color: #333;
    margin-bottom: 5rpx;
  }
  
  .shipment .address {
    color: #666;
  }
  
  .link {
    margin: 20rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }
  
  .popup-root {
    .list {
      padding: 20rpx 0 40rpx 10rpx !important;
    }
  
    .list .item {
      padding: 30rpx 60rpx 30rpx 10rpx;
      position: relative;
    }
  
    .list .item .icon {
      color: #999;
      font-size: 40rpx;
      transform: translateY(-50%);
      position: absolute;
      top: 50%;
      right: 10rpx;
    }
  
    .list .item .icon-checked {
      color: #27ba9b;
    }
  
    .list .item .text {
      font-size: 28rpx;
      color: #444;
    }
  }
  
  .goods {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  
  .goods .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;
  }
  
  .goods .item:first-child {
    border-top: none;
  }
  
  .goods .item .cover {
    width: 170rpx;
    height: 170rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }
  
  .goods .item .meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }
  
  .goods .item .name {
    height: 80rpx;
    font-size: 26rpx;
    color: #444;
  }
  
  .goods .item .type {
    line-height: 1.8;
    padding: 0 15rpx;
    margin-top: 6rpx;
    font-size: 24rpx;
    align-self: flex-start;
    border-radius: 4rpx;
    color: #888;
    background-color: #f7f7f8;
  }
  
  .goods .item .price {
    display: flex;
    align-items: baseline;
    margin-top: 6rpx;
    font-size: 28rpx;
  }
  
  .goods .item .symbol {
    font-size: 20rpx;
  }
  
  .goods .item .original {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
  }
  
  .goods .item .actual {
    margin-right: 10rpx;
    color: #cf4444;
  }
  
  .goods .item .quantity {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 26rpx;
    color: #444;
  }
  
  .related {
    padding: 0 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;
  }
  
  .related .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }
  
  .related input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }
  
  .related .item .text {
    width: 125rpx;
  }
  
  .related .picker {
    color: #666;
  }
  
  .related .picker::after {
    content: "\e6c2";
  }
  
  /* 结算清单 */
  .settlement {
    padding: 0 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;
  }
  
  .settlement .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }
  
  .settlement .symbol {
    font-size: 80%;
  }
  
  .settlement .danger {
    color: #cf4444;
  }
  
  .gap {
    height: 20rpx;
  }
  
  .toolbar {
    height: 120rpx;
    padding: 0 40rpx;
    border-top: 1rpx solid #eaeaea;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .toolbar .amount {
    font-size: 40rpx;
    color: #cf4444;
  }
  
  .toolbar .amount .symbol,
  .toolbar .amount .decimal {
    font-size: 75%;
  }
  
  .toolbar .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }
  </style>
  