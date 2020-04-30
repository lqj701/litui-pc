import moment from 'moment';
moment.locale('zh-cn');

export function msgDateStr(lastTime) {
  let formatStr = 'YYYY-MM-DD HH:mm';

  if (new Date().getDate() === new Date(lastTime).getDate()) {
    formatStr = 'HH:mm';
  }

  return moment(lastTime).format(formatStr);
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minute =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  return year + '-' + month + '-' + d + ' ' + hour + ':' + minute;
}

export function toMoney(val, unit = '¥') {
  var str = (val / 100).toFixed(2) + '';
  var intSum = str
    .substring(0, str.indexOf('.'))
    .replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
  var dot = str.substring(str.length, str.indexOf('.')); //取到小数部分搜索
  var ret = intSum + dot;
  return unit + ret;
}

export function toThousands(num) {
  if (typeof num === 'string') {
    return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function toYuan(num) {
  if (!num) {
    return 0;
  }
  return (num / 100).toFixed(2);
}

export function toDecimal(count, num) {
  let divisor = 1;
  let reserveNum = '0';

  switch (num) {
    case 0:
      divisor = 1;
      break;
    case 1:
      divisor = 10;
      reserveNum = '0';
      break;
    case 2:
      divisor = 100;
      reserveNum = '00';
      break;
    case 3:
      divisor = 1000;
      reserveNum = '000';
      break;
    default:
      divisor = 1;
      break;
  }

  let result = Math.floor(count * divisor) / divisor;

  if (result.toString().indexOf('.') < 0) {
    result = `${result}.${reserveNum}`;
  }

  return result;
}

// 目前未使用
export const API_CODE = {
  0: '操作成功！',
  500: '系统异常！',
  140001: '商城名为空！',
  140002: '该商品名有误',
  140003: '该商品名称已存在，请重新输入',
  140004: '商品价格不能为0',
  140005: '该商品首页图片为空',
  140007: '存在待发货的订单，不可关闭商城！',
  140011: '商品规格字段有误',
  140012: '库存限输入0~999999',
  140014: '商品规格名重复'
};

export const DELIVER = [
  '申通快递',
  '圆通速递',
  '中通快递',
  '韵达快递',
  '天天快递',
  '百世快递',
  '顺丰速运',
  '邮政快递包裹',
  'EMS经济快递',
  'EMS',
  '邮政平邮',
  '德邦快递',
  '联昊通',
  '全峰快递',
  '全一快递',
  '城市100',
  '汇强快递',
  '广东EMS',
  '速尔',
  '飞康达速运',
  '宅急送',
  '联邦快递',
  '德邦物流',
  '中铁快运',
  '信丰物流',
  '龙邦速递',
  '天地华宇',
  '快捷速递',
  '新邦物流',
  '能达速递',
  '优速快递',
  '国通快递',
  '其他',
  '顺丰快递',
  'AAE',
  '安信达',
  '百福东方',
  'BHT',
  '邦送物流',
  '传喜物流',
  '大田物流',
  'D速快递',
  '递四方',
  '飞康达物流',
  '飞快达',
  '如风达',
  '风行天下',
  '飞豹快递',
  '港中能达',
  '广东邮政',
  '共速达',
  '汇通快运',
  '华宇物流',
  '恒路物流',
  '华夏龙',
  '海航天天',
  '海盟速递',
  '华企快运',
  '山东海红',
  '佳吉物流',
  '佳怡物流',
  '加运美',
  '京广速递',
  '急先达',
  '晋越快递',
  '捷特快递',
  '金大物流',
  '嘉里大通',
  '康力物流',
  '跨越物流',
  '龙邦物流',
  '蓝镖快递',
  '隆浪快递',
  '门对门',
  '明亮物流',
  '全晨快递',
  '全际通',
  '全日通',
  '如风达快递',
  '三态速递',
  '盛辉物流',
  '速尔物流',
  '盛丰物流',
  '上大物流',
  '赛澳递',
  '圣安物流',
  '穗佳物流',
  '优速物流',
  '万家物流',
  '万象物流',
  '新蛋奥硕物流',
  '香港邮政',
  '运通快递',
  '远成物流',
  '亚风速递',
  '一邦速递',
  '源伟丰快递',
  '元智捷诚',
  '越丰物流',
  '源安达',
  '原飞航',
  '忠信达快递',
  '芝麻开门',
  '银捷速递',
  '中邮物流',
  '中速快件',
  '中天万运',
  '河北建华',
  '乐捷递',
  '立即送',
  '通和天下',
  '微特派',
  '一统飞鸿',
  '郑州建华',
  '山西红马甲',
  '陕西黄马甲',
  '快速递',
  '安能物流',
  '新顺丰',
  '钱报速运',
  '日日顺',
  '神盾快运',
  '京华亿家',
  '南方传媒物流',
  '成都商报物流',
  '冻到家物流',
  '亚马逊物流',
  '京东快递',
  'e邮宝',
  '思迈',
  'UPS',
  '南京100',
  '民航快递',
  '贝海国际速递',
  'CJ物流',
  '央广购物',
  '易时联国际速递',
  '风先生',
  '耀启物流',
  '内蒙EMS',
  '小红帽',
  'PCA',
  '诚义物流',
  '秦远国际物流',
  '万家康快递',
  '澳邮中国快运',
  '一号线国际速递',
  'EWE国际物流',
  '爱送配送',
  'POSTNZ',
  'FASTGO',
  '天越物流',
  '德中物流',
  '行必达',
  'EFS快递',
  '中邮速递'
];
