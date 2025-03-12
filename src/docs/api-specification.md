# 水质监测SaaS系统API规范

## 简介

本文档定义了水质监测SaaS系统的完整API规范，作为前端和后端开发团队的共同参考标准。遵循这些API规范可确保系统各组件之间的一致性和互操作性。

### 文档目的

- 为前端开发提供明确的数据获取和操作指南
- 为后端开发提供实现目标
- 确保系统设计满足所有业务需求
- 作为API测试和验证的基准
- 维护系统功能的一致性文档

### 系统概述

本系统是一个综合性水质监测SaaS平台，支持多租户架构，可实时监测、分析和报告水质数据。系统集成了传统水质监测与人工智能分析，支持第三方登录、多语言大模型交互、机器学习预测等高级功能。

## API基础信息

### 基础URL

所有API请求都应使用以下基础URL：

```
本地开发: http://localhost:3000/v1/
开发环境: https://dev-api.hydrogem.tech/v1/
测试环境: https://staging-api.hydrogem.tech/v1/
生产环境: https://api.hydrogem.tech/v1/
```

本地开发时，可使用Vite的代理功能简化跨域问题：
```
VITE_API_BASE_URL=/v1
```

然后在vite.config.ts中添加代理配置。

### 认证方式

系统使用JWT（JSON Web Token）进行认证：

```
Authorization: Bearer <token>
```

所有非公开API端点都需要在请求头中包含有效的访问令牌。令牌通常在用户登录后获取，有效期为1小时，可使用刷新令牌进行更新。

### 租户上下文

在多租户环境中，API请求需要指定租户上下文：

```
X-Tenant-ID: <tenant_id>
```

未指定租户ID的请求将使用用户的默认租户。

### 内容类型

- 请求: `Content-Type: application/json`
- 响应: `Content-Type: application/json`

对于文件上传，使用`multipart/form-data`。

### 标准响应格式

所有API响应都遵循统一的JSON格式：

```json
{
  "data": {
    // 响应数据
  },
  "meta": {
    // 元数据，如分页信息
    "page": 1,
    "limit": 20,
    "totalItems": 243,
    "totalPages": 13
  }
}
```

### 错误响应格式

错误响应的结构如下：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误信息",
    "details": {
      // 可选的详细错误信息
    }
  }
}
```

### HTTP状态码

API使用标准HTTP状态码表示请求结果：

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `204 No Content`: 请求成功但无返回内容
- `400 Bad Request`: 请求参数错误或不完整
- `401 Unauthorized`: 未认证或认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `409 Conflict`: 请求冲突（如资源已存在）
- `422 Unprocessable Entity`: 验证错误
- `429 Too Many Requests`: 请求频率超限
- `500 Internal Server Error`: 服务器内部错误
- `503 Service Unavailable`: 服务不可用

### 版本控制

API版本在URL路径中指定，如`/v1/measurements`。当前版本为`v1`。

## 核心API端点

### 1. 用户认证与管理

#### 1.1 用户注册

```
POST /auth/register
```

创建新用户账号。

**请求体**:

```json
{
  "username": "user123",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phone": "13800138000",
  "email": "user@example.com",
  "name": "张三"
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "u123456",
    "username": "user123",
    "name": "张三",
    "phone": "13800138000",
    "email": "user@example.com",
    "createdAt": "2023-05-10T08:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `409 Conflict`: 用户名/手机号/邮箱已存在

#### 1.2 账号登录

```
POST /auth/login
```

使用用户名/手机号/邮箱和密码登录。

**请求体**:

```json
{
  "username": "user123", // 或使用"phone"/"email"字段
  "password": "securePassword123",
  "remember": true
}
```

**响应** (200 OK):

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "expiresIn": 3600,
    "user": {
      "id": "u123456",
      "name": "张三",
      "username": "user123",
      "phone": "13800138000",
      "email": "user@example.com",
      "avatar": "https://example.com/avatars/default.png",
      "roles": ["user"],
      "tenants": [
        {
          "id": "t789",
          "name": "ABC水务公司",
          "role": "admin"
        }
      ],
      "currentTenant": {
        "id": "t789",
        "name": "ABC水务公司"
      }
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数缺失
- `401 Unauthorized`: 凭据无效
- `403 Forbidden`: 账号已禁用

#### 1.3 微信登录

```
POST /auth/login/wechat
```

使用微信授权码登录。

**请求体**:

```json
{
  "code": "AUTHORIZATION_CODE_FROM_WECHAT",
  "state": "ANTI_CSRF_STATE_TOKEN",
  "appType": "web" // 或 "miniprogram"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "expiresIn": 3600,
    "isNewUser": false,
    "user": {
      "id": "u123456",
      "name": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "13800138000",
      "roles": ["user"],
      "tenants": [
        {
          "id": "t789",
          "name": "ABC水务公司",
          "role": "admin"
        }
      ],
      "currentTenant": {
        "id": "t789",
        "name": "ABC水务公司"
      }
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 无效的授权码
- `401 Unauthorized`: 授权失败
- `403 Forbidden`: 账号已禁用

#### 1.4 QQ登录

```
POST /auth/login/qq
```

使用QQ授权码登录。

**请求体**:

```json
{
  "code": "AUTHORIZATION_CODE_FROM_QQ",
  "state": "ANTI_CSRF_STATE_TOKEN",
  "redirectUri": "https://example.com/auth/callback"
}
```

**响应**:
与微信登录响应格式相同。

#### 1.5 支付宝登录

```
POST /auth/login/alipay
```

使用支付宝授权码登录。

**请求体**:

```json
{
  "code": "AUTHORIZATION_CODE_FROM_ALIPAY",
  "state": "ANTI_CSRF_STATE_TOKEN"
}
```

**响应**:
与微信登录响应格式相同。

#### 1.6 刷新令牌

```
POST /auth/refresh
```

使用刷新令牌获取新的访问令牌。

**请求体**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

**响应** (200 OK):

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "expiresIn": 3600
  }
}
```

**错误情况**:
- `400 Bad Request`: 刷新令牌缺失
- `401 Unauthorized`: 刷新令牌无效或已过期

#### 1.7 注销登录

```
POST /auth/logout
```

注销当前用户会话。

**请求头**:

```
Authorization: Bearer <accessToken>
```

**响应** (204 No Content)

#### 1.8 获取当前用户信息

```
GET /auth/me
```

获取当前已登录用户的详细信息。

**请求头**:

```
Authorization: Bearer <accessToken>
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "u123456",
    "username": "user123",
    "name": "张三",
    "phone": "13800138000",
    "email": "user@example.com",
    "avatar": "https://example.com/avatars/default.png",
    "roles": ["user"],
    "tenants": [
      {
        "id": "t789",
        "name": "ABC水务公司",
        "role": "admin"
      }
    ],
    "currentTenant": {
      "id": "t789",
      "name": "ABC水务公司"
    },
    "preferences": {
      "language": "zh-CN",
      "theme": "light",
      "timezone": "Asia/Shanghai",
      "notifications": {
        "email": true,
        "sms": true,
        "push": true
      }
    },
    "lastLogin": "2023-05-15T14:30:00Z"
  }
}
```

#### 1.9 更新用户信息

```
PUT /auth/me
```

更新当前用户的个人信息。

**请求体**:

```json
{
  "name": "李四",
  "email": "new-email@example.com",
  "avatar": "https://example.com/avatars/custom.png",
  "preferences": {
    "language": "en-US",
    "theme": "dark",
    "notifications": {
      "email": false,
      "sms": true,
      "push": true
    }
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "u123456",
    "name": "李四",
    "email": "new-email@example.com",
    "avatar": "https://example.com/avatars/custom.png",
    "preferences": {
      "language": "en-US",
      "theme": "dark",
      "timezone": "Asia/Shanghai",
      "notifications": {
        "email": false,
        "sms": true,
        "push": true
      }
    },
    "updatedAt": "2023-05-16T09:45:00Z"
  }
}
```

#### 1.10 修改密码

```
PUT /auth/password
```

修改当前用户的密码。

**请求体**:

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 密码不符合安全要求
- `401 Unauthorized`: 当前密码错误

#### 1.11 请求密码重置

```
POST /auth/password/reset
```

请求重置密码链接/验证码。

**请求体**:

```json
{
  "phone": "13800138000" // 或使用"email"字段
}
```

**响应** (200 OK):

```json
{
  "data": {
    "message": "重置密码链接已发送至您的手机/邮箱",
    "expiration": 1800 // 链接/验证码有效期(秒)
  }
}
```

#### 1.12 重置密码

```
POST /auth/password/reset/confirm
```

使用验证码/令牌重置密码。

**请求体**:

```json
{
  "token": "VERIFICATION_TOKEN", // 或使用"code"字段
  "newPassword": "newSecurePassword789",
  "confirmPassword": "newSecurePassword789"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "message": "密码已成功重置",
    "canLogin": true
  }
}
```

#### 1.13 绑定第三方账号

```
POST /auth/bind/{provider}
```

将第三方账号绑定到当前用户账号。

**路径参数**:
- `provider`: 第三方平台名称 (wechat, qq, alipay, etc.)

**请求体**:

```json
{
  "code": "AUTHORIZATION_CODE_FROM_PROVIDER",
  "state": "ANTI_CSRF_STATE_TOKEN"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "provider": "wechat",
    "providerUserId": "openid12345",
    "nickname": "微信昵称",
    "bindTime": "2023-05-17T10:20:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 无效的授权码
- `409 Conflict`: 该第三方账号已被其他用户绑定

#### 1.14 解绑第三方账号

```
DELETE /auth/bind/{provider}
```

解除与指定第三方平台的账号绑定。

**路径参数**:
- `provider`: 第三方平台名称 (wechat, qq, alipay, etc.)

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 未绑定该平台账号
- `403 Forbidden`: 无法解绑(可能是唯一登录方式)

### 2. 租户管理

#### 2.1 获取租户列表

```
GET /tenants
```

获取当前用户可访问的所有租户。

**请求参数**:
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `status` (查询参数, 可选): 租户状态，如"active"、"inactive"

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "t789",
      "name": "ABC水务公司",
      "code": "abc-water",
      "status": "active",
      "role": "admin",
      "createdAt": "2023-01-10T08:00:00Z",
      "expiresAt": "2024-01-10T08:00:00Z",
      "plan": "professional",
      "logoUrl": "https://example.com/logos/abc.png",
      "userCount": 15
    },
    {
      "id": "t790",
      "name": "XYZ环保集团",
      "code": "xyz-env",
      "status": "active",
      "role": "user",
      "createdAt": "2023-02-15T10:30:00Z",
      "expiresAt": null,
      "plan": "enterprise",
      "logoUrl": "https://example.com/logos/xyz.png",
      "userCount": 48
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

#### 2.2 创建租户

```
POST /tenants
```

创建新的租户。需要系统管理员权限或特定权限。

**请求体**:

```json
{
  "name": "新建租户公司",
  "code": "new-tenant",
  "description": "这是一个新建的租户",
  "plan": "professional",
  "adminEmail": "admin@example.com",
  "adminPhone": "13900139000",
  "adminName": "管理员",
  "expiresAt": "2024-06-01T00:00:00Z",
  "maxUsers": 20,
  "features": {
    "waterQualityPredict": true,
    "alertSystem": true,
    "apiAccess": false
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "t791",
    "name": "新建租户公司",
    "code": "new-tenant",
    "description": "这是一个新建的租户",
    "status": "active",
    "createdAt": "2023-05-20T14:25:00Z",
    "expiresAt": "2024-06-01T00:00:00Z",
    "plan": "professional",
    "maxUsers": 20,
    "features": {
      "waterQualityPredict": true,
      "alertSystem": true,
      "apiAccess": false
    },
    "admin": {
      "id": "u456",
      "name": "管理员",
      "email": "admin@example.com",
      "phone": "13900139000"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建租户
- `409 Conflict`: 租户代码已存在

#### 2.3 获取租户详情

```
GET /tenants/{id}
```

获取指定租户的详细信息。

**路径参数**:
- `id`: 租户ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "t789",
    "name": "ABC水务公司",
    "code": "abc-water",
    "description": "专注于水质监测和管理的企业",
    "status": "active",
    "createdAt": "2023-01-10T08:00:00Z",
    "expiresAt": "2024-01-10T08:00:00Z",
    "plan": "professional",
    "logoUrl": "https://example.com/logos/abc.png",
    "userCount": 15,
    "maxUsers": 20,
    "features": {
      "waterQualityPredict": true,
      "alertSystem": true,
      "apiAccess": true,
      "advancedReports": false
    },
    "contact": {
      "name": "联系人",
      "phone": "13800138001",
      "email": "contact@abc-water.com",
      "address": "广东省深圳市南山区科技园"
    },
    "billing": {
      "plan": "professional",
      "nextBillingDate": "2023-06-10T00:00:00Z",
      "paymentMethod": "alipay"
    }
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权访问该租户
- `404 Not Found`: 租户不存在

#### 2.4 更新租户信息

```
PUT /tenants/{id}
```

更新指定租户的信息。需要租户管理员权限。

**路径参数**:
- `id`: 租户ID

**请求体**:

```json
{
  "name": "ABC水务科技公司",
  "description": "更新后的公司描述",
  "contact": {
    "name": "新联系人",
    "phone": "13800138002",
    "email": "new-contact@abc-water.com",
    "address": "广东省深圳市南山区科技园B区"
  },
  "logoUrl": "https://example.com/logos/abc-new.png"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "t789",
    "name": "ABC水务科技公司",
    "description": "更新后的公司描述",
    "updatedAt": "2023-05-20T16:00:00Z",
    "contact": {
      "name": "新联系人",
      "phone": "13800138002",
      "email": "new-contact@abc-water.com",
      "address": "广东省深圳市南山区科技园B区"
    },
    "logoUrl": "https://example.com/logos/abc-new.png"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新租户
- `404 Not Found`: 租户不存在

#### 2.5 删除租户

```
DELETE /tenants/{id}
```

删除指定租户。需要系统管理员权限。

**路径参数**:
- `id`: 租户ID

**请求体**:

```json
{
  "confirm": true,
  "reason": "租户合同终止"
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 确认字段缺失或为false
- `403 Forbidden`: 无权删除租户
- `404 Not Found`: 租户不存在

#### 2.6 获取租户用户列表

```
GET /tenants/{id}/users
```

获取指定租户下的所有用户。

**路径参数**:
- `id`: 租户ID

**请求参数**:
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `role` (查询参数, 可选): 按角色筛选
- `status` (查询参数, 可选): 用户状态，如"active"、"inactive"
- `search` (查询参数, 可选): 搜索用户名、邮箱或电话

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "u123",
      "name": "张三",
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "phone": "13800138000",
      "avatar": "https://example.com/avatars/u123.jpg",
      "role": "admin",
      "status": "active",
      "lastLogin": "2023-05-19T08:30:00Z"
    },
    {
      "id": "u124",
      "name": "李四",
      "username": "lisi",
      "email": "lisi@example.com",
      "phone": "13800138001",
      "avatar": "https://example.com/avatars/u124.jpg",
      "role": "user",
      "status": "active",
      "lastLogin": "2023-05-18T14:15:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 15,
    "totalPages": 1
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权访问租户用户列表
- `404 Not Found`: 租户不存在

#### 2.7 添加用户到租户

```
POST /tenants/{id}/users
```

将用户添加到指定租户。可以添加现有用户或创建新用户。

**路径参数**:
- `id`: 租户ID

**请求体**:

```json
{
  "userId": "u125", // 可选，添加现有用户
  "email": "wangwu@example.com", // 可选，创建新用户
  "phone": "13800138002", // 可选，创建新用户
  "name": "王五", // 可选，创建新用户
  "role": "user", // 必选，用户在租户中的角色
  "sendInvitation": true // 可选，是否发送邀请
}
```

**响应** (201 Created):

```json
{
  "data": {
    "userId": "u125",
    "name": "王五",
    "email": "wangwu@example.com",
    "phone": "13800138002",
    "role": "user",
    "status": "invited",
    "invitationSent": true,
    "invitationExpires": "2023-05-27T16:00:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权添加用户
- `404 Not Found`: 租户不存在
- `409 Conflict`: 用户已在租户中
- `422 Unprocessable Entity`: 用户配额已满

#### 2.8 从租户移除用户

```
DELETE /tenants/{id}/users/{userId}
```

从指定租户中移除用户。

**路径参数**:
- `id`: 租户ID
- `userId`: 用户ID

**响应** (204 No Content)

**错误情况**:
- `403 Forbidden`: 无权移除用户
- `404 Not Found`: 租户或用户不存在
- `409 Conflict`: 无法移除租户的最后一个管理员

#### 2.9 更新租户中用户的角色

```
PUT /tenants/{id}/users/{userId}
```

更新用户在租户中的角色。

**路径参数**:
- `id`: 租户ID
- `userId`: 用户ID

**请求体**:

```json
{
  "role": "admin"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "userId": "u124",
    "name": "李四",
    "role": "admin",
    "updatedAt": "2023-05-20T16:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新用户角色
- `404 Not Found`: 租户或用户不存在

#### 2.10 切换当前租户

```
POST /tenants/switch/{id}
```

切换当前用户的活动租户。

**路径参数**:
- `id`: 目标租户ID

**响应** (200 OK):

```json
{
  "data": {
    "currentTenant": {
      "id": "t790",
      "name": "XYZ环保集团",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5..." // 包含新租户上下文的令牌
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权访问目标租户
- `404 Not Found`: 租户不存在

### 3. 探头管理

#### 3.1 获取探头列表

```
GET /probes
```

获取当前租户下的探头列表。

**请求参数**:
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `status` (查询参数, 可选): 按状态筛选，如"active"、"inactive"、"maintenance"
- `siteId` (查询参数, 可选): 按站点ID筛选
- `areaId` (查询参数, 可选): 按区域ID筛选
- `type` (查询参数, 可选): 按探头类型筛选
- `search` (查询参数, 可选): 搜索探头名称或ID

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "p001",
      "name": "南湖-1号探头",
      "serialNumber": "SN20230001",
      "type": "multi-parameter",
      "model": "WQ-500",
      "manufacturer": "水质科技",
      "status": "active",
      "batteryLevel": 85,
      "signalStrength": 4,
      "lastDataTime": "2023-05-20T08:30:00Z",
      "position": {
        "latitude": 30.123456,
        "longitude": 120.123456,
        "depth": 2.5
      },
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      },
      "supportedMetrics": [
        "ph", "temperature", "dissolvedOxygen", "turbidity", "conductivity"
      ],
      "installationDate": "2023-01-15T00:00:00Z",
      "lastCalibration": "2023-04-15T10:00:00Z",
      "nextCalibration": "2023-07-15T10:00:00Z"
    },
    {
      "id": "p002",
      "name": "南湖-2号探头",
      "serialNumber": "SN20230002",
      "type": "single-parameter",
      "model": "PH-200",
      "manufacturer": "水质科技",
      "status": "maintenance",
      "batteryLevel": 45,
      "signalStrength": 3,
      "lastDataTime": "2023-05-19T16:45:00Z",
      "position": {
        "latitude": 30.123789,
        "longitude": 120.123789,
        "depth": 1.5
      },
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      },
      "supportedMetrics": [
        "ph"
      ],
      "installationDate": "2023-02-10T00:00:00Z",
      "lastCalibration": "2023-04-20T11:30:00Z",
      "nextCalibration": "2023-07-20T11:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 25,
    "totalPages": 2
  }
}
```

#### 3.2 创建探头

```
POST /probes
```

创建新的探头。

**请求体**:

```json
{
  "name": "东湖-1号探头",
  "serialNumber": "SN20230025",
  "type": "multi-parameter",
  "model": "WQ-500",
  "manufacturer": "水质科技",
  "siteId": "s002",
  "position": {
    "latitude": 30.234567,
    "longitude": 120.234567,
    "depth": 3.0
  },
  "supportedMetrics": [
    "ph", "temperature", "dissolvedOxygen", "turbidity", "conductivity"
  ],
  "installationDate": "2023-05-20T00:00:00Z",
  "description": "东湖监测站主要探头",
  "configuration": {
    "sampleInterval": 300,
    "dataUploadInterval": 900,
    "alarmThresholds": {
      "ph": {
        "min": 6.5,
        "max": 8.5
      },
      "temperature": {
        "min": 5,
        "max": 30
      },
      "dissolvedOxygen": {
        "min": 5
      }
    }
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "p026",
    "name": "东湖-1号探头",
    "serialNumber": "SN20230025",
    "type": "multi-parameter",
    "model": "WQ-500",
    "manufacturer": "水质科技",
    "status": "inactive", // 初始状态为未激活
    "batteryLevel": null,
    "signalStrength": null,
    "lastDataTime": null,
    "position": {
      "latitude": 30.234567,
      "longitude": 120.234567,
      "depth": 3.0
    },
    "site": {
      "id": "s002",
      "name": "东湖监测站"
    },
    "supportedMetrics": [
      "ph", "temperature", "dissolvedOxygen", "turbidity", "conductivity"
    ],
    "installationDate": "2023-05-20T00:00:00Z",
    "description": "东湖监测站主要探头",
    "configuration": {
      "sampleInterval": 300,
      "dataUploadInterval": 900,
      "alarmThresholds": {
        "ph": {
          "min": 6.5,
          "max": 8.5
        },
        "temperature": {
          "min": 5,
          "max": 30
        },
        "dissolvedOxygen": {
          "min": 5
        }
      }
    },
    "createdAt": "2023-05-21T09:30:00Z",
    "createdBy": {
      "id": "u123",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建探头
- `404 Not Found`: 站点不存在
- `409 Conflict`: 序列号已存在

#### 3.3 获取探头详情

```
GET /probes/{id}
```

获取单个探头的详细信息。

**路径参数**:
- `id`: 探头ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "p001",
    "name": "南湖-1号探头",
    "serialNumber": "SN20230001",
    "type": "multi-parameter",
    "model": "WQ-500",
    "manufacturer": "水质科技",
    "status": "active",
    "batteryLevel": 85,
    "signalStrength": 4,
    "lastDataTime": "2023-05-20T08:30:00Z",
    "position": {
      "latitude": 30.123456,
      "longitude": 120.123456,
      "depth": 2.5
    },
    "site": {
      "id": "s001",
      "name": "南湖监测站"
    },
    "area": {
      "id": "a001",
      "name": "南湖区域"
    },
    "supportedMetrics": [
      "ph", "temperature", "dissolvedOxygen", "turbidity", "conductivity"
    ],
    "installationDate": "2023-01-15T00:00:00Z",
    "lastCalibration": "2023-04-15T10:00:00Z",
    "nextCalibration": "2023-07-15T10:00:00Z",
    "description": "南湖监测站主要探头",
    "firmwareVersion": "2.3.1",
    "configuration": {
      "sampleInterval": 300,
      "dataUploadInterval": 900,
      "alarmThresholds": {
        "ph": {
          "min": 6.5,
          "max": 8.5
        },
        "temperature": {
          "min": 5,
          "max": 30
        },
        "dissolvedOxygen": {
          "min": 5
        }
      }
    },
    "maintenanceHistory": [
      {
        "date": "2023-04-15T10:00:00Z",
        "type": "calibration",
        "technician": "李工",
        "notes": "完成常规校准，所有参数正常"
      },
      {
        "date": "2023-02-20T14:30:00Z",
        "type": "battery_replacement",
        "technician": "王工",
        "notes": "更换了电池"
      }
    ],
    "statistics": {
      "uptime": 98.5, // 百分比
      "dataPoints": 12450,
      "anomalies": 3,
      "lastMonthAlerts": 2
    }
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权查看探头
- `404 Not Found`: 探头不存在

#### 3.4 更新探头信息

```
PUT /probes/{id}
```

更新探头的基本信息。

**路径参数**:
- `id`: 探头ID

**请求体**:

```json
{
  "name": "南湖-1号主探头",
  "siteId": "s001",
  "position": {
    "latitude": 30.123456,
    "longitude": 120.123456,
    "depth": 3.0
  },
  "description": "更新后的探头描述",
  "configuration": {
    "sampleInterval": 600,
    "dataUploadInterval": 1800,
    "alarmThresholds": {
      "ph": {
        "min": 6.0,
        "max": 9.0
      }
    }
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "p001",
    "name": "南湖-1号主探头",
    "siteId": "s001",
    "position": {
      "latitude": 30.123456,
      "longitude": 120.123456,
      "depth": 3.0
    },
    "description": "更新后的探头描述",
    "configuration": {
      "sampleInterval": 600,
      "dataUploadInterval": 1800,
      "alarmThresholds": {
        "ph": {
          "min": 6.0,
          "max": 9.0
        },
        "temperature": {
          "min": 5,
          "max": 30
        },
        "dissolvedOxygen": {
          "min": 5
        }
      }
    },
    "updatedAt": "2023-05-21T10:15:00Z",
    "updatedBy": {
      "id": "u123",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新探头
- `404 Not Found`: 探头或站点不存在

#### 3.5 删除探头

```
DELETE /probes/{id}
```

删除探头。该操作可能是软删除，保留历史数据。

**路径参数**:
- `id`: 探头ID

**请求体**:

```json
{
  "confirm": true,
  "reason": "设备已损坏",
  "deleteData": false // 是否删除相关的历史数据
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 确认字段缺失或为false
- `403 Forbidden`: 无权删除探头
- `404 Not Found`: 探头不存在
- `409 Conflict`: 探头有关联数据且未指定处理方式

#### 3.6 获取探头状态

```
GET /probes/{id}/status
```

获取探头当前状态信息。

**路径参数**:
- `id`: 探头ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "p001",
    "status": "active",
    "batteryLevel": 85,
    "signalStrength": 4,
    "lastDataTime": "2023-05-20T08:30:00Z",
    "firmwareVersion": "2.3.1",
    "temperature": 25.3, // 探头自身温度
    "lastMaintenance": "2023-04-15T10:00:00Z",
    "nextMaintenance": "2023-07-15T10:00:00Z",
    "issues": [
      {
        "type": "warning",
        "code": "BATT_LOW",
        "message": "电池电量低于30%",
        "detectedAt": "2023-05-19T23:11:08Z"
      }
    ],
    "dataQuality": {
      "completeness": 98.5,
      "outliers": 0.2,
      "stability": 99.3
    },
    "lastCheckin": "2023-05-20T09:15:30Z",
    "uptimeLastWeek": 99.8
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权查看探头状态
- `404 Not Found`: 探头不存在

#### 3.7 更新探头状态

```
PUT /probes/{id}/status
```

更新探头状态。该接口通常由系统内部使用，也可由管理员手动触发。

**路径参数**:
- `id`: 探头ID

**请求体**:

```json
{
  "status": "maintenance",
  "batteryLevel": 82,
  "signalStrength": 4,
  "issues": [
    {
      "type": "warning",
      "code": "BATT_LOW",
      "message": "电池电量低于30%",
      "detectedAt": "2023-05-19T23:11:08Z"
    }
  ],
  "maintenanceNote": "计划维护",
  "expectedResumption": "2023-05-22T12:00:00Z"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "p001",
    "status": "maintenance",
    "batteryLevel": 82,
    "signalStrength": 4,
    "issues": [
      {
        "type": "warning",
        "code": "BATT_LOW",
        "message": "电池电量低于30%",
        "detectedAt": "2023-05-19T23:11:08Z"
      }
    ],
    "maintenanceNote": "计划维护",
    "expectedResumption": "2023-05-22T12:00:00Z",
    "updatedAt": "2023-05-21T11:00:00Z",
    "updatedBy": {
      "id": "u123",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新探头状态
- `404 Not Found`: 探头不存在

#### 3.8 校准探头

```
POST /probes/{id}/calibrate
```

记录探头校准操作。

**路径参数**:
- `id`: 探头ID

**请求体**:

```json
{
  "calibrationType": "full", // 或 "ph", "temperature" 等特定指标
  "technician": "李工",
  "notes": "完成常规校准，所有参数正常",
  "calibrationValues": {
    "ph": {
      "before": 7.1,
      "after": 7.0,
      "standard": 7.0
    },
    "temperature": {
      "before": 25.3,
      "after": 25.0,
      "standard": 25.0
    }
  },
  "nextCalibrationDate": "2023-08-21T00:00:00Z"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "cal123",
    "probeId": "p001",
    "calibrationType": "full",
    "technician": "李工",
    "notes": "完成常规校准，所有参数正常",
    "calibrationValues": {
      "ph": {
        "before": 7.1,
        "after": 7.0,
        "standard": 7.0
      },
      "temperature": {
        "before": 25.3,
        "after": 25.0,
        "standard": 25.0
      }
    },
    "calibrationDate": "2023-05-21T11:30:00Z",
    "nextCalibrationDate": "2023-08-21T00:00:00Z",
    "status": "completed",
    "calibratedBy": {
      "id": "u123",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权校准探头
- `404 Not Found`: 探头不存在

#### 3.9 获取探头支持的指标

```
GET /probes/{id}/metrics
```

获取探头支持的指标列表。

**路径参数**:
- `id`: 探头ID

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "ph",
      "name": "pH值",
      "unit": "pH",
      "range": {
        "min": 0,
        "max": 14
      },
      "precision": 0.1,
      "description": "水溶液中氢离子浓度的负对数",
      "category": "chemical",
      "isActive": true
    },
    {
      "id": "temperature",
      "name": "温度",
      "unit": "°C",
      "range": {
        "min": -10,
        "max": 50
      },
      "precision": 0.1,
      "description": "水体温度",
      "category": "physical",
      "isActive": true
    },
    // 更多指标...
  ]
}
```

**错误情况**:
- `403 Forbidden`: 无权访问探头信息
- `404 Not Found`: 探头不存在

#### 3.10 更新探头指标配置

```
PUT /probes/{id}/metrics
```

更新探头的指标配置。

**路径参数**:
- `id`: 探头ID

**请求体**:

```json
{
  "activeMetrics": ["ph", "temperature", "dissolvedOxygen", "turbidity"],
  "sampleIntervals": {
    "ph": 300,
    "temperature": 300,
    "dissolvedOxygen": 600,
    "turbidity": 600
  },
  "alarmThresholds": {
    "ph": {
      "min": 6.0,
      "max": 9.0
    },
    "temperature": {
      "min": 5,
      "max": 35
    }
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "p001",
    "activeMetrics": ["ph", "temperature", "dissolvedOxygen", "turbidity"],
    "sampleIntervals": {
      "ph": 300,
      "temperature": 300,
      "dissolvedOxygen": 600,
      "turbidity": 600
    },
    "alarmThresholds": {
      "ph": {
        "min": 6.0,
        "max": 9.0
      },
      "temperature": {
        "min": 5,
        "max": 35
      }
    },
    "updatedAt": "2023-05-21T14:00:00Z",
    "updatedBy": {
      "id": "u123",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败或指标不受支持
- `403 Forbidden`: 无权更新探头配置
- `404 Not Found`: 探头不存在

#### 3.11 获取探头类型列表

```
GET /probes/types
```

获取系统支持的探头类型列表。

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "multi-parameter",
      "name": "多参数探头",
      "description": "可同时测量多个水质参数的综合性探头",
      "supportedMetrics": [
        "ph", "temperature", "dissolvedOxygen", "turbidity", "conductivity"
      ],
      "models": [
        {
          "id": "WQ-500",
          "name": "WQ-500多参数探头",
          "manufacturer": "水质科技",
          "specifications": {
            "batteryLife": "6个月",
            "dataStorage": "64GB",
            "waterproof": "IP68",
            "warranty": "2年"
          }
        },
        {
          "id": "MP-2000",
          "name": "MP-2000专业型探头",
          "manufacturer": "环境监测设备公司",
          "specifications": {
            "batteryLife": "12个月",
            "dataStorage": "128GB",
            "waterproof": "IP68",
            "warranty": "3年"
          }
        }
      ]
    },
    {
      "id": "single-parameter",
      "name": "单参数探头",
      "description": "专注于测量单一水质参数的专业探头",
      "supportedMetrics": [
        "ph"
      ],
      "models": [
        {
          "id": "PH-200",
          "name": "PH-200精密pH探头",
          "manufacturer": "水质科技",
          "specifications": {
            "batteryLife": "12个月",
            "dataStorage": "32GB",
            "waterproof": "IP67",
            "warranty": "18个月"
          }
        }
      ]
    }
  ]
}
```

#### 3.12 批量创建探头

```
POST /probes/batch
```

批量创建多个探头。

**请求体**:

```json
{
  "probes": [
    {
      "name": "东湖-1号探头",
      "serialNumber": "SN20230025",
      "type": "multi-parameter",
      "model": "WQ-500",
      "manufacturer": "水质科技",
      "siteId": "s002"
    },
    {
      "name": "东湖-2号探头",
      "serialNumber": "SN20230026",
      "type": "single-parameter",
      "model": "PH-200",
      "manufacturer": "水质科技",
      "siteId": "s002"
    }
  ],
  "commonConfiguration": {
    "sampleInterval": 300,
    "dataUploadInterval": 900
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "successCount": 2,
    "failureCount": 0,
    "probes": [
      {
        "id": "p026",
        "name": "东湖-1号探头",
        "serialNumber": "SN20230025",
        "status": "inactive"
      },
      {
        "id": "p027",
        "name": "东湖-2号探头",
        "serialNumber": "SN20230026",
        "status": "inactive"
      }
    ],
    "failures": []
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建探头
- `207 Multi-Status`: 部分探头创建成功，部分失败 

## 4. 水质测量数据API

### 4.1 获取测量数据

```
GET /measurements
```

获取水质测量数据，支持多种筛选和分页。

**请求参数**:
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `metrics` (查询参数, 可选): 指标列表，逗号分隔（如"ph,temperature"）
- `startTime` (查询参数, 可选): 开始时间，ISO8601格式
- `endTime` (查询参数, 可选): 结束时间，ISO8601格式
- `interval` (查询参数, 可选): 时间聚合间隔，如"raw"(原始),"hour","day","week","month"
- `aggregation` (查询参数, 可选): 聚合方式，如"avg","min","max","sum"
- `status` (查询参数, 可选): 数据状态，如"normal","warning","error"
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `sort` (查询参数, 可选): 排序字段，默认"timestamp"
- `order` (查询参数, 可选): 排序方向，"asc"或"desc"，默认"desc"

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "m123456",
      "probeId": "p001",
      "timestamp": "2023-05-20T08:30:00Z",
      "values": {
        "ph": 7.2,
        "temperature": 22.5,
        "dissolvedOxygen": 8.1,
        "turbidity": 3.5,
        "conductivity": 420
      },
      "status": "normal",
      "qualityScore": 85,
      "createdAt": "2023-05-20T08:30:05Z",
      "probe": {
        "id": "p001",
        "name": "南湖-1号探头"
      },
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      }
    },
    {
      "id": "m123457",
      "probeId": "p001",
      "timestamp": "2023-05-20T08:35:00Z",
      "values": {
        "ph": 7.3,
        "temperature": 22.6,
        "dissolvedOxygen": 8.0,
        "turbidity": 3.6,
        "conductivity": 422
      },
      "status": "normal",
      "qualityScore": 84,
      "createdAt": "2023-05-20T08:35:05Z",
      "probe": {
        "id": "p001",
        "name": "南湖-1号探头"
      },
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 12450,
    "totalPages": 623,
    "aggregation": null,
    "interval": "raw"
  }
}
```

**聚合数据响应示例** (当指定interval和aggregation时):

```json
{
  "data": [
    {
      "timestamp": "2023-05-20T08:00:00Z",
      "values": {
        "ph": {
          "avg": 7.25,
          "min": 7.1,
          "max": 7.4,
          "count": 12
        },
        "temperature": {
          "avg": 22.55,
          "min": 22.3,
          "max": 22.8,
          "count": 12
        }
      },
      "probeId": "p001"
    },
    {
      "timestamp": "2023-05-20T09:00:00Z",
      "values": {
        "ph": {
          "avg": 7.30,
          "min": 7.2,
          "max": 7.5,
          "count": 12
        },
        "temperature": {
          "avg": 22.75,
          "min": 22.5,
          "max": 23.0,
          "count": 12
        }
      },
      "probeId": "p001"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 24,
    "totalPages": 2,
    "aggregation": "avg",
    "interval": "hour"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数无效
- `403 Forbidden`: 无权访问数据

### 4.2 获取单次测量详情

```
GET /measurements/{id}
```

获取单个测量记录的详细信息。

**路径参数**:
- `id`: 测量记录ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "m123456",
    "probeId": "p001",
    "timestamp": "2023-05-20T08:30:00Z",
    "values": {
      "ph": 7.2,
      "temperature": 22.5,
      "dissolvedOxygen": 8.1,
      "turbidity": 3.5,
      "conductivity": 420
    },
    "rawValues": {
      "ph": 7.23,
      "temperature": 22.48,
      "dissolvedOxygen": 8.12,
      "turbidity": 3.46,
      "conductivity": 419.7
    },
    "status": "normal",
    "qualityScore": 85,
    "qualityGrade": "优",
    "flags": [],
    "createdAt": "2023-05-20T08:30:05Z",
    "probe": {
      "id": "p001",
      "name": "南湖-1号探头",
      "status": "active"
    },
    "site": {
      "id": "s001",
      "name": "南湖监测站"
    },
    "area": {
      "id": "a001",
      "name": "南湖区域"
    },
    "thresholds": {
      "ph": {
        "min": 6.5,
        "max": 8.5
      },
      "temperature": {
        "min": 5,
        "max": 30
      },
      "dissolvedOxygen": {
        "min": 5
      }
    },
    "metadata": {
      "batchId": "b789",
      "calibrationId": "cal123",
      "weather": {
        "condition": "sunny",
        "temperature": 24.5,
        "humidity": 65
      }
    }
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权访问该数据
- `404 Not Found`: 测量记录不存在

### 4.3 添加测量数据

```
POST /measurements
```

添加新的测量数据。通常由探头自动调用，也可由管理员手动添加。

**请求体**:

```json
{
  "probeId": "p001",
  "timestamp": "2023-05-21T10:00:00Z",
  "values": {
    "ph": 7.4,
    "temperature": 23.1,
    "dissolvedOxygen": 7.8,
    "turbidity": 4.2,
    "conductivity": 430
  },
  "metadata": {
    "batchId": "b790",
    "weather": {
      "condition": "cloudy",
      "temperature": 25.0,
      "humidity": 70
    }
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "m123900",
    "probeId": "p001",
    "timestamp": "2023-05-21T10:00:00Z",
    "values": {
      "ph": 7.4,
      "temperature": 23.1,
      "dissolvedOxygen": 7.8,
      "turbidity": 4.2,
      "conductivity": 430
    },
    "status": "normal",
    "qualityScore": 82,
    "createdAt": "2023-05-21T10:00:05Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权添加数据
- `404 Not Found`: 探头不存在
- `422 Unprocessable Entity`: 数据不符合指标范围限制

### 4.4 批量添加测量数据

```
POST /measurements/batch
```

批量添加多条测量数据。常用于数据同步和导入。

**请求体**:

```json
{
  "measurements": [
    {
      "probeId": "p001",
      "timestamp": "2023-05-21T10:05:00Z",
      "values": {
        "ph": 7.4,
        "temperature": 23.2
      }
    },
    {
      "probeId": "p001",
      "timestamp": "2023-05-21T10:10:00Z",
      "values": {
        "ph": 7.5,
        "temperature": 23.3
      }
    },
    {
      "probeId": "p002",
      "timestamp": "2023-05-21T10:05:00Z",
      "values": {
        "ph": 7.3
      }
    }
  ],
  "metadata": {
    "batchId": "b791",
    "source": "manual_import"
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "successCount": 3,
    "failureCount": 0,
    "batchId": "b791",
    "measurements": [
      {
        "id": "m123901",
        "probeId": "p001",
        "timestamp": "2023-05-21T10:05:00Z"
      },
      {
        "id": "m123902",
        "probeId": "p001",
        "timestamp": "2023-05-21T10:10:00Z"
      },
      {
        "id": "m123903",
        "probeId": "p002",
        "timestamp": "2023-05-21T10:05:00Z"
      }
    ],
    "failures": []
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权添加数据
- `207 Multi-Status`: 部分数据添加成功，部分失败

### 4.5 获取最新测量数据

```
GET /measurements/latest
```

获取指定探头的最新测量数据。

**请求参数**:
- `probeIds` (查询参数, 必选): 探头ID列表，逗号分隔
- `metrics` (查询参数, 可选): 指标列表，逗号分隔

**响应** (200 OK):

```json
{
  "data": [
    {
      "probeId": "p001",
      "timestamp": "2023-05-21T10:10:00Z",
      "values": {
        "ph": 7.5,
        "temperature": 23.3,
        "dissolvedOxygen": 7.9,
        "turbidity": 4.0,
        "conductivity": 428
      },
      "status": "normal",
      "qualityScore": 83,
      "probe": {
        "id": "p001",
        "name": "南湖-1号探头",
        "status": "active"
      }
    },
    {
      "probeId": "p002",
      "timestamp": "2023-05-21T10:05:00Z",
      "values": {
        "ph": 7.3
      },
      "status": "normal",
      "qualityScore": 84,
      "probe": {
        "id": "p002",
        "name": "南湖-2号探头",
        "status": "active"
      }
    }
  ]
}
```

**错误情况**:
- `400 Bad Request`: 缺少必要参数
- `403 Forbidden`: 无权访问数据

### 4.6 获取数据统计

```
GET /measurements/statistics
```

获取水质数据的统计信息。

**请求参数**:
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `metrics` (查询参数, 可选): 指标列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `groupBy` (查询参数, 可选): 分组方式，"probe","site","area"或"none"，默认"none"

**响应** (200 OK):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-05-01T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "metrics": {
      "ph": {
        "avg": 7.35,
        "min": 6.8,
        "max": 7.9,
        "median": 7.4,
        "stdDev": 0.2,
        "count": 5760,
        "completeness": 99.8, // 数据完整度百分比
        "trend": "stable", // 或 "increasing", "decreasing"
        "histogram": [
          {
            "range": [6.5, 7.0],
            "count": 1250
          },
          {
            "range": [7.0, 7.5],
            "count": 3100
          },
          {
            "range": [7.5, 8.0],
            "count": 1410
          }
        ]
      },
      "temperature": {
        "avg": 22.8,
        "min": 19.5,
        "max": 25.2,
        "median": 22.9,
        "stdDev": 1.2,
        "count": 5760,
        "completeness": 99.8,
        "trend": "increasing",
        "histogram": [
          {
            "range": [19.0, 21.0],
            "count": 1050
          },
          {
            "range": [21.0, 23.0],
            "count": 3200
          },
          {
            "range": [23.0, 25.0],
            "count": 1400
          },
          {
            "range": [25.0, 26.0],
            "count": 110
          }
        ]
      }
    },
    "qualityScores": {
      "avg": 83.5,
      "distribution": {
        "excellent": 65, // 百分比
        "good": 30,
        "fair": 5,
        "poor": 0
      }
    },
    "anomalies": {
      "count": 12,
      "byMetric": {
        "ph": 3,
        "temperature": 5,
        "dissolvedOxygen": 4
      }
    }
  }
}
```

**按探头分组响应示例** (当groupBy="probe"):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-05-01T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "groups": [
      {
        "probeId": "p001",
        "probeName": "南湖-1号探头",
        "metrics": {
          "ph": {
            "avg": 7.35,
            "min": 6.8,
            "max": 7.9,
            "median": 7.4,
            "stdDev": 0.2,
            "count": 2880,
            "completeness": 99.8
          },
          "temperature": {
            "avg": 22.8,
            "min": 19.5,
            "max": 25.2,
            "median": 22.9,
            "stdDev": 1.2,
            "count": 2880,
            "completeness": 99.8
          }
        },
        "qualityScores": {
          "avg": 83.5,
          "distribution": {
            "excellent": 65,
            "good": 30,
            "fair": 5,
            "poor": 0
          }
        },
        "anomalies": {
          "count": 6
        }
      },
      {
        "probeId": "p002",
        "probeName": "南湖-2号探头",
        "metrics": {
          "ph": {
            "avg": 7.3,
            "min": 6.9,
            "max": 7.8,
            "median": 7.3,
            "stdDev": 0.18,
            "count": 2880,
            "completeness": 99.7
          }
        },
        "qualityScores": {
          "avg": 84.0,
          "distribution": {
            "excellent": 68,
            "good": 28,
            "fair": 4,
            "poor": 0
          }
        },
        "anomalies": {
          "count": 6
        }
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 缺少必要参数
- `403 Forbidden`: 无权访问数据

### 4.7 获取趋势分析

```
GET /measurements/trends
```

获取水质数据的趋势分析结果。

**请求参数**:
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `metrics` (查询参数, 必选): 指标列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `interval` (查询参数, 可选): 时间聚合间隔，如"hour","day","week","month"，默认"day"

**响应** (200 OK):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-04-21T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "interval": "day",
    "trends": [
      {
        "metric": "ph",
        "name": "pH值",
        "unit": "pH",
        "series": [
          {
            "timestamp": "2023-04-21T00:00:00Z",
            "value": 7.25,
            "min": 7.1,
            "max": 7.4
          },
          {
            "timestamp": "2023-04-22T00:00:00Z",
            "value": 7.28,
            "min": 7.1,
            "max": 7.5
          },
          // ... 更多数据点
          {
            "timestamp": "2023-05-21T00:00:00Z",
            "value": 7.35,
            "min": 7.2,
            "max": 7.5
          }
        ],
        "analysis": {
          "trend": "slight_increase",
          "changeRate": 0.14, // 百分比
          "stability": "high",
          "seasonality": "none",
          "outliers": [
            {
              "timestamp": "2023-05-05T00:00:00Z",
              "value": 7.9,
              "deviation": 3.5 // 标准差倍数
            }
          ]
        }
      },
      {
        "metric": "temperature",
        "name": "温度",
        "unit": "°C",
        "series": [
          {
            "timestamp": "2023-04-21T00:00:00Z",
            "value": 19.8,
            "min": 18.5,
            "max": 21.2
          },
          // ... 更多数据点
          {
            "timestamp": "2023-05-21T00:00:00Z",
            "value": 22.8,
            "min": 21.5,
            "max": 24.0
          }
        ],
        "analysis": {
          "trend": "significant_increase",
          "changeRate": 15.15, // 百分比
          "stability": "medium",
          "seasonality": "daily",
          "outliers": []
        }
      }
    ],
    "correlations": [
      {
        "metrics": ["ph", "temperature"],
        "coefficient": 0.72,
        "strength": "strong",
        "direction": "positive"
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 缺少必要参数
- `403 Forbidden`: 无权访问数据

### 4.8 数据对比分析

```
GET /measurements/compare
```

对比不同探头或不同时间的水质数据。

**请求参数**:
- `targetType` (查询参数, 必选): 对比目标类型，"probes"或"periods"
- `metrics` (查询参数, 必选): 指标列表，逗号分隔
- `probeIds` (查询参数, 当targetType="probes"时必选): 探头ID列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `periodStart1` (查询参数, 当targetType="periods"时必选): 第一个周期开始时间
- `periodEnd1` (查询参数, 当targetType="periods"时必选): 第一个周期结束时间
- `periodStart2` (查询参数, 当targetType="periods"时必选): 第二个周期开始时间
- `periodEnd2` (查询参数, 当targetType="periods"时必选): 第二个周期结束时间
- `interval` (查询参数, 可选): 时间聚合间隔，如"hour","day","week"，默认"day"

**响应示例** (探头对比):

```json
{
  "data": {
    "targetType": "probes",
    "timeRange": {
      "start": "2023-05-01T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "metrics": [
      {
        "id": "ph",
        "name": "pH值",
        "unit": "pH",
        "targets": [
          {
            "probeId": "p001",
            "probeName": "南湖-1号探头",
            "statistics": {
              "avg": 7.35,
              "min": 6.8,
              "max": 7.9,
              "median": 7.4,
              "stdDev": 0.2
            }
          },
          {
            "probeId": "p002",
            "probeName": "南湖-2号探头",
            "statistics": {
              "avg": 7.3,
              "min": 6.9,
              "max": 7.8,
              "median": 7.3,
              "stdDev": 0.18
            }
          }
        ],
        "difference": {
          "avg": 0.05,
          "percentageDiff": 0.68,
          "significance": "low"
        }
      }
    ],
    "qualityScores": {
      "targets": [
        {
          "probeId": "p001",
          "probeName": "南湖-1号探头",
          "avg": 83.5
        },
        {
          "probeId": "p002",
          "probeName": "南湖-2号探头",
          "avg": 84.0
        }
      ],
      "difference": {
        "avg": -0.5,
        "percentageDiff": -0.6,
        "significance": "low"
      }
    }
  }
}
```

**响应示例** (时间周期对比):

```json
{
  "data": {
    "targetType": "periods",
    "periods": [
      {
        "name": "Period 1",
        "start": "2023-04-01T00:00:00Z",
        "end": "2023-04-30T23:59:59Z"
      },
      {
        "name": "Period 2",
        "start": "2023-05-01T00:00:00Z",
        "end": "2023-05-21T23:59:59Z"
      }
    ],
    "probeId": "p001",
    "probeName": "南湖-1号探头",
    "metrics": [
      {
        "id": "ph",
        "name": "pH值",
        "unit": "pH",
        "targets": [
          {
            "periodName": "Period 1",
            "statistics": {
              "avg": 7.25,
              "min": 6.7,
              "max": 7.8,
              "median": 7.3,
              "stdDev": 0.22
            }
          },
          {
            "periodName": "Period 2",
            "statistics": {
              "avg": 7.35,
              "min": 6.8,
              "max": 7.9,
              "median": 7.4,
              "stdDev": 0.2
            }
          }
        ],
        "difference": {
          "avg": 0.1,
          "percentageDiff": 1.38,
          "significance": "medium",
          "trend": "increasing"
        }
      }
    ],
    "qualityScores": {
      "targets": [
        {
          "periodName": "Period 1",
          "avg": 82.0
        },
        {
          "periodName": "Period 2",
          "avg": 83.5
        }
      ],
      "difference": {
        "avg": 1.5,
        "percentageDiff": 1.83,
        "significance": "medium",
        "trend": "improving"
      }
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 缺少必要参数
- `403 Forbidden`: 无权访问数据

### 4.9 导出测量数据

```
GET /measurements/export
```

导出水质测量数据，支持多种格式。

**请求参数**:
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `metrics` (查询参数, 可选): 指标列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `interval` (查询参数, 可选): 时间聚合间隔，如"raw","hour","day"，默认"raw"
- `format` (查询参数, 必选): 导出格式，"csv"，"excel"或"json"
- `includeMetadata` (查询参数, 可选): 是否包含元数据，默认false

**响应** (200 OK):

```
Content-Type: application/vnd.ms-excel
Content-Disposition: attachment; filename="water_quality_data_2023-05-01_2023-05-21.xlsx"

[二进制数据]
```

**错误情况**:
- `400 Bad Request`: 缺少必要参数
- `403 Forbidden`: 无权访问数据

### 4.10 删除测量数据

```
DELETE /measurements/{id}
```

删除单条测量数据。通常需要管理员权限。

**路径参数**:
- `id`: 测量记录ID

**响应** (204 No Content)

**错误情况**:
- `403 Forbidden`: 无权删除数据
- `404 Not Found`: 测量记录不存在 

## 5. 水质指标管理API

### 5.1 获取指标列表

```
GET /metrics
```

获取系统支持的所有水质指标列表。

**请求参数**:
- `category` (查询参数, 可选): 按类别筛选，如"physical"、"chemical"等
- `status` (查询参数, 可选): 按状态筛选，如"active"、"inactive"
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认50

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "ph",
      "name": "pH值",
      "category": "physical",
      "unit": "pH",
      "description": "水溶液酸碱度指标",
      "range": [0, 14],
      "standardRange": [6.5, 8.5],
      "precision": 0.1,
      "status": "active",
      "isCore": true,
      "metadata": {
        "displayOrder": 1,
        "thresholds": {
          "excellent": [6.5, 7.5],
          "good": [6.0, 8.0],
          "fair": [5.5, 8.5],
          "poor": [5.0, 9.0]
        },
        "importance": "high"
      }
    },
    {
      "id": "temperature",
      "name": "温度",
      "category": "physical",
      "unit": "°C",
      "description": "水体温度",
      "range": [-10, 50],
      "standardRange": [5, 30],
      "precision": 0.1,
      "status": "active",
      "isCore": true,
      "metadata": {
        "displayOrder": 2,
        "thresholds": {
          "excellent": [15, 25],
          "good": [10, 28],
          "fair": [5, 32],
          "poor": [0, 35]
        },
        "importance": "high"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "totalItems": 45,
    "totalPages": 1,
    "categories": {
      "physical": 12,
      "chemical": 25,
      "biological": 5,
      "mineral": 3
    }
  }
}
```

### 5.2 获取单个指标详情

```
GET /metrics/{id}
```

获取特定水质指标的详细信息。

**路径参数**:
- `id`: 指标ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "dissolved_oxygen",
    "name": "溶解氧",
    "category": "physical",
    "unit": "mg/L",
    "description": "水中溶解的氧气含量，是水生生物生存的重要指标",
    "range": [0, 20],
    "standardRange": [5, 12],
    "precision": 0.1,
    "status": "active",
    "isCore": true,
    "formula": "直接测量",
    "metadata": {
      "displayOrder": 3,
      "thresholds": {
        "excellent": [7, 12],
        "good": [6, 14],
        "fair": [5, 15],
        "poor": [3, 16]
      },
      "importance": "high",
      "relatedParameters": ["temperature", "salinity", "atmospheric_pressure"],
      "notes": "溶解氧水平受温度、压力和盐度影响"
    },
    "updatedAt": "2023-03-15T08:30:00Z",
    "createdAt": "2023-01-10T12:00:00Z"
  }
}
```

**错误情况**:
- `404 Not Found`: 指标不存在

### 5.3 创建新指标

```
POST /metrics
```

创建新的水质指标定义。需要管理员权限。

**请求体**:

```json
{
  "id": "fluoride",
  "name": "氟化物",
  "category": "chemical",
  "unit": "mg/L",
  "description": "水中的氟离子含量",
  "range": [0, 10],
  "standardRange": [0, 1.5],
  "precision": 0.01,
  "status": "active",
  "formula": "离子选择电极法",
  "metadata": {
    "displayOrder": 25,
    "thresholds": {
      "excellent": [0, 0.7],
      "good": [0, 1.0],
      "fair": [0, 1.5],
      "poor": [0, 2.0]
    },
    "importance": "medium"
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "fluoride",
    "name": "氟化物",
    "category": "chemical",
    "unit": "mg/L",
    "description": "水中的氟离子含量",
    "range": [0, 10],
    "standardRange": [0, 1.5],
    "precision": 0.01,
    "status": "active",
    "formula": "离子选择电极法",
    "metadata": {
      "displayOrder": 25,
      "thresholds": {
        "excellent": [0, 0.7],
        "good": [0, 1.0],
        "fair": [0, 1.5],
        "poor": [0, 2.0]
      },
      "importance": "medium"
    },
    "createdAt": "2023-05-21T15:30:00Z",
    "updatedAt": "2023-05-21T15:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建指标
- `409 Conflict`: 指标ID已存在

### 5.4 更新指标

```
PUT /metrics/{id}
```

更新现有水质指标的定义。需要管理员权限。

**路径参数**:
- `id`: 指标ID

**请求体**:

```json
{
  "name": "氟化物(F-)",
  "description": "水中的氟离子含量，反映水质安全性",
  "standardRange": [0, 1.0],
  "metadata": {
    "thresholds": {
      "excellent": [0, 0.5],
      "good": [0, 0.7],
      "fair": [0, 1.0],
      "poor": [0, 1.5]
    },
    "importance": "high"
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "fluoride",
    "name": "氟化物(F-)",
    "category": "chemical",
    "unit": "mg/L",
    "description": "水中的氟离子含量，反映水质安全性",
    "range": [0, 10],
    "standardRange": [0, 1.0],
    "precision": 0.01,
    "status": "active",
    "formula": "离子选择电极法",
    "metadata": {
      "displayOrder": 25,
      "thresholds": {
        "excellent": [0, 0.5],
        "good": [0, 0.7],
        "fair": [0, 1.0],
        "poor": [0, 1.5]
      },
      "importance": "high"
    },
    "createdAt": "2023-05-21T15:30:00Z",
    "updatedAt": "2023-05-21T16:45:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新指标
- `404 Not Found`: 指标不存在

### 5.5 删除指标

```
DELETE /metrics/{id}
```

删除水质指标。需要管理员权限。

**路径参数**:
- `id`: 指标ID

**请求体**:

```json
{
  "confirm": true
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 确认字段缺失或为false
- `403 Forbidden`: 无权删除指标
- `404 Not Found`: 指标不存在
- `409 Conflict`: 指标正在使用中，无法删除

### 5.6 获取指标分类列表

```
GET /metrics/categories
```

获取所有指标分类信息。

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "physical",
      "name": "物理指标",
      "description": "描述水体物理特性的指标",
      "count": 12,
      "displayOrder": 1
    },
    {
      "id": "chemical",
      "name": "化学指标",
      "description": "描述水体化学特性的指标",
      "count": 25,
      "displayOrder": 2
    },
    {
      "id": "biological",
      "name": "生物指标",
      "description": "描述水体生物特性的指标",
      "count": 5,
      "displayOrder": 3
    },
    {
      "id": "mineral",
      "name": "矿物质指标",
      "description": "描述水体矿物质含量的指标",
      "count": 3,
      "displayOrder": 4
    }
  ]
}
```

### 5.7 获取指标阈值设置

```
GET /metrics/thresholds
```

获取租户的指标阈值设置。

**请求参数**:
- `categoryId` (查询参数, 可选): 按分类筛选

**响应** (200 OK):

```json
{
  "data": {
    "tenant": {
      "id": "t789",
      "name": "ABC水务公司"
    },
    "thresholds": [
      {
        "metricId": "ph",
        "name": "pH值",
        "warning": {
          "min": 6.0,
          "max": 9.0
        },
        "critical": {
          "min": 5.0,
          "max": 10.0
        },
        "standard": "GB 5749-2006",
        "updatedAt": "2023-04-15T13:30:00Z"
      },
      {
        "metricId": "dissolved_oxygen",
        "name": "溶解氧",
        "warning": {
          "min": 5.0
        },
        "critical": {
          "min": 3.0
        },
        "standard": "GB 3838-2002",
        "updatedAt": "2023-04-15T13:30:00Z"
      }
    ]
  }
}
```

### 5.8 更新指标阈值设置

```
PUT /metrics/thresholds
```

批量更新租户的指标阈值设置。

**请求体**:

```json
{
  "thresholds": [
    {
      "metricId": "ph",
      "warning": {
        "min": 6.2,
        "max": 8.8
      },
      "critical": {
        "min": 5.5,
        "max": 9.5
      }
    },
    {
      "metricId": "turbidity",
      "warning": {
        "max": 3.0
      },
      "critical": {
        "max": 5.0
      }
    }
  ]
}
```

**响应** (200 OK):

```json
{
  "data": {
    "updatedCount": 2,
    "thresholds": [
      {
        "metricId": "ph",
        "name": "pH值",
        "warning": {
          "min": 6.2,
          "max": 8.8
        },
        "critical": {
          "min": 5.5,
          "max": 9.5
        },
        "updatedAt": "2023-05-21T16:45:00Z"
      },
      {
        "metricId": "turbidity",
        "name": "浊度",
        "warning": {
          "max": 3.0
        },
        "critical": {
          "max": 5.0
        },
        "updatedAt": "2023-05-21T16:45:00Z"
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新阈值
- `404 Not Found`: 指标不存在

## 6. 系统设置API

### 6.1 获取系统设置

```
GET /settings
```

获取当前租户的系统设置。

**响应** (200 OK):

```json
{
  "data": {
    "general": {
      "systemName": "HydroGem水质监测系统",
      "logoUrl": "https://assets.hydrogem.cn/logos/tenant-t789.png",
      "timezone": "Asia/Shanghai",
      "dateFormat": "YYYY-MM-DD",
      "timeFormat": "HH:mm:ss",
      "language": "zh-CN"
    },
    "notifications": {
      "email": {
        "enabled": true,
        "dailySummary": true,
        "criticalAlerts": true,
        "warningAlerts": true,
        "systemUpdates": false
      },
      "sms": {
        "enabled": true,
        "criticalAlerts": true,
        "warningAlerts": false
      },
      "pushNotifications": {
        "enabled": true,
        "criticalAlerts": true,
        "warningAlerts": true,
        "systemUpdates": true
      }
    },
    "monitoring": {
      "defaultRefreshInterval": 300,
      "autoRefresh": true,
      "defaultParameterView": "category",
      "dataCacheDuration": 1800
    },
    "reports": {
      "autoGenerateDaily": true,
      "autoGenerateWeekly": true,
      "autoGenerateMonthly": true,
      "recipients": ["admin@example.com", "manager@example.com"]
    },
    "security": {
      "sessionTimeout": 3600,
      "loginAttempts": 5,
      "requireMfa": false,
      "passwordPolicy": {
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumber": true,
        "requireSpecial": true,
        "expiryDays": 90
      }
    },
    "audit": {
      "enableLoginAudit": true,
      "enableDataChangeAudit": true,
      "retentionDays": 90
    }
  }
}
```

**错误情况**:
- `403 Forbidden`: 无权访问设置

### 6.2 更新系统设置

```
PUT /settings
```

更新当前租户的系统设置。

**请求体**:

```json
{
  "general": {
    "systemName": "HydroGem企业水质监测平台",
    "timezone": "Asia/Shanghai",
    "language": "zh-CN"
  },
  "notifications": {
    "email": {
      "enabled": true,
      "dailySummary": false,
      "criticalAlerts": true
    }
  },
  "monitoring": {
    "defaultRefreshInterval": 600,
    "autoRefresh": true
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "updated": {
      "general.systemName": "HydroGem企业水质监测平台",
      "notifications.email.dailySummary": false,
      "monitoring.defaultRefreshInterval": 600
    },
    "timestamp": "2023-05-21T17:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新设置

### 6.3 获取通知联系人列表

```
GET /settings/contacts
```

获取通知联系人列表。

**请求参数**:
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "c001",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138000",
      "role": "管理员",
      "notificationTypes": ["email", "sms", "push"],
      "alertLevels": ["critical", "warning"],
      "status": "active",
      "createdAt": "2023-03-15T08:30:00Z"
    },
    {
      "id": "c002",
      "name": "李四",
      "email": "lisi@example.com",
      "phone": "13800138001",
      "role": "技术员",
      "notificationTypes": ["email", "push"],
      "alertLevels": ["critical"],
      "status": "active",
      "createdAt": "2023-04-01T10:15:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### 6.4 添加通知联系人

```
POST /settings/contacts
```

添加新的通知联系人。

**请求体**:

```json
{
  "name": "王五",
  "email": "wangwu@example.com",
  "phone": "13800138002",
  "role": "水质专家",
  "notificationTypes": ["email", "sms"],
  "alertLevels": ["critical", "warning"]
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "c003",
    "name": "王五",
    "email": "wangwu@example.com",
    "phone": "13800138002",
    "role": "水质专家",
    "notificationTypes": ["email", "sms"],
    "alertLevels": ["critical", "warning"],
    "status": "active",
    "createdAt": "2023-05-21T17:45:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权添加联系人

### 6.5 更新通知联系人

```
PUT /settings/contacts/{id}
```

更新现有通知联系人信息。

**路径参数**:
- `id`: 联系人ID

**请求体**:

```json
{
  "phone": "13900139000",
  "notificationTypes": ["email", "sms", "push"],
  "status": "inactive"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "c003",
    "name": "王五",
    "email": "wangwu@example.com",
    "phone": "13900139000",
    "role": "水质专家",
    "notificationTypes": ["email", "sms", "push"],
    "alertLevels": ["critical", "warning"],
    "status": "inactive",
    "updatedAt": "2023-05-21T18:00:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新联系人
- `404 Not Found`: 联系人不存在

### 6.6 删除通知联系人

```
DELETE /settings/contacts/{id}
```

删除通知联系人。

**路径参数**:
- `id`: 联系人ID

**响应** (204 No Content)

**错误情况**:
- `403 Forbidden`: 无权删除联系人
- `404 Not Found`: 联系人不存在

### 6.7 获取用户界面设置

```
GET /settings/ui
```

获取用户界面个性化设置。

**响应** (200 OK):

```json
{
  "data": {
    "theme": {
      "mode": "light", // 或 "dark", "system"
      "primaryColor": "#0099FF",
      "radius": "medium", // 或 "small", "large"
      "animations": true
    },
    "dashboard": {
      "layout": "standard", // 或 "compact", "expanded"
      "defaultView": "monitoring",
      "widgets": [
        {
          "id": "system-status",
          "position": 1,
          "enabled": true
        },
        {
          "id": "critical-parameters",
          "position": 2,
          "enabled": true
        },
        {
          "id": "recent-alerts",
          "position": 3,
          "enabled": true
        },
        {
          "id": "trend-chart",
          "position": 4,
          "enabled": true
        }
      ]
    },
    "tables": {
      "rowsPerPage": 20,
      "denseView": false,
      "showGridLines": true,
      "animateChanges": true
    },
    "charts": {
      "defaultColorScheme": "blue",
      "showLegend": true,
      "showGrid": true,
      "animations": true,
      "tooltips": true
    },
    "maps": {
      "defaultZoom": 14,
      "showLabels": true,
      "clusterMarkers": true
    }
  }
}
```

### 6.8 更新用户界面设置

```
PUT /settings/ui
```

更新用户界面个性化设置。

**请求体**:

```json
{
  "theme": {
    "mode": "dark",
    "primaryColor": "#00CCFF"
  },
  "dashboard": {
    "widgets": [
      {
        "id": "system-status",
        "position": 2
      },
      {
        "id": "critical-parameters",
        "position": 1
      }
    ]
  },
  "tables": {
    "rowsPerPage": 50,
    "denseView": true
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "updated": {
      "theme.mode": "dark",
      "theme.primaryColor": "#00CCFF",
      "dashboard.widgets[0].position": 2,
      "dashboard.widgets[1].position": 1,
      "tables.rowsPerPage": 50,
      "tables.denseView": true
    },
    "timestamp": "2023-05-21T18:15:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新设置

## 7. API扩展与长尾问题解决方案

### 7.1 API版本兼容性

为保证API的向下兼容性及未来扩展，所有API实现应遵循以下原则：

1. **字段添加兼容性**：新API版本可以添加新字段，但不应删除或修改现有字段的数据类型
2. **参数扩展性**：查询参数应支持多种过滤和排序选项，即使当前版本未使用
3. **分页一致性**：所有列表API应支持相同的分页机制
4. **错误处理标准化**：使用一致的错误响应格式

### 7.2 未来扩展考虑

以下API领域已预留用于未来扩展：

1. **机器学习分析API**：`/ai/predictions`、`/ai/anomalies`、`/ai/recommendations`
2. **高级报告引擎API**：`/reports/templates`、`/reports/generate`、`/reports/schedule`
3. **数据集成API**：`/integrations/*`，用于连接第三方数据源
4. **实时警报管理API**：`/alerts/*`，用于警报规则配置和通知管理
5. **IoT设备直接管理API**：`/devices/*`，用于直接管理探头硬件

### 7.3 长尾问题解决方案

以下机制用于解决API可能遇到的长尾问题：

1. **批量操作**：所有资源类型都支持批量操作端点（`/batch`），减少网络请求
2. **增量同步**：支持通过`If-Modified-Since`头和`ETag`实现数据增量同步
3. **资源部分更新**：支持通过PATCH方法进行部分资源更新
4. **查询复杂度管理**：复杂查询使用`/query`子资源，支持POST提交复杂过滤条件
5. **大数据集处理**：对于大型数据集，支持通过分页、游标或流式传输进行高效处理
6. **WebSocket实时更新**：时序数据支持WebSocket实时更新（`wss://api.hydrogem.cn/v1/live`）

### 7.4 API演进策略

API随时间演进的策略如下：

1. **兼容性期限**：API版本保证至少36个月的兼容性支持
2. **弃用通知**：任何API变更均提前至少6个月通知，并在响应头中标记弃用信息
3. **版本共存**：新旧API版本将共存，允许客户端平滑迁移
4. **功能标志**：实验性功能通过`X-Feature-Flags`请求头启用，允许早期访问
5. **端点重定向**：重命名的端点将使用HTTP 301重定向到新位置
6. **文档版本控制**：所有API规范文档均使用git版本控制，确保历史版本可访问 

## 8. 报警与通知API

### 8.1 获取报警列表

```
GET /alerts
```

获取系统报警列表。

**请求参数**:
- `status` (查询参数, 可选): 按状态筛选，如"active"、"acknowledged"、"resolved"
- `level` (查询参数, 可选): 按级别筛选，如"critical"、"warning"、"info"
- `source` (查询参数, 可选): 按来源筛选，如"probe"、"system"、"manual"
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `startTime` (查询参数, 可选): 开始时间，ISO8601格式
- `endTime` (查询参数, 可选): 结束时间，ISO8601格式
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `sort` (查询参数, 可选): 排序字段，默认"createdAt"
- `order` (查询参数, 可选): 排序方向，"asc"或"desc"，默认"desc"

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "a001",
      "title": "pH值超出阈值",
      "message": "南湖-1号探头 pH值为9.2，超出警告阈值(9.0)",
      "level": "warning",
      "status": "active",
      "source": "probe",
      "sourceId": "p001",
      "sourceName": "南湖-1号探头",
      "metricId": "ph",
      "metricName": "pH值",
      "value": 9.2,
      "threshold": 9.0,
      "createdAt": "2023-05-21T10:15:00Z",
      "updatedAt": "2023-05-21T10:15:00Z",
      "acknowledgedAt": null,
      "acknowledgedBy": null,
      "resolvedAt": null,
      "resolvedBy": null,
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      },
      "area": {
        "id": "a001",
        "name": "南湖区域"
      }
    },
    {
      "id": "a002",
      "title": "溶解氧低于阈值",
      "message": "南湖-2号探头 溶解氧为2.8 mg/L，低于临界阈值(3.0 mg/L)",
      "level": "critical",
      "status": "acknowledged",
      "source": "probe",
      "sourceId": "p002",
      "sourceName": "南湖-2号探头",
      "metricId": "dissolved_oxygen",
      "metricName": "溶解氧",
      "value": 2.8,
      "threshold": 3.0,
      "createdAt": "2023-05-21T09:30:00Z",
      "updatedAt": "2023-05-21T09:45:00Z",
      "acknowledgedAt": "2023-05-21T09:45:00Z",
      "acknowledgedBy": {
        "id": "u123456",
        "name": "张三"
      },
      "resolvedAt": null,
      "resolvedBy": null,
      "site": {
        "id": "s001",
        "name": "南湖监测站"
      },
      "area": {
        "id": "a001",
        "name": "南湖区域"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1,
    "summary": {
      "active": 1,
      "acknowledged": 1,
      "resolved": 0,
      "critical": 1,
      "warning": 1,
      "info": 0
    }
  }
}
```

### 8.2 获取报警详情

```
GET /alerts/{id}
```

获取单个报警的详细信息。

**路径参数**:
- `id`: 报警ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "a001",
    "title": "pH值超出阈值",
    "message": "南湖-1号探头 pH值为9.2，超出警告阈值(9.0)",
    "level": "warning",
    "status": "active",
    "source": "probe",
    "sourceId": "p001",
    "sourceName": "南湖-1号探头",
    "metricId": "ph",
    "metricName": "pH值",
    "value": 9.2,
    "threshold": 9.0,
    "createdAt": "2023-05-21T10:15:00Z",
    "updatedAt": "2023-05-21T10:15:00Z",
    "acknowledgedAt": null,
    "acknowledgedBy": null,
    "resolvedAt": null,
    "resolvedBy": null,
    "site": {
      "id": "s001",
      "name": "南湖监测站"
    },
    "area": {
      "id": "a001",
      "name": "南湖区域"
    },
    "relatedMeasurement": {
      "id": "m123456",
      "timestamp": "2023-05-21T10:15:00Z",
      "values": {
        "ph": 9.2,
        "temperature": 23.5,
        "dissolved_oxygen": 7.8
      }
    },
    "timeline": [
      {
        "timestamp": "2023-05-21T10:15:00Z",
        "event": "created",
        "message": "系统自动创建报警",
        "user": null
      }
    ],
    "notifications": [
      {
        "type": "email",
        "recipients": ["admin@example.com", "operator@example.com"],
        "sentAt": "2023-05-21T10:15:05Z",
        "status": "delivered"
      },
      {
        "type": "sms",
        "recipients": ["+8613800138000"],
        "sentAt": "2023-05-21T10:15:10Z",
        "status": "delivered"
      }
    ]
  }
}
```

**错误情况**:
- `404 Not Found`: 报警不存在

### 8.3 确认报警

```
POST /alerts/{id}/acknowledge
```

确认报警，表示已知晓并正在处理。

**路径参数**:
- `id`: 报警ID

**请求体**:

```json
{
  "note": "已安排技术人员检查探头校准情况"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "a001",
    "status": "acknowledged",
    "acknowledgedAt": "2023-05-21T10:30:00Z",
    "acknowledgedBy": {
      "id": "u123456",
      "name": "张三"
    },
    "note": "已安排技术人员检查探头校准情况"
  }
}
```

**错误情况**:
- `404 Not Found`: 报警不存在
- `409 Conflict`: 报警已被确认或已解决

### 8.4 解决报警

```
POST /alerts/{id}/resolve
```

将报警标记为已解决。

**路径参数**:
- `id`: 报警ID

**请求体**:

```json
{
  "resolution": "已重新校准pH探头，读数恢复正常",
  "preventiveMeasures": "增加定期校准频率"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "a001",
    "status": "resolved",
    "resolvedAt": "2023-05-21T11:15:00Z",
    "resolvedBy": {
      "id": "u123456",
      "name": "张三"
    },
    "resolution": "已重新校准pH探头，读数恢复正常",
    "preventiveMeasures": "增加定期校准频率"
  }
}
```

**错误情况**:
- `404 Not Found`: 报警不存在
- `409 Conflict`: 报警已解决

### 8.5 添加报警评论

```
POST /alerts/{id}/comments
```

为报警添加评论或处理记录。

**路径参数**:
- `id`: 报警ID

**请求体**:

```json
{
  "content": "已联系设备厂商，预计明天到场检修",
  "visibility": "internal" // 或 "public"
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "c001",
    "alertId": "a001",
    "content": "已联系设备厂商，预计明天到场检修",
    "visibility": "internal",
    "createdAt": "2023-05-21T10:45:00Z",
    "createdBy": {
      "id": "u123456",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `404 Not Found`: 报警不存在

### 8.6 获取报警评论列表

```
GET /alerts/{id}/comments
```

获取报警的评论列表。

**路径参数**:
- `id`: 报警ID

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "c001",
      "alertId": "a001",
      "content": "已联系设备厂商，预计明天到场检修",
      "visibility": "internal",
      "createdAt": "2023-05-21T10:45:00Z",
      "createdBy": {
        "id": "u123456",
        "name": "张三"
      }
    },
    {
      "id": "c002",
      "alertId": "a001",
      "content": "厂商确认将于明天上午10点到场",
      "visibility": "internal",
      "createdAt": "2023-05-21T14:30:00Z",
      "createdBy": {
        "id": "u123457",
        "name": "李四"
      }
    }
  ]
}
```

### 8.7 创建手动报警

```
POST /alerts
```

手动创建新的报警。

**请求体**:

```json
{
  "title": "设备维护通知",
  "message": "南湖监测站将于明天进行设备维护，数据可能暂时不可用",
  "level": "info",
  "source": "manual",
  "sourceId": "s001",
  "sourceName": "南湖监测站",
  "notifyUsers": ["u123456", "u123457"],
  "notifyRoles": ["admin", "operator"],
  "scheduledAt": "2023-05-22T09:00:00Z",
  "expiresAt": "2023-05-22T17:00:00Z"
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "a003",
    "title": "设备维护通知",
    "message": "南湖监测站将于明天进行设备维护，数据可能暂时不可用",
    "level": "info",
    "status": "scheduled",
    "source": "manual",
    "sourceId": "s001",
    "sourceName": "南湖监测站",
    "createdAt": "2023-05-21T15:00:00Z",
    "createdBy": {
      "id": "u123456",
      "name": "张三"
    },
    "scheduledAt": "2023-05-22T09:00:00Z",
    "expiresAt": "2023-05-22T17:00:00Z",
    "notificationStatus": "pending"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建报警

### 8.8 获取报警统计

```
GET /alerts/statistics
```

获取报警统计信息。

**请求参数**:
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `groupBy` (查询参数, 可选): 分组方式，"day"、"week"、"month"，默认"day"

**响应** (200 OK):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-04-21T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "total": {
      "count": 45,
      "byLevel": {
        "critical": 8,
        "warning": 25,
        "info": 12
      },
      "byStatus": {
        "active": 5,
        "acknowledged": 10,
        "resolved": 30
      },
      "bySource": {
        "probe": 35,
        "system": 5,
        "manual": 5
      }
    },
    "trend": [
      {
        "date": "2023-04-21",
        "count": 2,
        "byLevel": {
          "critical": 0,
          "warning": 2,
          "info": 0
        }
      },
      // ... 更多日期数据
      {
        "date": "2023-05-21",
        "count": 3,
        "byLevel": {
          "critical": 1,
          "warning": 1,
          "info": 1
        }
      }
    ],
    "topSources": [
      {
        "sourceId": "p001",
        "sourceName": "南湖-1号探头",
        "count": 12
      },
      {
        "sourceId": "p002",
        "sourceName": "南湖-2号探头",
        "count": 8
      }
    ],
    "topMetrics": [
      {
        "metricId": "ph",
        "metricName": "pH值",
        "count": 15
      },
      {
        "metricId": "dissolved_oxygen",
        "metricName": "溶解氧",
        "count": 10
      }
    ],
    "responseTime": {
      "averageAcknowledgeTime": 1800, // 秒
      "averageResolveTime": 14400, // 秒
      "byLevel": {
        "critical": {
          "averageAcknowledgeTime": 900,
          "averageResolveTime": 7200
        },
        "warning": {
          "averageAcknowledgeTime": 3600,
          "averageResolveTime": 21600
        }
      }
    }
  }
}
```

### 8.9 获取通知规则列表

```
GET /alerts/rules
```

获取报警通知规则列表。

**请求参数**:
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "r001",
      "name": "pH值临界报警",
      "description": "pH值超出临界阈值时通知所有管理员",
      "conditions": {
        "level": ["critical"],
        "metricIds": ["ph"],
        "sourceTypes": ["probe"]
      },
      "actions": {
        "notifyRoles": ["admin"],
        "notifyUsers": [],
        "channels": ["email", "sms", "push"],
        "escalateAfter": 1800, // 秒，30分钟后升级
        "escalateTo": ["u123456"] // 特定用户ID
      },
      "enabled": true,
      "createdAt": "2023-03-15T08:30:00Z",
      "updatedAt": "2023-04-10T14:15:00Z"
    },
    {
      "id": "r002",
      "name": "常规水质报警",
      "description": "常规水质指标报警通知运维人员",
      "conditions": {
        "level": ["warning"],
        "metricIds": ["ph", "dissolved_oxygen", "turbidity", "conductivity"],
        "sourceTypes": ["probe"]
      },
      "actions": {
        "notifyRoles": ["operator"],
        "notifyUsers": [],
        "channels": ["email", "push"],
        "escalateAfter": 7200, // 秒，2小时后升级
        "escalateTo": ["u123457"] // 特定用户ID
      },
      "enabled": true,
      "createdAt": "2023-03-15T08:35:00Z",
      "updatedAt": "2023-03-15T08:35:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### 8.10 创建通知规则

```
POST /alerts/rules
```

创建新的报警通知规则。

**请求体**:

```json
{
  "name": "重金属超标报警",
  "description": "重金属指标超标时立即通知管理员和水质专家",
  "conditions": {
    "level": ["critical", "warning"],
    "metricIds": ["mercury", "lead", "cadmium", "arsenic"],
    "sourceTypes": ["probe"]
  },
  "actions": {
    "notifyRoles": ["admin"],
    "notifyUsers": ["u123458"], // 水质专家用户ID
    "channels": ["email", "sms", "push"],
    "escalateAfter": 900, // 秒，15分钟后升级
    "escalateTo": ["u123456"] // 特定用户ID
  },
  "enabled": true
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "r003",
    "name": "重金属超标报警",
    "description": "重金属指标超标时立即通知管理员和水质专家",
    "conditions": {
      "level": ["critical", "warning"],
      "metricIds": ["mercury", "lead", "cadmium", "arsenic"],
      "sourceTypes": ["probe"]
    },
    "actions": {
      "notifyRoles": ["admin"],
      "notifyUsers": ["u123458"],
      "channels": ["email", "sms", "push"],
      "escalateAfter": 900,
      "escalateTo": ["u123456"]
    },
    "enabled": true,
    "createdAt": "2023-05-21T15:30:00Z",
    "updatedAt": "2023-05-21T15:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建通知规则

### 8.11 更新通知规则

```
PUT /alerts/rules/{id}
```

更新现有的报警通知规则。

**路径参数**:
- `id`: 规则ID

**请求体**:

```json
{
  "actions": {
    "notifyRoles": ["admin", "manager"],
    "channels": ["email", "sms", "push"],
    "escalateAfter": 1800
  },
  "enabled": true
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "r003",
    "name": "重金属超标报警",
    "description": "重金属指标超标时立即通知管理员和水质专家",
    "conditions": {
      "level": ["critical", "warning"],
      "metricIds": ["mercury", "lead", "cadmium", "arsenic"],
      "sourceTypes": ["probe"]
    },
    "actions": {
      "notifyRoles": ["admin", "manager"],
      "notifyUsers": ["u123458"],
      "channels": ["email", "sms", "push"],
      "escalateAfter": 1800,
      "escalateTo": ["u123456"]
    },
    "enabled": true,
    "createdAt": "2023-05-21T15:30:00Z",
    "updatedAt": "2023-05-21T16:00:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新通知规则
- `404 Not Found`: 规则不存在

### 8.12 删除通知规则

```
DELETE /alerts/rules/{id}
```

删除报警通知规则。

**路径参数**:
- `id`: 规则ID

**响应** (204 No Content)

**错误情况**:
- `403 Forbidden`: 无权删除通知规则
- `404 Not Found`: 规则不存在

### 8.13 测试通知规则

```
POST /alerts/rules/{id}/test
```

测试报警通知规则，发送测试通知。

**路径参数**:
- `id`: 规则ID

**请求体**:

```json
{
  "recipients": ["u123456"], // 可选，指定测试接收者
  "channels": ["email"] // 可选，指定测试渠道
}
```

**响应** (200 OK):

```json
{
  "data": {
    "success": true,
    "testId": "t001",
    "sentTo": [
      {
        "userId": "u123456",
        "name": "张三",
        "channels": ["email"],
        "status": "sent"
      }
    ],
    "timestamp": "2023-05-21T16:15:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权测试通知规则
- `404 Not Found`: 规则不存在

## 9. 站点和区域管理API

### 9.1 获取区域列表

```
GET /areas
```

获取当前租户下的所有区域。

**请求参数**:
- `status` (查询参数, 可选): 按状态筛选，如"active"、"inactive"
- `search` (查询参数, 可选): 搜索关键词，匹配区域名称或描述
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `sort` (查询参数, 可选): 排序字段，默认"name"
- `order` (查询参数, 可选): 排序方向，"asc"或"desc"，默认"asc"

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "a001",
      "name": "南湖区域",
      "description": "南湖及周边水域",
      "status": "active",
      "geoJson": {
        "type": "Polygon",
        "coordinates": [
          [
            [120.1, 30.2],
            [120.2, 30.2],
            [120.2, 30.3],
            [120.1, 30.3],
            [120.1, 30.2]
          ]
        ]
      },
      "center": {
        "longitude": 120.15,
        "latitude": 30.25
      },
      "siteCount": 3,
      "probeCount": 8,
      "createdAt": "2023-01-15T08:30:00Z",
      "updatedAt": "2023-03-10T14:15:00Z"
    },
    {
      "id": "a002",
      "name": "西湖区域",
      "description": "西湖及周边水域",
      "status": "active",
      "geoJson": {
        "type": "Polygon",
        "coordinates": [
          [
            [120.0, 30.2],
            [120.1, 30.2],
            [120.1, 30.3],
            [120.0, 30.3],
            [120.0, 30.2]
          ]
        ]
      },
      "center": {
        "longitude": 120.05,
        "latitude": 30.25
      },
      "siteCount": 5,
      "probeCount": 12,
      "createdAt": "2023-01-15T08:35:00Z",
      "updatedAt": "2023-01-15T08:35:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### 9.2 创建区域

```
POST /areas
```

创建新的区域。

**请求体**:

```json
{
  "name": "钱塘江区域",
  "description": "钱塘江流域监测区域",
  "geoJson": {
    "type": "Polygon",
    "coordinates": [
      [
        [120.2, 30.2],
        [120.3, 30.2],
        [120.3, 30.3],
        [120.2, 30.3],
        [120.2, 30.2]
      ]
    ]
  },
  "center": {
    "longitude": 120.25,
    "latitude": 30.25
  },
  "status": "active"
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "a003",
    "name": "钱塘江区域",
    "description": "钱塘江流域监测区域",
    "status": "active",
    "geoJson": {
      "type": "Polygon",
      "coordinates": [
        [
          [120.2, 30.2],
          [120.3, 30.2],
          [120.3, 30.3],
          [120.2, 30.3],
          [120.2, 30.2]
        ]
      ]
    },
    "center": {
      "longitude": 120.25,
      "latitude": 30.25
    },
    "siteCount": 0,
    "probeCount": 0,
    "createdAt": "2023-05-21T16:30:00Z",
    "updatedAt": "2023-05-21T16:30:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建区域

### 9.3 获取区域详情

```
GET /areas/{id}
```

获取单个区域的详细信息。

**路径参数**:
- `id`: 区域ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "a001",
    "name": "南湖区域",
    "description": "南湖及周边水域",
    "status": "active",
    "geoJson": {
      "type": "Polygon",
      "coordinates": [
        [
          [120.1, 30.2],
          [120.2, 30.2],
          [120.2, 30.3],
          [120.1, 30.3],
          [120.1, 30.2]
        ]
      ]
    },
    "center": {
      "longitude": 120.15,
      "latitude": 30.25
    },
    "siteCount": 3,
    "probeCount": 8,
    "createdAt": "2023-01-15T08:30:00Z",
    "updatedAt": "2023-03-10T14:15:00Z",
    "sites": [
      {
        "id": "s001",
        "name": "南湖监测站",
        "status": "active",
        "probeCount": 5
      },
      {
        "id": "s002",
        "name": "南湖东岸监测站",
        "status": "active",
        "probeCount": 2
      },
      {
        "id": "s003",
        "name": "南湖西岸监测站",
        "status": "active",
        "probeCount": 1
      }
    ],
    "metrics": {
      "summary": {
        "ph": {
          "min": 6.8,
          "max": 8.2,
          "avg": 7.5,
          "latest": 7.6
        },
        "dissolved_oxygen": {
          "min": 4.5,
          "max": 9.2,
          "avg": 7.8,
          "latest": 8.1
        }
      },
      "lastUpdated": "2023-05-21T16:00:00Z"
    }
  }
}
```

**错误情况**:
- `404 Not Found`: 区域不存在

### 9.4 更新区域

```
PUT /areas/{id}
```

更新区域信息。

**路径参数**:
- `id`: 区域ID

**请求体**:

```json
{
  "name": "南湖生态区",
  "description": "南湖生态保护监测区域",
  "status": "active"
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "a001",
    "name": "南湖生态区",
    "description": "南湖生态保护监测区域",
    "status": "active",
    "updatedAt": "2023-05-21T16:45:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新区域
- `404 Not Found`: 区域不存在

### 9.5 删除区域

```
DELETE /areas/{id}
```

删除区域。

**路径参数**:
- `id`: 区域ID

**请求体**:

```json
{
  "confirmation": true,
  "transferSitesTo": "a002" // 可选，将该区域的站点转移到指定区域
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权删除区域
- `404 Not Found`: 区域不存在
- `409 Conflict`: 区域包含站点且未指定转移目标

### 9.6 获取站点列表

```
GET /sites
```

获取当前租户下的所有监测站点。

**请求参数**:
- `areaId` (查询参数, 可选): 按区域ID筛选
- `status` (查询参数, 可选): 按状态筛选，如"active"、"inactive"、"maintenance"
- `search` (查询参数, 可选): 搜索关键词，匹配站点名称或描述
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20
- `sort` (查询参数, 可选): 排序字段，默认"name"
- `order` (查询参数, 可选): 排序方向，"asc"或"desc"，默认"asc"

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "s001",
      "name": "南湖监测站",
      "description": "南湖中心监测站",
      "status": "active",
      "type": "floating",
      "location": {
        "longitude": 120.15,
        "latitude": 30.25
      },
      "address": "浙江省杭州市南湖中心",
      "area": {
        "id": "a001",
        "name": "南湖区域"
      },
      "probeCount": 5,
      "lastMaintenance": "2023-04-15T10:00:00Z",
      "nextMaintenance": "2023-07-15T10:00:00Z",
      "createdAt": "2023-01-20T08:30:00Z",
      "updatedAt": "2023-04-15T14:15:00Z"
    },
    {
      "id": "s002",
      "name": "南湖东岸监测站",
      "description": "南湖东岸固定监测站",
      "status": "active",
      "type": "fixed",
      "location": {
        "longitude": 120.16,
        "latitude": 30.25
      },
      "address": "浙江省杭州市南湖东岸",
      "area": {
        "id": "a001",
        "name": "南湖区域"
      },
      "probeCount": 2,
      "lastMaintenance": "2023-04-20T10:00:00Z",
      "nextMaintenance": "2023-07-20T10:00:00Z",
      "createdAt": "2023-01-20T09:30:00Z",
      "updatedAt": "2023-04-20T14:15:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### 9.7 创建站点

```
POST /sites
```

创建新的监测站点。

**请求体**:

```json
{
  "name": "西湖北岸监测站",
  "description": "西湖北岸固定监测站",
  "type": "fixed",
  "location": {
    "longitude": 120.05,
    "latitude": 30.26
  },
  "address": "浙江省杭州市西湖北岸",
  "areaId": "a002",
  "status": "active",
  "maintenanceSchedule": {
    "frequency": "quarterly",
    "nextDate": "2023-08-15T10:00:00Z"
  },
  "contactInfo": {
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  }
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "s005",
    "name": "西湖北岸监测站",
    "description": "西湖北岸固定监测站",
    "status": "active",
    "type": "fixed",
    "location": {
      "longitude": 120.05,
      "latitude": 30.26
    },
    "address": "浙江省杭州市西湖北岸",
    "area": {
      "id": "a002",
      "name": "西湖区域"
    },
    "probeCount": 0,
    "maintenanceSchedule": {
      "frequency": "quarterly",
      "nextDate": "2023-08-15T10:00:00Z"
    },
    "contactInfo": {
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com"
    },
    "createdAt": "2023-05-21T17:00:00Z",
    "updatedAt": "2023-05-21T17:00:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建站点
- `404 Not Found`: 指定的区域不存在

### 9.8 获取站点详情

```
GET /sites/{id}
```

获取单个站点的详细信息。

**路径参数**:
- `id`: 站点ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "s001",
    "name": "南湖监测站",
    "description": "南湖中心监测站",
    "status": "active",
    "type": "floating",
    "location": {
      "longitude": 120.15,
      "latitude": 30.25
    },
    "address": "浙江省杭州市南湖中心",
    "area": {
      "id": "a001",
      "name": "南湖区域"
    },
    "probeCount": 5,
    "maintenanceSchedule": {
      "frequency": "quarterly",
      "lastDate": "2023-04-15T10:00:00Z",
      "nextDate": "2023-07-15T10:00:00Z"
    },
    "contactInfo": {
      "name": "李四",
      "phone": "13900139000",
      "email": "lisi@example.com"
    },
    "createdAt": "2023-01-20T08:30:00Z",
    "updatedAt": "2023-04-15T14:15:00Z",
    "probes": [
      {
        "id": "p001",
        "name": "南湖-1号探头",
        "type": "multi-parameter",
        "status": "active"
      },
      {
        "id": "p002",
        "name": "南湖-2号探头",
        "type": "dissolved-oxygen",
        "status": "active"
      }
    ],
    "metrics": {
      "summary": {
        "ph": {
          "min": 7.0,
          "max": 8.0,
          "avg": 7.5,
          "latest": 7.6
        },
        "dissolved_oxygen": {
          "min": 5.5,
          "max": 8.2,
          "avg": 7.2,
          "latest": 7.5
        }
      },
      "lastUpdated": "2023-05-21T16:30:00Z"
    },
    "maintenanceHistory": [
      {
        "date": "2023-04-15T10:00:00Z",
        "type": "regular",
        "technician": "张三",
        "notes": "常规维护，更换电池"
      },
      {
        "date": "2023-01-15T10:00:00Z",
        "type": "regular",
        "technician": "张三",
        "notes": "常规维护，校准探头"
      }
    ]
  }
}
```

**错误情况**:
- `404 Not Found`: 站点不存在

### 9.9 更新站点

```
PUT /sites/{id}
```

更新站点信息。

**路径参数**:
- `id`: 站点ID

**请求体**:

```json
{
  "name": "南湖中心监测站",
  "description": "南湖中心浮动监测站，全参数监测",
  "status": "maintenance",
  "maintenanceSchedule": {
    "nextDate": "2023-07-20T10:00:00Z"
  },
  "contactInfo": {
    "name": "王五",
    "phone": "13700137000",
    "email": "wangwu@example.com"
  }
}
```

**响应** (200 OK):

```json
{
  "data": {
    "id": "s001",
    "name": "南湖中心监测站",
    "description": "南湖中心浮动监测站，全参数监测",
    "status": "maintenance",
    "maintenanceSchedule": {
      "nextDate": "2023-07-20T10:00:00Z"
    },
    "contactInfo": {
      "name": "王五",
      "phone": "13700137000",
      "email": "wangwu@example.com"
    },
    "updatedAt": "2023-05-21T17:15:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权更新站点
- `404 Not Found`: 站点不存在

### 9.10 删除站点

```
DELETE /sites/{id}
```

删除站点。

**路径参数**:
- `id`: 站点ID

**请求体**:

```json
{
  "confirmation": true,
  "transferProbesTo": "s002" // 可选，将该站点的探头转移到指定站点
}
```

**响应** (204 No Content)

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权删除站点
- `404 Not Found`: 站点不存在
- `409 Conflict`: 站点包含探头且未指定转移目标

### 9.11 记录站点维护

```
POST /sites/{id}/maintenance
```

记录站点维护操作。

**路径参数**:
- `id`: 站点ID

**请求体**:

```json
{
  "date": "2023-05-21T10:00:00Z",
  "type": "regular",
  "technician": "张三",
  "notes": "常规维护，清洁设备外壳，检查电源",
  "nextMaintenanceDate": "2023-08-21T10:00:00Z",
  "partsReplaced": [
    {
      "name": "电池",
      "serialNumber": "BAT-12345",
      "manufacturer": "电池厂商"
    }
  ]
}
```

**响应** (201 Created):

```json
{
  "data": {
    "id": "m001",
    "siteId": "s001",
    "date": "2023-05-21T10:00:00Z",
    "type": "regular",
    "technician": "张三",
    "notes": "常规维护，清洁设备外壳，检查电源",
    "nextMaintenanceDate": "2023-08-21T10:00:00Z",
    "partsReplaced": [
      {
        "name": "电池",
        "serialNumber": "BAT-12345",
        "manufacturer": "电池厂商"
      }
    ],
    "createdAt": "2023-05-21T17:30:00Z",
    "createdBy": {
      "id": "u123456",
      "name": "李四"
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权记录站点维护
- `404 Not Found`: 站点不存在

### 9.12 获取站点维护历史

```
GET /sites/{id}/maintenance
```

获取站点的维护历史记录。

**路径参数**:
- `id`: 站点ID

**请求参数**:
- `startDate` (查询参数, 可选): 开始日期，ISO8601格式
- `endDate` (查询参数, 可选): 结束日期，ISO8601格式
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "m001",
      "siteId": "s001",
      "date": "2023-05-21T10:00:00Z",
      "type": "regular",
      "technician": "张三",
      "notes": "常规维护，清洁设备外壳，检查电源",
      "nextMaintenanceDate": "2023-08-21T10:00:00Z",
      "partsReplaced": [
        {
          "name": "电池",
          "serialNumber": "BAT-12345",
          "manufacturer": "电池厂商"
        }
      ],
      "createdAt": "2023-05-21T17:30:00Z",
      "createdBy": {
        "id": "u123456",
        "name": "李四"
      }
    },
    {
      "id": "m002",
      "siteId": "s001",
      "date": "2023-04-15T10:00:00Z",
      "type": "regular",
      "technician": "张三",
      "notes": "常规维护，更换电池",
      "nextMaintenanceDate": "2023-07-15T10:00:00Z",
      "partsReplaced": [],
      "createdAt": "2023-04-15T14:15:00Z",
      "createdBy": {
        "id": "u123456",
        "name": "李四"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

**错误情况**:
- `404 Not Found`: 站点不存在

### 9.13 获取站点类型

```
GET /sites/types
```

获取系统支持的站点类型列表。

**响应** (200 OK):

```json
{
  "data": [
    {
      "code": "fixed",
      "name": "固定站点",
      "description": "固定在特定位置的监测站点"
    },
    {
      "code": "floating",
      "name": "浮动站点",
      "description": "浮动在水面上的监测站点"
    },
    {
      "code": "mobile",
      "name": "移动站点",
      "description": "可移动的监测站点"
    },
    {
      "code": "underwater",
      "name": "水下站点",
      "description": "安装在水下的监测站点"
    }
  ]
}
```

## 10. 数据分析和报表API

### 10.1 获取数据概览

```
GET /analytics/overview
```

获取系统数据概览，包括关键指标统计、探头状态分布等。

**请求参数**:
- `timeRange` (查询参数, 可选): 时间范围，如"today"、"week"、"month"、"year"，默认"today"
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `metrics` (查询参数, 可选): 指标代码列表，逗号分隔

**响应** (200 OK):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-05-21T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "probeStatus": {
      "total": 25,
      "active": 22,
      "maintenance": 2,
      "offline": 1
    },
    "measurementStats": {
      "total": 28800,
      "validCount": 28750,
      "invalidCount": 50
    },
    "alertStats": {
      "total": 5,
      "critical": 1,
      "warning": 3,
      "info": 1
    },
    "keyMetrics": [
      {
        "id": "ph",
        "name": "pH值",
        "unit": "",
        "min": 6.8,
        "max": 8.2,
        "avg": 7.5,
        "latest": 7.6,
        "trend": "stable",
        "standardRange": {
          "min": 6.5,
          "max": 8.5
        }
      },
      {
        "id": "dissolved_oxygen",
        "name": "溶解氧",
        "unit": "mg/L",
        "min": 4.5,
        "max": 9.2,
        "avg": 7.8,
        "latest": 8.1,
        "trend": "increasing",
        "standardRange": {
          "min": 5.0,
          "max": null
        }
      }
    ],
    "lastUpdated": "2023-05-21T17:45:00Z"
  }
}
```

### 10.2 获取时间序列数据

```
GET /analytics/timeseries
```

获取指定指标的时间序列数据。

**请求参数**:
- `metrics` (查询参数, 必选): 指标代码列表，逗号分隔
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `interval` (查询参数, 可选): 数据聚合间隔，如"5m"、"1h"、"1d"，默认根据时间范围自动选择
- `aggregation` (查询参数, 可选): 聚合方式，如"avg"、"min"、"max"，默认"avg"

**响应** (200 OK):

```json
{
  "data": {
    "timeRange": {
      "start": "2023-05-20T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "interval": "1h",
    "aggregation": "avg",
    "series": [
      {
        "metricId": "ph",
        "metricName": "pH值",
        "unit": "",
        "data": [
          {
            "timestamp": "2023-05-20T00:00:00Z",
            "value": 7.4,
            "min": 7.3,
            "max": 7.5,
            "count": 12
          },
          {
            "timestamp": "2023-05-20T01:00:00Z",
            "value": 7.5,
            "min": 7.4,
            "max": 7.6,
            "count": 12
          }
          // ... 更多时间点数据
        ]
      },
      {
        "metricId": "dissolved_oxygen",
        "metricName": "溶解氧",
        "unit": "mg/L",
        "data": [
          {
            "timestamp": "2023-05-20T00:00:00Z",
            "value": 7.8,
            "min": 7.5,
            "max": 8.1,
            "count": 12
          },
          {
            "timestamp": "2023-05-20T01:00:00Z",
            "value": 7.9,
            "min": 7.6,
            "max": 8.2,
            "count": 12
          }
          // ... 更多时间点数据
        ]
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败，如缺少必要参数或时间范围过大

### 10.3 获取热力图数据

```
GET /analytics/heatmap
```

获取用于生成热力图的空间分布数据。

**请求参数**:
- `metricId` (查询参数, 必选): 指标代码
- `areaId` (查询参数, 可选): 区域ID
- `timestamp` (查询参数, 可选): 时间点，ISO8601格式，默认为最新数据时间
- `resolution` (查询参数, 可选): 热力图分辨率，如"low"、"medium"、"high"，默认"medium"

**响应** (200 OK):

```json
{
  "data": {
    "metricId": "ph",
    "metricName": "pH值",
    "unit": "",
    "timestamp": "2023-05-21T17:00:00Z",
    "resolution": "medium",
    "bounds": {
      "north": 30.3,
      "south": 30.2,
      "east": 120.2,
      "west": 120.0
    },
    "points": [
      {
        "latitude": 30.25,
        "longitude": 120.15,
        "value": 7.6,
        "probeId": "p001",
        "siteName": "南湖监测站"
      },
      {
        "latitude": 30.25,
        "longitude": 120.16,
        "value": 7.5,
        "probeId": "p003",
        "siteName": "南湖东岸监测站"
      }
      // ... 更多点位数据
    ],
    "interpolatedGrid": [
      {
        "latitude": 30.25,
        "longitude": 120.15,
        "value": 7.6
      },
      {
        "latitude": 30.25,
        "longitude": 120.155,
        "value": 7.55
      }
      // ... 更多插值网格数据
    ],
    "colorScale": {
      "min": 6.5,
      "max": 8.5,
      "stops": [
        {
          "value": 6.5,
          "color": "#ff0000"
        },
        {
          "value": 7.5,
          "color": "#00ff00"
        },
        {
          "value": 8.5,
          "color": "#0000ff"
        }
      ]
    }
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `404 Not Found`: 指定的指标或区域不存在

### 10.4 获取统计分析数据

```
GET /analytics/statistics
```

获取指定指标的统计分析数据。

**请求参数**:
- `metricId` (查询参数, 必选): 指标代码
- `probeIds` (查询参数, 可选): 探头ID列表，逗号分隔
- `siteIds` (查询参数, 可选): 站点ID列表，逗号分隔
- `areaIds` (查询参数, 可选): 区域ID列表，逗号分隔
- `startTime` (查询参数, 必选): 开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 结束时间，ISO8601格式
- `groupBy` (查询参数, 可选): 分组方式，如"hour"、"day"、"week"、"month"，默认不分组

**响应** (200 OK):

```json
{
  "data": {
    "metricId": "ph",
    "metricName": "pH值",
    "unit": "",
    "timeRange": {
      "start": "2023-04-21T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "overall": {
      "count": 8640,
      "min": 6.8,
      "max": 8.2,
      "avg": 7.5,
      "median": 7.5,
      "stdDev": 0.3,
      "percentiles": {
        "p10": 7.1,
        "p25": 7.3,
        "p75": 7.7,
        "p90": 7.9
      }
    },
    "distribution": {
      "buckets": [
        {
          "min": 6.5,
          "max": 6.7,
          "count": 0
        },
        {
          "min": 6.7,
          "max": 6.9,
          "count": 120
        }
        // ... 更多分布区间
      ]
    },
    "byGroup": [
      {
        "name": "2023-04-21",
        "count": 288,
        "min": 7.0,
        "max": 7.8,
        "avg": 7.4
      },
      {
        "name": "2023-04-22",
        "count": 288,
        "min": 7.1,
        "max": 7.9,
        "avg": 7.5
      }
      // ... 更多分组数据
    ],
    "correlation": [
      {
        "metricId": "temperature",
        "metricName": "水温",
        "coefficient": 0.65,
        "significance": "high"
      },
      {
        "metricId": "dissolved_oxygen",
        "metricName": "溶解氧",
        "coefficient": -0.48,
        "significance": "medium"
      }
    ],
    "anomalies": [
      {
        "timestamp": "2023-05-10T14:30:00Z",
        "value": 8.2,
        "deviation": 2.33,
        "probeId": "p001",
        "siteName": "南湖监测站"
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `404 Not Found`: 指定的指标不存在

### 10.5 获取报表列表

```
GET /reports
```

获取已生成的报表列表。

**请求参数**:
- `type` (查询参数, 可选): 报表类型，如"daily"、"weekly"、"monthly"、"custom"
- `status` (查询参数, 可选): 报表状态，如"generating"、"completed"、"failed"
- `startDate` (查询参数, 可选): 开始日期，ISO8601格式
- `endDate` (查询参数, 可选): 结束日期，ISO8601格式
- `page` (查询参数, 可选): 页码，默认1
- `limit` (查询参数, 可选): 每页记录数，默认20

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "r001",
      "name": "南湖区域5月日报",
      "type": "daily",
      "format": "pdf",
      "status": "completed",
      "createdAt": "2023-05-21T00:05:00Z",
      "completedAt": "2023-05-21T00:07:30Z",
      "fileSize": 1245678,
      "url": "https://api.hydrogem.cn/v1/reports/r001/download",
      "parameters": {
        "areaIds": ["a001"],
        "date": "2023-05-20",
        "metrics": ["ph", "dissolved_oxygen", "temperature"]
      },
      "createdBy": {
        "id": "u123456",
        "name": "张三"
      }
    },
    {
      "id": "r002",
      "name": "西湖区域水质周报",
      "type": "weekly",
      "format": "pdf",
      "status": "generating",
      "createdAt": "2023-05-21T08:00:00Z",
      "completedAt": null,
      "fileSize": null,
      "url": null,
      "parameters": {
        "areaIds": ["a002"],
        "startDate": "2023-05-14",
        "endDate": "2023-05-20",
        "metrics": ["ph", "dissolved_oxygen", "temperature", "turbidity"]
      },
      "createdBy": {
        "id": "u123457",
        "name": "李四"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### 10.6 创建报表

```
POST /reports
```

创建新的报表生成任务。

**请求体**:

```json
{
  "name": "钱塘江区域水质月报",
  "type": "monthly",
  "format": "pdf",
  "parameters": {
    "areaIds": ["a003"],
    "month": "2023-05",
    "metrics": ["ph", "dissolved_oxygen", "temperature", "turbidity", "conductivity"],
    "includeCharts": true,
    "includeStatistics": true,
    "includeAnomalies": true,
    "template": "standard"
  },
  "schedule": {
    "enabled": true,
    "frequency": "monthly",
    "dayOfMonth": 1,
    "time": "01:00:00"
  },
  "notification": {
    "enabled": true,
    "recipients": ["u123456", "u123457"],
    "channels": ["email"]
  }
}
```

**响应** (202 Accepted):

```json
{
  "data": {
    "id": "r003",
    "name": "钱塘江区域水质月报",
    "type": "monthly",
    "format": "pdf",
    "status": "queued",
    "createdAt": "2023-05-21T18:00:00Z",
    "parameters": {
      "areaIds": ["a003"],
      "month": "2023-05",
      "metrics": ["ph", "dissolved_oxygen", "temperature", "turbidity", "conductivity"],
      "includeCharts": true,
      "includeStatistics": true,
      "includeAnomalies": true,
      "template": "standard"
    },
    "schedule": {
      "enabled": true,
      "frequency": "monthly",
      "dayOfMonth": 1,
      "time": "01:00:00"
    },
    "notification": {
      "enabled": true,
      "recipients": ["u123456", "u123457"],
      "channels": ["email"]
    },
    "estimatedCompletionTime": "2023-05-21T18:05:00Z"
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `403 Forbidden`: 无权创建报表

### 10.7 获取报表详情

```
GET /reports/{id}
```

获取单个报表的详细信息。

**路径参数**:
- `id`: 报表ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "r001",
    "name": "南湖区域5月日报",
    "type": "daily",
    "format": "pdf",
    "status": "completed",
    "createdAt": "2023-05-21T00:05:00Z",
    "queuedAt": "2023-05-21T00:05:00Z",
    "startedAt": "2023-05-21T00:05:10Z",
    "completedAt": "2023-05-21T00:07:30Z",
    "fileSize": 1245678,
    "pageCount": 15,
    "url": "https://api.hydrogem.cn/v1/reports/r001/download",
    "thumbnailUrl": "https://api.hydrogem.cn/v1/reports/r001/thumbnail",
    "parameters": {
      "areaIds": ["a001"],
      "date": "2023-05-20",
      "metrics": ["ph", "dissolved_oxygen", "temperature"]
    },
    "createdBy": {
      "id": "u123456",
      "name": "张三"
    },
    "schedule": {
      "enabled": true,
      "frequency": "daily",
      "time": "00:05:00"
    },
    "notification": {
      "enabled": true,
      "recipients": ["u123456"],
      "channels": ["email"]
    },
    "sections": [
      {
        "title": "概述",
        "pageNumber": 1
      },
      {
        "title": "水质指标分析",
        "pageNumber": 2
      },
      {
        "title": "pH值分析",
        "pageNumber": 5
      },
      {
        "title": "溶解氧分析",
        "pageNumber": 8
      },
      {
        "title": "水温分析",
        "pageNumber": 11
      },
      {
        "title": "结论与建议",
        "pageNumber": 14
      }
    ]
  }
}
```

**错误情况**:
- `404 Not Found`: 报表不存在

### 10.8 下载报表

```
GET /reports/{id}/download
```

下载报表文件。

**路径参数**:
- `id`: 报表ID

**响应**:
- 成功时返回文件流，Content-Type根据报表格式设置（如application/pdf）
- 失败时返回标准错误响应

**错误情况**:
- `404 Not Found`: 报表不存在
- `409 Conflict`: 报表尚未生成完成

### 10.9 取消报表生成

```
POST /reports/{id}/cancel
```

取消正在生成的报表任务。

**路径参数**:
- `id`: 报表ID

**响应** (200 OK):

```json
{
  "data": {
    "id": "r002",
    "status": "cancelled",
    "cancelledAt": "2023-05-21T18:15:00Z",
    "cancelledBy": {
      "id": "u123456",
      "name": "张三"
    }
  }
}
```

**错误情况**:
- `404 Not Found`: 报表不存在
- `409 Conflict`: 报表已完成或已取消，无法取消

### 10.10 删除报表

```
DELETE /reports/{id}
```

删除报表及其文件。

**路径参数**:
- `id`: 报表ID

**响应** (204 No Content)

**错误情况**:
- `403 Forbidden`: 无权删除报表
- `404 Not Found`: 报表不存在

### 10.11 获取报表模板列表

```
GET /reports/templates
```

获取可用的报表模板列表。

**响应** (200 OK):

```json
{
  "data": [
    {
      "id": "standard",
      "name": "标准模板",
      "description": "包含基本水质指标分析的标准报表模板",
      "supportedTypes": ["daily", "weekly", "monthly"],
      "supportedFormats": ["pdf", "docx"],
      "thumbnailUrl": "https://api.hydrogem.cn/v1/reports/templates/standard/thumbnail",
      "sections": [
        {
          "id": "overview",
          "name": "概述",
          "required": true
        },
        {
          "id": "metrics_analysis",
          "name": "水质指标分析",
          "required": true
        },
        {
          "id": "anomalies",
          "name": "异常情况分析",
          "required": false
        },
        {
          "id": "conclusion",
          "name": "结论与建议",
          "required": true
        }
      ]
    },
    {
      "id": "comprehensive",
      "name": "综合分析模板",
      "description": "包含详细水质分析和趋势预测的综合报表模板",
      "supportedTypes": ["weekly", "monthly", "custom"],
      "supportedFormats": ["pdf", "docx", "pptx"],
      "thumbnailUrl": "https://api.hydrogem.cn/v1/reports/templates/comprehensive/thumbnail",
      "sections": [
        {
          "id": "executive_summary",
          "name": "管理摘要",
          "required": true
        },
        {
          "id": "overview",
          "name": "概述",
          "required": true
        },
        {
          "id": "metrics_analysis",
          "name": "水质指标分析",
          "required": true
        },
        {
          "id": "trend_analysis",
          "name": "趋势分析",
          "required": true
        },
        {
          "id": "anomalies",
          "name": "异常情况分析",
          "required": true
        },
        {
          "id": "correlation_analysis",
          "name": "相关性分析",
          "required": false
        },
        {
          "id": "prediction",
          "name": "预测分析",
          "required": false
        },
        {
          "id": "conclusion",
          "name": "结论与建议",
          "required": true
        },
        {
          "id": "appendix",
          "name": "附录",
          "required": false
        }
      ]
    }
  ]
}
```

### 10.12 获取预测分析数据

```
GET /analytics/prediction
```

获取基于历史数据的预测分析结果。

**请求参数**:
- `metricId` (查询参数, 必选): 指标代码
- `probeId` (查询参数, 可选): 探头ID
- `siteId` (查询参数, 可选): 站点ID
- `areaId` (查询参数, 可选): 区域ID
- `startTime` (查询参数, 必选): 预测开始时间，ISO8601格式
- `endTime` (查询参数, 必选): 预测结束时间，ISO8601格式
- `interval` (查询参数, 可选): 预测数据间隔，如"1h"、"1d"，默认"1h"
- `model` (查询参数, 可选): 预测模型，如"arima"、"prophet"、"lstm"，默认"auto"
- `confidenceLevel` (查询参数, 可选): 置信区间级别，如0.8、0.9、0.95，默认0.9

**响应** (200 OK):

```json
{
  "data": {
    "metricId": "ph",
    "metricName": "pH值",
    "unit": "",
    "predictionRange": {
      "start": "2023-05-22T00:00:00Z",
      "end": "2023-05-29T23:59:59Z"
    },
    "trainingRange": {
      "start": "2023-04-22T00:00:00Z",
      "end": "2023-05-21T23:59:59Z"
    },
    "interval": "1h",
    "model": "prophet",
    "confidenceLevel": 0.9,
    "predictions": [
      {
        "timestamp": "2023-05-22T00:00:00Z",
        "value": 7.6,
        "lowerBound": 7.4,
        "upperBound": 7.8
      },
      {
        "timestamp": "2023-05-22T01:00:00Z",
        "value": 7.5,
        "lowerBound": 7.3,
        "upperBound": 7.7
      }
      // ... 更多预测数据点
    ],
    "accuracy": {
      "mape": 2.5,
      "rmse": 0.15,
      "mae": 0.12
    },
    "factors": [
      {
        "name": "temperature",
        "importance": 0.65
      },
      {
        "name": "rainfall",
        "importance": 0.25
      },
      {
        "name": "season",
        "importance": 0.1
      }
    ],
    "anomalyProbability": 0.05,
    "trendDirection": "stable",
    "seasonalPatterns": [
      {
        "name": "daily",
        "strength": 0.7
      },
      {
        "name": "weekly",
        "strength": 0.3
      }
    ]
  }
}
```

**错误情况**:
- `400 Bad Request`: 请求参数验证失败
- `404 Not Found`: 指定的指标或探头不存在
- `422 Unprocessable Entity`: 数据不足以进行预测分析

## 11. API版本控制与变更管理

### 11.1 版本控制策略

HydroGem API采用以下版本控制策略：

1. **主版本号**：在URL路径中指定，如`/v1/`、`/v2/`等。主版本号的变更表示不向后兼容的API变更。
2. **次版本号**：在响应头中指定，如`X-API-Version: 1.2`。次版本号的变更表示向后兼容的功能增强。
3. **补丁版本号**：仅在内部文档中跟踪，表示bug修复和小改进。

### 11.2 API生命周期

API版本的生命周期管理：

1. **开发阶段**：API版本处于开发中，可能会有频繁变更，仅在开发环境可用。
2. **预览阶段**：API版本基本稳定，在测试环境可用，可能会有小的调整。
3. **正式发布**：API版本稳定，在生产环境可用，遵循向后兼容原则。
4. **弃用通知**：当新版本发布后，旧版本进入弃用期，通过响应头`X-API-Deprecated: true`和`X-API-Deprecated-Date: YYYY-MM-DD`通知用户。
5. **停用**：弃用期结束后，旧版本将被停用，请求将返回410 Gone状态码。

### 11.3 变更通知

API变更通知渠道：

1. **开发者门户**：所有API变更将在开发者门户上公布。
2. **邮件通知**：重要变更将通过邮件通知已注册的开发者。
3. **响应头**：通过`X-API-Changes-URL`响应头提供变更详情链接。

### 11.4 变更历史

#### v1.0.0 (2023-06-01)

- 初始版本发布
- 包含用户认证、租户管理、探头管理、测量数据、指标管理、系统设置、报警与通知、站点和区域管理、数据分析和报表等核心功能

#### v1.1.0 (计划中)

- 增强数据分析功能，支持更多统计方法和可视化选项
- 增加批量操作API，提高大规模数据处理效率
- 优化报警规则配置，支持更复杂的条件组合

#### v2.0.0 (规划中)

- 重构认证系统，支持OAuth 2.1和FIDO2
- 增加实时数据推送API，基于WebSocket协议
- 增强机器学习模型API，支持自定义模型训练和部署

## 12. 附录

### 12.1 状态码汇总

| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 200 OK | 请求成功 | GET请求成功返回数据 |
| 201 Created | 资源创建成功 | POST请求成功创建资源 |
| 202 Accepted | 请求已接受，但处理尚未完成 | 异步处理任务已接受 |
| 204 No Content | 请求成功，无返回内容 | DELETE请求成功 |
| 400 Bad Request | 请求参数错误或不完整 | 请求参数验证失败 |
| 401 Unauthorized | 未认证或认证失败 | 缺少或无效的访问令牌 |
| 403 Forbidden | 权限不足 | 用户无权访问请求的资源 |
| 404 Not Found | 资源不存在 | 请求的资源不存在 |
| 409 Conflict | 请求冲突 | 资源已存在或状态冲突 |
| 422 Unprocessable Entity | 请求格式正确但语义错误 | 数据验证失败 |
| 429 Too Many Requests | 请求频率超限 | 超过API调用限制 |
| 500 Internal Server Error | 服务器内部错误 | 服务器异常 |
| 503 Service Unavailable | 服务不可用 | 服务器维护或过载 |

### 12.2 常见错误码

| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| AUTH_INVALID_CREDENTIALS | 无效的认证凭据 | 401 |
| AUTH_TOKEN_EXPIRED | 访问令牌已过期 | 401 |
| AUTH_INSUFFICIENT_PERMISSIONS | 权限不足 | 403 |
| RESOURCE_NOT_FOUND | 资源不存在 | 404 |
| VALIDATION_ERROR | 请求参数验证失败 | 400 |
| DUPLICATE_ENTITY | 实体已存在 | 409 |
| RATE_LIMIT_EXCEEDED | 超过API调用限制 | 429 |
| INTERNAL_ERROR | 服务器内部错误 | 500 |
| SERVICE_UNAVAILABLE | 服务暂时不可用 | 503 |
| TENANT_NOT_FOUND | 租户不存在 | 404 |
| PROBE_OFFLINE | 探头离线 | 422 |
| DATA_PROCESSING_ERROR | 数据处理错误 | 422 |

### 12.3 API限流策略

HydroGem API采用以下限流策略：

1. **基础限制**：每个API密钥每分钟100个请求
2. **突发限制**：允许短时间内突发请求，但不超过每秒10个请求
3. **高级用户**：根据订阅计划提供更高的限制
4. **批量操作**：批量API端点有单独的限制策略

限流信息通过以下响应头返回：
- `X-Rate-Limit-Limit`: 在当前时间窗口内允许的请求数
- `X-Rate-Limit-Remaining`: 在当前时间窗口内剩余的请求数
- `X-Rate-Limit-Reset`: 当前时间窗口重置的时间（Unix时间戳）

### 12.4 API安全最佳实践

使用HydroGem API时的安全建议：

1. **保护API密钥**：不要在客户端代码中硬编码API密钥，使用环境变量或安全的密钥管理服务
2. **使用HTTPS**：始终通过HTTPS发送请求，确保数据传输安全
3. **最小权限原则**：为API密钥分配最小必要的权限
4. **实现重试机制**：使用指数退避策略处理临时错误
5. **验证响应**：始终验证API响应的完整性和有效性
6. **监控异常**：监控API调用中的异常模式，可能表示安全问题
7. **定期轮换密钥**：定期更新API密钥，减少凭据泄露的风险

### 12.5 支持与反馈

如需技术支持或提供API反馈：

- **开发者社区**：[https://community.hydrogem.tech](https://community.hydrogem.tech)
- **支持邮箱**：[support@hydrogem.tech](mailto:support@hydrogem.tech)
- **功能请求**：[https://feedback.hydrogem.tech](https://feedback.hydrogem.tech)

---

**文档最后更新时间**：2025-03-12