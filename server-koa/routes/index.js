const router = require('koa-router')();

/* GET home page. */
router.get('/', async ctx => {
  await ctx.render('index.ejs', { title: 'Koa' });
});

module.exports = router;
