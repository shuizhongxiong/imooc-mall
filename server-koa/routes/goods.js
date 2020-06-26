const router = require('koa-router')();
const Goods = require('../models/goods');
const User = require('../models/user');
const Util = require('../util');

/**
 * 查询商品列表
 * @returns total Number 商品总量
 * @returns list Array 商品列表
 */
router.get('/', async ctx => {
  const query = ctx.request.query;
  const start = parseInt(query.start);
  const limit = parseInt(query.limit);
  const sortKey = query.sortKey;
  const sortType = query.sortType;
  const minPrice = parseInt(query.minPrice);
  const maxPrice = parseInt(query.maxPrice);
  let params = {};
  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    params = {
      salePrice: { $gte: minPrice, $lte: maxPrice },
    };
  }
  const goodsModel = Goods.find(params)
    .skip(start)
    .limit(limit);
  if (sortKey && sortType) {
    goodsModel.sort({ [sortKey]: sortType });
  }

  const goodsFindRes = await Goods.find(params);
  const goodsExecRes = await goodsModel.exec();

  ctx.body = Util.successHandle({
    total: goodsFindRes.length,
    list: goodsExecRes,
  });
});

/**
 * 加入购物车
 * @param productId String 商品 id
 */
router.post('/addCart', async ctx => {
  const userId = ctx.cookies.get('userId');
  const productId = ctx.request.body.productId;

  const userFindRes = await User.findOne({ userId });

  const filterGoods = userFindRes.cartList.filter(d => d.productId === productId);
  if (filterGoods.length > 0) {
    filterGoods[0].productNum++;

    const userSaveRes = await userFindRes.save();
    if (!userSaveRes) {
      ctx.body = Util.failHandle({ msg: '添加购物车失败' });
      return;
    }
    ctx.body = Util.successHandle();
  } else {
    const goodsFindRes = await Goods.findOne({ productId: productId });
    if (!goodsFindRes) {
      ctx.body = Util.failHandle({ msg: '添加购物车失败' });
      return;
    }

    userFindRes.cartList.push({
      productId: goodsFindRes.productId,
      productName: goodsFindRes.productName,
      salePrice: goodsFindRes.salePrice,
      productImage: goodsFindRes.productImage,
      productNum: 1,
      checked: 1,
    });

    const userSaveRes = await userFindRes.save();
    if (!userSaveRes) {
      ctx.body = Util.failHandle({ msg: '添加购物车失败' });
      return;
    }

    const cartCount = +ctx.cookies.get('cartCount');
    ctx.cookies.set('cartCount', cartCount + 1, {
      httpOnly: false,
      path: '/',
      maxAge: 1000 * 60 * 60 * 2,
    });
    ctx.body = Util.successHandle();
  }
});

module.exports = router;
