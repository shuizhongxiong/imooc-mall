const router = require('koa-router')();
const User = require('../models/user');
const CODE = require('../util/code');
const Util = require('../util/index');

/**
 * 登入
 * @param userName String 用户名
 * @param userPwd String 密码
 */
router.post('/login', async ctx => {
  const param = {
    userName: ctx.request.body.userName,
    userPwd: ctx.request.body.userPwd,
  };

  const userFindRes = await User.findOne(param);
  if (!userFindRes) {
    ctx.body = Util.failHandle(CODE.USER_INFO_WRONG);
    return;
  }

  ctx.cookies.set('userId', userFindRes.userId, {
    httpOnly: false,
    path: '/',
    maxAge: 1000 * 60 * 60,
  });
  ctx.cookies.set('userName', userFindRes.userName, {
    httpOnly: false,
    path: '/',
    maxAge: 1000 * 60 * 60,
  });
  ctx.cookies.set('cartCount', userFindRes.cartList.length, {
    httpOnly: false,
    path: '/',
    maxAge: 1000 * 60 * 60,
  });

  ctx.body = Util.successHandle({
    userId: userFindRes.userId,
    userName: userFindRes.userName,
    cartCount: userFindRes.cartList.length,
  });
});

/**
 * 登入
 */
router.post('/logout', async ctx => {
  ctx.cookies('userId', '', {
    path: '/',
    maxAge: -1,
  });
  ctx.cookies('userName', '', {
    path: '/',
    maxAge: -1,
  });
  ctx.cookies('cartCount', '', {
    path: '/',
    maxAge: -1,
  });

  ctx.body = Util.successHandle();
});

module.exports = router;
