const CODE = require('./code');

module.exports = {
  sleep: function(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms || Math.random() * 500);
    });
  },
  failHandle({ msg, code }) {
    return {
      code: code || CODE.FAIL.code,
      msg: msg || CODE.FAIL.msg,
      result: null,
    };
  },
  successHandle(result = null) {
    return {
      code: CODE.SUCCESS.code,
      msg: CODE.SUCCESS.msg,
      result,
    };
  },
};
