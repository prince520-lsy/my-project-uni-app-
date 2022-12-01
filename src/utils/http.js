/* 
uni app中 拦截器  概念 更加广泛
1  不只是 发送http请求的拦截
2  还能用在其他 地方
   1 上传文件 也能拦截
   2 调用本地存储 也能拦截 
 */

// uni.request({ url: "http://xxxxxxx" }); // url 是完整，所以不需要拼接
// uni.request({ url: "/home/oneStop/mutli", header: { a: 1, b: 2 } }); // url 是不完整的，所以就需要拼接

import store from "@/store";

// 1 基础地址
const baseURL = "https://pcapi-xiaotuxian-front-devtest.itheima.net";
// 2 来自于 uniapp的官网
const request = {
  // 发送前
  invoke(args) {
    uni.showLoading({ title: "加载中" }); // 显示加载中
    // startsWith  是一个字符串方法   判断当前的字符串 是不是以 xxx开头
    if (!args.url.startsWith("http")) {
      // 不是的话  才去拼接 基地址
      args.url = baseURL + args.url;
    }
    // 请求头
    args.header = {
      ...args.header, // 保留原本的 header
      "source-client": "miniapp", // 添加小程序端调用标识  -  给后端判断使用！！
    };

    // 判断一下有没有token 有 就携带
    if (store.state.user.profile) {
      args.header.Authorization = store.state.user.profile.token;
    }
  },
  // 完成后
  complete(res) {
    uni.hideLoading(); // 关闭加载中
  },
};
uni.addInterceptor("request", request); // 拦截发送请求
uni.addInterceptor("uploadFile", request); // 拦截上传文件

// 自己针对 uni.request 再次做了的封装
export default (options) => {
  return new Promise((resolve, reject) => {
    // 封装自己的发送请求的代码 底层 还是使用 uni.request => 继续使用刚刚封装好的拦截器
    uni.request({
      ...options,
      // url,data,header,
      //通过success的方式获取返回值 是本来 原生的小程序 的request就支持，uni.request 也是支持
      success(res) {
        // 请求成功了 判断一下 http状态码  满足 200~300 表示成功
        // 否则 401 303 500 都理解成 是错误
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 成功  resolve 把请求后的参数 返回
          resolve(res.data);
        } else {
          // 多做一次判断
          if (res.statusCode === 401) {
            // 跳转到 登录页面
            uni.navigateTo({ url: "/pages/login/index" });
          }

          // 失败
          reject(res);
        }
      },
      fail(err) {
        // 失败
        reject(res);
      },
    });
  });
};

// import http from "http";
// http({ url, data, header });