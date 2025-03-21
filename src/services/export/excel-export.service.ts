import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { formatDateTime } from '@/utils/format';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
  headers?: string[];
  customStyles?: Partial<ExcelJS.Style>;
  includeTimestamp?: boolean;
}

export class ExcelExportService {
  /**
   * 导出数据到Excel文件
   * @param data 要导出的数据数组
   * @param options 导出选项
   */
  public static async exportToExcel<T extends Record<string, any>>(
    data: T[],
    options: ExcelExportOptions = {}
  ): Promise<void> {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const {
      fileName = `export-${Date.now()}`,
      sheetName = 'Sheet1',
      headers,
      customStyles,
      includeTimestamp = true
    } = options;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    // 确定要包含的列
    const columns = headers || Object.keys(data[0]);

    // 设置列标题
    sheet.columns = columns.map((header) => ({
      header,
      key: header,
      width: 20,
      style: {
        font: { bold: true },
        ...customStyles
      }
    }));

    // 添加数据行
    data.forEach((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        // 对于每列，尝试从数据对象中获取相应的值
        let value = item[col];
        
        // 格式化日期类型的值
        if (value instanceof Date) {
          value = formatDateTime(value);
        }
        
        row[col] = value;
      });
      sheet.addRow(row);
    });

    // 添加创建时间到表格底部
    if (includeTimestamp) {
      sheet.addRow([]);
      sheet.addRow([`导出时间: ${formatDateTime(new Date())}`]);
    }

    // 应用样式到表头
    sheet.getRow(1).font = { bold: true };

    // 创建Excel文件并下载
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}

export default ExcelExportService; 