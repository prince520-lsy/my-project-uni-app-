<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view scroll-y>
      <view class="address">
        <!-- 按组使用 -->
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="item in addressList"
            :key="item.id"
            class="swipe-cell"
          >
            <view class="item" @click="onChooseAddress(item)">
              <view class="user">
                {{ item.receiver }}
                <text>{{ item.contact }}</text>
                <text v-if="item.isDefault === 1" class="badge"> 默认 </text>
              </view>
              <view class="locate">
                {{ item.fullLocation }}{{ item.address }}
              </view>
              <!-- 🐛 添加阻止冒泡 -->
              <navigator
                :url="`./form?id=${item.id}`"
                class="edit"
                hover-class="none"
                @click.stop="() => {}"
              >
                修改
              </navigator>
            </view>
            <template v-slot:right>
              <view class="swipe-cell-action">
                <button @tap="onAddressRemove(item.id)" class="delete-button">
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="./form">新建地址</navigator>
    </view>
  </view>
</template>

<script>
/*
1 把静态结构给完成了
2 发送请求 获取 当前登录用户对应的  地址数据
 */

import { getMembeAddress, deleteMembeAddress } from "@/http/address";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      // 地址列表
      addressList: [],
    };
  },
  // 成功新增地址后，返回了上一页  没有显示最新数据 ？
  // onLoad 和 onShow区别
  // onLoad 页面开始加载的时候 触发 触发一次
  // onShow 页面重新被看见的时候 触发

  onShow() {
    this.loadata();
  },
  methods: {
    ...mapMutations("address", ["setSelectedAddress"]),
    async loadata() {
      const result = await getMembeAddress();
      this.addressList = result.result;
    },
    onClick(e) {
      console.log("点击事件click");
    },
    swipeChange(e, index) {
      console.log("滑动事件");
    },
    // 点击删除
    async onAddressRemove(id) {
      // 如何在这里 获取到 被删除的地址的id！！！
      // console.log(id);

      // 弹出对话框 询问用户 是否要删除
      const [err, { confirm }] = await uni.showModal({
        title: "警告",
        content: "您确定删除吗",
      });
      if (confirm) {
        // 是 获取id 调用接口 完成删除
        await deleteMembeAddress(id);
        // 删除成功后，给出用户一个提示
        uni.showToast({ title: "删除成功" });
        // 获取最新地址数据  更新页面
        this.loadata();
      }
    },
    // 点击地址
    onChooseAddress(item) {
      // 把选中的地址 存到了  vuex中
      this.setSelectedAddress(item);
      // 返回上一页
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;
  scroll-view {
    padding-top: 20rpx;
  }
}
.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  .item {
    line-height: 1;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    .user {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      color: #333;
      text {
        color: #666;
      }
      .badge {
        display: inline-block;
        padding: 4rpx 10rpx 2rpx 14rpx;
        margin: 2rpx 0 0 10rpx;
        font-size: 26rpx;
        color: #27ba9b;
        border-radius: 6rpx;
        border: 1rpx solid #27ba9b;
      }
    }
    .locate {
      line-height: 1.6;
      font-size: 26rpx;
      color: #333;
    }
    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }
  .swipe-cell {
    &:last-child {
      .item {
        border: none;
      }
    }
  }
}
.swipe-cell-action {
  height: 100%;
  .delete-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
    font-size: 28rpx;
    color: #fff;
    border-radius: 0;
    padding: 0;
    background-color: #cf4444 !important;
  }
}
.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}
</style>
