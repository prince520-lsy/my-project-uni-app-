<template>
	<view>
	  <view> {{ text }}</view>
	  <button @click="onClick">修改state.text</button>
	</view>
  </template>
  
  <script>
  // 使用 @ 引入组件
  
  export default {
	computed: {
	  text() {
		return this.$store.state.text;
	  },
	},
	methods: {
	  onClick() {
		// 提交mutations
		this.$store.commit("setText", Date.now());
		// 微信小程序中 本地存储
		// 支持任意的数据类型  不需要想网页本地存储一样都需要转成字符串
		// 存数据
		// uni.setStorageSync("abcd", 1234);
		// uni.setStorageSync("abcd1", "aaaa");
		// uni.setStorageSync("abcd2", true);
		// uni.setStorageSync("abcd3", [123, 4, 4]);
		// uni.setStorageSync("abcd4", { a: 1, b: 2 });
		// 取数据
		// console.log(uni.getStorageSync("abcd"));
		// console.log(uni.getStorageSync("abcd1"));
		// console.log(uni.getStorageSync("abcd2"));
		// console.log(uni.getStorageSync("abcd3"));
		// console.log(uni.getStorageSync("abcd4"));
	  },
	},
  };
  </script>
  
  <style></style>