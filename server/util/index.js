module.exports = {
  Sleep: function (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms || Math.random() * 500)
    })
  },
  ErrorHandle: function (res, err) {
    res.json({
      code: 500,
      msg: err.message
    });
  },
  SuccessHandle: function (res, data = {}) {
    res.json({
      code: data.code || 200,
      msg: data.msg || 'success',
      result: data.result || null
    });
  },
};
