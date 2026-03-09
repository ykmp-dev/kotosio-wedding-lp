# KOTOSIO LP 引き継ぎ資料

## サイト概要
- URL: https://kotosio.com
- フレームワーク: 静的HTML + CSS + JavaScript
- CMS: microCMS
- デプロイ: Netlify（GitHub連携）

---

## ファイル構成

```
/home/yuber/workspace/KOTOSIO/
├── index.html              # 本番LP（メイン）
├── index-figma.html        # Figma取込用（静的）
├── images/                 # 画像フォルダ
│   ├── yokohama/
│   ├── shonan/
│   ├── komagane/
│   └── toyohashi/
└── microcms-*.json         # APIスキーマ定義ファイル
```

---

## microCMS 設定

### サービス情報
- サービスID: `kotosio`
- APIキー: `ypPunTvi0Ww1WfXgUiobybLT21iro6d8N4n8`

### API一覧（最大5個）

| # | API名 | エンドポイント | 用途 |
|---|-------|---------------|------|
| 1 | locations | locations | ロケーション名、タグライン、説明、カルーセル画像 |
| 2 | gallery | gallery | ギャラリー画像、カテゴリ |
| 3 | testimonials | testimonials | お客様の声 |
| 4 | site-content | site-content | Hero、ブランド、CREDO、Q&A、サービス等（key-value） |
| 5 | location-features | location-features | 各ロケのFEATURES、ストーリー、引用文 |

---

## コンテンツ編集手順

### テキスト・画像を変更する場合
1. https://kotosio.microcms.io/ にログイン
2. 該当するAPIを選択
3. コンテンツを編集 → 「公開」ボタン
4. 数分で本番に反映（Webhook自動デプロイ）

### HTML/CSS/JSを変更する場合
1. ローカルで `index.html` を編集
2. GitHubにプッシュ
3. Netlifyが自動デプロイ

---

## 開発環境

### ローカルプレビュー
```bash
cd /home/yuber/workspace/KOTOSIO
python3 -m http.server 8000
# http://localhost:8000 にアクセス
```

### microCMSデータの確認
```bash
curl -H "X-MICROCMS-API-KEY: ypPunTvi0Ww1WfXgUiobybLT21iro6d8N4n8" \
  https://kotosio.microcms.io/api/v1/locations
```

---

## Netlify 設定

- ダッシュボード: https://app.netlify.com/
- Build Hook URL: https://api.netlify.com/build_hooks/699aabf6cacbf145c13917d8
- 連携リポジトリ: GitHub

---

## ブランドガイドライン

### コンセプト
「土地が語り、写真が遺し、人生の"ことしお"になる結婚式を。」

### メインコピー
「ただいま、と言える場所で、家族が生まれる。」

### カラーパレット
- Primary: #1a1a1a（ディープブラック）
- Secondary: #f5f0eb（ウォームベージュ）
- Accent: #8b7355（アースブラウン）

### フォント
- 見出し: Noto Serif JP
- 本文: Noto Sans JP

### ターゲット
- 26〜45歳、世帯年収700万〜1500万
- 湘南・横浜・駒ヶ根・豊橋に「ただいま」と言える場所を持つカップル

---

## site-content API キー一覧

### Hero
- `hero_title`: メインタイトル
- `hero_subtitle`: サブタイトル

### ブランドストーリー
- `brand_title`: タイトル
- `brand_description`: 説明文
- `credo_1`〜`credo_5`: CREDO 5箇条

### Q&A
- `qa_1_q`〜`qa_N_q`: 質問
- `qa_1_a`〜`qa_N_a`: 回答

### サービス
- `service_photo_title`: フォトウエディングタイトル
- `service_photo_desc`: 説明
- `service_ceremony_title`: 挙式・パーティタイトル
- ...

---

## トラブルシューティング

### microCMSの変更が反映されない
- キャッシュをクリア
- microCMSで「公開」ボタンが押されているか確認
- Netlifyのデプロイ状況を確認

### 画像が表示されない
- microCMSの画像URLが正しいか確認
- 画像サイズが大きすぎないか確認

### デプロイが失敗する
- GitHubのコミットにエラーがないか確認
- Netlifyのデプロイログを確認
