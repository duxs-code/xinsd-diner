# GitHub 仓库设置指南

## 方法一：通过GitHub网站创建仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `xinsd-diner`
   - Description: `Xinsd 苍蝇饭馆 - 智能食谱生成应用，基于Next.js和SQLite构建，支持食材管理、购物车功能和AI驱动的食谱与图片生成`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

## 方法二：使用GitHub CLI (如果已安装)

```bash
# 安装GitHub CLI (如果未安装)
brew install gh

# 登录GitHub
gh auth login

# 创建仓库并推送
gh repo create xinsd-diner --public --description "Xinsd 苍蝇饭馆 - 智能食谱生成应用，基于Next.js和SQLite构建，支持食材管理、购物车功能和AI驱动的食谱与图片生成" --push --source .
```

## 手动添加远程仓库并推送

创建仓库后，运行以下命令：

```bash
# 添加远程仓库 (替换 YOUR_USERNAME 为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/xinsd-diner.git

# 推送代码到GitHub
git push -u origin main
```

## 验证推送成功

```bash
# 检查远程仓库状态
git remote -v

# 查看提交历史
git log --oneline
```

## 项目已准备就绪

✅ Git仓库已初始化  
✅ 代码已提交到本地仓库  
✅ .gitignore已配置，排除编译产物和敏感文件  
✅ 提交信息已完善，包含项目概述和技术栈信息  

现在只需要按照上述步骤创建GitHub仓库并推送代码即可！