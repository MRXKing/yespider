const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio')
const path = require('path');

class Spider {
  constructor(config) {
      this.conf = Object.assign({},this.conf,config);
  }
  start(){
      try {
        const reg =  /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/;
        let curl = this.conf.url;
        if (!reg.test(this.conf.url)) {
            curl = "https://"+this.conf.url;
        }
        request(curl,(err,res,body) => {
             // console.log('data',body);
             const $ = cheerio.load(body);
             const imageData = [];
              $("img").each((index,item)=>{
              imageData.push($(item).attr("src"))
             })
             const dirname = this.conf.dir || "./screenshot";
             const filePath = path.join(process.cwd(),dirname);
             const stats = fs.existsSync(filePath);
             if (!stats) {
                fs.mkdirSync(dirname);
             }

             for (let value of imageData) {
               // console.log(value);
               let ext = '';
               if (value) {
                 ext = path.extname(value || '');
               }
               if (!reg.test(value)) {
                   value ='https:'+value;
               }
              this.downloadImg(value,ext,filePath)
           }
        })
      } catch (e) {
        console.log(e);
      }
  }
  async downloadImg(url,ext,path){
    await  request({url,encoding:'binary'},(err,res,body) => {
           fs.writeFile(`${path}/${Date.now()}${ext}`,body,"binary",() => {
             console.log("done!");
           })
      })
  }
}
module.exports = Spider
