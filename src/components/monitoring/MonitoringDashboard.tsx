import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { useMonitoringData } from '../../hooks/useMonitoringData';
import { Badge } from '../ui/badge';
import { 
  AlertCircle, BarChart3, CheckCircle2, AlertTriangle, 
  Droplets, Computer, Map, FilterX, Download, Menu, X
} from 'lucide-react';
import { WaterQualityPanel } from './WaterQualityPanel';
import { getTimeAgo } from '../../lib/utils';
import { DeviceManagement } from '../devices/DeviceManagement';
import { SpatialManagement } from '../spatial/SpatialManagement';
import { cn } from '../../lib/utils';
import MonitoringFilter, { FilterConfig, TimeRange } from './MonitoringFilter';
import { ParameterCategory, ParameterStatus, WaterQualityParameter } from '../../types/parameters';
import StatusIndicator from '../ui/status-indicator';
import ExportButton from '../ui/export-button';
import { formatDateTime } from '@/utils/format';

// Define system status type
type SystemStatus = 'optimal' | 'warning' | 'critical' | 'offline';
type ActiveTab = 'monitoring' | 'devices' | 'areas';

// Define tab configuration for consistent styling and behavior
const tabConfig = [
  {
    id: 'monitoring',
    label: '水质监测',
    icon: Droplets,
    iconColor: 'text-blue-500',
    ariaLabel: 'water quality monitoring tab'
  },
  {
    id: 'devices',
    label: '设备管理',
    icon: Computer,
    iconColor: 'text-purple-500',
    ariaLabel: 'device management tab'
  },
  {
    id: 'areas',
    label: '空间管理',
    icon: Map,
    iconColor: 'text-emerald-500',
    ariaLabel: 'spatial management tab'
  }
];

export function MonitoringDashboard() {
  const { t } = useTranslation('monitoring');
  const { parameters: allParameters, lastUpdated, loading } = useMonitoringData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('monitoring');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // 添加过滤器状态
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    timeRange: '24h',
    status: null,
    categories: null,
    importance: null
  });
  
  // 过滤后的参数
  const [filteredParameters, setFilteredParameters] = useState<WaterQualityParameter[]>(allParameters);

  // 应用过滤器
  useEffect(() => {
    let result = [...allParameters];
    
    // 按状态过滤
    if (filterConfig.status && filterConfig.status.length > 0) {
      result = result.filter(param => 
        filterConfig.status!.includes(param.status)
      );
    }
    
    // 按类别过滤
    if (filterConfig.categories && filterConfig.categories.length > 0) {
      result = result.filter(param => 
        filterConfig.categories!.includes(param.category)
      );
    }
    
    // 按重要性过滤
    if (filterConfig.importance && filterConfig.importance.length > 0) {
      result = result.filter(param => 
        param.importance && filterConfig.importance!.includes(param.importance)
      );
    }
    
    // 注意：时间范围过滤需要实际的时间戳数据，这里是模拟实现
    // 在实际项目中，应该根据参数的时间戳进行过滤
    
    setFilteredParameters(result);
  }, [allParameters, filterConfig]);

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate system status
  const getSystemStatus = (): SystemStatus => {
    if (loading) return 'offline';
    
    const criticalCount = filteredParameters.filter(p => p.status === 'critical').length;
    const warningCount = filteredParameters.filter(p => p.status === 'warning').length;
    
    if (criticalCount > 0) return 'critical';
    if (warningCount > 2) return 'warning';
    return 'optimal';
  };

  const systemStatus = getSystemStatus();
  const criticalCount = filteredParameters.filter(p => p.status === 'critical').length;
  const warningCount = filteredParameters.filter(p => p.status === 'warning').length;
  const normalCount = filteredParameters.filter(p => p.status === 'good').length;
  
  // Status indicator colors
  const statusColors = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    normal: 'bg-emerald-500',
    offline: 'bg-gray-400'
  };

  // Render alert if needed
  const renderAlert = () => {
    if (criticalCount === 0 && warningCount === 0) return null;
    
    return (
      <div 
        role="alert"
        className={cn(
          "flex items-center px-4 py-3 mb-4 rounded-md",
          "text-sm sm:text-base",
          criticalCount > 0 
            ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        )}
      >
        {criticalCount > 0 ? (
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
        )}
        <div className="text-sm font-medium">
          {criticalCount > 0 
            ? t('alerts.criticalMessage', { count: criticalCount }) 
            : t('alerts.warningMessage', { count: warningCount })}
        </div>
      </div>
    );
  };

  // Handle tab change with transition
  const handleTabChange = (value: string) => {
    setActiveTab(value as ActiveTab);
    if (windowWidth < 640) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // 处理过滤器变化
  const handleFilterChange = (newConfig: FilterConfig) => {
    setFilterConfig(newConfig);
  };

  // 获取时间范围显示文本
  const getTimeRangeText = (range: TimeRange): string => {
    const rangeMap: Record<TimeRange, string> = {
      '1h': '最近1小时',
      '6h': '最近6小时',
      '12h': '最近12小时',
      '24h': '最近24小时',
      '3d': '最近3天',
      '7d': '最近7天',
      '30d': '最近30天',
      'custom': '自定义范围'
    };
    return rangeMap[range];
  };

  // 准备导出数据
  const prepareExportData = () => {
    // 将水质参数数据转换为适合导出的格式
    return filteredParameters.map(param => ({
      ID: param.id,
      名称: param.name,
      类别: t(`parameters.categories.${param.category}`),
      当前值: param.current,
      单位: param.unit || '',
      状态: t(`parameters.status.${param.status}`),
      参考范围: param.range ? `${param.range[0]} - ${param.range[1]}` : '未设置',
      最佳范围: param.optimal ? `${param.optimal[0]} - ${param.optimal[1]}` : '未设置',
      更新时间: lastUpdated ? formatDateTime(lastUpdated) : '',
      重要性: param.importance ? t(`parameters.importance.${param.importance}`) : '未设置'
    }));
  };

  return (
    <div className="space-y-4 w-full pb-6 h-full">
      {/* Header section with clean, minimal design */}
      <div className="border-b pb-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-blue-500" aria-hidden="true" />
            <h2 className="text-xl font-medium hidden sm:block">{t('title')}</h2>
            <h2 className="text-lg font-medium sm:hidden">{t('title')}</h2>
            {lastUpdated && (
              <span className="ml-3 text-xs text-gray-400 hidden sm:inline">
                {getTimeAgo(lastUpdated)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu button - only appears on small screens */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="sm:hidden"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop: Filter and Export buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <MonitoringFilter 
                onFilterChange={handleFilterChange}
                currentFilter={filterConfig}
              />
              <ExportButton 
                data={prepareExportData()}
                options={{
                  fileName: `water-quality-parameters-${new Date().toISOString().split('T')[0]}`,
                  sheetName: '水质参数',
                }}
                exportText={t('actions.export', '导出数据')}
                size="sm"
                className="h-8 text-xs"
              />
            </div>
            
            {/* Mobile: Filter and Export icons */}
            <div className="flex sm:hidden items-center">
              <MonitoringFilter 
                onFilterChange={handleFilterChange}
                currentFilter={filterConfig}
                isMobile={true}
              />
              <ExportButton 
                data={prepareExportData()}
                options={{
                  fileName: `water-quality-parameters-${new Date().toISOString().split('T')[0]}`,
                  sheetName: '水质参数',
                }}
                exportText=""
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                showTooltip={true}
                tooltipText={t('actions.export', '导出数据')}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </ExportButton>
            </div>
          </div>
        </div>
        
        {/* Mobile: Last updated timestamp shown below title on small screens */}
        {lastUpdated && (
          <span className="text-xs text-gray-400 sm:hidden mt-1 inline-block">
            {getTimeAgo(lastUpdated)}
          </span>
        )}
        
        {/* 显示当前过滤器状态 */}
        {(filterConfig.status || filterConfig.categories || filterConfig.importance || filterConfig.timeRange !== '24h') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filterConfig.timeRange !== '24h' && (
              <Badge variant="outline" className="text-xs py-0">
                {getTimeRangeText(filterConfig.timeRange)}
              </Badge>
            )}
            {filterConfig.status && filterConfig.status.map(status => (
              <Badge key={status} variant="outline" className="text-xs py-0">
                {status === 'critical' ? '严重异常' : 
                 status === 'warning' ? '警告状态' : 
                 status === 'good' ? '正常状态' : '未活动'}
              </Badge>
            ))}
            {filterConfig.categories && filterConfig.categories.map(category => (
              <Badge key={category} variant="outline" className="text-xs py-0">
                {category === 'temperature' ? '温度' :
                 category === 'chemical' ? '化学指标' :
                 category === 'mineral' ? '矿物质' :
                 category === 'biological' ? '生物指标' :
                 category === 'physical' ? '物理指标' :
                 category === 'metal' ? '重金属' :
                 category === 'organic' ? '有机物' : '其他'}
              </Badge>
            ))}
            {filterConfig.importance && filterConfig.importance.map(importance => (
              <Badge key={importance} variant="outline" className="text-xs py-0">
                {importance === 'high' ? '高重要性' :
                 importance === 'medium' ? '中等重要性' : '低重要性'}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Alert notification */}
      {renderAlert()}

      {/* Stats summary - fully responsive grid that adapts to screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card className="rounded-xl overflow-hidden border-0 shadow-sm">
          <div className="flex items-stretch h-full">
            <div className={`w-1 ${statusColors[criticalCount > 0 ? 'critical' : 'normal']}`}></div>
            <CardContent className="flex-1 p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('dashboard.status.title', '系统状态')}</h3>
                  <p className="text-base sm:text-lg font-semibold mt-1">
                    {systemStatus === 'critical' ? t('dashboard.status.critical', '严重异常') : 
                     systemStatus === 'warning' ? t('dashboard.status.warning', '需要注意') : 
                     systemStatus === 'offline' ? t('dashboard.status.offline', '更新中') : 
                     t('dashboard.status.optimal', '状态良好')}
                  </p>
                </div>
                <StatusIndicator 
                  status={systemStatus === 'critical' ? 'critical' : 
                         systemStatus === 'warning' ? 'warning' : 
                         systemStatus === 'offline' ? 'inactive' : 'good'}
                  variant="subtle"
                  size="lg"
                  tooltip={
                    systemStatus === 'critical' ? t('dashboard.statusDescription.critical', {count: criticalCount}) : 
                    systemStatus === 'warning' ? t('dashboard.statusDescription.warning', {count: warningCount}) : 
                    systemStatus === 'offline' ? t('dashboard.statusDescription.offline') : 
                    t('dashboard.statusDescription.optimal')
                  }
                />
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="rounded-xl overflow-hidden border-0 shadow-sm">
          <div className="flex items-stretch h-full">
            <div className={`w-1 ${criticalCount > 0 ? statusColors.critical : warningCount > 0 ? statusColors.warning : statusColors.normal}`}></div>
            <CardContent className="flex-1 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('dashboard.parametersStats', '参数统计')}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5" title={t('dashboard.critical', '严重')}>
                  <StatusIndicator 
                    status="critical"
                    variant="filled"
                    size="xs"
                  />
                  <span className="text-xs sm:text-sm font-medium">{criticalCount}</span>
                </div>
                <div className="flex items-center gap-1.5" title={t('dashboard.warning', '警告')}>
                  <StatusIndicator 
                    status="warning"
                    variant="filled"
                    size="xs"
                  />
                  <span className="text-xs sm:text-sm font-medium">{warningCount}</span>
                </div>
                <div className="flex items-center gap-1.5" title={t('dashboard.normal', '正常')}>
                  <StatusIndicator 
                    status="good"
                    variant="filled"
                    size="xs"
                  />
                  <span className="text-xs sm:text-sm font-medium">{normalCount}</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="rounded-xl overflow-hidden border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">{t('dashboard.parameterCount', '参数监测')}</h3>
                <p className="text-base sm:text-lg font-semibold mt-1">{filteredParameters.length}{t('dashboard.itemUnit', '个')}</p>
              </div>
              <div className="flex space-x-3">
                <div className="flex items-center gap-1" title={t('dashboard.critical', '严重')}>
                  <StatusIndicator 
                    status="critical"
                    variant="default"
                    size="xs"
                  />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">{criticalCount}</span>
                </div>
                <div className="flex items-center gap-1" title={t('dashboard.warning', '警告')}>
                  <StatusIndicator 
                    status="warning"
                    variant="default"
                    size="xs"
                  />
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{warningCount}</span>
                </div>
                <div className="flex items-center gap-1" title={t('dashboard.normal', '正常')}>
                  <StatusIndicator 
                    status="good"
                    variant="default"
                    size="xs"
                  />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{normalCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab navigation - adapts to screen size */}
      <div className="relative">
        {/* Mobile tab menu - slides in from the top when menu button is clicked */}
        {windowWidth < 640 && (
          <div className={cn(
            "absolute top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md rounded-lg z-10 transform transition-transform duration-200 ease-in-out",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full opacity-0 pointer-events-none"
          )}>
            <div className="p-2">
              {tabConfig.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start mb-1 px-3 py-2"
                  onClick={() => handleTabChange(tab.id)}
                >
                  {React.createElement(tab.icon, { className: `h-4 w-4 mr-3 ${tab.iconColor}`, "aria-hidden": true })}
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      
        {/* Desktop tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="flex-grow"
        >
          <TabsList 
            className="mb-6 grid grid-cols-3 h-10 sm:h-12 rounded-lg bg-gray-100 p-1 dark:bg-gray-800/50 transition-all"
            aria-label="Dashboard sections"
          >
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className={cn(
                  "rounded-md flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2",
                  "data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700",
                  "transition-all duration-200 ease-in-out", 
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1", 
                  "hover:bg-white/80 dark:hover:bg-gray-700/70" 
                )}
                aria-label={tab.ariaLabel}
              >
                {React.createElement(tab.icon, { 
                  className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${tab.iconColor}`, 
                  "aria-hidden": true 
                })}
                <span className="text-xs sm:text-sm font-medium truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent 
            value="monitoring" 
            className="mt-0 transition-all duration-300 ease-in-out" 
            role="tabpanel"
            aria-labelledby="monitoring-tab"
          >
            <WaterQualityPanel parameters={filteredParameters} />
          </TabsContent>
          
          <TabsContent 
            value="devices" 
            className="mt-0 transition-all duration-300 ease-in-out"
            role="tabpanel"
            aria-labelledby="devices-tab"
          >
            <DeviceManagement />
          </TabsContent>
          
          <TabsContent 
            value="areas" 
            className="mt-0 transition-all duration-300 ease-in-out"
            role="tabpanel" 
            aria-labelledby="areas-tab"
          >
            <SpatialManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MonitoringDashboard;