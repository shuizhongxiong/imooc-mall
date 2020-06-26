/*
 * @Author: your name
 * @Date: 2020-06-21 17:48:59
 * @LastEditTime: 2020-06-26 11:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /imooc-mall/server-koa/routes/carts.js
 */

const router = require('koa-router')();
const User = require('../models/user');
const Util = require('../util');

/**
 * 查询当前用户的购物车详情
 * @returns Array 购物车详情列表
 */
router.get('/list', async ctx => {
  const userId = ctx.cookies.get('userId');

  const userFindRes = await User.findOne({ userId });

  ctx.body = Util.successHandle(userFindRes.cartList);
});

/**
 * 删除
 * @param productId String 商品 id
 */
router.post('/del', async ctx => {
  const userId = ctx.cookies.get('userId');
  const productId = ctx.request.body.productId;

  const userUpdateRes = await User.update({ userId }, { $pull: { cartList: { productId } } });

  // nModified 更新条数，大于零确保更新成功
  if (userUpdateRes.nModified > 0) {
    const cartCount = +ctx.cookies.get('cartCount');
    ctx.cookies.set('cartCount', cartCount - 1, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 2,
    });
    ctx.body = Util.successHandle();
  } else {
    ctx.body = Util.failHandle({ msg: '删除失败' });
    return;
  }
});

/**
 * 编辑
 * @param productId String 商品 id
 * @param productNum Number 更新的数量
 */
router.post('/edit', async ctx => {
  const userId = ctx.cookies.get('userId');
  const productId = ctx.request.body.productId;
  const productNum = ctx.request.body.productNum;

  const UserUpdateRes = await User.update(
    { userId, 'cartList.productId': productId },
    { 'cartList.$.productNum': productNum },
  );
  if (!UserUpdateRes) {
    ctx.body = Util.ErrorHandle();
    return;
  }

  ctx.body = Util.successHandle();
});

/**
 * 批量更改选中
 * @param productIds Array<String> 商品 id 列表
 */
router.post('/checked', async ctx => {
  const userId = ctx.cookies.get('userId');
  const productIds = ctx.request.body.productIds;

  const UserFindRes = await User.findOne({ userId });
  if (!UserFindRes.cartList || UserFindRes.cartList.length <= 0) {
    ctx.body = Util.failHandle({ msg: '全选操作失败' });
    return;
  }

  UserFindRes.cartList.forEach(d => {
    d.checked = productIds.includes(d.productId) ? 1 : 0;
  });

  const UserSaveRes = await UserFindRes.save();
  if (!UserSaveRes) {
    ctx.body = Util.failHandle({ msg: '全选操作失败' });
    return;
  }

  ctx.body = Util.successHandle();
});

module.exports = router;
