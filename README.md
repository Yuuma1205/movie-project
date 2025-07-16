# Cinema Addict 🎬

## 作品介紹 | Project Overview

Cinema Addict 是一個結合電影與電視影集的收藏平台，支援主題搜尋、熱門排行、收藏我的最愛，並串接 [TMDB API](https://www.themoviedb.org/) 及 Firebase 後端。  
Cinema Addict is a movie & TV show collection platform. You can search, browse trending titles, and manage your personal watchlist, with data powered by [TMDB API](https://www.themoviedb.org/) and Firebase.

## Demo

- 線上預覽 Online Demo: [https://playful-raindrop-03b6ff.netlify.app/](https://playful-raindrop-03b6ff.netlify.app/)

## 技術棧 | Tech Stack

- **前端 Frontend**: React (Vite)
- **UI**: CSS, 自訂響應式設計 Responsive Design
- **資料串接 Data**: TMDB REST API, Firebase (Auth & Firestore)
- **登入功能 Auth**: Google Sign-In, Email 登入/註冊
- **部署 Deployment**: Netlify

## 特色功能 | Features

- 🔍 電影/影集關鍵字搜尋 Movie/TV search
- 📈 熱門排行 Trending list
- ⭐️ 收藏/移除最愛 Add/remove favorites (watchlist)
- 👤 Google 第三方登入 Third-party login
- ☀️ 暗色/亮色主題切換 Dark/Light mode toggle
- 📱 RWD 響應式設計 Responsive Design

## 如何啟動 | Getting Started

```bash
git clone https://github.com/Yuuma1205/movie-project.git
cd movie-project
npm install
# 建立 .env 並填入 API Key（見下方 .env 設定）
npm run dev
```

## .env 設定 | .env Setup

請在專案根目錄下建立 `.env` 檔案，並填入以下內容：

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxx
VITE_FIREBASE_APP_ID=xxxxxx
VITE_FIREBASE_MEASUREMENT_ID=xxxxxx
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## 專案結構 | Project Structure

<details>
<summary>點我展開/Click to expand</summary>

```plaintext
movie-project/
├── public/                 # 靜態資源 Static assets
├── src/
│   ├── assets/             # 圖片、icon 等素材 Images and icons
│   ├── components/         # 可重用元件 Reusable components
│   │   ├── Banner/
│   │   ├── LoginModal/
│   │   ├── MediaList/
│   │   ├── MovieList/
│   │   ├── TVList/
│   │   └── ...
│   ├── context/            # React context 狀態管理
│   ├── pages/              # 路由頁面 Pages (Home, Search, MyFavorites, etc.)
│   ├── App.jsx
│   ├── main.jsx
│   └── firebase.js         # Firebase 設定
├── .env                    # 環境變數 Environment variables
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

</details>
