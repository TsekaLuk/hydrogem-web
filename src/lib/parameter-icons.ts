/**
 * 水质参数图标工具函数
 * 用于获取参数对应的图标路径
 */

/**
 * 获取参数图标URL
 * @param parameterId 参数ID
 * @returns 图标URL或null
 */
export const getParameterIconUrl = (parameterId: string): string | null => {
  // 参数ID到图标名称的映射表
  const iconMappings: Record<string, string> = {
    // 基础参数
    'ph': 'pH',
    'turbidity': 'Turbidity',
    'conductivity': 'Conductivity',
    'dissolvedOxygen': 'Dissolved Oxygen',
    'dissolved_oxygen': 'Dissolved Oxygen',
    'temperature': 'Temperature',
    'totalDissolvedSolids': 'Total Dissolved Solids',
    'tds': 'Total Dissolved Solids',
    
    // 氮类
    'totalNitrogen': 'Total Nitrogen',
    'total_nitrogen': 'Total Nitrogen',
    'ammoniaNitrogen': 'Ammonia Nitrogen',
    'ammonia': 'Ammonia Nitrogen',
    'nitrate': 'Nitrate',
    'nitrite': 'Nitrite',
    
    // 磷类
    'totalPhosphorus': 'Total Phosphorus',
    'total_phosphorus': 'Total Phosphorus',
    'phosphate': 'Phosphate',
    
    // 碳类
    'totalOrganicCarbon': 'TOC',
    'totalCarbon': 'TC',
    'tc': 'TC',
    'inorganicCarbon': 'TIC',
    'tic': 'TIC',
    'dissolvedOrganicCarbon': 'DOC',
    'doc': 'DOC',
    'toc': 'TOC',
    
    // 其他离子
    'chloride': 'Chloride',
    'sulfate': 'Sulfate',
    'fluoride': 'Fluoride',
    'sulfide': 'Sulfide',
    'potassium': 'Potassium Ion',
    
    // 重金属
    'zinc': 'Zinc',
    'copper': 'Copper',
    'iron': 'Iron',
    'ferrousIron': 'Ferrous Iron',
    'ferrous_iron': 'Ferrous Iron',
    'chromium': 'Hexavalent Chromium',
    'arsenic': 'Arsenic',
    'aluminum': 'Aluminum',
    'cadmium': 'Cadmium',
    'manganese': 'Manganese',
    
    // 硅相关
    'siliconDioxide': 'Silicon Dioxide',
    'silicon_dioxide': 'Silicon Dioxide',
    'solubleSilicon': 'Soluble Silicon',
    'soluble_silicon': 'Soluble Silicon',
    
    // 物理特性
    'resistivity': 'Resistivity',
    'salinity': 'Salinity',
    
    // 有机物
    'phenols': 'Phenol',
    'methanol': 'Methanol',
    
    // 其他
    'chemicalOxygenDemand': 'COD',
    'cod': 'COD',
    'chlorophyll': 'Chlorophyll',
    'totalHardness': 'Hardness',
    'hardness': 'Hardness',
    'residualChlorine': 'Residual Chlorine',
    'residual_chlorine': 'Residual Chlorine'
  };

  try {
    // 获取映射的图标名称
    const iconName = iconMappings[parameterId] || parameterId;
    console.log(`Debug - Parameter ID: ${parameterId}, Icon Name: ${iconName}`);
    
    // 固定使用正确的图标路径
    return `/parameter-icons/${iconName}.png`;
  } catch (error) {
    console.warn(`Icon not found for parameter: ${parameterId}`);
    return null;
  }
}; 