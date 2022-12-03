import http from "@/utils/http";

/**
 * 添加商品到购物车
 * @param {Object} data 要添加的商品数据 skuId 和 count
 */
export const postMemberCart = (data) => {
  return http({ url: "/member/cart", data, method: "post" });
};

/**
 * 获取购物车列表
 */
export const getMemberCart = () => {
  return http({ url: "/member/cart" });
};

/**
 * 修改商品 数量 和  选中状态
 * @param {String} id 商品的id
 * @param {Object} data 修改的商品的属性 selected 和  count
 */
export const putMemberCart = (id, data) => {
  return http({ url: `/member/cart/${id}`, data, method: "put" });
};