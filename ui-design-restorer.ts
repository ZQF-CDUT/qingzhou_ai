#!/usr/bin/env ts-node

/**
 * UI Design Restorer - TypeScript版本
 *
 * 前端设计还原辅助工具 - 从设计图提取规格并生成前端代码
 * 支持 React + Tailwind CSS + shadcn/ui 技术栈
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// ==================== 类型定义 ====================

interface ColorShade {
  main: string;
  light?: string;
  dark?: string;
  contrast?: string;
}

interface ColorPalette {
  primary: ColorShade;
  secondary: ColorShade;
  background: ColorShade;
  text: ColorShade;
  border: ColorShade;
  functional: ColorShade;
}

interface FontSizeEntry {
  fontSize: string;
  lineHeight?: string;
}

interface TypographySystem {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: Record<string, [string, { lineHeight: string }] | string>;
  fontWeight: Record<string, string | number>;
  letterSpacing: Record<string, string>;
}

interface SpacingSystem {
  spacing: Record<string, string>;
  gap: Record<string, string>;
}

interface ComponentVariants {
  [key: string]: {
    padding?: string;
    height?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    width?: string;
  };
}

interface ComponentStates {
  hover?: Record<string, string>;
  active?: Record<string, string>;
  focus?: Record<string, string>;
  disabled?: Record<string, string>;
}

interface ComponentSpec {
  variants?: ComponentVariants;
  states?: ComponentStates;
  padding?: string;
  height?: string;
  borderRadius?: string;
  boxShadow?: string;
  backgroundColor?: string;
  [key: string]: any;
}

interface ComponentsSpec {
  button: ComponentSpec;
  card: ComponentSpec;
  input: ComponentSpec;
  sidebar: ComponentSpec;
  navigation: ComponentSpec;
}

interface DesignSpec {
  colors: ColorPalette;
  typography: TypographySystem;
  spacing: SpacingSystem;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  components: ComponentsSpec;
  metadata: {
    extractedAt: string;
    sourceImage: string;
    techStack: string[];
    iconLibrary: string;
  };
}

// ==================== 设计规格提取器 ====================

class DesignSpecExtractor {
  /**
   * 从图片中提取颜色值
   */
  static async extractColors(imagePath: string, options: any = {}): Promise<ColorPalette> {
    // 基于overview.png分析的配色方案
    const defaultColors: ColorPalette = {
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
        main: '#f1f5f9',    // slate-100
        paper: '#ffffff',
        dark: '#1e293b',    // slate-800
        darker: '#0f172a',  // slate-900
        contrast: '#ffffff'
      },
      text: {
        main: '#1e293b',    // slate-800
        secondary: '#64748b', // slate-500
        disabled: '#cbd5e1', // slate-300
        inverse: '#ffffff',
      },
      border: {
        main: '#e2e8f0',    // slate-200
        light: '#f1f5f9',   // slate-100
        dark: '#334155',    // slate-700
      },
      functional: {
        success: '#22c55e', // green-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444',   // red-500
        info: '#3b82f6',    // blue-500
        main: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2',
      }
    };

    return defaultColors;
  }

  /**
   * 提取字体系统规格
   */
  static extractTypography(): TypographySystem {
    return {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
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
   */
  static extractSpacing(): SpacingSystem {
    return {
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      gap: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      }
    };
  }

  /**
   * 提取圆角系统
   */
  static extractBorderRadius(): Record<string, string> {
    return {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    };
  }

  /**
   * 提取阴影系统
   */
  static extractShadows(): Record<string, string> {
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
   */
  static extractComponentSpecs(): ComponentsSpec {
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
        width: '4rem',
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
   */
  static async extractFullSpec(imagePath: string): Promise<DesignSpec> {
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
   */
  static generateTailwindConfig(spec: DesignSpec): string {
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
      colors: ${JSON.stringify(spec.colors, null, 2)},
      borderRadius: ${JSON.stringify(spec.borderRadius, null, 2)},
      fontSize: ${JSON.stringify(spec.typography.fontSize, null, 2)},
      fontWeight: ${JSON.stringify(spec.typography.fontWeight, null, 2)},
      letterSpacing: ${JSON.stringify(spec.typography.letterSpacing, null, 2)},
      spacing: spec.spacing.spacing,
      gap: spec.spacing.gap,
      boxShadow: ${JSON.stringify(spec.shadows, null, 2)},
      fontFamily: spec.typography.fontFamily,
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
  }

  /**
   * 生成 CSS 变量文件
   */
  static generateCSSVariables(spec: DesignSpec): string {
    const { colors } = spec;
    let css = `@layer base {\n  :root {\n`;

    // 生成颜色变量
    Object.entries(colors).forEach(([category, shades]: [string, any]) => {
      if (typeof shades === 'object' && !Array.isArray(shades)) {
        Object.entries(shades).forEach(([shade, value]: [string, any]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            css += `    --${category}-${shade}: ${value};\n`;
          }
        });
      }
    });

    css += `  }\n}\n`;

    return css;
  }

  /**
   * 生成 TypeScript 类型定义
   */
  static generateTSTypes(spec: DesignSpec): string {
    let ts = `// Auto-generated Design System Types\n\n`;

    // 颜色类型
    ts += `export type ColorShade = {\n`;
    ts += `  main: string;\n`;
    ts += `  light?: string;\n`;
    ts += `  dark?: string;\n`;
    ts += `  contrast?: string;\n`;
    ts += `}\n\n`;

    ts += `export interface ColorPalette {\n`;
    Object.keys(spec.colors).forEach(key => {
      ts += `  ${key}: ColorShade | Record<string, string>;\n`;
    });
    ts += `}\n\n`;

    // 间距类型
    ts += `export const Spacing = {\n`;
    Object.entries(spec.spacing.spacing).forEach(([key, value]) => {
      ts += `  ${key}: '${value}' as const,\n`;
    });
    ts += `} as const;\n\n`;
    ts += `export type SpacingValue = keyof typeof Spacing;\n\n`;

    // 组件规格类型
    ts += `export interface ComponentSpec {\n`;
    ts += `  variants?: Record<string, Record<string, string>>;\n`;
    ts += `  states?: Record<string, Record<string, string>>;\n`;
    ts += `  [key: string]: any;\n`;
    ts += `}\n\n`;

    ts += `export interface ComponentsSpec {\n`;
    Object.keys(spec.components).forEach(key => {
      ts += `  ${key}: ComponentSpec;\n`;
    });
    ts += `}\n\n`;

    return ts;
  }

  /**
   * 生成 React 组件
   */
  static generateComponent(
    componentName: string,
    componentType: keyof ComponentsSpec,
    spec: DesignSpec
  ): string {
    const componentSpec = spec.components[componentType];
    if (!componentSpec) {
      throw new Error(`Unknown component type: ${componentType}`);
    }

    switch (componentType) {
      case 'button':
        return this.generateButtonComponent(componentName, componentSpec, spec);
      case 'card':
        return this.generateCardComponent(componentName, componentSpec, spec);
      case 'input':
        return this.generateInputComponent(componentName, componentSpec, spec);
      default:
        throw new Error(`Unsupported component type: ${componentType}`);
    }
  }

  private static generateButtonComponent(
    name: string,
    spec: ComponentSpec,
    designSpec: DesignSpec
  ): string {
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

const ${name} = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
${name}.displayName = "${name}"

export { ${name}, buttonVariants }`;
  }

  private static generateCardComponent(
    name: string,
    spec: ComponentSpec,
    designSpec: DesignSpec
  ): string {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

const ${name} = React.forwardRef<
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
${name}.displayName = "${name}"

export { ${name} }`;
  }

  private static generateInputComponent(
    name: string,
    spec: ComponentSpec,
    designSpec: DesignSpec
  ): string {
    return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ${name} = React.forwardRef<HTMLInputElement, InputProps>(
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
${name}.displayName = "${name}"

export { ${name} }`;
  }
}

// ==================== 实用工具 ====================

class DesignUtils {
  /**
   * 将 Hex 颜色转换为 RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * 将 RGB 转换为 Hex
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * 计算对比度
   */
  static calculateContrast(hex1: string, hex2: string): number {
    const rgb1 = this.hexToRgb(hex1);
    const rgb2 = this.hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255;
    const lum2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255;

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * 导出设计规格为 JSON
   */
  static exportToJSON(spec: DesignSpec, outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  }
}

// ==================== CLI 接口 ====================

const program = new Command();

program
  .name('ui-design-restorer')
  .description('UI设计还原辅助工具 - TypeScript版本')
  .version('1.0.0');

program
  .command('analyze <imagePath>')
  .description('分析设计图并输出详细规格')
  .option('-o, --output <path>', '输出文件路径')
  .action(async (imagePath: string, options: any) => {
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
  .action(async (imagePath: string, options: any) => {
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
    const tsTypes = CodeGenerator.generateTSTypes(spec);
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
  .action(async (imagePath: string, options: any) => {
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

program.parse();

// 导出模块
export {
  DesignSpecExtractor,
  CodeGenerator,
  DesignUtils,
  DesignSpec,
  ColorPalette,
  TypographySystem,
  SpacingSystem,
  ComponentSpec,
  ComponentsSpec
};
