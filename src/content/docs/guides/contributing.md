---
title: yamisskey開発ガイド
description: Misskeyフォークyamisskeyにおけるブランチ管理からリリースまでの包括的な開発者ガイド
ogImage: ../../assets/logo.webp
---

## 概要

このガイドでは、Misskeyフォーク「[yamisskey](https://github.com/yamisskey/yamisskey/)」の開発手順について説明します。本番環境（[master](https://github.com/yamisskey/yamisskey/tree/master)）、テスト環境（[nayami](https://github.com/yamisskey/yamisskey/tree/nayami)）、開発環境（[muyami](https://github.com/yamisskey/yamisskey/tree/muyami)）の3つのブランチを使用した開発フローと、アップストリーム（[Misskey本体](https://github.com/misskey-dev/misskey/tree/master)）からの変更取り込み手順を解説します。

## ブランチ構成と役割

### masterブランチ（本番環境）

* [やみすきー](https://yami.ski/)の安定運用版として位置づけ
* バージョン名には「yami」を使用（例: 2025.1.0-yami-1.4.3）
* Misskeyの新機能は、やみすきーのコンセプト（プライバシー重視、心理的安全重視）に合致するものだけを選択的に取り入れる
* 本番環境での安定した運用を重視

### nayamiブランチ（テスト環境）

* [なやみすきー](https://na.yami.ski/)はテスト版として位置づけ
* 開発完了した機能の検証用
* バージョン名には「nayami」を使用（例: 2025.1.0-nayami-1.4.3）
* 本番環境への反映前の最終検証を行う場所
* ユーザーフィードバックの収集も行う

### muyamiブランチ（開発環境）

* 開発専用環境として位置づけ
* サーバー常駐なしで開発者のローカル環境で動作
* バージョン名には「muyami」を使用（例: 2025.1.0-muyami-1.4.3）
* 新機能開発や実験的な機能の実装に使用
* 自由な開発とイノベーションを促進

## 1. 開発環境のセットアップ

### 必要な環境

* Node.js v20以上
* pnpm（パッケージマネージャー）
* Git

### 環境確認

```bash
# Node.jsバージョン確認
node -v

# pnpmの有効化
corepack enable
```

### Gitの初期設定

```bash
# 現在の設定確認
git config --list | grep user

# ユーザー名とメールアドレスの設定（未設定の場合）
git config --global user.name "Your Name"
git config --global user.email "your.email"
```

### リポジトリの準備

```bash
# リモートの確認と追加
git remote -v
git remote add upstream https://github.com/misskey-dev/misskey.git

# 最新状態への更新
git fetch --all --prune

# 作業環境のクリーン化
git status
git stash -u  # 必要な場合
```

## 2. 新しい開発フロー

### ブランチの作成と管理

```bash
# masterブランチの最新化
git checkout master
git pull origin master

# nayamiブランチ（テスト環境）の作成/更新
git checkout -b nayami
git push origin nayami

# muyamiブランチ（開発環境）の作成/更新
git checkout -b muyami
git push origin muyami
```

### 開発作業の基本フロー

#### 1. 新機能開発（muyamiブランチ）

```bash
# 開発ブランチへの切り替え
git checkout muyami

# 機能ごとのトピックブランチを作成
git checkout -b feat/新機能名
```

#### 2. 開発作業

```bash
# 変更の実施
# ...コーディング作業...

# 変更の確認とテスト
pnpm install
pnpm run build
pnpm run dev  # 開発サーバーの起動

# 変更のコミット
git add .
git commit -m "feat: 機能の説明"
```

#### 3. muyamiブランチへのマージ

```bash
# muyamiブランチに戻る
git checkout muyami

# 開発した機能をマージ
git merge feat/新機能名

# muyamiブランチの更新をリモートに反映
git push origin muyami
```

#### 4. テスト環境への反映（nayamiブランチ）

```bash
# テスト環境ブランチへの切り替え
git checkout nayami

# 開発完了した機能をマージ
git merge muyami --no-ff -m "merge: 開発済み機能をテスト環境に反映"

# package.jsonのバージョン更新（muyami → nayami）
# エディタでpackage.jsonを開き、バージョン名を変更

# テスト環境への反映
git push origin nayami
```

#### 5. 本番環境への反映（masterブランチ）

```bash
# 本番環境ブランチへの切り替え
git checkout master

# テスト済み機能をマージ
git merge nayami --no-ff -m "merge: テスト済み機能を本番環境に反映"

# package.jsonのバージョン更新（nayami → yami）
# エディタでpackage.jsonを開き、バージョン名を変更

# 本番環境への反映
git push origin master
```

## 3. アップストリームからの変更取り込み

### 準備作業


1. 現在の状態のバックアップ

```bash
git branch backup/[現在のバージョン] muyami
git branch backup/[現在のバージョン]-nayami nayami
git branch backup/[現在のバージョン]-master master
```


2. package.jsonのバージョン更新確認

```json
{
  "name": "misskey",
  "version": "2025.1.0-yami-1.4.3",  // masterブランチでは-yamiを使用
  // nayamiブランチでは "2025.1.0-nayami-1.4.3" を使用
  // muyamiブランチでは "2025.1.0-muyami-1.4.3" を使用
  "repository": {
    "url": "https://github.com/yamisskey/yamisskey.git"
  }
}
```

### マージプロセス

#### 1. 開発ブランチ（muyami）への変更取り込み

```bash
git checkout muyami
git merge upstream/master
```

#### 2. コンフリクト解決の優先順位

```bash
# 自動生成ファイル（upstreamを採用）
git checkout --theirs packages/misskey-js/src/autogen/
git add packages/misskey-js/src/autogen/

# ロケールファイル
git checkout --theirs locales/
git add locales/

# lockファイル
git checkout --theirs pnpm-lock.yaml
git add pnpm-lock.yaml

# プライバシー機能（フォークの実装を維持）
git checkout --ours packages/frontend/src/components/MkNote.vue
git checkout --ours packages/frontend/src/components/MkPostForm.vue
git add packages/frontend/src/components/Mk*.vue
```

#### 3. 開発環境での動作確認

```bash
pnpm install
pnpm run build
pnpm run dev
```

#### 4. テスト環境（nayami）への反映

```bash
git checkout nayami
git merge muyami --no-ff -m "merge: アップストリーム変更をテスト環境に反映"
git push origin nayami
```

#### 5. テスト環境での詳細検証

以下の項目を重点的に確認：
* プライバシー機能の動作確認
* 新機能の正常動作
* パフォーマンスの確認
* インスタンス情報の制御機能
* ノート自動削除機能
* 投稿フォームのカスタマイズ

#### 6. 本番環境（master）への反映

```bash
git checkout master
git merge nayami --no-ff -m "merge: テスト済みアップストリーム変更を本番環境に反映"
git push origin master
```

## 4. リリース管理

### リリースタグの作成

```bash
# masterブランチでタグ作成
git checkout master
git tag -a '[新バージョン]' -m "Release [新バージョン]"
git push origin --tags
```

### 各環境のバージョン管理

* master: 2025.1.0-yami-x.x.x
* nayami: 2025.1.0-nayami-x.x.x
* muyami: 2025.1.0-muyami-x.x.x

## 5. トラブルシューティング

### マージ失敗時の対応

```bash
# マージの中断
git merge --abort

# バックアップからの復帰
git checkout backup/[現在のバージョン]
```

### よくある問題と解決方法

* ビルドエラー → `pnpm install` の再実行
* マイグレーションエラー → データベースのバックアップ確認
* コンフリクト → 優先順位に従って解決
* ブランチの混乱 → 各ブランチの役割を明確に意識

## 6. ブランチ保護ルール（GitHub Branch Protection）

### masterブランチの保護設定
masterブランチには以下の保護ルールを設定しています：

* **ブランチ削除の禁止**：誤った削除を防止します

これらの設定により、本番環境の安定性と品質を確保します。

### nayamiとmuyamiブランチ
開発とテストを柔軟に行うため、nayamiとmuyamiブランチには厳格な保護ルールを設けていません。ただし、以下の運用ルールを守ってください：

* muyamiブランチでの開発は必ずトピックブランチから行う
* nayamiブランチへのマージは十分なテスト後に行う
* 他の開発者の作業を尊重し、必要に応じて事前に連絡する

## 7. 継続的インテグレーション（CI）

### GitHub Actionsの役割
やみすきーでは品質管理のためにGitHub Actionsを活用して継続的インテグレーション（CI）を実施しています。これにより以下のメリットがあります：

* コードの品質保証（リント、型チェック）
* 自動テスト実行によるバグの早期発見
* ビルドエラーの検出
* 本番環境への安全なデプロイ

### CI設定
* リポジトリのActionsタブでワークフローの実行状況を確認できます
* 主要なワークフローは以下の通りです：
  - `lint.yml` - コードスタイルと品質チェック
  - `test-backend.yml` - バックエンドのテスト
  - `test-frontend.yml` - フロントエンドのテスト
  - `test-production.yml` - 本番環境想定のビルドテスト

### ブランチでのCI活用方法
* **muyamiブランチ（開発環境）** - 開発中の変更が基本的な品質基準を満たすか確認
* **nayamiブランチ（テスト環境）** - 統合テストとユーザー機能テスト
* **masterブランチ（本番環境）** - リリース前の最終検証

### プルリクエスト時のCI
プルリクエストを作成すると自動的にCIテストが実行されます。以下に注意してください：
* テストが失敗した場合は、エラーを修正してから再度プッシュしてください
* すべてのテストが通過するまでmasterブランチへのマージは行わないでください

## 8. 注意事項
* 重要な変更前は必ずバックアップを作成
* プライバシー機能に関する変更は特に慎重にテスト
* パフォーマンスへの影響を必ず確認
* セキュリティ関連の修正は優先して取り込み
* 各ブランチの役割を尊重し、適切なフローで開発を進める
* muyami（開発）→ nayami（テスト）→ master（本番）の流れを徹底