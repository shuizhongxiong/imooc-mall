/**
 * koa 中间件
 * koa-router 核心 路由
 * koa-logger 日志输出
 * koa-json 格式化 json
 * koa-static 访问静态资源
 * koa-views 访问 html
 * koa-bodyparser 应用于 post 请求 数据解析和转换
 */

const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const Json = require('koa-json');
const Static = require('koa-static');
const Views = require('koa-views');
const BodyParser = require('koa-bodyparser');

const DB = require('./config/db');
const CODE = require('./util/code');
const Util = require('./util/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const goodsRouter = require('./routes/goods');
const cartsRouter = require('./routes/carts');
const User = require('./models/user');

const app = new Koa();

app.use(Logger());
app.use(Json());
app.use(Static(__dirname + '/public'));
app.use(Views(__dirname + '/views'), {
  extension: 'ejs',
});
app.use(BodyParser());

DB.init();

const router = new Router({
  prefix: '/api',
});

// 全局拦截
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('捕获到错误：' + error);
    return (ctx.body = error.message);
  }
});
// 登陆拦截
router.use(async (ctx, next) => {
  const userId = ctx.cookies.get('userId');
  const limitPath = ['/api/users/login', '/api/users/logout', '/api/goods'];
  if (limitPath.includes(ctx.request.path)) {
    await next();
  } else if (userId) {
    const userFindRes = await User.findOne({ userId });
    if (!userFindRes) {
      ctx.body = Util.failHandle({ msg: '当前用户不存在' });
      return;
    }
    await next();
  } else {
    ctx.body = Util.failHandle(CODE.USER_NOT_LOGIN);
  }
});
router.use('/', indexRouter.routes(), indexRouter.allowedMethods());
router.use('/users', usersRouter.routes(), usersRouter.allowedMethods());
router.use('/goods', goodsRouter.routes(), goodsRouter.allowedMethods());
router.use('/carts', cartsRouter.routes(), cartsRouter.allowedMethods());
app.use(router.routes());

app.listen(3000);

app.on('error', err => {
  console.error('server error', err);
});
