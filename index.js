
const yargs = require('yargs');
const config = require('./config/config.js');
const Spider = require('./config/spider');
const argv = yargs
.usage('yespider [options]')
.option('u',{
  alias:'url',
  describe:'网址',
  default:config.url
})
.option('d',{
  alias:'dir',
  describe:'目录',
  default:config.dir
})
.version()
.alias('v','version')
.help()
.argv;
// console.log(argv);
const spider = new Spider(argv);
spider.start();
