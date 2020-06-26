/*
 * @Author: your name
 * @Date: 2020-06-21 18:19:27
 * @LastEditTime: 2020-06-26 11:31:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /imooc-mall/server-koa/util/code.js
 */

// 统一 code 码

module.exports = {
  // 系统级别使用 0x
  SUCCESS: { code: 200, msg: '成功' },
  FAIL: { code: 500, msg: '失败' },

  // 用户有关使用 1x
  USER_INFO_WRONG: { code: 40100, msg: '账户或密码错误' }, // 安全考虑，不能单独提示某一项是错误的。
  USER_NOT_LOGIN: { code: 40101, msg: '当前未登录' },
  USER_TOKEN_WRONG: { code: 40102, msg: 'token 无效或过期' },
};
