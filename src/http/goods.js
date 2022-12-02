// 个人信息 相关的 接口
import http from "@/utils/http";

/**
 * 根据商品id来获取详情数据
 * @param {String} id 商品id
 */
export const getGoodsById = (id) => {
  return http({ url: "/goods", data: { id } });
};

/**
 * 根据商品id获取同类推荐商品
 * @param {Object} data 请求参数
 */
export const getGoodsRelevant = (data) => {
  return http({ url: "/goods/relevant", data });
};
