#### 调用方式：
```
// 画分享图片
async drawShare() {
  let { shareData } = this.data;

  const userInfo = wx.getStorageSync('userInfo');
  let headerImage = await this.getImageInfo(userInfo.headimgurl);
  let books = shareData.books;

  let p1 = Promise.all(books.map(async book => {
    book.score = book.score.toFixed(1);
    if (book.cover && book.cover.wxApp) {
      await this.getImageInfo(book.cover.wxApp).then(miniUrl => {
        book.cover.miniUrl = miniUrl;
      });
    }
  }));

  p1.then((data) => {
    new Share({
      canvasId: 'shareCanvas',
      shareData: shareData,
      headerImage: headerImage,
      nickname: userInfo.nickname,
      radarImg: this.data.radarImg,
      books: data,
    });
    wx.hideLoading();
  });
}
```
#### 保存图片
```
// 保存分享图片
saveImage() {
  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: 325,
    height: 489,
    canvasId: 'shareCanvas',
    success: res => {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          this.setData({ shareImgShow: false }, () => {
            setTimeout(() => {
              this.setData({ shareGuideShow: true });
            }, 200);
          });
        },
        fail(res) {
          console.log(res);
        },
        complete(res) {
          console.log(res);
        }
      });
    },
    fail: err => {
      setTimeout(() => {
        this.handleCanvarToImg();
      }, 200);
    }
  });
}
```
##### 上述代码中，使用promise将童书的封面（服务器端获取到的图片）暂存到本地，获取一个本地链接，这是因为canvas不能绘制外部链接图片。
##### 后续会讲解具体绘制思路及方法。 未完待续...
