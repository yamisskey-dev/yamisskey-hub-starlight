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
* Git

### 推奨開発環境

* Visual Studio Code
* Docker
* devcontainer

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
pnpm build
pnpm build-misskey-js-with-types
pnpm migrate
pnpm dev

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
git merge muyami

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
git merge nayami

# package.jsonのバージョン更新（nayami → yami）
# エディタでpackage.jsonを開き、バージョン名を変更

# 本番環境への反映
git push origin master
```

## 3. 他フォークから機能をcherry-pick

### 準備作業

```bash
git remote add misskey-fork-name https://github.com/misskey-fork-org-name/misskey-fork-name.git
git fetch --all
```

### チェリーピック

```bash
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
git checkout muyami
git branch backup/[現在のバージョン] muyami
git checkout nayami
git branch backup/[現在のバージョン] nayami
git checkout master
git branch backup/[現在のバージョン] master
```

### マージプロセス

#### 1. 開発ブランチ（muyami）への変更取り込み

```bash
git fetch --all
git checkout muyami
git merge upstream/master
```

#### 2. テスト環境（nayami）への反映

```bash
git checkout nayami
git merge muyami
git push origin nayami
```

#### 3. 本番環境（master）への反映

##### 事前準備

- `DIFFERENCE.md`のUnreleased項目に変更点を明記
- `package.json`のversionプロパティをインクリメント

##### リリースPR作成

- GitHubで[Release Manager [Dispatch](https://github.com/yamisskey-dev/yamisskey/actions/workflows/release-with-dispatch.yml)をnayamiブランチから手動実行
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
# masterブランチでタグ作成
git checkout master
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

### マージ失敗時の対応

```bash
# マージの中断
git merge --abort

# バックアップからの復帰
git checkout backup/[現在のバージョン]
```

### よくある問題と解決方法

* ビルドエラー → `pnpm cleanall` → `pnpm install` の再実行
* マイグレーションエラー → データベースのバックアップ確認
* コンフリクト → 優先順位に従って解決
* ブランチの混乱 → 各ブランチの役割を明確に意識

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

## 9. 注意事項
* 重要な変更前は必ずバックアップを作成
* プライバシー機能に関する変更は特に慎重にテスト
* パフォーマンスへの影響を必ず確認
* セキュリティ関連の修正は優先して取り込み
* 各ブランチの役割を尊重し、適切なフローで開発を進める
* muyami（開発）→ nayami（テスト）→ master（本番）の流れを徹底