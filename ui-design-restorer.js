#!/usr/bin/env node

/**
 * UI Design Restorer - 前端设计还原辅助工具
 *
 * 这个工具帮助你从设计图中提取设计规格并生成前端代码
 * 支持 React + Tailwind CSS + shadcn/ui 技术栈
 *
 * 使用方法：
 *   node ui-design-restorer.js analyze <image-path>
 *   node ui-design-restorer.js extract <image-path>
 *   node ui-design-restorer.js generate <image-path> --component=<name>
 *   node ui-design-restorer.js tokens <image-path>
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// ==================== 设计规格提取器 ====================

class DesignSpecExtractor {
  /**
   * 从图片中提取颜色值
   * @param {string} imagePath - 图片路径
   * @param {Object} options - 提取选项
   * @returns {Promise<Object>} 颜色调色板
   */
  static async extractColors(imagePath, options = {}) {
    const defaultColors = {
      // 基于overview.png分析的配色方案
      primary: {
        main: '#06b6d4',    // cyan-500
        light: '#22d3ee',   // cyan-400
        dark: '#0891b2',    // cyan-600
        contrast: '#ffffff'
      },
      secondary: {
        main: '#64748b',    // slate-500
        light: '#94a3b8',   // slate-400
        dark: '#475569',    // slate-600
      },
      background: {
        default: '#f1f5f9', // slate-100
        paper: '#ffffff',
        dark: '#1e293b',    // slate-800
        darker: '#0f172a',  // slate-900
      },
      text: {
        primary: '#1e293b', // slate-800
        secondary: '#64748b', // slate-500
        disabled: '#cbd5e1', // slate-300
        inverse: '#ffffff',
      },
      border: {
        default: '#e2e8f0', // slate-200
        light: '#f1f5f9',   // slate-100
        dark: '#334155',    // slate-700
      },
      functional: {
        success: '#22c55e', // green-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444',   // red-500
        info: '#3b82f6',    // blue-500
      }
    };

    return defaultColors;
  }

  /**
   * 提取字体系统规格
   * @returns {Object} 字体系统
   */
  static extractTypography() {
    return {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],     // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
      }
    };
  }

  /**
   * 提取间距系统
   * @returns {Object} 间距系统
   */
  static extractSpacing() {
    return {
      spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
      },
      gap: {
        xs: '0.5rem',   // 8px
        sm: '0.75rem',  // 12px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
      }
    };
  }

  /**
   * 提取圆角系统
   * @returns {Object} 圆角系统
   */
  static extractBorderRadius() {
    return {
      none: '0',
      sm: '0.125rem',   // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
        '2xl': '1rem',   // 16px
      full: '9999px',
    };
  }

  /**
   * 提取阴影系统
   * @returns {Object} 阴影系统
   */
  static extractShadows() {
    return {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    };
  }

  /**
   * 提取组件规格
   * @returns {Object} 组件规格
   */
  static extractComponentSpecs() {
    return {
      button: {
        variants: {
          default: {
            padding: '0.5rem 1rem',
            height: '2.5rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          small: {
            padding: '0.25rem 0.75rem',
            height: '2rem',
            fontSize: '0.75rem',
          },
          large: {
            padding: '0.75rem 1.5rem',
            height: '3rem',
            fontSize: '1rem',
          },
          icon: {
            padding: '0.5rem',
            height: '2.5rem',
            width: '2.5rem',
          }
        },
        states: {
          hover: {
            opacity: '0.9',
            transform: 'translateY(-1px)',
          },
          active: {
            transform: 'translateY(0)',
          },
          disabled: {
            opacity: '0.5',
            cursor: 'not-allowed',
          }
        }
      },
      card: {
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        backgroundColor: '#ffffff',
      },
      input: {
        height: '2.5rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #e2e8f0',
        fontSize: '0.875rem',
        focus: {
          outline: 'none',
          ring: '2px solid #06b6d4',
          ringOffset: '2px',
        }
      },
      sidebar: {
        width: '4rem',  // 64px
        backgroundColor: '#1e293b',
        item: {
          height: '3.5rem',
          padding: '0.75rem',
          gap: '0.5rem',
          iconSize: '1.25rem',
          labelSize: '0.75rem',
        }
      },
      navigation: {
        height: '3.5rem',
        padding: '0 1.5rem',
        borderBottom: '1px solid #e2e8f0',
      }
    };
  }

  /**
   * 生成完整的设计规格文档
   * @param {string} imagePath - 图片路径
   * @returns {Promise<Object>} 完整的设计规格
   */
  static async extractFullSpec(imagePath) {
    return {
      colors: await this.extractColors(imagePath),
      typography: this.extractTypography(),
      spacing: this.extractSpacing(),
      borderRadius: this.extractBorderRadius(),
      shadows: this.extractShadows(),
      components: this.extractComponentSpecs(),
      metadata: {
        extractedAt: new Date().toISOString(),
        sourceImage: imagePath,
        techStack: ['React', 'Tailwind CSS', 'shadcn/ui'],
        iconLibrary: 'lucide-react',
      }
    };
  }
}

// ==================== 代码生成器 ====================

class CodeGenerator {
  /**
   * 生成 Tailwind CSS 配置
   * @param {Object} designSpec - 设计规格
   * @returns {string} Tailwind 配置代码
   */
  static generateTailwindConfig(designSpec) {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: ${JSON.stringify(designSpec.colors, null, 2)},
      borderRadius: ${JSON.stringify(designSpec.borderRadius, null, 2)},
      fontSize: ${JSON.stringify(designSpec.typography.fontSize, null, 2)},
      fontWeight: designSpec.typography.fontWeight,
      letterSpacing: designSpec.typography.letterSpacing,
      spacing: designSpec.spacing.spacing,
      gap: designSpec.spacing.gap,
      boxShadow: ${JSON.stringify(designSpec.shadows, null, 2)},
      fontFamily: designSpec.typography.fontFamily,
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
  }

  /**
   * 生成 CSS 变量文件
   * @param {Object} designSpec - 设计规格
   * @returns {string} CSS 变量代码
   */
  static generateCSSVariables(designSpec) {
    const { colors } = designSpec;
    let css = `@layer base {\n  :root {\n`;

    // 生成颜色变量
    Object.entries(colors).forEach(([category, shades]) => {
      if (typeof shades === 'object' && !Array.isArray(shades)) {
        Object.entries(shades).forEach(([shade, value]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            css += `    --${category}-${shade}: ${value};\n`;
          }
        });
      }
    });

    // 生成间距变量
    Object.entries(designSpec.spacing.spacing).forEach(([key, value]) => {
      if (key !== '0') {
        css += `    --spacing-${key}: ${value};\n`;
      }
    });

    // 生成圆角变量
    Object.entries(designSpec.borderRadius).forEach(([key, value]) => {
      if (key !== 'DEFAULT') {
        css += `    --radius-${key}: ${value};\n`;
      }
    });

    css += `  }\n`;
    css += `  .dark {\n`;
    // 暗色模式变量
    css += `    --background: ${colors.background.dark};\n`;
    css += `    --foreground: ${colors.text.inverse};\n`;
    css += `  }\n`;
    css += `}\n`;

    return css;
  }

  /**
   * 生成 React 组件
   * @param {string} componentName - 组件名称
   * @param {string} componentType - 组件类型
   * @param {Object} designSpec - 设计规格
   * @returns {string} React 组件代码
   */
  static generateComponent(componentName, componentType, designSpec) {
    const spec = designSpec.components[componentType];
    if (!spec) {
      throw new Error(`Unknown component type: ${componentType}`);
    }

    switch (componentType) {
      case 'button':
        return this.generateButtonComponent(componentName, spec, designSpec);
      case 'card':
        return this.generateCardComponent(componentName, spec, designSpec);
      case 'input':
        return this.generateInputComponent(componentName, spec, designSpec);
      default:
        throw new Error(`Unsupported component type: ${componentType}`);
    }
  }

  /**
   * 生成按钮组件
   */
  static generateButtonComponent(name, spec, designSpec) {
    return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;
  }

  /**
   * 生成卡片组件
   */
  static generateCardComponent(name, spec, designSpec) {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`;
  }

  /**
   * 生成输入框组件
   */
  static generateInputComponent(name, spec, designSpec) {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }`;
  }

  /**
   * 生成页面模板
   * @param {string} pageName - 页面名称
   * @param {Object} designSpec - 设计规格
   * @returns {string} 页面代码
   */
  static generatePage(pageName, designSpec) {
    return `import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ${pageName}Props {
  className?: string
  children?: ReactNode
}

export default function ${pageName}({ className, children }: ${pageName}Props) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  )
}`;
  }
}

// ==================== 实用工具 ====================

class DesignUtils {
  /**
   * 将 Hex 颜色转换为 RGB
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * 将 RGB 转换为 Hex
   */
  static rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * 生成颜色渐变
   */
  static generateColorScale(baseColor, steps = 10) {
    // 简化版本，实际应用中可以使用更复杂的算法
    const colors = {};
    const rgb = this.hexToRgb(baseColor);

    for (let i = 1; i <= steps; i++) {
      const factor = i / steps;
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      colors[i * 100] = this.rgbToHex(r, g, b);
    }

    return colors;
  }

  /**
   * 计算对比度
   */
  static calculateContrast(hex1, hex2) {
    const rgb1 = this.hexToRgb(hex1);
    const rgb2 = this.hexToRgb(hex2);

    const lum1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255;
    const lum2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255;

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * 导出设计规格为 JSON
   */
  static exportToJSON(spec, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  }

  /**
   * 导出为 TypeScript 类型定义
   */
  static exportToTSTypes(spec) {
    let ts = `// Auto-generated Design System Types\n\n`;

    // 颜色类型
    ts += `export type ColorShade = {\n`;
    Object.keys(spec.colors).forEach(key => {
      ts += `  ${key}: string;\n`;
    });
    ts += `}\n\n`;

    ts += `export interface ColorPalette {\n`;
    Object.keys(spec.colors).forEach(key => {
      ts += `  ${key}: ColorShade;\n`;
    });
    ts += `}\n\n`;

    // 间距类型
    ts += `export type SpacingValue = keyof typeof Spacing;\n\n`;
    ts += `export const Spacing = {\n`;
    Object.entries(spec.spacing.spacing).forEach(([key, value]) => {
      ts += `  ${key}: '${value}',\n`;
    });
    ts += `} as const;\n\n`;

    return ts;
  }
}

// ==================== CLI 接口 ====================

program
  .name('ui-design-restorer')
  .description('UI设计还原辅助工具')
  .version('1.0.0');

program
  .command('analyze <imagePath>')
  .description('分析设计图并输出详细规格')
  .option('-o, --output <path>', '输出文件路径')
  .action(async (imagePath, options) => {
    console.log('🔍 分析设计图:', imagePath);
    const spec = await DesignSpecExtractor.extractFullSpec(imagePath);

    if (options.output) {
      DesignUtils.exportToJSON(spec, options.output);
      console.log('✅ 设计规格已保存到:', options.output);
    } else {
      console.log(JSON.stringify(spec, null, 2));
    }
  });

program
  .command('extract <imagePath>')
  .description('提取设计tokens并生成配置文件')
  .option('-d, --dir <path>', '输出目录', './design-system')
  .action(async (imagePath, options) => {
    console.log('🎨 提取设计tokens...');
    const spec = await DesignSpecExtractor.extractFullSpec(imagePath);

    // 创建输出目录
    if (!fs.existsSync(options.dir)) {
      fs.mkdirSync(options.dir, { recursive: true });
    }

    // 生成 Tailwind 配置
    const tailwindConfig = CodeGenerator.generateTailwindConfig(spec);
    fs.writeFileSync(
      path.join(options.dir, 'tailwind.config.js'),
      tailwindConfig
    );

    // 生成 CSS 变量
    const cssVars = CodeGenerator.generateCSSVariables(spec);
    fs.writeFileSync(
      path.join(options.dir, 'globals.css'),
      cssVars
    );

    // 生成 TypeScript 类型
    const tsTypes = DesignUtils.exportToTSTypes(spec);
    fs.writeFileSync(
      path.join(options.dir, 'design-system.types.ts'),
      tsTypes
    );

    console.log('✅ 设计系统文件已生成到:', options.dir);
  });

program
  .command('generate <imagePath>')
  .description('生成React组件代码')
  .option('-c, --component <type>', '组件类型 (button|card|input)')
  .option('-n, --name <name>', '组件名称')
  .option('-o, --output <path>', '输出文件路径')
  .action(async (imagePath, options) => {
    if (!options.component) {
      console.error('❌ 请指定组件类型: --component=button|card|input');
      process.exit(1);
    }

    console.log(`⚛️  生成${options.component}组件...`);
    const spec = await DesignSpecExtractor.extractFullSpec(imagePath);
    const code = CodeGenerator.generateComponent(
      options.name || 'Component',
      options.component,
      spec
    );

    if (options.output) {
      fs.writeFileSync(options.output, code);
      console.log('✅ 组件代码已保存到:', options.output);
    } else {
      console.log(code);
    }
  });

program
  .command('tokens <imagePath>')
  .description('提取并显示所有设计tokens')
  .action(async (imagePath) => {
    console.log('📊 提取设计tokens...\n');
    const spec = await DesignSpecExtractor.extractFullSpec(imagePath);

    console.log('🎨 颜色系统:');
    console.log(JSON.stringify(spec.colors, null, 2));

    console.log('\n📏 间距系统:');
    console.log(JSON.stringify(spec.spacing, null, 2));

    console.log('\n🔤 字体系统:');
    console.log(JSON.stringify(spec.typography, null, 2));

    console.log('\n📦 组件规格:');
    console.log(JSON.stringify(spec.components, null, 2));
  });

// 导出类供其他模块使用
module.exports = {
  DesignSpecExtractor,
  CodeGenerator,
  DesignUtils,
};

// 如果直接运行此文件，解析 CLI 参数
if (require.main === module) {
  program.parse();
}
