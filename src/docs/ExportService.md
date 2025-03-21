# 数据导出服务使用指南

HydroGem系统提供了灵活的数据导出功能，允许用户将系统中的数据导出为Excel格式。本文档说明如何在项目中使用导出功能。

## 导出服务概述

导出服务主要由两部分组成：

1. **ExcelExportService** - 核心导出服务类，提供将数据导出为Excel文件的功能
2. **ExportButton** - 可重用的UI组件，封装了导出功能的按钮

## 使用ExcelExportService

`ExcelExportService`类提供了静态方法`exportToExcel`，可以直接在代码中调用：

```typescript
import { ExcelExportService } from '@/services/export';

// 准备要导出的数据
const data = [
  { id: 1, name: '参数1', value: 10 },
  { id: 2, name: '参数2', value: 20 },
];

// 导出数据
ExcelExportService.exportToExcel(data, {
  fileName: 'my-export',       // 导出的文件名（不包含扩展名）
  sheetName: '我的数据',        // Excel工作表名称
  headers: ['id', 'name', 'value'], // 可选：指定要包含的列（默认包含所有列）
  includeTimestamp: true,      // 是否在底部添加导出时间戳
});
```

### 配置选项

`exportToExcel`方法接受以下配置选项：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fileName | string | `export-{timestamp}` | 导出文件的名称（不含扩展名） |
| sheetName | string | 'Sheet1' | Excel工作表的名称 |
| headers | string[] | 所有键 | 指定要包含的列（为空则包含所有列） |
| customStyles | Partial<ExcelJS.Style> | {} | 自定义Excel样式 |
| includeTimestamp | boolean | true | 是否在导出底部添加时间戳 |

## 使用ExportButton组件

为了简化在UI中添加导出功能，我们提供了一个可重用的`ExportButton`组件：

```tsx
import ExportButton from '@/components/ui/export-button';

// 在组件中使用
function MyComponent() {
  const data = [/* 要导出的数据 */];
  
  return (
    <div>
      <h1>我的数据</h1>
      <ExportButton 
        data={data}
        options={{
          fileName: 'my-data-export',
          sheetName: '数据表'
        }}
        exportText="导出数据"
      />
    </div>
  );
}
```

### ExportButton属性

`ExportButton`组件接受以下属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Record<string, any>[] | 必填 | 要导出的数据数组 |
| options | ExcelExportOptions | {} | 导出选项（与ExcelExportService相同） |
| exportText | string | "导出数据" | 按钮上显示的文本 |
| onBeforeExport | () => void | undefined | 导出前的回调函数 |
| onAfterExport | () => void | undefined | 导出完成后的回调函数 |
| onError | (error: Error) => void | undefined | 导出错误时的回调函数 |
| showTooltip | boolean | true | 是否显示提示文本 |
| tooltipText | string | "将数据导出为Excel文件" | 提示文本 |
| size | "default" \| "sm" \| "lg" \| "icon" | "default" | 按钮尺寸 |
| variant | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" | "outline" | 按钮样式变体 |

## 数据格式化

导出服务会自动处理基本的数据格式化：

- 日期类型的值会自动格式化为易读的日期时间字符串
- 数字、字符串等基本类型会按原样导出

对于需要特殊格式化的数据，应在传递给导出服务前进行处理。例如：

```typescript
// 准备导出数据并格式化
const prepareExportData = () => {
  return parameters.map(param => ({
    ID: param.id,
    名称: param.name,
    状态: getStatusText(param.status), // 使用函数将状态码转换为友好文本
    更新时间: formatDateTime(param.lastUpdated),
  }));
};

<ExportButton data={prepareExportData()} />
```

## 最佳实践

1. **考虑性能**: 处理大量数据时，考虑分批导出或提供过滤选项
2. **提供有意义的文件名**: 包含导出内容类型和日期，例如：`water-quality-2023-01-01`
3. **本地化**: 导出的表头和内容应考虑用户语言偏好
4. **提供用户反馈**: 使用`onBeforeExport`和`onAfterExport`回调显示导出进度
5. **错误处理**: 使用`onError`回调处理导出过程中可能出现的错误

## 示例

### 基本用法

```tsx
<ExportButton 
  data={myData}
  options={{
    fileName: `export-${new Date().toISOString().split('T')[0]}`,
    sheetName: '我的数据'
  }}
/>
```

### 高级用法

```tsx
<ExportButton 
  data={myData}
  options={{
    fileName: `water-quality-${new Date().toISOString().split('T')[0]}`,
    sheetName: '水质数据',
    headers: ['id', 'name', 'value'], // 只导出这些列
  }}
  exportText="导出水质数据"
  onBeforeExport={() => setIsLoading(true)}
  onAfterExport={() => {
    setIsLoading(false);
    showNotification('数据已成功导出');
  }}
  onError={(error) => {
    setIsLoading(false);
    showErrorNotification(`导出失败: ${error.message}`);
  }}
  variant="secondary"
  size="sm"
/>
``` 