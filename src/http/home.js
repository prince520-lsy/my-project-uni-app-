import http from "@/utils/http";

/**
 * 广告区域(pc-小程序)
 * @param {Number} distributionSite 要获取 首页的数据-1 还是 分类页面的数据-2
 * @returns Object
 */
export const getHomeBanner = (distributionSite = 1) => {
  return http({
    url: "/home/banner",
    data: { distributionSite },
  });
};

/**
 * 首页-前台类目-小程序
 */
export const getHomeCategoryHeadMutli = () => {
  return http({ url: "/home/category/head/mutli" });
};

/**
 * 首页-人气推荐-小程序和app
 */
export const getHomeHotMutli = () => {
  return http({ url: "/home/hot/mutli" });
};

/**
 *
 * @param {Number} limit 数据条数
 */
export const getHomeNew = (limit = 4) => {
  return http({ url: "/home/new", data: { limit } });
};

/**
 * 获取猜你喜欢 数据
 * @param {Object} data 请求参数 page 和 pageSize
 */
export const getHomeGoodsGuesslike = (data = {}) => {
  return http({ url: "/home/goods/guessLike", data });
};

/**
 * 统一获取推荐页面用到数据
 * @param {String} url 推荐页面用到的url
 * @param {Object} data 参数
 */
export const getHomeRecommend = (url, data = {}) => {
  return http({ url, data });
};