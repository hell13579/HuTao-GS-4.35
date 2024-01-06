# HuTao-GS

![pc-fork](./pc-fork.jpg)
<!-- Source: https://raw.githubusercontent.com/crowity/HuTao-GS/master/pc-forkk.jpg -->

简中 | [EN](README_EN.md) 

## 使用指南

**注意:** 如需帮助请加入官方 [Discord](https://discord.gg/4tZ96QMvHq)

## HuTao-GS 当前功能

* 登录
* 自动给予所有角色及物品
* 战斗
* 生成怪物

## 前期准备 ##

* [Node-Js](https://nodejs.org/en/)
* [Openssl](https://slproweb.com/products/Win32OpenSSL.html)
* [HuTao-GD](https://github.com/NotArandomGUY/HuTao-GD) (转换Hutao Res的工具，如果你有别人编译好的，那么你可以不下)
* HuTao-GS-Protos 下载4.25(3.8.5-4.3.5的proto通用)的proto https://www.123pan.com/s/xmC8Vv-Gcr3A.html 
* 相应版本的Resources文件或者已经编译过的

## 步骤概述 ##
* 1.安装所需软件
* 2.下载所需文件至本地
* 3.构建服务端，建议构建DEV
* 4.先运行服务端生成文件
* 5.使用Hutao-GD编译HuTao-GS专用的Resources 或者直接下载编译过的文件放入HuTao-GS/data/3.8.50里
* 6.将Proto放入HuTao-GS/data/proto/3.8.5 proto下载地址:https://www.123pan.com/s/xmC8Vv-Ber3A.html
* 7.从下载key解压到data/key里 https://www.123pan.com/s/xmC8Vv-Dcr3A.html
* 8.运行服务端 (Dev使用START-DEV.bat启动)
* 9.从SSL安装自动生成的证书
* 10.设置代理（GC代理不适用于HuTao-GS）(两种代理凭自己爱好选，DNS不行就用Fiddler)
* 11.开始游玩 祝您玩的愉快

**详细步骤请下载HuTao-GS 并打开 HuTao-GS/Docs/zh-cn/index.html 进行阅读参考！**

## 快速问题排除 ##

* 如果编译服务端失败--请检查构建所需依赖安装是否成功，可尝试重新安装
* 运行服务端后证书没有自动生成--请确认 OpenSSL 的 bin 文件夹处于环境变量 `PATH` 中
* 客户端无法登录、连接、错误 4206 等其他问题--可能是代理设置出现了问题
