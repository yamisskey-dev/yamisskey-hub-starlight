# yamisskey-hub-starlight

✨ YAMI エコシステムのドキュメントサイト **[hub.yami.ski](https://hub.yami.ski)** のソースリポジトリ。[Astro Starlight](https://starlight.astro.build) で構築。

[やみすきー](https://yami.ski) と周辺サービスの理念・使い方・規約（利用規約 / プライバシーポリシー / モデレーションポリシー）をまとめています。

## 構成

- `src/content/docs/guides/` — 理念・エコシステム紹介・参加ガイド・運用ルール
- `src/content/docs/reference/` — 機能・使い方・管理体制・モデレーション・プライバシーポリシー・利用規約

## 開発

```bash
pnpm install
pnpm run dev      # localhost:4321
pnpm run build    # ./dist/ にビルド
pnpm run preview
```

## 貢献

誤字修正・内容の改善は Issue / Pull Request で歓迎します。規約類（privacy / term）の変更は改定履歴に追記した上で PR してください。

## 関連

- [yamisskey-dev](https://github.com/yamisskey-dev) — 組織トップ
- [yamisskey](https://github.com/yamisskey-dev/yamisskey) — Misskey フォーク本体
- [yamidao](https://github.com/yamisskey-dev/yamidao) — ガバナンス（GOVERNANCE / ROADMAP）
