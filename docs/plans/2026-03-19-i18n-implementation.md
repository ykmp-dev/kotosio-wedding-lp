# 多言語化（日英切り替え）実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** KOTOSIO Wedding LPに日本語/英語の切り替え機能を追加する

**Architecture:** `data-i18n`属性でテキスト要素をマーク → `lang/ja.json`と`lang/en.json`で翻訳管理 → `js/i18n.js`で切り替えロジック。デフォルトのHTMLは日本語のまま残し、JSONのfetch失敗時もサイトが壊れない設計。

**Tech Stack:** Vanilla JS（既存のビルドレス構成を維持）

**設計書:** `docs/plans/2026-03-19-i18n-design.md`

---

### Task 1: i18n.jsの作成

**Files:**
- Create: `js/i18n.js`

**Step 1: i18n.jsを作成**

```js
// js/i18n.js — 多言語切り替えロジック
(function() {
  'use strict';

  const SUPPORTED_LANGS = ['ja', 'en'];
  const DEFAULT_LANG = 'ja';
  const STORAGE_KEY = 'kotosio-lang';

  let translations = {};

  // 言語判定: localStorage > ブラウザ設定
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    const browserLang = (navigator.language || '').slice(0, 2);
    return browserLang === 'ja' ? 'ja' : 'en';
  }

  // 翻訳を適用
  function applyTranslations(lang) {
    // テキスト内容
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations, key);
      if (value !== undefined) {
        // <br>を含む場合はinnerHTMLを使用
        if (value.includes('<br>')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = getNestedValue(translations, key);
      if (value !== undefined) el.placeholder = value;
    });

    // alt
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-alt');
      var value = getNestedValue(translations, key);
      if (value !== undefined) el.alt = value;
    });

    // select要素のoption
    document.querySelectorAll('[data-i18n-options]').forEach(function(select) {
      var keyPrefix = select.getAttribute('data-i18n-options');
      select.querySelectorAll('option').forEach(function(opt, i) {
        var value = getNestedValue(translations, keyPrefix + '.' + i);
        if (value !== undefined) opt.textContent = value;
      });
    });

    // html lang属性とトグルUI更新
    document.documentElement.lang = lang;
    updateToggleUI(lang);
  }

  // ネストされたキーの値を取得（例: "hero.title"）
  function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce(function(o, k) {
      return o && o[k] !== undefined ? o[k] : undefined;
    }, obj);
  }

  // トグルボタンのUI更新
  function updateToggleUI(lang) {
    var btnJa = document.getElementById('langBtnJa');
    var btnEn = document.getElementById('langBtnEn');
    if (!btnJa || !btnEn) return;
    btnJa.classList.toggle('active', lang === 'ja');
    btnEn.classList.toggle('active', lang === 'en');
  }

  // 言語を切り替え
  function switchLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);

    fetch('lang/' + lang + '.json?v=' + Date.now())
      .then(function(res) { return res.json(); })
      .then(function(data) {
        translations = data;
        applyTranslations(lang);
      })
      .catch(function(err) {
        console.warn('i18n: 翻訳ファイルの読み込みに失敗:', err);
      });
  }

  // 初期化
  function init() {
    var lang = detectLang();

    // 日本語の場合はJSON読み込み不要（HTMLがすでに日本語）
    if (lang === 'ja') {
      updateToggleUI('ja');
      return;
    }

    // 英語の場合のみJSONを読み込んで差し替え
    switchLang(lang);
  }

  // グローバルに公開（トグルボタンから呼び出し用）
  window.switchLang = switchLang;

  // DOM読み込み後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

**Step 2: ブラウザで確認**

`file:///C:/claude%20workspace/KOTOSIOLP/index.html` を開き、コンソールにエラーが出ないこと確認。

**Step 3: コミット**

```bash
git add js/i18n.js
git commit -m "feat: i18n.jsを追加（多言語切り替えロジック）"
```

---

### Task 2: 言語切り替えUIをヘッダーに追加

**Files:**
- Modify: `index.html` — ヘッダーナビ（3321-3334行付近）、CSSスタイル

**Step 1: ヘッダーHTMLにトグルを追加**

デスクトップナビ（3325-3328行付近）の最後、`</div>` の前に追加：
```html
<div class="lang-toggle">
  <button id="langBtnJa" class="lang-btn active" onclick="switchLang('ja')">JP</button>
  <button id="langBtnEn" class="lang-btn" onclick="switchLang('en')">EN</button>
</div>
```

SP用ハンバーガーの隣（3330行の直前）にも追加：
```html
<div class="lang-toggle-sp">
  <button id="langBtnJaSp" class="lang-btn active" onclick="switchLang('ja')">JP</button>
  <button id="langBtnEnSp" class="lang-btn" onclick="switchLang('en')">EN</button>
</div>
```

**注意:** i18n.jsの`updateToggleUI`関数をSP用のIDにも対応させる。

**Step 2: CSSを追加**

`<style>` セクション内に追加：
```css
/* 言語切り替えトグル */
.lang-toggle {
  display: none;
  align-items: center;
  gap: 2px;
  margin-left: 20px;
}

@media (min-width: 1024px) {
  .lang-toggle {
    display: flex;
  }
}

.lang-toggle-sp {
  display: flex;
  align-items: center;
  gap: 2px;
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
}

@media (min-width: 1024px) {
  .lang-toggle-sp {
    display: none;
  }
}

.lang-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.4);
  color: #fff;
  padding: 4px 8px;
  font-size: 11px;
  font-family: 'Noto Sans JP', sans-serif;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn.active {
  background: #8b7355;
  border-color: #8b7355;
  color: #fff;
}

/* スクロール後の色変更 */
.nav.scrolled .lang-btn {
  border-color: rgba(0,0,0,0.3);
  color: #333;
}

.nav.scrolled .lang-btn.active {
  background: #8b7355;
  border-color: #8b7355;
  color: #fff;
}
```

**Step 3: scriptタグを追加**

`</body>` の直前、既存scriptの後に追加：
```html
<script src="js/i18n.js"></script>
```

**Step 4: ブラウザで確認**

- ヘッダーに JP / EN ボタンが表示される
- PC: ナビ右端に表示
- SP: ハンバーガーの左に表示
- スクロール時に色が変わる

**Step 5: コミット**

```bash
git add index.html
git commit -m "feat: ヘッダーに言語切り替えトグル（JP/EN）を追加"
```

---

### Task 3: data-i18n属性をHTMLに付与 + ja.jsonを作成

**Files:**
- Modify: `index.html` — 全セクションのテキスト要素に `data-i18n` 属性を付与
- Create: `lang/ja.json`

**Step 1: 対象セクションとキー設計**

以下のセクション構造でキーを設計し、`index.html`の各テキスト要素に`data-i18n`属性を追加する。

**キーの命名規則：**
- セクション名.要素名（例: `hero.title_1`, `shonan.tagline`）
- 同種の要素は連番（例: `faq.q1`, `faq.a1`）
- フォーム: `contact.label_xxx`, `contact.placeholder_xxx`
- select options: `data-i18n-options` 属性で一括

**対象セクション一覧：**

1. **header** — バナーテキスト、ナビリンク4つ、モバイルメニューリンク4つ+CTA
2. **hero** — メインコピー、サブコピー、CTAボタン、SCROLL
3. **stats** — 4つの実績（数字+説明テキスト）
4. **brand** — ミッションテキスト、3つのバリュー（タイトル+説明）、信条5項目
5. **region** — 導入タイトル+説明文
6. **yokohama** — ロケーション名、タグライン、ストーリー（タイトル+本文）、3つの特徴（タイトル+説明）、ギャラリーalt×5、引用
7. **shonan** — 同上構造
8. **komagane** — 同上構造
9. **toyohashi** — 同上構造
10. **instagram** — タイトル、説明、フォローボタン
11. **testimonials** — 4つの声（本文+名前+地域）
12. **painpoints** — セクションタイトル、4つの悩み（タイトル+説明文）
13. **comparison** — セクションタイトル、表の全セル、説明文
14. **service** — セクションタイトル、4つのサービス（タイトル+説明+価格）
15. **flow** — セクションタイトル、4ステップ（タイトル+説明）
16. **faq** — セクションタイトル、8つのQ&A
17. **cta** — タイトル、説明、CTA、4つのチェックマーク、相談でわかること4項目
18. **contact** — タイトル、説明、ラベル×9、placeholder×5、select option×16、送信ボタン、注釈
19. **about** — タイトル、メイン説明、4地域の説明、クロージングコピー
20. **footer** — コピーライト、信頼バッジ×4

**Step 2: index.htmlに属性を付与**

全テキスト要素に `data-i18n="section.key"` を追加。例：
```html
<!-- before -->
<h1 class="hero-copy"><span>ただいま、と言える場所で、</span><span>家族が生まれる。</span></h1>

<!-- after -->
<h1 class="hero-copy"><span data-i18n="hero.title_1">ただいま、と言える場所で、</span><span data-i18n="hero.title_2">家族が生まれる。</span></h1>
```

フォーム要素の例：
```html
<input type="text" data-i18n-placeholder="contact.placeholder_groom" placeholder="山田 太郎">
<select data-i18n-options="contact.options_area">
  <option>選択してください</option>
  ...
</select>
```

画像alt：
```html
<img data-i18n-alt="shonan.gallery_alt_1" alt="湘南フォトウエディング 踏切×海" ...>
```

**Step 3: ja.jsonを作成**

`lang/ja.json` にHTMLから抽出した全テキストを格納。構造は上記キー設計に従う。

**Step 4: ブラウザで確認**

- ページの表示が変わらないこと（日本語のまま）
- コンソールにエラーが出ないこと

**Step 5: コミット**

```bash
git add index.html lang/ja.json
git commit -m "feat: 全テキスト要素にdata-i18n属性を付与、ja.jsonを作成"
```

---

### Task 4: en.jsonを作成（英語翻訳）

**Files:**
- Create: `lang/en.json`

**Step 1: ja.jsonをベースにen.jsonを作成**

`ja.json` の全キーを英語翻訳。

**翻訳のトーン指針：**
- ウェディング業界のエモーショナルなトーンを維持
- カジュアルすぎず、かしこまりすぎず
- 日本の地名はローマ字（Shonan, Yokohama, Komagane, Toyohashi）
- 固有名詞（KOTOSIO、Cモニュメント等）はそのまま
- 価格は日本円表示のまま（¥200,000〜 の形式）

**Step 2: ブラウザで確認**

- JP/ENトグルで英語に切り替え
- 全セクションが英語になっていること
- 切り替え後リロードしても英語が維持されること
- JPに戻すと日本語に戻ること

**Step 3: コミット**

```bash
git add lang/en.json
git commit -m "feat: en.json（英語翻訳）を追加"
```

---

### Task 5: 最終確認・デプロイ

**Files:**
- 全ファイルの最終チェック

**Step 1: 全体テスト**

以下を確認：
- [ ] 初回アクセス時、ブラウザ言語に応じて自動切り替え
- [ ] JP/ENトグルが正常動作
- [ ] localStorage に言語設定が保存される
- [ ] 全セクションの翻訳漏れがないか
- [ ] フォームのplaceholder、selectのoption、画像のaltが切り替わるか
- [ ] SP表示でトグルが正しく表示されるか
- [ ] スクロール時にトグルの色が正しく変わるか
- [ ] JSON読み込み失敗時に日本語で表示されるか

**Step 2: デプロイ**

```bash
git push origin main
```
