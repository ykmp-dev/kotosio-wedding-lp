// js/i18n.js — 多言語切り替えロジック
(function() {
  'use strict';

  var SUPPORTED_LANGS = ['ja', 'en'];
  var DEFAULT_LANG = 'ja';
  var STORAGE_KEY = 'kotosio-lang';

  var translations = {};

  // 言語判定: localStorage > ブラウザ設定
  function detectLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

    var browserLang = (navigator.language || '').slice(0, 2);
    return browserLang === 'ja' ? 'ja' : 'en';
  }

  // 翻訳を適用
  function applyTranslations(lang) {
    // テキスト内容
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations, key);
      if (value !== undefined) {
        // HTMLタグを含む場合はinnerHTMLで設定
        if (value.indexOf('<br>') !== -1 || value.indexOf('<') !== -1) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // placeholder属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = getNestedValue(translations, key);
      if (value !== undefined) el.placeholder = value;
    });

    // alt属性
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

  // トグルボタンのUI更新（PC用とSP用の両方に対応）
  function updateToggleUI(lang) {
    ['langBtnJa', 'langBtnJaSp', 'langBtnJaMobile'].forEach(function(id) {
      var btn = document.getElementById(id);
      if (btn) {
        if (lang === 'ja') btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
    ['langBtnEn', 'langBtnEnSp', 'langBtnEnMobile'].forEach(function(id) {
      var btn = document.getElementById(id);
      if (btn) {
        if (lang === 'en') btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
  }

  // 言語を切り替え
  function switchLang(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
    localStorage.setItem(STORAGE_KEY, lang);

    if (lang === 'ja') {
      // 日本語に戻す場合はページをリロードしてHTMLデフォルトに戻す
      location.reload();
      return;
    }

    // 英語などの場合はJSONを読み込んで差し替え
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
