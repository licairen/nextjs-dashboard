
## Prisma 数据库操作指南
### 目录
1. 已有数据库的操作流程
2. 新建数据库表的操作流程
3. 常见问题与解决方案


#### 前提:配置数据库连接
```bash
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"
```

#### 1. 已有数据库的操作流程
#### 1.1 初始化 Prisma
```bash
npx prisma init
```
这将会生成：
* `prisma` 文件夹
* `.env` 文件（用于配置数据库连接）
* `schema.prisma` 文件（数据库模型定义）

#### 1.2 拉取现有数据库结构
* 这会将现有数据库的表结构同步到 schema.prisma 文件中
```bash
npx prisma db pull
```

* 在执行prisma db pull后，需要执行以下关键步骤

#### 1.3 生成 Prisma Client
```bash
npx prisma generate
```

#### 1.4 安装 Prisma Client
```bash
pnpm add @prisma/client
```

#### 1.5 创建 Prisma 实例（单例模式）
* 创建文件 `lib/prisma.ts`：
```javascript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### 1.6 在其他文件中使用 Prisma Client
* 在需要使用 Prisma 的文件中，导入 `prisma` 实例：
```javascript
import { prisma } from '@/lib/prisma'

async function getCustomers() {
  try {
    const customers = await prisma.customers.findMany()
    return customers
  } catch (error) {
    console.error('获取客户数据失败:', error)
    throw error
  }
}
```

#### 2. 新建数据库表的操作流程 

#### 2.1 在 schema.prisma 中定义新表
```javascript
model Test {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 2.2 创建数据库迁移
```javascript
npx prisma migrate dev --name init_test_table
```
这个命令会：
* 创建一个新的迁移文件
* 执行迁移到数据库
* 重新生成 Prisma Client

#### 2.3 使用新建表的示例
```bash
import { prisma } from '@/lib/prisma'

// 创建记录
async function createTest() {
  try {
    const newTest = await prisma.test.create({
      data: {
        name: "测试名称",
        email: "test@example.com"
      }
    })
    return newTest
  } catch (error) {
    console.error('创建测试数据失败:', error)
    throw error
  }
}

// 查询记录
async function getTests() {
  try {
    const tests = await prisma.test.findMany()
    return tests
  } catch (error) {
    console.error('获取测试数据失败:', error)
    throw error
  }
}
```


#### 常见问题与解决方案
####1. 数据库连接错误
* 检查 .env 文件中的连接字符串是否正确
* 确保数据库服务器正在运行
* 验证用户名和密码是否正确

#### 2. 模型同步问题
* 如果数据库结构发生变化：
```bash
# 重新拉取数据库结构
npx prisma db pull

# 重新生成 Prisma Client
npx prisma generate
```
#### 3. 开发工具
* 使用 Prisma Studio 可视化数据库
```bash
npx prisma studio
```

#### 4. 类型提示
* 确保在 `tsconfig.json` 中包含 Prisma 的类型定义：
```javascript
{
  "compilerOptions": {
    "types": ["@prisma/client"]
  }
}
```

####  注意事项
* 在生产环境部署前，请使用 `prisma migrate deploy` 命令
* 定期备份数据库
* 在开发环境中使用 `prisma migrate reset` 要谨慎，它会清除所有数据

[避坑指南](https://www.cnblogs.com/zcookies/p/17517270.html)