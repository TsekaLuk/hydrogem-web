import { WaterQualityParameter } from '@/types/parameters';
import { SearchResultGroups } from '@/contexts/search-context';

/**
 * 执行全局搜索的服务
 */
export class SearchService {
  /**
   * 执行全局搜索
   * @param query 搜索查询
   * @param options 搜索选项
   * @returns 搜索结果
   */
  public static async search(
    query: string,
    options: {
      searchParameters?: boolean;
      searchDevices?: boolean;
      searchAreas?: boolean;
      parameters?: WaterQualityParameter[];
      devices?: any[];
      areas?: any[];
    } = {}
  ): Promise<SearchResultGroups> {
    const {
      searchParameters = true,
      searchDevices = true,
      searchAreas = true,
      parameters = [],
      devices = [],
      areas = [],
    } = options;

    // 默认空结果
    const results: SearchResultGroups = {
      parameters: [],
      devices: [],
      areas: [],
    };

    // 如果查询为空，返回空结果
    if (!query || query.trim() === '') {
      return results;
    }

    const normalizedQuery = query.trim().toLowerCase();

    // 搜索参数
    if (searchParameters && parameters.length > 0) {
      results.parameters = this.searchParameters(normalizedQuery, parameters);
    }

    // 搜索设备
    if (searchDevices && devices.length > 0) {
      results.devices = this.searchDevices(normalizedQuery, devices);
    }

    // 搜索区域
    if (searchAreas && areas.length > 0) {
      results.areas = this.searchAreas(normalizedQuery, areas);
    }

    return results;
  }

  /**
   * 搜索水质参数
   * @param query 搜索查询
   * @param parameters 参数列表
   * @returns 匹配的参数
   */
  private static searchParameters(
    query: string,
    parameters: WaterQualityParameter[]
  ): WaterQualityParameter[] {
    return parameters.filter(param => {
      // 尝试匹配参数的各个字段
      return (
        param.id.toLowerCase().includes(query) ||
        param.name.toLowerCase().includes(query) ||
        param.category.toLowerCase().includes(query) ||
        (param.importance && param.importance.toLowerCase().includes(query)) ||
        (param.unit && param.unit.toLowerCase().includes(query)) ||
        // 匹配状态
        param.status.toLowerCase().includes(query) ||
        // 匹配数值（转换为字符串进行匹配）
        param.current.toString().includes(query)
      );
    });
  }

  /**
   * 搜索设备
   * @param query 搜索查询
   * @param devices 设备列表
   * @returns 匹配的设备
   */
  private static searchDevices(query: string, devices: any[]): any[] {
    // 这里需要根据设备的实际数据结构进行实现
    return devices.filter(device => {
      // 示例实现，需要根据实际设备类型调整
      return (
        (device.id && device.id.toLowerCase().includes(query)) ||
        (device.name && device.name.toLowerCase().includes(query)) ||
        (device.type && device.type.toLowerCase().includes(query)) ||
        (device.status && device.status.toLowerCase().includes(query)) ||
        (device.location && 
          (typeof device.location === 'string' 
            ? device.location.toLowerCase().includes(query)
            : JSON.stringify(device.location).toLowerCase().includes(query)))
      );
    });
  }

  /**
   * 搜索区域
   * @param query 搜索查询
   * @param areas 区域列表
   * @returns 匹配的区域
   */
  private static searchAreas(query: string, areas: any[]): any[] {
    // 这里需要根据区域的实际数据结构进行实现
    return areas.filter(area => {
      // 示例实现，需要根据实际区域类型调整
      return (
        (area.id && area.id.toLowerCase().includes(query)) ||
        (area.name && area.name.toLowerCase().includes(query)) ||
        (area.type && area.type.toLowerCase().includes(query)) ||
        (area.description && area.description.toLowerCase().includes(query))
      );
    });
  }
} 