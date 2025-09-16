---
title: yamisskey開発ガイド
description: Misskeyフォークyamisskeyにおけるブランチ管理からリリースまでの包括的な開発者ガイド
---

![yamisskeyプロジェクトアイコン](https://github.com/yamisskey-dev/yamisskey-assets/blob/main/yamisskey/yamisskey_project.png?raw=true)

## 概要

このガイドでは、[Misskey](https://github.com/misskey-dev/misskey)フォーク「[yamisskey](https://github.com/yamisskey-dev/yamisskey/)」の開発手順について説明します。基本的な開発手順は[フォーク元の開発ガイド](https://github.com/misskey-dev/misskey/blob/develop/CONTRIBUTING.md#development)を参照してください。

本番環境（[master](https://github.com/yamisskey-dev/yamisskey/tree/master)）、テスト環境（[nayami](https://github.com/yamisskey-dev/yamisskey/tree/nayami)）、開発環境（[muyami](https://github.com/yamisskey-dev/yamisskey/tree/muyami)）の3つのブランチを使用した開発フローと、アップストリーム（[Misskey本体](https://github.com/misskey-dev/misskey/tree/master)）からの変更取り込み手順を解説します。

## ブランチ構成と役割

### masterブランチ（本番環境）

* [やみすきー](https://yami.ski/)の安定運用版として位置づけ
* バージョン名には「yami」（やみ、闇）を使用（例: 2025.1.0-yami-1.4.3）
* DockerイメージはGitHub Actionsでビルド、バージョン名タグ[Dockerイメージ](https://hub.docker.com/r/yamisskey/yamisskey/tags)をpull
* Misskeyの新機能は、やみすきーのコンセプト（プライバシー重視、心理的安全重視）に合致するものだけを選択的に取り入れる
* 本番環境での安定した運用を重視

### nayamiブランチ（テスト環境）

* [なやみすきー](https://na.yami.ski/)はテスト版として位置づけ
* 開発完了した機能の検証用
* DockerイメージはGitHub Actionsでビルド、nayamiタグ[Dockerイメージ](https://hub.docker.com/r/yamisskey/yamisskey/tags)をpull
* バージョン名には「nayami」（なやみ、悩み）を使用（例: 2025.1.0-nayami-1.4.3）
* 本番環境への反映前の最終検証を行う場所
* ユーザーフィードバックの収集も行う

### muyamiブランチ（開発環境）

* 開発専用環境として位置づけ
* サーバー常駐なしで開発者のローカル環境で動作
* `git pull`で反映を取り込んで、Dockerイメージを毎回ローカルビルド
* バージョン名には「muyami」（むやみ、無暗）を使用（例: 2025.1.0-muyami-1.4.3）
* 新機能開発や実験的な機能の実装に使用
* 自由な開発とイノベーションを促進

## 1. 開発環境のセットアップ

### 必要な環境

* Node.js
* pnpm
* Git (2.15以降、git worktree対応)

### 推奨開発環境

* Visual Studio Code
* Docker
* devcontainer (Claude Codeが設定済み)

### リポジトリの準備

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

### Git Worktreeによる環境構築

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

## 2. 新しい開発フロー

### Git Worktreeを使った開発の利点

* **高速な環境切り替え**: ブランチ切り替えによる再ビルドが不要
* **並行開発**: 複数環境を同時に起動して動作確認可能
* **独立した依存関係**: 各環境のnode_modulesが独立
* **ビルド済みアセット保持**: 各環境のビルド結果が保持される
* **生成AIツールとの親和性**: Claude CodeやCursorで複数ブランチの並列作業が容易

### 開発作業の基本フロー

#### 1. 新機能開発（muyamiブランチ）

```bash
# muyami worktreeに移動
cd ../yamisskey-muyami

# 最新の変更を取得
git pull origin muyami

# 機能ごとのトピックブランチを作成
git checkout -b feat/新機能名
```

#### 2. 開発作業

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

#### 3. muyamiブランチへのマージ

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

#### 4. テスト環境への反映（nayamiブランチ）

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

#### 5. 本番環境への反映（masterブランチ）

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

## 3. 他フォークから機能をcherry-pick

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

## 4. アップストリームからの変更取り込み

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
- `package.json`のversionプロパティをインクリメント

##### リリースPR作成

- GitHubで[Release Manager Dispatch](https://github.com/yamisskey-dev/yamisskey/actions/workflows/release-with-dispatch.yml)をnayamiブランチから手動実行
- `DIFFERENCE.md`のUnreleased項目がバージョン名に上書きされる
- 自動的にnayami→masterのプルリクエストが作成される

##### コンフリクト解決

- PRで`package.json`のバージョンコンフリクトが発生
- 🎯 "Create a new branch and commit updates" を選択
- ブランチ名: release/v2025.7.0-yami-1.9.11 （対象バージョンに合わせて調整）
- versionを正しいyami形式（例："2025.7.0-yami-1.9.11"）に編集
- コミット後、PRが自動更新される

🔧 コンフリクト解決の詳細手順
> 1. PR画面で "Resolve conflicts" をクリック
> 2. package.json を編集:
>   "version": "2025.7.0-yami-1.9.11"
> 3. ⭐ "Create a new branch and commit updates" を選択
> 4. ブランチ名: release/v2025.7.0-yami-1.9.11
> 5. "Commit changes" をクリック
> 6. PRが自動更新され、コンフリクト解決完了

##### 最終確認とマージ

- 自動生成されたプルリクエストをレビュー
- CIチェックの完了を確認
- プルリクエストを承認してマージ

##### 自動リリース

- マージ後、[release-on-merge.yml](http://github.com/yamisskey-dev/yamisskey/actions/workflows/release-on-merge.yml)が自動実行
- masterブランチのGitHub Releaseが自動作成
- masterブランチのDockerイメージが自動生成・公開

## 5. リリース管理

### リリースタグの作成

```bash
# メインリポジトリ（master）で作業
cd ../yamisskey

# タグ作成
git tag -a '[新バージョン]' -m "Release [新バージョン]"
git push origin --tags
```

### 各環境のバージョン管理

* master: 2025.1.0-yami-x.x.x
* nayami: 2025.1.0-nayami-x.x.x
* muyami: 2025.1.0-muyami-x.x.x

### Dockerイメージの自動ビルド

- masterブランチはGitHubでリリース後ビルド
- nayamiブランチはpushするたびに自動ビルド
- muyamiブランチは開発用なので自動ビルドなし

## 6. トラブルシューティング

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

### よくある問題と解決方法

* **worktree間でのnode_modules共有エラー**
  * 各worktreeで独立して `pnpm install` を実行
  * `.gitignore` にnode_modulesが含まれていることを確認

* **worktreeでのビルドエラー**
  * 該当worktreeで `pnpm cleanall` → `pnpm install` の再実行
  * ビルドキャッシュのクリア: `rm -rf built/`

* **マイグレーションエラー** → データベースのバックアップ確認
* **コンフリクト** → 優先順位に従って解決
* **ブランチの混乱** → `git worktree list` で現在地を確認

## 7. ブランチ保護ルール

### masterブランチの保護設定
masterブランチには以下の保護ルールを設定しています：

* **ブランチ削除の禁止**：誤った削除を防止します

これらの設定により、本番環境の安定性と品質を確保します。

### nayamiとmuyamiブランチ
開発とテストを柔軟に行うため、nayamiとmuyamiブランチには厳格な保護ルールを設けていません。ただし、以下の運用ルールを守ってください：

* muyamiブランチでの開発は必ずトピックブランチから行う
* nayamiブランチへのマージは十分なテスト後に行う
* 他の開発者の作業を尊重し、必要に応じて事前に連絡する

## 8. 継続的インテグレーション

### GitHub Actionsの役割
やみすきーでは品質管理のためにGitHub Actionsを活用して継続的インテグレーション（CI）を実施しています。これにより以下のメリットがあります：

* コードの品質保証（リント、型チェック）
* 自動テスト実行によるバグの早期発見
* ビルドエラーの検出
* 本番環境への安全なデプロイ

### ブランチでのCI活用方法
* **muyamiブランチ（開発環境）** - 開発中の変更が基本的な品質基準を満たすか確認
* **nayamiブランチ（テスト環境）** - 統合テストとユーザー機能テスト
* **masterブランチ（本番環境）** - リリース前の最終検証

### プルリクエスト時のCI
プルリクエストを作成すると自動的にCIテストが実行されます。以下に注意してください：
* テストが失敗した場合は、エラーを修正してから再度プッシュしてください
* すべてのテストが通過するまでmasterブランチへのマージは行わないでください

## 9. 生成AI利用ガイドライン

### 基本方針
参入推進と開発効率と品質向上のため、生成AIツールの活用を許可します。

### 利用可能なAIツール

#### 開発環境での利用
* **Claude Code**: devcontainerに事前設定済み、コード生成・レビュー・リファクタリングに活用
* **Cursor**: AI支援機能付きコードエディタとして利用可能

#### CIでのAI活用
* **Pull Requestレビュー**: ClaudeとGeminiによる自動コードレビュー
* **品質チェック**: セキュリティ脆弱性やコード品質の自動検出
* **改善提案**: AIによる最適化提案の自動生成

### AIを利用した開発手法

#### Git Worktreeとの連携メリット
* **並列タスク実行**: Claude Codeで複数のworktreeに対して同時に異なるタスクを実行
* **独立した検証環境**: 各worktreeでAI生成コードを独立してテスト可能
* **高速な切り替え**: AIツールのコンテキストを切り替えずに複数環境で作業継続
* **マージ前確認**: 異なるディレクトリでAIによる変更の影響を事前確認

### 利用上のガイドライン

#### 推奨される使用方法
* コードの自動生成とボイラープレート削減
* 複雑なアルゴリズムの実装支援
* テストコードの生成
* ドキュメント作成支援
* リファクタリング提案の活用
* バグ修正の支援

#### 注意事項
* 生成されたコードは必ず人間によるレビューを実施
* セキュリティに関わる部分は特に慎重に検証
* プライバシー関連機能では生成コードの適切性を必ず確認
* ライセンスに配慮し、著作権侵害のリスクを回避
* 機密情報をAIツールに入力しない

#### コミットメッセージとPR
* AI生成のコードを含む場合、その旨を明記することを推奨
* 重要な変更はAIの提案内容も含めてPRの説明に記載

### AIレビューの活用
プルリクエスト時の自動AIレビューは以下の観点でチェックされます：
* コードの品質と可読性
* 潜在的なバグやエッジケース
* パフォーマンスの改善点
* セキュリティ上の懸念事項

AIレビューの指摘事項は参考として扱い、最終的な判断は人間が行ってください。

## 10. 注意事項
* 重要な変更前は必ずバックアップを作成
* プライバシー機能に関する変更は特に慎重にテスト
* パフォーマンスへの影響を必ず確認
* セキュリティ関連の修正は優先して取り込み
* 各ブランチの役割を尊重し、適切なフローで開発を進める
* muyami（開発）→ nayami（テスト）→ master（本番）の流れを徹底
