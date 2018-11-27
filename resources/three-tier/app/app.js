const util = require('util');
const KOA = require('koa');
const redis = require('redis');
const moment = require('moment');

const server = new KOA();
const storage = redis.createClient({
  host: 'redis',
});
const get = util.promisify(storage.get).bind(storage);
const KEY = 'cache';

server.use(async (ctx) => {
  const previous = await get(KEY);
  const when = moment().format('HH:mm:ss:SSS');
  const IP = ctx.get('X-Real-IP');
  const line = `${when} | ${IP}`;
  storage.set(KEY, [previous, line].join('\n'));
  const response = previous;
  ctx.body = response;
});

server.listen(3000);
