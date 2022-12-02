<template>
    <view class="viewport">
      <!-- 地址信息 -->
      <view class="form">
        <view class="form-item">
          <text class="label">姓名</text>
          <input
            v-model="form.receiver"
            placeholder-style="color: #888"
            placeholder="请填写收货人姓名"
          />
        </view>
        <view class="form-item">
          <text class="label">手机号码</text>
          <input
            v-model="form.contact"
            placeholder-style="color: #888"
            placeholder="请填写收货人手机号码"
          />
        </view>
        <view class="form-item">
          <text class="label">省/市/县 (区)</text>
          <picker @change="regionChange" mode="region">
            <view v-if="form.fullLocation" class="region">
              {{ form.fullLocation }}
            </view>
            <view v-else class="placeholder"> 请填写收货人所在城市 </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">详细地址</text>
          <input
            v-model="form.address"
            placeholder-style="color: #888"
            placeholder="街道、楼牌号信息"
          />
        </view>
        <view class="form-item">
          <text class="label">设置默认地址</text>
          <switch
            @change="isDefaultChange"
            :checked="form.isDefault === 1"
            color="#27ba9b"
          />
        </view>
      </view>
      <!-- 提交按钮 -->
      <view class="button" @tap="submitFrom"> 保 存 </view>
    </view>
  </template>
  
  <script>
  /* 
  1 实现 表单标签 和  数据 产生联系
    1 省市区 地址的获取 
  2 点击保存
    1 获取表单数据  this.form 
    2 进行表单的合法性的验证 
    3 通过了，调用接口完成 新增
    4 返回上一个页面 
   */
  import {
    postMembeAddress,
    getDetailMembeAddress,
    putMembeAddress,
  } from "@/http/address";
  // 导入 validate对象
  import Schema from "validate";
  export default {
    data() {
      return {
        form: {
          /**
           * 详细地址
           */
          address: "",
          /**
           * 地址标签,以英文逗号分割
           */
          addressTags: "",
          /**
           * 所在城市编码
           */
          cityCode: "",
          /**
           * 联系方式
           */
          contact: "",
          /**
           * 所在区/县编码
           */
          countyCode: "",
          /**
           * 是否为默认，1为是，0为否
           */
          isDefault: 0,
          /**
           * 邮政编码
           */
          postalCode: "",
          /**
           * 所在省份编码
           */
          provinceCode: "",
          /**
           * 收货人姓名
           */
          receiver: "",
          fullLocation: "",
        },
      };
    },
    methods: {
      // 城市选择 事件
      regionChange(event) {
        // 设置省份相关编码
        this.form.provinceCode = event.detail.code[0];
        this.form.cityCode = event.detail.code[1];
        this.form.countyCode = event.detail.code[2];
        this.form.postalCode = event.detail.postcode;
  
        // 设置中文 地址信息即可
        this.form.fullLocation = event.detail.value.join("");
      },
      // 切换默认地址
      isDefaultChange(event) {
        this.form.isDefault = event.detail.value ? 1 : 0;
      },
      // 保存
      async submitFrom() {
        // 1 获取表单数据   this.form
        // 2 进行表单合法性的验证 ？？  validate.js  库   只要是可以运行js 都可以进行验证   validate - elementui---
        //    只要是可以运行js 就可以 validate.js   它也是很多的ui框架表单验证 底层
        // 3 使用
        // 3.1 安装  npm  i  validate
        // 3.2 看使用说明即可
  
        // 新建表单校验对象
        const addressRule = new Schema(
          {
            // 姓名
            receiver: {
              required: true,
              message: {
                required: "请输入收货人姓名",
              },
            },
            // 手机号码
            contact: {
              required: true,
              // 指定规则 正则
              match: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
              message: {
                required: "请输入手机号码",
                match: "请输入合法的手机号码",
              },
            },
            // 地址编码
            provinceCode: {
              required: true,
              message: "请选择省份",
            },
            cityCode: {
              required: true,
              message: "请选择城市",
            },
            countyCode: {
              required: true,
              message: "请选择区/县",
            },
            // 详细地址
            address: {
              required: true,
              message: "请输入详细地址",
            },
          },
          {
            // strip: false, // 禁用默认的行为，   不再剔除没有在在Schema中定义过数据   this.form  不会被删除属性
          }
        );
  
        // // 开始验证  不要直接传递我的数据  浅拷贝 信息的地址  解决 了 validate 自动剔除我们属性的问题
        const errorList = addressRule.validate({ ...this.form });
        // const errorList = addressRule.validate(this.form);
        // console.log(errorList);
        // 友好的弹窗 提示用户
        if (errorList[0]) {
          uni.showToast({ title: errorList[0].message, icon: "none" });
          return; // 返回
        }
  
        console.log(this.form);
        // return;
  
        // 通过以上的校验 表示没错  正常往下 执行业务
        // console.log("正常执行业务");
  
        // 判断新建还是编辑
        if (this.form.id) {
          // 编辑
          await putMembeAddress(this.form.id, this.form);
          uni.showToast({ title: "编辑成功" });
        } else {
          // 新建
          // 传递参数 调用 新增地址的接口
          await postMembeAddress(this.form);
  
          // 成功  弹出提示  返回上一页 ！！
          uni.showToast({ title: "新增成功" });
        }
  
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      },
    },
    // 页面开始加载
    async onLoad({ id }) {
      if (id) {
        // 编辑
        uni.setNavigationBarTitle({ title: "编辑地址" });
        const result = await getDetailMembeAddress(id);
        // 将地址详情 设置到 data中
        this.form = result.result;
      } else {
        uni.setNavigationBarTitle({ title: "新建地址" });
      }
    },
  };
  </script>
  
  <style lang="scss">
  page {
    background-color: #f4f4f4;
  }
  .form {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
    .form-item {
      display: flex;
      min-height: 96rpx;
      line-height: 46rpx;
      padding: 25rpx 10rpx;
      background-color: #fff;
      font-size: 28rpx;
      border-bottom: 1rpx solid #ddd;
      position: relative;
      &:last-child {
        border: none;
      }
      .label {
        width: 200rpx;
        color: #333;
      }
      input {
        flex: 1;
        display: block;
        height: 46rpx;
      }
      switch {
        position: absolute;
        right: -10rpx;
        transform: scale(0.7) translateY(-8px);
      }
      picker {
        flex: 1;
      }
      .region {
        color: #333;
      }
      .placeholder {
        color: #888;
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