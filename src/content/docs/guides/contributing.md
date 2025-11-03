---
title: yamisskey開発ガイド
description: Misskeyフォークyamisskeyの開発手順
---

![yamisskeyプロジェクトアイコン](https://github.com/yamisskey-dev/yamisskey-assets/blob/main/yamisskey/yamisskey_project.png?raw=true)

## 概要

[Misskey](https://github.com/misskey-dev/misskey)フォーク「[yamisskey](https://github.com/yamisskey-dev/yamisskey/)」の開発手順を説明します。基本的な開発手順は[フォーク元の開発ガイド](https://github.com/misskey-dev/misskey/blob/develop/CONTRIBUTING.md#development)を参照してください。

3ブランチによる開発フロー（muyami → nayami → master）：
- **muyami**: 開発環境（ローカル）
- **nayami**: テスト環境（[なやみすきー](https://na.yami.ski/)）
- **master**: 本番環境（[やみすきー](https://yami.ski/)）

## ブランチ構成

### muyamiブランチ（開発環境）
- ローカルでの新機能開発と実験的機能の実装
- バージョン形式: `2025.1.0-muyami-1.4.3`

### nayamiブランチ（テスト環境）
- [なやみすきー](https://na.yami.ski/)での本番前検証
- バージョン形式: `2025.1.0-nayami-1.4.3`
- push時にDockerイメージ自動ビルド

### masterブランチ（本番環境）
- [やみすきー](https://yami.ski/)の安定運用版
- バージョン形式: `2025.1.0-yami-1.4.3`
- GitHubリリース時にDockerイメージ自動ビルド

## セットアップ

### 必要環境
- Node.js
- pnpm（worktreeとの併用でディスク容量を節約）
- Git (2.15以降)
- Go (ghq/gwqのインストール用)

### ghqとgwqのインストール

```bash
# ghqのインストール
go install github.com/x-motemen/ghq@latest

# gwqのインストール
go install github.com/d-kuro/gwq/cmd/gwq@latest
```

### 推奨開発環境
- Visual Studio Code
- Docker
- devcontainer (Claude Codeが設定済み)

### リポジトリ準備

#### ghqを使ったリポジトリ管理

ghqを使用することで、複数のリポジトリを一元管理できます。

```bash
# yamisskeyリポジトリの取得
ghq get https://github.com/yamisskey-dev/yamisskey.git

# Misskey本家や他フォークの取得
ghq get https://github.com/misskey-dev/misskey.git
ghq get https://github.com/kokonect-link/cherrypick.git

# yamisskeyリポジトリに移動
cd $(ghq root)/github.com/yamisskey-dev/yamisskey

# リモート追加と更新
git remote add upstream https://github.com/misskey-dev/misskey.git
git fetch --all --prune --tags
```

### git worktree構築

#### gwqを使ったworktree管理

yamisskeyでは、git worktreeを使用して複数のブランチを同時に管理します。gwqを使うことで、worktreeの作成・管理がより簡単になります。

#### pnpmとworktreeの相性

pnpmはハードリンクで`node_modules`を共有するため、worktreeを複数作成しても容量はほぼ1つ分で済みます。npmやyarnでは各worktreeで完全に複製されるため、容量が倍増します。

これにより、複数のClaude Codeエージェントを並列実行する際も、ディスク容量を気にせずworktreeを作成できます。

```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey

# gwqでworktreeを作成
gwq create nayami
gwq create muyami
gwq list
```

#### 各worktreeでの初期設定
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.nayami
pnpm install && pnpm build && pnpm build-misskey-js-with-types

cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami
pnpm install && pnpm build && pnpm build-misskey-js-with-types
```

**Tips**: `gwq cd <ブランチ名>` でworktree間を素早く移動できます。

## 開発フロー

### 1. 新機能開発（muyamiブランチ）
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami
git pull origin muyami
git checkout -b feat/新機能名
```

### 2. 開発作業
```bash
# ...コーディング作業...
pnpm dev
pnpm build
pnpm migrate
git add .
git commit -m "feat: 機能の説明"
```

### 3. muyamiブランチへのマージ
```bash
git checkout muyami
git merge feat/新機能名
git push origin muyami
```

### 4. テスト環境への反映（nayamiブランチ）
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.nayami
git pull origin nayami
git merge muyami
# package.jsonのバージョン更新（muyami → nayami）
pnpm build
git push origin nayami
```

### 5. 本番環境への反映（masterブランチ）
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey
git pull origin master
git merge nayami
# package.jsonのバージョン更新（nayami → yami）
pnpm build
git push origin master
```

## gwqとClaude Codeを使った並列開発

複数の機能を並行開発する場合、機能ごとにworktreeを作成します。

```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami

# 機能ごとのworktreeを作成
gwq create feat/feature-a
gwq create feat/feature-b

# 各worktreeで初期化
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.feat-feature-a
pnpm install && pnpm build

cd $(ghq root)/github.com/yamisskey-dev/yamisskey.feat-feature-b
pnpm install && pnpm build

# 各worktreeでVSCodeを開く
code $(ghq root)/github.com/yamisskey-dev/yamisskey.feat-feature-a
code $(ghq root)/github.com/yamisskey-dev/yamisskey.feat-feature-b

# 開発完了後、muyamiにマージ
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami
git merge feat/feature-a
git merge feat/feature-b
git push origin muyami

# 不要なworktreeを削除
gwq remove feat/feature-a
gwq remove feat/feature-b
```

pnpmのハードリンク共有により、worktreeを増やしても容量はほぼ増えません。同一ファイルを複数worktreeで編集する場合は、マージ時のコンフリクトに注意してください。

## 他フォークから機能をcherry-pick

```bash
# 他フォークのコミットログを確認
cd $(ghq root)/github.com/kokonect-link/cherrypick
git log --oneline -20

# yamisskey muyami worktreeに移動
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami

# 他フォークをリモートに追加（初回のみ）
git remote add cherrypick $(ghq root)/github.com/kokonect-link/cherrypick
git fetch cherrypick

# 特定のコミットをcherry-pick
git cherry-pick コミットID

# コンフリクトがある場合
git add .
git cherry-pick --continue
```

## アップストリームからの変更取り込み

### 準備：バックアップ作成

```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami
git branch backup/$(date +%Y%m%d) muyami

cd $(ghq root)/github.com/yamisskey-dev/yamisskey.nayami
git branch backup/$(date +%Y%m%d) nayami

cd $(ghq root)/github.com/yamisskey-dev/yamisskey
git branch backup/$(date +%Y%m%d) master
```

### マージプロセス

#### 1. 開発ブランチ（muyami）への変更取り込み
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.muyami
git fetch upstream --tags --prune
git merge --no-ff --no-edit -S <tag-name>

# コンフリクト解決後
git add -A && git commit -m "upstream: resolve conflicts for <tag-name>"
```

#### 2. テスト環境（nayami）への反映
```bash
cd $(ghq root)/github.com/yamisskey-dev/yamisskey.nayami
git merge muyami
pnpm build
git push origin nayami
```

#### 3. 本番環境（master）への反映

1. `DIFFERENCE.md`のUnreleased項目に変更点を記載
2. `package.json`のversionをインクリメント
3. GitHubで[Release Manager Dispatch](https://github.com/yamisskey-dev/yamisskey/actions/workflows/release-with-dispatch.yml)を実行
4. 自動生成されたPRで`package.json`のバージョンを正しいyami形式に修正
5. PRをマージすると、GitHub ReleaseとDockerイメージが自動生成

## トラブルシューティング

### git worktree関連の問題

```bash
# worktreeの削除と再作成
cd $(ghq root)/github.com/yamisskey-dev/yamisskey
gwq remove muyami          # 削除
gwq remove --force muyami  # 強制削除
gwq create muyami          # 再作成
gwq list                   # 状態確認

# worktreeのクリーンアップ
git worktree prune
```

### マージ失敗時の対応
```bash
git merge --abort                            # マージ中断
git checkout backup/[現在のバージョン]      # バックアップから復帰
```

### ghq関連の問題
```bash
ghq root                                     # ルートディレクトリ確認
rm -rf $(ghq root)/github.com/yamisskey-dev/yamisskey  # リポジトリ削除
ghq get https://github.com/yamisskey-dev/yamisskey.git # 再取得
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
