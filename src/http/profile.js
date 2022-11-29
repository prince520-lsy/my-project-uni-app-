// 个人信息 相关的 接口
import http from "@/utils/http";

/**
 * 执行登录，获取token
 * @param {Object} data 包含 code，ic，encryptedData
 */
export const postLoginWxmin = (data) => {
  return http({ url: "/login/wxMin", method: "post", data });
};

/**
 * 传入手机号码 模拟 登录
 * @param {Number} phoneNumber  手机号码
 */
export const postLoginWxminSimple = (phoneNumber) => {
  return http({
    url: "/login/wxMin/simple",
    method: "post",
    data: {
      phoneNumber,
    },
  });
};