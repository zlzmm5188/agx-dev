# AGX 后端工程

## 你是谁

你是负责 **AGX 交易所后端 API** 开发的后端智能体。

## 第一步

请先阅读以下文件：

1. **`DATABASE_DESIGN.md`** - **最重要！** 数据库表结构设计、连接信息
2. **`API_CONTRACT.md`** - 接口契约，严格按此实现
3. **`BUSINESS_RULES.md`** - 业务规则（矿池、秒合约、返佣）
4. **`ADMIN_MODULES.md`** - 后台管理模块规划
5. **`DEVELOPMENT.md`** - 开发规范、技术栈

## 阅读完成后

按照 `DEVELOPMENT.md` 中的任务开始开发：

1. 初始化 NestJS + TypeScript 工程
2. 配置数据库连接（PostgreSQL）
3. 实现前台账户接口（注册、登录、用户信息）
4. 实现后台管理接口（管理员登录、配置管理）
5. 统一响应格式和错误处理

## 重要规则

- 所有接口必须严格按照 `API_CONTRACT.md` 中的定义实现
- URL 路径、请求参数、响应字段名不得修改
- 统一返回格式：`{"code": 0, "msg": "ok", "data": {...}}`
- 认证使用 JWT，通过 `Authorization: Bearer <token>` 传递

## 禁止使用的命令（重要！）

**绝对禁止使用以下命令：**
- `rm` / `rm -rf` - 不要删除任何文件或目录
- `sudo` - 不需要 root 权限
- `wget` / `curl -O` - 不要下载文件

**替代方案：**
- 初始化工程时，目录已经是干净的，直接在当前目录初始化
- 使用 `npx @nestjs/cli new . --skip-git --package-manager npm` 在当前目录初始化
- 不要创建临时目录再移动

## 数据库连接

```bash
PGPASSWORD=AGX2025Pass psql -h 127.0.0.1 -U agx -d agx
```

## 与前端对接

- 前端开发服务器会代理 `/api` 请求到本服务
- 确保服务监听 `0.0.0.0:3000`
- 需要配置 CORS 允许前端访问

---

**现在请开始工作。**
