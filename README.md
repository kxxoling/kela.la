# [崩坏·星穹铁道跃迁分析](https://kela.la/)

一个基于 Next.js 的崩坏·星穹铁道跃迁分析工具。

A Honkai: Star Rail Warp Analysis Tool based on Next.js.

## 工作原理

在 Windows 下从游戏的日志数据中获取跃迁 API 所需要的 `authkey` 等信息，然后通过 `authkey` 获取跃迁数据，最后通过 `authkey` 和跃迁数据计算出跃迁的各项数据。

目前仅试过国际服中文的支持，对于国服和其它语言的支持还未测试。

## How it works

Get the `authkey` and other information required by the warp API from the game log data under Windows, then get the warp data through `authkey`, and finally calculate the various data of the warp through `authkey` and warp data.

Currently, only the Chinese support of the international service has been proved, and the support for the national service and other languages has not been tested.

## 参与开发

开发流程和其它 [Next.js](https://nextjs.org/) 项目一样。

```bash
pnpm install # 安装依赖
pnpm dev # 启动开发服务器
pnpm build # 构建生产版本
```

## Development

The development process is the same as other [Next.js](https://nextjs.org/) projects.

```bash
pnpm install # Install dependencies
pnpm dev # Start development server
pnpm build # Build production version
```

## 提交 PR

欢迎提交 Pull requests，但请注意：

- 请先提交 Issue，说明你要做什么，以免重复劳动。
- 请先 Fork 本仓库，然后在你的仓库中修改，最后提交 Pull requests。
- 请保持代码风格一致，使用 [Prettier](https://prettier.io/) 格式化代码。
- 请保持提交的代码和提交的 Issue 一致，不要提交无关的代码。

## Pull requests

Pull requests are welcome, but please note:

- Please submit an Issue first to explain what you are going to do to avoid duplicate work.
- Please Fork this repository first, then modify it in your repository, and finally submit Pull requests.
- Please keep the code style consistent and use [Prettier](https://prettier.io/) to format the code.
- Please keep the submitted code consistent with the submitted Issue, and do not submit irrelevant code.
