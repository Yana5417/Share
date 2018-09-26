// 获得字符串实际长度，中文2，英文1
const byteLength = function(str) {
  let realLength = 0;
  let len = str.length;
  let charCode = -1;

  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    }
    else {
      realLength += 2;
    }
  }

  return realLength;
};

const MAX_BYTE_LENGTH = 24;

class Share {
  constructor(options) {
    const {
      canvasId,
      headerImage,
      nickname,
      radarImg,
      books,
      shareData
    } = options;

    this.headerImage = headerImage;
    this.nickname = nickname;
    this.radarImg = radarImg;
    this.shareData = shareData;
    this.books = books;

    // 开始画图
    this.ctx = wx.createCanvasContext(canvasId);

    // 清空上次画的内容
    this.ctx.draw();

    this.drawBg();
    this.drawHeader();
    this.drawRadarImage();
    this.drawPopulars();
    this.drawMorePopular();

    this.drawPopularsFn();
  }

  /* 画分享页背景 */
  drawBg() {
    const arr = ['../../../assets/images/share_bg.png', '../../../assets/images/share_white_bg.png'];

    this.ctx.drawImage(arr[0], 0, 0, 325, 489);
    this.ctx.drawImage(arr[1], 0, 90, 325, 395);
    this.ctx.restore();
  }

  /* 画分享头部用户信息 */
  drawHeader() {
    const arr = [this.headerImage, '../../../assets/images/headerimg_modal.png'];

    this.ctx.drawImage(arr[0], 15, 10, 40, 40);
    this.ctx.drawImage(arr[1], 15, 10, 40, 40);

    // nikname
    this.ctx.setFontSize(12);
    this.ctx.fillText(this.nickname, 64, 32);

    // title1
    this.ctx.setFillStyle('rgb(51,51,51)');
    this.ctx.setFontSize(14);
    this.ctx.fillText('一起读了 ', 95, 57);
    this.ctx.setFontSize(16);
    this.ctx.setFillStyle('rgb(252,114,2)');
    this.ctx.fillText(`${this.shareData.bookread.readCount}`, 154, 57);
    this.ctx.setFillStyle('rgb(51,51,51)');
    this.ctx.setFontSize(14);
    this.ctx.fillText('本童书', 177, 57);

    let topRank = Math.ceil(this.shareData.topRank);
    // title2
    this.ctx.fillText(`在${this.shareData.ageRange[0]}-${this.shareData.ageRange[1]}岁孩子爸妈中位列前`, 54, 81);
    this.ctx.setFontSize(16);
    this.ctx.setFillStyle('rgb(252,114,2)');
    this.ctx.fillText(`${topRank}%`, 225, 82);

    this.ctx.restore();
  }

  /* 画雷达图 */
  drawRadarImage() {
    const arr = [this.radarImg];

    this.ctx.drawImage(arr[0], 82, 97, 160, 110);
    this.ctx.restore();
  }

  /* 画受欢迎的书列表 */
  drawPopulars() {
    this.ctx.setFontSize(13);
    this.ctx.setFillStyle('rgb(51,51,51)');
    this.ctx.fillText(`书单里有 ${this.shareData.existBookCount} 本 ${this.shareData.ageRange[0]}-${this.shareData.ageRange[1]} 岁最受欢迎童书`, 20, 223);

    let x = 0;
    let sarr = [0, 0, 0, 0, 0];
    let books = this.shareData.books;

    for (let i =0; i< books.length; i++) {
      x = 20 + 73.5*i;
      let url = books[i].cover && books[i].cover.miniUrl ? books[i].cover.miniUrl : '../../../assets/images/bmylogo.png';


      // 画封面
      this.ctx.setStrokeStyle('#ddd');
      this.ctx.strokeRect(x, 235, 64, 96);
      this.ctx.drawImage(url, x, 235, 64, 96);

      // 画书名
      if (books[i].isInList) {
        this.ctx.setFillStyle('rgba(51,51,51,1)');
      } else {
        this.ctx.setFillStyle('rgba(238,238,238,1)');
      }
      let title = books[i].title;
      if (title.length > 5) {
        if (escape(title).indexOf('%u') === -1) {
          title = title.slice(0, 9) + '...';
        } else {
          title = title.slice(0, 5) + '...';
        }
      }
      this.ctx.setFontSize(11);
      this.ctx.fillText(`${title}`, x, 347);

      // 画评分
      let heart = ['../../../assets/images/heart_full.png', '../../../assets/images/heart_gray.png'];
      let hx = x;
      sarr.map((s, index) => {
        hx = x + 8*index;
        if (books[i].isInList) {
          if (Number(books[i].score) > s) {
            this.ctx.drawImage(heart[0], hx, 354, 7, 7);
          } else {
            this.ctx.drawImage(heart[1], hx, 354, 7, 7);
          }
        } else {
          this.ctx.drawImage(heart[1], hx, 354, 7, 7);
        }
      });
      this.ctx.setFontSize(8);
      this.ctx.fillText(`${books[i].score}`, hx + 8, 361);

      // 画最受欢迎年龄范围
      this.ctx.setStrokeStyle('rgba(245,245,245,1)');
      let len = books[i].maxAgeReadPercent[0].length;
      len = len*4.5;
      if (books[i].isInList) {
        this.ctx.setFillStyle('rgba(238,238,238,1)');
        this.ctx.fillRect(x, 365, len+6, 10);
        this.ctx.strokeRect(x, 365, len+6, 10);
        this.ctx.setFillStyle('rgba(102,102,102,1)');
      } else {
        this.ctx.setFillStyle('rgba(245,245,245,1)');
        this.ctx.fillRect(x, 365, len+6, 10);
        this.ctx.strokeRect(x, 365, len+6, 10);
        this.ctx.setFillStyle('rgba(238,238,238,1)');
      }

      this.ctx.fillText(`${books[i].maxAgeReadPercent[0]}`, x+3, 373);
      this.ctx.fillText(`${books[i].maxAgeReadPercent[1]}`, hx+10, 373);
    }

    this.ctx.restore();
  }

  // 画童书遮罩层
  drawPopularsFn() {
    let books = this.shareData.books;
    let x = 0;
    for (let i =0; i< books.length; i++) {
      x = 20 + 73.5*i;

      if (!books[i].isInList) {
        this.ctx.setFillStyle('rgba(165, 165, 165, 0.65)');
        this.ctx.rect(x, 235, 64, 96);
        this.ctx.fill();
        this.ctx.drawImage('../../../assets/images/unknown.png', x+23, 263, 19, 29);
      }
      this.ctx.draw(true);
    }
  }

  /* 画更多最受欢迎童书 */
  drawMorePopular() {
    this.ctx.setFontSize(13);
    this.ctx.setFillStyle('rgb(51,51,51)');
    this.ctx.fillText('更多最受欢迎童书', 20, 402);

    let ages = this.shareData.moreBook;
    ages.map((age) => {
      let books = age.books;

      let remainLength = MAX_BYTE_LENGTH;
      age.booksStr = books.map((book, i) => {
        let title = (book.title || '').replace(/[《》]/g, '');
        if (remainLength <= 0) return '';
        let length = byteLength(title);
        if (remainLength < length) title = title.slice(0, Math.floor(remainLength / 2)) + '...';
        remainLength = remainLength - length;
        return `《${title}》`;
      }).join('');
    });

    let x = 20, y = 423;
    for (let i = 0; i< ages.length; i++) {
      y = 423 + 18*i;
      this.ctx.setFontSize(11);
      this.ctx.fillText(`${ages[i].ageRange[0]}-${ages[i].ageRange[1]}岁:`, x, y);
      this.ctx.setFontSize(10);
      this.ctx.fillText(`${ages[i].booksStr}`, x + 38, y);
    }

    this.ctx.setFontSize(13);
    this.ctx.fillText('生成我的报告', 230, 402);
    this.ctx.drawImage('../../../assets/images/miniapp.jpg', 237, 408, 60, 60);
    this.ctx.draw();
  }

}

module.exports = Share;
