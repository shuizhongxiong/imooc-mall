var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');
var Util = require('../util');

// 链接 MongoDB 数据库
mongoose.connect('mongodb://localhost/dumall');
mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success.');
});
mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail.');
});
mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected.');
});

/**
 * 查询商品列表
 * @returns total Number 商品总量
 * @returns list Array 商品列表
 */
router.get('/', function (req, res, next) {
  let start = parseInt(req.param('start'));
  let limit = parseInt(req.param('limit'));
  let sortKey = req.param('sortKey');
  let sortType = req.param('sortType');
  let minPrice = parseInt(req.param('minPrice'));
  let maxPrice = parseInt(req.param('maxPrice'));
  let params = {};
  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    params = {
      salePrice: { $gte: minPrice, $lte: maxPrice }
    }
  }
  let goodsModel = Goods.find(params).skip(start).limit(limit);
  if (sortKey && sortType) {
    goodsModel.sort({ [sortKey]: sortType });
  }

  goodsModel.exec(function (err, doc) {
    if (err) {
      Util.ErrorHandle(res, err);
      return;
    }
    Goods.find(params, function (err, result) { // 获取总条数
      if (err) {
        Util.ErrorHandle(res, err);
        return;
      }
      Util.SuccessHandle(res, {
        result: {
          total: result.length,
          list: doc
        }
      });
    });
  });
});

/**
 * 加入购物车
 * @param productId String 商品 id
 */
router.post('/addCart', function (req, res, next) {
  let userId = '100000077';
  let productId = req.body.productId;

  User.findOne({ userId }, function (userErr, userDoc) {
    if (userErr) {
      Util.ErrorHandle(res, userErr);
      return;
    }
    let filterGoods = userDoc.cartList.filter(d => d.productId === productId);
    if (filterGoods.length > 0) {
      filterGoods[0].productNum++;
      userDoc.save(function (saveErr, saveDoc) {
        if (saveErr) {
          Util.ErrorHandle(res, saveErr);
          return;
        }
        Util.SuccessHandle(res);
      });
    } else {
      Goods.findOne({ productId: productId }, function (goodErr, goodDoc) {
        if (goodErr) {
          Util.ErrorHandle(res, goodErr);
          return;
        }
        userDoc.cartList.push({
          productId: goodDoc.productId,
          productName: goodDoc.productName,
          salePrice: goodDoc.salePrice,
          productImage: goodDoc.productImage,
          productNum: 1,
          checked: 1
        });
        userDoc.save(function (saveErr, saveDoc) {
          if (saveErr) {
            Util.ErrorHandle(res, saveErr);
            return;
          }
          Util.SuccessHandle(res);
        });
      });
    }
  });
});

module.exports = router;
