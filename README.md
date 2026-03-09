# Frame UI 展示页面 & Skills 工具集

## 📁 项目结构

```
09/
├── index.html              # Frame UI 展示页面
├── Frame.png/svg           # 原始设计文件
├── analyze.html            # 设计分析页面
├── skills/                 # Skills 工具集
│   ├── ui-design-restorer.js    # UI设计还原工具（JS版）
│   ├── ui-design-restorer.ts    # UI设计还原工具（TS版）
│   ├── example-usage.js         # 使用示例（7个示例）
│   ├── SKILL-SYSTEM-SUMMARY.md  # 技能系统总结
│   └── UI-DESIGN-RESTORER-GUIDE.md  # 完整使用指南
└── output/                 # 工具生成的输出目录
```

---

## 🚀 运行 index.html

### 方法 1: 使用 Python HTTP 服务器

```bash
# 在项目目录下运行
python3 -m http.server 8080

# 然后在浏览器打开
# http://localhost:8080/index.html
```

### 方法 2: 使用 Node.js HTTP 服务器

```bash
# 全局安装 http-server（如果没有安装）
npm install -g http-server

# 在项目目录下运行
http-server -p 8080

# 然后在浏览器打开
# http://localhost:8080/index.html
```

### 方法 3: 直接在浏览器打开

```bash
# 使用默认浏览器
xdg-open index.html    # Linux
open index.html        # macOS
start index.html       # Windows
```

---

## 🛠️ Skills 工具集使用

### UI Design Restorer - 前端设计还原辅助工具

这是一个强大的工具，可以从设计图中自动提取设计规格并生成前端代码。

#### 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 运行所有示例（推荐先运行这个）
node skills/example-usage.js

# 3. 查看生成的输出
ls output/
```

#### CLI 命令

```bash
# 分析设计图
node skills/ui-design-restorer.js analyze overview.png

# 提取设计tokens并生成配置文件
node skills/ui-design-restorer.js extract overview.png -d ./design-system

# 生成特定组件
node skills/ui-design-restorer.js generate overview.png --component=button -o Button.tsx

# 查看所有设计tokens
node skills/ui-design-restorer.js tokens overview.png
```

#### 功能特性

- ✅ 从设计图提取颜色、字体、间距、阴影等设计规格
- ✅ 生成 Tailwind CSS 配置文件
- ✅ 生成 CSS 变量定义
- ✅ 生成 TypeScript 类型定义
- ✅ 生成 React 组件代码（Button、Card、Input等）
- ✅ 颜色格式转换（Hex ↔ RGB）
- ✅ 对比度计算（符合 WCAG 标准）
- ✅ 批量处理多个设计图

#### 输出示例

运行 `node skills/example-usage.js` 后，会在 `output/` 目录生成：

```
output/
├── design-spec.json           # 完整设计规格
├── DESIGN-SYSTEM.md           # 设计系统文档
├── design-system/
│   ├── tailwind.config.js     # Tailwind配置
│   ├── globals.css            # CSS变量
│   └── design-system.types.ts # TS类型定义
├── components/
│   ├── Button.tsx             # 按钮组件
│   ├── Card.tsx               # 卡片组件
│   └── Input.tsx              # 输入框组件
└── pages/
    └── login.tsx              # 示例页面
```

#### 详细文档

查看 `skills/` 目录下的文档了解更多：

- `SKILL-SYSTEM-SUMMARY.md` - 技能系统概述
- `UI-DESIGN-RESTORER-GUIDE.md` - 完整使用指南
- `example-usage.js` - 7个实用示例

---

## 📄 index.html 说明

`index.html` 是一个基于 Frame.png 设计的 UI 展示页面，包含：

- 全屏深色渐变背景
- 5个信息区块，展示航向、航速、坐标、位置、通信状态
- 青色（#63FFFF）和绿色（#00FA00）的主题色
- 发光阴影效果

### 区块内容

| 区块 | 宽度 | 内容 |
|------|------|------|
| 区块1 | 200px | 航向 100° 艏向100° + 图标 |
| 区块2 | 139px | 航速 18km |
| 区块3 | 289px | E 116.397467.N 39.908739 |
| 区块4 | 159px | 湖北省武汉市 |
| 区块5 | 163px | 通信状态 正常 + 状态点 |

---

## 🔧 技术栈

- **HTML/CSS** - 页面实现
- **Node.js** - Skills工具运行环境
- **TypeScript** - 类型支持
- **Tailwind CSS** - 样式框架（Skills工具生成）

---

## 📝 注意事项

1. 首次使用需要运行 `npm install` 安装依赖
2. 生成的代码应该作为起点，根据实际需求调整
3. 设计图建议使用高清晰度的 PNG 格式
4. 确保端口 8080 未被占用

---

## 📞 支持

- 查看详细文档：`skills/UI-DESIGN-RESTORER-GUIDE.md`
- 运行示例：`node skills/example-usage.js`
- 检查输出：`ls output/`

---

**版本**: 1.0.0
**创建日期**: 2026-03-09
