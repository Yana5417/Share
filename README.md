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
},
```
##### 上述代码中，使用promise将童书的封面（服务器端获取到的图片）暂存到本地，获取一个本地链接，这是因为canvas不能绘制外部链接图片。
##### 最近项目比较忙，后悔会讲解具体绘制思路。 未完待续...
