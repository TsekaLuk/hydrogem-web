FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装依赖阶段
FROM base AS deps
# 复制package.json和package-lock.json
COPY package.json package-lock.json ./
# 安装依赖
RUN npm ci --legacy-peer-deps

# 构建阶段
FROM base AS builder
WORKDIR /app
# 从deps阶段复制node_modules
COPY --from=deps /app/node_modules ./node_modules
# 复制所有源代码
COPY . .
# 构建应用
RUN npm run build

# 开发阶段镜像
FROM base AS development
WORKDIR /app
# 复制package.json和package-lock.json
COPY package.json package-lock.json ./
# 从deps阶段复制node_modules
COPY --from=deps /app/node_modules ./node_modules
# 复制所有源代码
COPY . .
# 开发服务器端口
EXPOSE 5174
# 启动开发服务器
CMD ["npm", "run", "dev"]

# 生产阶段镜像
FROM nginx:alpine AS production
# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
