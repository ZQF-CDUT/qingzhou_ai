#!/usr/bin/env node

/**
 * UI Design Restorer - 使用示例
 *
 * 这个脚本展示了如何使用 UI Design Restorer 工具的各种功能
 */

const { DesignSpecExtractor, CodeGenerator, DesignUtils } = require('./ui-design-restorer');
const fs = require('fs');
const path = require('path');

// ==================== 示例 1: 基础分析 ====================

async function example1_BasicAnalysis() {
  console.log('\n=== 示例 1: 基础设计分析 ===\n');

  const imagePath = './overview.png';

  try {
    // 检查文件是否存在
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  图片文件不存在: ${imagePath}`);
      console.log('使用默认设计规格...\n');
    }

    // 提取完整的设计规格
    const spec = await DesignSpecExtractor.extractFullSpec(imagePath);

    // 打印颜色系统
    console.log('🎨 颜色系统:');
    console.log(JSON.stringify(spec.colors, null, 2));

    // 保存到文件
    const outputPath = './output/design-spec.json';
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    DesignUtils.exportToJSON(spec, outputPath);
    console.log(`\n✅ 设计规格已保存到: ${outputPath}\n`);

    return spec;
  } catch (error) {
    console.error('❌ 错误:', error.message);
    return null;
  }
}

// ==================== 示例 2: 生成配置文件 ====================

async function example2_GenerateConfigFiles(spec) {
  console.log('\n=== 示例 2: 生成配置文件 ===\n');

  if (!spec) {
    console.log('⚠️  没有设计规格，跳过此示例');
    return;
  }

  try {
    const outputDir = './output/design-system';
    fs.mkdirSync(outputDir, { recursive: true });

    // 生成 Tailwind 配置
    const tailwindConfig = CodeGenerator.generateTailwindConfig(spec);
    fs.writeFileSync(
      path.join(outputDir, 'tailwind.config.js'),
      tailwindConfig
    );
    console.log('✅ Tailwind 配置已生成');

    // 生成 CSS 变量
    const cssVars = CodeGenerator.generateCSSVariables(spec);
    fs.writeFileSync(
      path.join(outputDir, 'globals.css'),
      cssVars
    );
    console.log('✅ CSS 变量已生成');

    // 生成 TypeScript 类型
    const tsTypes = DesignUtils.exportToTSTypes(spec);
    fs.writeFileSync(
      path.join(outputDir, 'design-system.types.ts'),
      tsTypes
    );
    console.log('✅ TypeScript 类型已生成');

    console.log(`\n📁 所有配置文件已保存到: ${outputDir}\n`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// ==================== 示例 3: 生成组件 ====================

async function example3_GenerateComponents(spec) {
  console.log('\n=== 示例 3: 生成组件代码 ===\n');

  if (!spec) {
    console.log('⚠️  没有设计规格，跳过此示例');
    return;
  }

  try {
    const componentsDir = './output/components';
    fs.mkdirSync(componentsDir, { recursive: true });

    // 生成按钮组件
    console.log('🔘 生成按钮组件...');
    const buttonCode = CodeGenerator.generateComponent('Button', 'button', spec);
    fs.writeFileSync(
      path.join(componentsDir, 'Button.tsx'),
      buttonCode
    );
    console.log('✅ Button.tsx 已生成');

    // 生成卡片组件
    console.log('📦 生成卡片组件...');
    const cardCode = CodeGenerator.generateComponent('Card', 'card', spec);
    fs.writeFileSync(
      path.join(componentsDir, 'Card.tsx'),
      cardCode
    );
    console.log('✅ Card.tsx 已生成');

    // 生成输入框组件
    console.log('📝 生成输入框组件...');
    const inputCode = CodeGenerator.generateComponent('Input', 'input', spec);
    fs.writeFileSync(
      path.join(componentsDir, 'Input.tsx'),
      inputCode
    );
    console.log('✅ Input.tsx 已生成');

    console.log(`\n📁 所有组件已保存到: ${componentsDir}\n`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// ==================== 示例 4: 颜色工具 ====================

function example4_ColorTools(spec) {
  console.log('\n=== 示例 4: 颜色工具使用 ===\n');

  if (!spec) {
    console.log('⚠️  没有设计规格，使用默认颜色');
  }

  const primaryColor = spec?.colors?.primary?.main || '#06b6d4';
  const textColor = spec?.colors?.text?.primary || '#1e293b';

  // Hex 转 RGB
  console.log('🔄 颜色格式转换:');
  const rgb = DesignUtils.hexToRgb(primaryColor);
  console.log(`  ${primaryColor} -> RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`);

  // RGB 转 Hex
  const hex = DesignUtils.rgbToHex(6, 182, 212);
  console.log(`  RGB(6, 182, 212) -> ${hex}`);

  // 计算对比度
  console.log('\n📊 对比度计算:');
  const contrast = DesignUtils.calculateContrast(primaryColor, textColor);
  console.log(`  ${primaryColor} vs ${textColor}: ${contrast.toFixed(2)}:1`);
  if (contrast >= 4.5) {
    console.log('  ✅ 对比度符合 WCAG AA 标准');
  } else if (contrast >= 3) {
    console.log('  ⚠️  对比度符合 WCAG AA 大文本标准');
  } else {
    console.log('  ❌ 对比度不符合 WCAG 标准');
  }

  console.log('');
}

// ==================== 示例 5: 批量处理 ====================

async function example5_BatchProcessing() {
  console.log('\n=== 示例 5: 批量处理设计图 ===\n');

  try {
    // 假设有多个设计图
    const imageFiles = [
      './overview.png',
      // './dashboard.png',
      // './settings.png',
    ];

    console.log(`📁 发现 ${imageFiles.length} 个设计图\n`);

    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];

      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  跳过不存在的文件: ${imagePath}`);
        continue;
      }

      console.log(`[${i + 1}/${imageFiles.length}] 处理: ${imagePath}`);

      // 提取规格
      const spec = await DesignSpecExtractor.extractFullSpec(imagePath);

      // 保存规格
      const basename = path.basename(imagePath, path.extname(imagePath));
      const outputPath = `./output/specs/${basename}.json`;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      DesignUtils.exportToJSON(spec, outputPath);

      console.log(`  ✅ 已保存: ${outputPath}\n`);
    }

    console.log('✅ 批量处理完成\n');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// ==================== 示例 6: 生成完整页面 ====================

async function example6_GeneratePage(spec) {
  console.log('\n=== 示例 6: 生成完整页面示例 ===\n');

  if (!spec) {
    console.log('⚠️  没有设计规格，跳过此示例');
    return;
  }

  try {
    // 生成一个简单的登录页面示例
    const pageCode = `import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>输入您的账号信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">邮箱</label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">密码</label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">登录</Button>
        </CardContent>
      </Card>
    </div>
  );
}`;

    const outputPath = './output/pages/login.tsx';
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, pageCode);
    console.log(`✅ 登录页面已生成: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// ==================== 示例 7: 设计系统文档 ====================

async function example7_DesignSystemDoc(spec) {
  console.log('\n=== 示例 7: 生成设计系统文档 ===\n');

  if (!spec) {
    console.log('⚠️  没有设计规格，跳过此示例');
    return;
  }

  try {
    let doc = `# 设计系统文档

## 概述

本文档描述了从设计图中提取的设计系统规格。

## 颜色系统

### 主色调
- **Primary Main**: \`${spec.colors.primary.main}\`
- **Primary Light**: \`${spec.colors.primary.light || 'N/A'}\`
- **Primary Dark**: \`${spec.colors.primary.dark || 'N/A'}\`

### 辅助色
- **Secondary**: \`${spec.colors.secondary.main}\`

### 背景色
- **Default**: \`${spec.colors.background.main || '#f1f5f9'}\`
- **Paper**: \`${spec.colors.background.paper || '#ffffff'}\`
- **Dark**: \`${spec.colors.background.dark || '#1e293b'}\`

### 功能色
- **Success**: \`${spec.colors.functional.success}\`
- **Warning**: \`${spec.colors.functional.warning}\`
- **Error**: \`${spec.colors.functional.error}\`
- **Info**: \`${spec.colors.functional.info}\`

## 字体系统

### 字体家族
- **Sans**: ${spec.typography.fontFamily.sans.join(', ')}
- **Mono**: ${spec.typography.fontFamily.mono.join(', ')}

### 字体大小
`;

    Object.entries(spec.typography.fontSize).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        doc += `- **${name}**: ${value[0]} (line-height: ${value[1]?.lineHeight || 'normal'})\n`;
      }
    });

    doc += `
## 间距系统

### 基础间距
`;

    Object.entries(spec.spacing.spacing).forEach(([name, value]) => {
      if (name !== '0') {
        doc += `- **spacing-${name}**: ${value}\n`;
      }
    });

    doc += `
## 组件规格

### 按钮
- **默认高度**: ${spec.components.button.variants?.default?.height || '2.5rem'}
- **默认内边距**: ${spec.components.button.variants?.default?.padding || '0.5rem 1rem'}
- **圆角**: ${spec.components.button.variants?.default?.borderRadius || '0.375rem'}

### 卡片
- **内边距**: ${spec.components.card.padding || '1.5rem'}
- **圆角**: ${spec.components.card.borderRadius || '0.5rem'}
- **阴影**: ${spec.components.card.boxShadow || 'shadow-sm'}

### 输入框
- **高度**: ${spec.components.input.height || '2.5rem'}
- **内边距**: ${spec.components.input.padding || '0.5rem 0.75rem'}
- **边框**: ${spec.components.input.border || '1px solid #e2e8f0'}

---

*本文档由 UI Design Restorer 自动生成*
`;

    const outputPath = './output/DESIGN-SYSTEM.md';
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, doc);
    console.log(`✅ 设计系统文档已生成: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// ==================== 主函数 ====================

async function main() {
  console.log('\n🎨 UI Design Restorer - 使用示例\n');
  console.log('═══════════════════════════════════════════════\n');

  let spec = null;

  // 运行所有示例
  spec = await example1_BasicAnalysis();
  await example2_GenerateConfigFiles(spec);
  await example3_GenerateComponents(spec);
  example4_ColorTools(spec);
  await example5_BatchProcessing();
  await example6_GeneratePage(spec);
  await example7_DesignSystemDoc(spec);

  console.log('\n═══════════════════════════════════════════════');
  console.log('\n✅ 所有示例运行完成！\n');
  console.log('📁 查看输出目录: ./output/\n');
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  });
}

module.exports = {
  example1_BasicAnalysis,
  example2_GenerateConfigFiles,
  example3_GenerateComponents,
  example4_ColorTools,
  example5_BatchProcessing,
  example6_GeneratePage,
  example7_DesignSystemDoc,
};
