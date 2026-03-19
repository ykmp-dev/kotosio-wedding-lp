# KOTOSIO プロジェクト引き継ぎ

## プロジェクト概要

KOTOSIOウェディングのLP。湘南・横浜・駒ヶ根・豊橋の4エリアでフォトウェディング・ロケーション撮影を提供するサービス。

- **本番LP**: `index.html`（単一ファイル、HTML/CSS/JS全てインライン）
- **URL**: https://kotosio-wedding-lp.netlify.app（Cloudflare Pages移行後に変更）
- **デプロイ**: Cloudflare Pagesに移行予定（現状はNetlify）
- **ローカル確認**: `python3 -m http.server 8000`

## 現状のステータス

**本番稼働中のLP（index.html）はそのまま動いている。** ただしコンセプトレベルの課題が未解決。

### ファイルの状態

| ファイル | 状態 | 説明 |
|---------|------|------|
| `index.html` | **本番** | 現在デプロイ中のLP |
| `index-v2-feminine.html` | ボツ | フェミニン路線の試作 |
| `index-v3-motion.html` | ボツ | アニメーション追加版 |
| `index-v4-cinematic.html` | ボツ | シネマティックレイアウト版 |
| `index-v5-kaeru.html` | ボツ | 「帰る日」コンセプト版。コンセプト不在のまま上物を盛った失敗作 |
| `index-figma.html` | 参考 | Figma取込用の静的版 |
| `LP-issues.md` | **重要** | コンセプトレベルの課題整理。必ず読むこと |
| `CLAUDE.md` | 有効 | Claude Code用のプロジェクト情報 |

**ボツ版（v2〜v5）は参考のために残しているが、これらをベースに作業しないこと。**

## 最重要コンテキスト

### 「KOTOSIO（ことしお）」の意味が未開示

ブランド名「ことしお」は造語。この言葉の意味の開示が、サービスコンセプトそのものになるはず。
現状、LP上ではAbout Usに「人生の『ことしお』になる結婚式を」と1行あるだけで、意味が伝わっていない。

**「ことしお」の意味を言語化するところが全ての起点。** ここが空白のままLPを作ると寄せ集めになる（v5で実証済み）。

### V5「帰る日」コンセプトの失敗から学んだこと

- 「帰る日」はコンセプトとしてストレートすぎた（説明であって詩ではない）
- コンセプトが固まる前にLPのセクションを足すと断層が増えるだけ
- 「何ではないか」（撮影サービスではありません）は語れるが「何であるか」を一言で言えない状態だった
- ロケーションセクションが旧LP（フォトスタジオ調）のままで、新コンセプトとの世界観が断絶していた

### 市場データ（2025年調査）

コンセプト検討の参考値として。

| 指標 | 数値 | 出典 |
|------|------|------|
| フォト婚市場規模 | 1,025億円 | Wedding Park 2025 |
| 家族参加希望 | 29.7%（前年比+6.1pt、急成長中） | Wedding Park 2025 |
| ナシ婚率 | 26.3%（増加中） | マイナビ 2025 |
| フォト婚平均費用 | 28.4万円 | Wedding Park 2025 |
| 再婚含む婚姻 | 約26%（4組に1組） | 厚労省 2023 |
| 同性パートナーシップ | 9,836組 | nippon.com 2025 |

**家族参加型の需要は伸びている。方向性は市場と合っている。問題はコンセプトの言語化。**

## 次にやるべきこと

1. **Cloudflare Pagesでデプロイ環境を構築する**（下記「デプロイ移行」参照）
2. **オーナーと対話して「ことしお」の意味を言語化する**
3. その意味からサービス定義・対象者・価格の正当性を一本の筋で通す
4. 筋が通ったらLPに落とす（index.htmlを改修 or 新規作成）

## やってはいけないこと

- コンセプトが固まる前にLPのセクションを増やす・デザインを凝る
- 「帰る日」をそのまま再利用する（ボツ済み）
- v2〜v5をベースにする（全てボツ）
- 旧HANDOVER.mdにあったmicroCMS情報は現在未使用（index.htmlからmicroCMS連携は削除済み）

## 技術情報

### デプロイ移行: Netlify → Cloudflare Pages

**現状はNetlifyだが、Cloudflare Pagesに移行予定。**

#### 引き継ぎ担当がやること

1. Cloudflareアカウントで Pages プロジェクトを作成
   - `Dashboard → Workers & Pages → Create → Pages → Connect to Git`
2. ビルド設定（静的HTMLなのでビルド不要）
   - Build command: （空欄）
   - Build output directory: `/` or `.`
3. GitHubリポジトリを接続 → mainブランチへのpushで自動デプロイ
4. カスタムドメイン `kotosio.com` を設定（Cloudflare DNS + Pages Custom domains）
5. 動作確認後、以下を削除・無効化：
   - `.github/workflows/deploy-lp.yml`（GitHub Actions経由のデプロイは不要になる）
   - GitHub Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_KOTOSIO_SITE_ID`
6. CLAUDE.md のデプロイ情報を更新

#### 旧Netlify情報（参考・移行後は破棄）
- Netlify Site ID: `7cdcbb1f-2b11-44f3-85f4-dc20b2bacbea`
- **NETLIFY_AUTH_TOKENは漏洩済み。移行しない場合でも再生成必須。**

### デザイン基本情報
- Colors: Primary #1a1a1a, Secondary #f5f0eb, Accent #8b7355
- Fonts: 見出し Noto Serif JP / 本文 Noto Sans JP
- Mobile-first（SP-first CSS、PCは `@media (min-width: 1024px)`）

### 画像
- エリア別: `yokohama/`, `komagane/`, `toyohashi/`, `shonan/`
- 高画質原本: `本番高画質/`
- テスト用: `テスト用低画質/`

## 詳細な課題整理

`LP-issues.md` を参照。コンセプトレベルの6つの問題点と市場データをまとめている。
