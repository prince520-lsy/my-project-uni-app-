<template>
  <view class="order-detail">
    <!-- 顶部导航栏 -->
    <!-- 顶部导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
      <view class="wrap">
        <navigator open-type="navigateBack" class="back icon-left"></navigator>
        <view :class="['title', platform]">订单详情</view>
      </view>
    </view>

    <!-- 内容 -->
    <scroll-view class="viewport" scroll-y>
      <!-- 订单状态 -->
      <view class="overview" :style="{ paddingTop: safeArea.top + 40 + 'px' }">
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view class="status icon-clock">等待付款</view>
          <view class="tips">
            <text>应付金额: ¥{{ order.payMoney }}</text>
            <text class="countdown"> 支付剩余 {{ countdown }} </text>
          </view>
          <view @tap="orderPay" class="button">去支付</view>
        </template>
        <template v-else>
          <view class="status icon-clock">
            {{ OrderStateOptions[order.orderState] }}
          </view>
        </template>
      </view>

      <!-- 商品信息 -->
      <!-- 商品信息 -->
      <view class="goods">
        <view class="item">
          <navigator
            v-for="item in order.skus"
            :key="item.id"
            :url="`/pages/goods/index?id=${item.spuId}`"
            hover-class="none"
          >
            <image class="cover" :src="item.image"></image>
            <view class="meta">
              <view class="name ellipsis">{{ item.name }}</view>
              <view class="type">{{ item.attrsText }}</view>
              <view class="price">
                <view class="original">
                  <text class="symbol">¥</text>
                  <text>{{ item.curPrice }}</text>
                </view>
                <view class="actual">
                  <text class="text">实付: </text>
                  <text class="symbol">¥</text>
                  <text>{{ item.realPay }}</text>
                </view>
              </view>
              <view class="quantity">x{{ item.quantity }}</view>
            </view>
          </navigator>
          <view
            class="action"
            v-if="order.orderState === OrderState.YiWanCheng"
          >
            <view class="button primary">申请售后</view>
            <navigator url="/pages/comments/publish/index" class="button">
              去评价
            </navigator>
          </view>
        </view>
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">商品总价: </view>
            <view class="symbol">{{ order.totalMoney }}</view>
          </view>
          <view class="row">
            <view class="text">运费: </view>
            <view class="symbol">{{ order.postFee }}</view>
          </view>
          <view class="row paid">
            <view class="text">实付: </view>
            <view class="symbol primary">{{ order.payMoney }}</view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">订单信息</view>
        <view class="row">
          <view>订单编号: {{ order.id }}</view>
          <view>下单时间: {{ order.createTime }}</view>
          <view v-if="order.payType === PayType.Online">
            支付方式: 在线支付
          </view>
          <view v-if="order.payChannel == PayChannel.WxPay">
            支付渠道: 微信支付
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部工具 -->
    <view class="toobar" v-if="order.orderState === OrderState.DaiFuKuan">
      <view @tap="orderPay" class="primary">去支付</view>
      <view class="default">取消订单</view>
    </view>
  </view>
</template>
<script>
import { mapState } from "vuex";
import {
  getMembeOrderById,
  getPayWxPayMiniPay,
  getPayMock,
} from "@/http/order";
import {
  OrderState,
  PayType,
  PayChannel,
  OrderStateOptions,
} from "./OrderConstance";
// 引入日期处理库  unix 接收一个秒为单位事件， 转成 dayjs 对应的对象 ， 使用dayjs对象内置的一些方法
import { unix } from "dayjs";
export default {
  data() {
    return {
      // 订单信息
      order: null,
      // 订单状态
      OrderState,
      // 支付方式
      PayType,
      // 支付渠道
      PayChannel,
      // 订单状态描述
      OrderStateOptions,
    };
  },
  computed: {
    ...mapState(["safeArea", "platform"]),
    // 负责将订单中的 倒计时间  格式化处理 00分00秒
    countdown() {
      // 自己做转换 或者 使用第三方日期库 dayjs
      if (this.order) {
        return unix(this.order.countdown).format("mm分ss秒");
      } else {
        return `00分00秒`;
      }
    },
  },
  async onLoad({ id }) {
    const result = await getMembeOrderById(id);
    this.order = result.result;

    // 判断一下订单的倒计时  countdown
    if (this.order.countdown < 0) {
      // 修改订单的状态  已取消
      this.order.orderState = OrderState.YiQuXiao;
    } else {
      // 开启倒计时
      const timeId = setInterval(() => {
        this.order.countdown--;
        if (this.order.countdown < 0) {
          // 停止定时器
          clearInterval(timeId);
          // 修改订单的状态  已取消
          this.order.orderState = OrderState.YiQuXiao;
        }
      }, 1000);
    }
  },
  methods: {
    // 点击去支付
    async orderPay() {
      try {
        // ============== 老师的代码===================
        // 1 把订单编号 发送给后端，获取 微信支付相关的参数
        // const result = await getPayWxPayMiniPay(this.order.id);
        // 2 调用小程序内置的api，调起微信支付
        // await uni.requestPayment(result.result);
        // ============== 老师的代码===================

        // ===============同学们 模拟支付接口代码
        await getPayMock(this.order.id); // 这一行代码 等同于上面老师的两行代码    来模拟支付成功

        // ===============同学们 模拟支付接口代码

        // 3 弹出提示，稍等一会，跳转到 支付成功页面
        uni.showToast({ title: "支付成功" });

        // 3 支付失败  弹出提示，等待一会，跳转到 订单列表页面
        setTimeout(() => {
          uni.navigateTo({ url: "/pages/order/payment" });
        }, 1000);
      } catch (error) {
        uni.showToast({ title: "支付失败", icon: "none" });
        setTimeout(() => {
          uni.navigateTo({ url: "/pages/order/index" });
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss">
.order-detail {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.navbar {
  width: 750rpx;
  color: #fff;
  background-image: url(https://static.botue.com/erabbit/static/images/order_bg.png);
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  .title {
    height: 40px;
    line-height: 30px;
    text-align: center;
    font-size: 17px;
    font-weight: 500;
    opacity: 0;
  }
  .android {
    text-align: left;
    padding-left: 42px;
  }
  .wrap {
    position: relative;
  }
  .back {
    position: absolute;
    left: 10px;
    top: 4px;
    line-height: 1;
    font-size: 23px;
    z-index: 9;
  }
}
.viewport {
  background-color: #f7f7f8;
}
.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  background-image: url(https://static.botue.com/erabbit/static/images/order_bg.png);
  background-size: cover;
  .status {
    font-size: 36rpx;
    &::before {
      margin-right: 6rpx;
      font-weight: 500;
    }
  }
  .tips {
    margin-top: 30rpx;
    font-size: 24rpx;
    width: 100%;
    text-align: center;
    .countdown {
      margin-left: 10rpx;
    }
  }
  .button {
    width: 260rpx;
    height: 64rpx;
    text-align: center;
    line-height: 64rpx;
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #27ba9b;
    border-radius: 68rpx;
    background-color: #fff;
  }
}
.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
  .locate {
    background-image: url(https://static.botue.com/erabbit/static/images/locate.png);
    .user {
      font-size: 26rpx;
      color: #444;
    }
    .address {
      font-size: 24rpx;
      color: #666;
    }
  }
  .logistics {
    background-image: url(https://static.botue.com/erabbit/static/images/car.png);
    border-bottom: 1rpx solid #eee;
    position: relative;
    &::after {
      position: absolute;
      right: 10rpx;
      top: 50%;
      transform: translateY(-50%);
      content: "\e6c2";
      font-family: "erabbit" !important;
      font-size: 32rpx;
      color: #666;
    }
    .message {
      font-size: 26rpx;
      color: #444;
    }
    .date {
      font-size: 24rpx;
      color: #666;
    }
  }
}
.shipment .locate,
.shipment .logistics {
  min-height: 120rpx;
  padding: 30rpx 30rpx 25rpx 75rpx;
  background-size: 50rpx;
  background-repeat: no-repeat;
  background-position: 6rpx center;
}
.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;
    navigator {
      display: flex;
    }
    .cover {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }
    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }
    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }
    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }
    .price {
      display: flex;
      margin-top: 6rpx;
      font-size: 24rpx;
    }
    .symbol {
      font-size: 20rpx;
    }
    .original {
      color: #999;
      text-decoration: line-through;
    }
    .actual {
      margin-left: 10rpx;
      color: #444;
    }
    .text {
      font-size: 22rpx;
    }
    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 24rpx;
      color: #444;
    }
    .action {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      padding: 30rpx 0 0;
    }
  }
  .action {
    .button {
      width: 200rpx;
      height: 60rpx;
      text-align: center;
      justify-content: center;
      line-height: 60rpx;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }
    .primary {
      color: #27ba9b;
      border-color: #27ba9b;
    }
  }
  .total {
    line-height: 1;
    font-size: 26rpx;
    padding: 20rpx 0;
    color: #666;
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }
    .symbol {
      &::before {
        content: "¥";
        font-size: 20rpx;
      }
    }
    .paid {
      font-size: 30rpx;
      color: #444;
    }
    .primary {
      color: #cf4444;
    }
  }
}
.detail {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;
  .title {
    font-size: 30rpx;
    color: #444;
  }
  .row {
    padding: 20rpx 0;
    & > view {
      display: block;
      padding: 10rpx 0;
    }
  }
}
.toobar {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding: 30rpx 20rpx;
  background-color: #fff;
  box-shadow: 0 -4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;
  & > view {
    width: 200rpx;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    border-radius: 72rpx;
  }
  .default {
    color: #444;
    border: 1rpx solid #ccc;
  }
  .primary {
    color: #fff;
    background-color: #27ba9b;
  }
}
.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;
  .title {
    font-size: 30rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }
  .description {
    font-size: 28rpx;
    padding: 0 20rpx;
    .tips {
      color: #444;
      margin-bottom: 12rpx;
    }
    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      padding: 15rpx 0;
      margin-bottom: 4rpx;
      color: #666;
    }
    .icon-ring {
      font-size: 38rpx;
      color: #999;
    }
    .icon-checked {
      font-size: 38rpx;
      color: #27ba9b;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;
    .button {
      flex: 1;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      margin: 0 20rpx;
      color: #444;
      border-radius: 72rpx;
      border: 1rpx solid #ccc;
    }
    .primary {
      color: #fff;
      background-color: #27ba9b;
      border: none;
    }
  }
}
</style>
