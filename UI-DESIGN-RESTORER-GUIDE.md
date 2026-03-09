# UI Design Restorer - 完整使用指南

## 📖 概述

UI Design Restorer 是一个强大的前端设计还原辅助工具，它可以帮助你：

- 从设计图中自动提取设计规格（颜色、字体、间距、阴影等）
- 生成符合设计规范的 Tailwind CSS 配置
- 自动生成 React 组件代码
- 导出设计系统文档和 TypeScript 类型定义
- 提供设计token计算和转换工具

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 基本用法

```bash
# 分析设计图
node ui-design-restorer.js analyze overview.png

# 提取设计tokens并生成配置文件
node ui-design-restorer.js extract overview.png -d ./design-system

# 生成特定组件
node ui-design-restorer.js generate overview.png --component=button --name=MyButton

# 查看所有设计tokens
node ui-design-restorer.js tokens overview.png
```

## 📋 命令详解

### 1. analyze - 分析设计图

```bash
node ui-design-restorer.js analyze <imagePath> [options]
```

**选项：**
- `-o, --output <path>` - 将分析结果保存到JSON文件

**示例：**
```bash
# 输出到控制台
node ui-design-restorer.js analyze overview.png

# 保存到文件
node ui-design-restorer.js analyze overview.png -o design-spec.json
```

**输出内容：**
```json
{
  "colors": {
    "primary": { "main": "#06b6d4", ... },
    "secondary": { ... },
    ...
  },
  "typography": { ... },
  "spacing": { ... },
  "borderRadius": { ... },
  "shadows": { ... },
  "components": { ... }
}
```

### 2. extract - 提取设计tokens

```bash
node ui-design-restorer.js extract <imagePath> [options]
```

**选项：**
- `-d, --dir <path>` - 输出目录（默认：./design-system）

**示例：**
```bash
# 使用默认输出目录
node ui-design-restorer.js extract overview.png

# 指定输出目录
node ui-design-restorer.js extract overview.png -d ./src/design-system
```

**生成的文件：**
```
design-system/
├── tailwind.config.js    # Tailwind CSS 配置
├── globals.css           # CSS 变量
└── design-system.types.ts # TypeScript 类型定义
```

### 3. generate - 生成组件代码

```bash
node ui-design-restorer.js generate <imagePath> [options]
```

**选项：**
- `-c, --component <type>` - 组件类型（button|card|input）
- `-n, --name <name>` - 组件名称
- `-o, --output <path>` - 输出文件路径

**示例：**
```bash
# 生成按钮组件
node ui-design-restorer.js generate overview.png --component=button --name=Button

# 生成卡片组件并保存
node ui-design-restorer.js generate overview.png --component=card --name=Card -o components/Card.tsx

# 生成输入框组件
node ui-design-restorer.js generate overview.png --component=input --name=Input
```

### 4. tokens - 查看设计tokens

```bash
node ui-design-restorer.js tokens <imagePath>
```

**示例：**
```bash
node ui-design-restorer.js tokens overview.png
```

**输出内容：**
- 🎨 颜色系统
- 📏 间距系统
- 🔤 字体系统
- 📦 组件规格

## 🎨 设计规格说明

### 颜色系统

工具会自动提取以下颜色类别：

```javascript
{
  primary: { main, light, dark, contrast },
  secondary: { main, light, dark },
  background: { default, paper, dark, darker },
  text: { primary, secondary, disabled, inverse },
  border: { default, light, dark },
  functional: { success, warning, error, info }
}
```

### 字体系统

```javascript
{
  fontFamily: { sans, mono },
  fontSize: { xs, sm, base, lg, xl, '2xl', '3xl', '4xl' },
  fontWeight: { normal, medium, semibold, bold },
  letterSpacing: { tighter, tight, normal, wide, wider }
}
```

### 间距系统

```javascript
{
  spacing: { 0-24 },    // 基于 4px 网格
  gap: { xs, sm, md, lg, xl }
}
```

### 组件规格

每个组件包含：
- 基础样式（padding, height, borderRadius等）
- 变体（不同尺寸和状态）
- 交互状态（hover, active, focus, disabled）

## 🔧 高级用法

### 作为模块使用

```javascript
const { DesignSpecExtractor, CodeGenerator, DesignUtils } = require('./ui-design-restorer');

// 提取设计规格
const spec = await DesignSpecExtractor.extractFullSpec('overview.png');

// 生成Tailwind配置
const tailwindConfig = CodeGenerator.generateTailwindConfig(spec);

// 生成组件
const buttonCode = CodeGenerator.generateComponent('Button', 'button', spec);

// 使用工具函数
const contrast = DesignUtils.calculateContrast('#ffffff', '#000000');
```

### 自定义组件生成

```javascript
// 扩展代码生成器
class CustomCodeGenerator extends CodeGenerator {
  static generateCustomComponent(name, spec) {
    // 你的自定义组件生成逻辑
    return `// 自定义组件代码`;
  }
}
```

### 颜色工具

```javascript
// 转换颜色格式
const rgb = DesignUtils.hexToRgb('#06b6d4');
const hex = DesignUtils.rgbToHex(6, 182, 212);

// 生成颜色渐变
const scale = DesignUtils.generateColorScale('#06b6d4', 10);

// 计算对比度
const contrast = DesignUtils.calculateContrast('#06b6d4', '#ffffff');
```

## 📁 项目集成

### 与 Next.js 项目集成

1. 提取设计系统：
```bash
node ui-design-restorer.js extract overview.png -d ./src/design-system
```

2. 复制配置文件：
```bash
cp design-system/tailwind.config.js ./tailwind.config.js
cp design-system/globals.css ./src/app/globals.css
```

3. 生成组件：
```bash
node ui-design-restorer.js generate overview.png --component=button -o src/components/ui/button.tsx
```

### 与 Vite + React 项目集成

1. 同样的提取步骤
2. 将 CSS 变量添加到 `src/index.css`
3. 将组件添加到 `src/components` 目录

## 🎯 最佳实践

1. **批量处理多个设计图**
```bash
for file in designs/*.png; do
  node ui-design-restorer.js analyze "$file" -o "specs/$(basename $file .png).json"
done
```

2. **版本控制设计规格**
```bash
# 将设计规格提交到git
git add design-spec.json
git commit -m "Update design specifications"
```

3. **持续更新设计系统**
```bash
# 当设计更新时，重新提取
node ui-design-restorer.js extract new-design.png -d ./design-system
```

## 🔍 故障排除

### 问题：无法识别某些颜色
- 确保图片清晰度足够
- 检查图片格式是否支持（PNG、JPG）
- 尝试提高图片对比度

### 问题：生成的代码需要调整
- 工具生成的是基础代码
- 根据实际需求进行微调
- 使用生成的代码作为起点

### 问题：TypeScript 类型错误
- 确保已安装相关类型定义
- 检查 tsconfig.json 配置
- 根据需要调整类型定义

## 📚 扩展阅读

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [React 官方文档](https://react.dev/)
- [设计系统最佳实践](https://www.designsystems.com/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**提示：** 这个工具是辅助工具，生成的代码应该作为起点，根据实际项目需求进行调整和优化。
