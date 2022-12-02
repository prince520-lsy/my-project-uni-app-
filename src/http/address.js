// /member/address

import http from "@/utils/http";

/**
 * 获取登录用户的地址列表
 */
export const getMembeAddress = () => {
  return http({ url: "/member/address" });
};

/**
 * 新增地址
 * @param {Object} data 新增的地址对象
 */
export const postMembeAddress = (data) => {
  return http({ url: "/member/address", method: "post", data });
};

/**
 * 根据地址id来实现 删除地址
 * @param {string} id 地址id
 */
export const deleteMembeAddress = (id) => {
  return http({ url: `/member/address/${id}`, method: "delete" });
};

/**
 * 根据地址id来获取地址详情
 * @param {string} id 地址id
 */
export const getDetailMembeAddress = (id) => {
  return http({ url: `/member/address/${id}`, method: "get" });
};