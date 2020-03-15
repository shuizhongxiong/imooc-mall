var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Util = require('../util');
var Code = require('../util/code');

/**
 * 登入
 * @param userName String 用户名
 * @param userPwd String 密码
 */
router.post('/login', function(req, res, next ) {
  const param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, async function(err, doc) {
    if (err) {
      Util.ErrorHandle(res, err);
      return;
    }
    if (!doc) {
      Util.SuccessHandle(res, {
        code: Code.USER_INFO_WRONG,
        msg: '账户或密码错误',
      });
      return;
    }
    res.cookie('userId', doc.userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 2
    });
    res.cookie('userName', doc.userName, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 2
    });
    res.cookie('cartCount', doc.cartList.length, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 2
    });
    Util.SuccessHandle(res, {
      result: {
        userId: doc.userId,
        userName: doc.userName,
        cartCount: doc.cartList.length
      }
    });
  })
})

/**
 * 登入
 */
router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('cartCount', '', {
    path: '/',
    maxAge: -1
  });
  Util.SuccessHandle(res);
});

module.exports = router;
