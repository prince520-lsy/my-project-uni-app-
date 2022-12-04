// 订单状态
// 订单状态，0为全部 1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消
export const OrderState = {
    QuanBu: 0,
    DaiFuKuan: 1,
    DaiFaHuo: 2,
    DaiShouHuo: 3,
    DaiPingJia: 4,
    YiWanCheng: 5,
    YiQuXiao: 6,
  };
  // 支付类型
  export const PayType = {
    Online: 1,
    Delivery: 2,
  };
  // 支付渠道
  export const PayChannel = {
    AliPay: 1,
    WxPay: 2,
  };
  // 订单状态描述
  export const OrderStateOptions = {
    [OrderState.DaiFuKuan]: "待付款",
    [OrderState.DaiFaHuo]: "待发货",
    [OrderState.DaiShouHuo]: "待收货",
    [OrderState.DaiPingJia]: "待评价",
    [OrderState.YiWanCheng]: "已完成",
    [OrderState.YiQuXiao]: "已取消",
  };
  