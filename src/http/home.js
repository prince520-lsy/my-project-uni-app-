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