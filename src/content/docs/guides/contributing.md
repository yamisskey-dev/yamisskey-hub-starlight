---
title: yamisskey開発ガイド
description: Misskeyフォークyamisskeyの開発手順
---

## 概要

[Misskey](https://github.com/misskey-dev/misskey)フォーク「[yamisskey](https://github.com/yamisskey-dev/yamisskey/)」の開発手順について説明します。基本的な開発手順は[フォーク元の開発ガイド](https://github.com/misskey-dev/misskey/blob/develop/CONTRIBUTING.md#development)を参照してください。

3ブランチによる開発フロー：
- **master**: 本番環境（[やみすきー](https://yami.ski/)）
- **nayami**: テスト環境（[なやみすきー](https://na.yami.ski/)）  
- **muyami**: 開発環境（ローカル）

## ブランチ構成

### masterブランチ（本番環境）
- [やみすきー](https://yami.ski/)の安定運用版
- バージョン形式: `2025.1.0-yami-1.4.3`
- 自動ビルド: GitHubリリース時に[Dockerイメージ](https://hub.docker.com/r/yamisskey/yamisskey/tags)作成
- やみすきーのコンセプト（プライバシー重視、心理的安全重視）に合致する機能のみ導入

### nayamiブランチ（テスト環境）
- [なやみすきー](https://na.yami.ski/)はテスト版
- バージョン形式: `2025.1.0-nayami-1.4.3`  
- 自動ビルド: push時に[Dockerイメージ](https://hub.docker.com/r/yamisskey/yamisskey/tags)作成
- 本番前の最終検証とユーザーフィードバック収集

### muyamiブランチ（開発環境）
- 開発専用環境
- バージョン形式: `2025.1.0-muyami-1.4.3`
- ローカルビルド: 開発者環境でDockerビルド
- 新機能開発と実験的機能の実装

## セットアップ

### 必要環境
- Node.js
- pnpm
- Git (2.15以降、git worktree対応)

### 推奨開発環境
- Visual Studio Code
- Docker
- devcontainer (Claude Codeが設定済み)

### リポジトリ準備
```bash
# リポジトリのクローン
git clone https://github.com/yamisskey-dev/yamisskey.git
cd yamisskey

# リモートの確認と追加
git remote -v
git remote add upstream https://github.com/misskey-dev/misskey.git

# 最新状態への更新
git fetch --all --prune --tags
```

### Git Worktree構築

yamisskeyでは、git worktreeを使用して複数のブランチを同時に管理します。これにより、ブランチ切り替え時の再ビルドを避け、効率的な開発が可能になります。

```bash
# メインリポジトリのディレクトリ構成
# yamisskey/           (メインリポジトリ、masterブランチ)
# yamisskey-nayami/    (テスト環境用worktree)
# yamisskey-muyami/    (開発環境用worktree)

# nayamiブランチ用のworktree作成
git worktree add ../yamisskey-nayami nayami

# muyamiブランチ用のworktree作成
git worktree add ../yamisskey-muyami muyami

# worktreeの確認
git worktree list
```

#### 各worktreeでの初期設定
```bash
# nayami環境のセットアップ
cd ../yamisskey-nayami
pnpm install
pnpm build
pnpm build-misskey-js-with-types

# muyami環境のセットアップ
cd ../yamisskey-muyami
pnpm install
pnpm build
pnpm build-misskey-js-with-types
```

## 開発フロー

### 1. 新機能開発（muyamiブランチ）
```bash
# muyami worktreeに移動
cd ../yamisskey-muyami

# 最新の変更を取得
git pull origin muyami

# 機能ごとのトピックブランチを作成
git checkout -b feat/新機能名
```

### 2. 開発作業
```bash
# muyami worktreeで作業
cd ../yamisskey-muyami

# 変更の実施
# ...コーディング作業...

# 変更の確認とテスト（既にビルド済みの環境を利用）
pnpm dev

# 必要に応じて再ビルド
pnpm build
pnpm migrate

# 変更のコミット
git add .
git commit -m "feat: 機能の説明"
```

### 3. muyamiブランチへのマージ
```bash
# muyami worktree内で作業継続
cd ../yamisskey-muyami

# muyamiブランチに戻る
git checkout muyami

# 開発した機能をマージ
git merge feat/新機能名

# muyamiブランチの更新をリモートに反映
git push origin muyami
```

### 4. テスト環境への反映（nayamiブランチ）
```bash
# nayami worktreeに移動
cd ../yamisskey-nayami

# 最新の変更を取得
git pull origin nayami

# 開発完了した機能をマージ
git merge muyami

# package.jsonのバージョン更新（muyami → nayami）
# エディタでpackage.jsonを開き、バージョン名を変更

# 必要に応じてビルド
pnpm build

# テスト環境への反映
git push origin nayami
```

### 5. 本番環境への反映（masterブランチ）
```bash
# メインリポジトリ（master）に移動
cd ../yamisskey

# 最新の変更を取得
git pull origin master

# テスト済み機能をマージ
git merge nayami

# package.jsonのバージョン更新（nayami → yami）
# エディタでpackage.jsonを開き、バージョン名を変更

# 必要に応じてビルド
pnpm build

# 本番環境への反映
git push origin master
```

## 他フォークから機能をcherry-pick

### 準備作業
```bash
# 開発環境のworktreeで作業
cd ../yamisskey-muyami

# 他フォークをリモートに追加
git remote add misskey-fork-name https://github.com/misskey-fork-org-name/misskey-fork-name.git
git fetch --all
```

### チェリーピック
```bash
# muyami worktreeで実行
cd ../yamisskey-muyami
git cherry-pick コミットID
```

## アップストリームからの変更取り込み

### 準備作業

1. package.jsonのバージョン更新確認

```json
{
  "name": "misskey",
  "version": "2025.1.0-yami-1.4.3",  // masterブランチでは-yamiを使用
  // nayamiブランチでは "2025.1.0-nayami-1.4.3" を使用
  // muyamiブランチでは "2025.1.0-muyami-1.4.3" を使用
  "repository": {
    "url": "https://github.com/yamisskey-dev/yamisskey.git"
  }
}
```

2. 現在の状態のバックアップ

```bash
# 各worktreeでバックアップブランチを作成
cd ../yamisskey-muyami
git branch backup/[現在のバージョン] muyami

cd ../yamisskey-nayami
git branch backup/[現在のバージョン] nayami

cd ../yamisskey
git branch backup/[現在のバージョン] master
```

### マージプロセス

#### 1. 開発ブランチ（muyami）への変更取り込み
```bash
# muyami worktreeで作業
cd ../yamisskey-muyami

# 上流の変更を取得
git fetch upstream --tags --prune

# マージ実行
git merge --no-ff --no-edit -S <tag-name>
```

※リカバリ方法
```bash
git add -A && git commit -m "upstream: resolve conflicts for <tag-name>"
git log --merges --oneline -n 3
git revert -m 1 <merge-commit-sha>
```

#### 2. テスト環境（nayami）への反映
```bash
# nayami worktreeで作業
cd ../yamisskey-nayami

# muyamiの変更をマージ
git merge muyami

# ビルドとテスト
pnpm build

# リモートへ反映
git push origin nayami
```

#### 3. 本番環境（master）への反映

##### 事前準備
- `DIFFERENCE.md`のUnreleased項目に変更点を明記
- [`package.json`](package.json:2)のversionプロパティをインクリメント

##### リリースPR作成
- GitHubで[Release Manager Dispatch](https://github.com/yamisskey-dev/yamisskey/actions/workflows/release-with-dispatch.yml)をnayamiブランチから手動実行
- `DIFFERENCE.md`のUnreleased項目がバージョン名に上書きされる
- 自動的にnayami→masterのプルリクエストが作成される

##### コンフリクト解決
- PRで[`package.json`](package.json:2)のバージョンコンフリクトが発生
- 🎯 "Create a new branch and commit updates" を選択
- ブランチ名: release/v2025.7.0-yami-1.9.11 （対象バージョンに合わせて調整）
- versionを正しいyami形式（例："2025.7.0-yami-1.9.11"）に編集
- コミット後、PRが自動更新される

##### 最終確認とマージ
- 自動生成されたプルリクエストをレビュー
- CIチェックの完了を確認
- プルリクエストを承認してマージ

##### 自動リリース
- マージ後、[release-on-merge.yml](http://github.com/yamisskey-dev/yamisskey/actions/workflows/release-on-merge.yml)が自動実行
- masterブランチのGitHub Releaseが自動作成
- masterブランチのDockerイメージが自動生成・公開

## トラブルシューティング

### Git Worktree関連の問題

#### worktreeの削除と再作成
```bash
# worktreeの削除
git worktree remove ../yamisskey-muyami

# 強制削除（変更がある場合）
git worktree remove --force ../yamisskey-muyami

# worktreeの再作成
git worktree add ../yamisskey-muyami muyami
```

#### worktreeのクリーンアップ
```bash
# 不要になったworktreeの情報を削除
git worktree prune

# worktreeの状態確認
git worktree list
```

### マージ失敗時の対応
```bash
# 該当worktreeで実行
# マージの中断
git merge --abort

# バックアップからの復帰
git checkout backup/[現在のバージョン]
```

## ブランチ保護と開発ルール

### masterブランチの保護設定
- **ブランチ削除の禁止**：誤った削除を防止
- 本番環境の安定性と品質を確保

### 開発ルール
- muyamiブランチでの開発は必ずトピックブランチから行う
- nayamiブランチへのマージは十分なテスト後に行う
- 開発フロー: muyami（開発）→ nayami（テスト）→ master（本番）を徹底

## CI/CDとAI活用

### GitHub Actionsの役割
- コードの品質保証（リント、型チェック）
- 自動テスト実行によるバグの早期発見
- ビルドエラーの検出
- 本番環境への安全なデプロイ

### AI活用
- **Claude Code**: devcontainerに事前設定済み、コード生成・レビュー・リファクタリングに活用
- **Pull Requestレビュー**: ClaudeとGeminiによる自動コードレビュー
- 生成されたコードは必ず人間によるレビューを実施
- セキュリティ・プライバシー関連機能では生成コードの適切性を必ず確認

## 注意事項
- 重要な変更前は必ずバックアップを作成
- プライバシー機能に関する変更は特に慎重にテスト
- パフォーマンスへの影響を必ず確認
- セキュリティ関連の修正は優先して取り込み
- 各ブランチの役割を尊重し、適切なフローで開発を進める
