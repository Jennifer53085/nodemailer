# nodemailer(google及SMTP做法)

## 使用google OAuth 2.0 透過Gmail api寄信
#### 1.建立專案

  ![Select Project" Dropdown Menu](https://github.com/Jennifer53085/nodemailer/blob/main/1701914533295.jpg)
  ![Create New Project](https://github.com/Jennifer53085/nodemailer/blob/main/1701914555154.jpg)

#### 2.選取Gmail api
  點擊左側導覽列中的「API和服務」
  
  ![APIs and Services Navber](https://github.com/Jennifer53085/nodemailer/blob/main/1701914587716_0.jpg)
  
  點擊上方「啟用 API 和服務」
  
  ![APIs and Services Button](https://github.com/Jennifer53085/nodemailer/blob/main/addApi.jpg)
  
  搜尋Gmail 找到Gmail api進行啟用
  
  ![Gmail api](https://github.com/Jennifer53085/nodemailer/blob/main/gmail_api.jpg)

#### 3.設定OAuth同意畫面--第一次開啟API的話需要進行設定，其餘沒有進行其他更動的話可以跳過這步驟
  點選左側導覽列中的「憑證」會看到一個「設定同意畫面」，之後點選「設定同意畫面」會看到下面設定畫面
  ![OAuth 2.0 Configuration Screen](https://github.com/Jennifer53085/nodemailer/blob/main/agreement.png)
  
  點擊外部，會進入「編輯應用程式註冊申請」畫面，以下三點是必填外其他都是選填:
  -應用程式名稱：取名
  *使用者支援電子郵件：選自己 Email
  +開發人員聯絡資訊：選自己 Email
  點擊後進入「範圍」的設定頁面可以跳過設定直接點「儲存並繼續」

#### 4.設定OAuth2.0憑證
  點選「建立憑證」中的「建立OAuth2.0用戶端ID」
  
  ![Create Credentials](https://github.com/Jennifer53085/nodemailer/blob/main/1701914679132_0.jpg)
  選擇「網頁應用程式」
  
  ![Select Web Application](https://github.com/Jennifer53085/nodemailer/blob/main/1701914697465_0.jpg)
  
  設定「網頁應用程式」
  -名稱：自行取名
  +已授權的重新導向 URI：請輸入 ** http://localhost:3000/auth/google/callback **
  
  ![Setting Web Application](https://github.com/Jennifer53085/nodemailer/blob/main/202307211128.jpg)
  
  所有設定好之後會跳出有CLIENT_ID及CLIENT_SECRET，可以下載JSON檔案或是直接複製兩個資料分別貼入.env的相對應變數即完成

## SMTP server設定
取得該公司的SMTP的
-domain name(host)
*port號
*auth.user:寄件人信箱帳號
+auth.pass:寄件人信箱密碼
```
const mail=nodemailer.createTransport({
  host: 'mail.domain.com', // Server
  port: 25,
  auth: {
    user: 'yourcompany@email',
    pass: 'password',
  },
});
```
