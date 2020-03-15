var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Util = require('../util');

/**
 * 查询当前用户的购物车详情
 * @returns Array 购物车详情列表
 */
router.get('/list', function(req, res ,next) {
  const userId = req.cookies.userId;
  User.findOne({ userId }, function(err, doc) {
    if (err) {
      Util.ErrorHandle(res, err);
      return;
    }
    Util.SuccessHandle(res, {
      result: doc.cartList,
    });
  });
});

/**
 * 删除
 * @param productId String 商品 id
 */
router.post('/del', function(req, res ,next) {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  User.update(
    { userId },
    { $pull: { cartList: { productId } } },
    function(err, doc) {
      if (err) {
        Util.ErrorHandle(res, err);
        return;
      }
      Util.SuccessHandle(res);
    });
});

/**
 * 编辑
 * @param productId String 商品 id
 * @param productNum Number 更新的数量
 */
router.post('/edit', function(req, res ,next) {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  const productNum = req.body.productNum;
  User.update(
    { userId, 'cartList.productId': productId },
    { 'cartList.$.productNum': productNum },
    function(err, doc) {
      if (err) {
        Util.ErrorHandle(res, err);
        return;
      }
      Util.SuccessHandle(res);
    });
});

/**
 * 批量更改选中
 * @param productIds Array<String> 商品 id 列表
 */
router.post('/checked', function(req, res ,next) {
  const userId = req.cookies.userId;
  const productIds = req.body.productIds;
  User.findOne({ userId }, function(err, doc) {
    if (err) {
      Util.ErrorHandle(res, err);
      return;
    }
    if (doc && doc.cartList.length > 0) {
      doc.cartList.forEach(d => {
        d.checked = (productIds.includes(d.productId)) ? 1 : 0
      });
      doc.save(function(err1, doc1) {
        if (err) {
          Util.ErrorHandle(res, err);
          return;
        }
        Util.SuccessHandle(res);
      });
    }
  });
});

module.exports = router;
