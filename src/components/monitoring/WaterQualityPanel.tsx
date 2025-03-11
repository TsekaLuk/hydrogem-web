import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMonitoringData } from '../../hooks/useMonitoringData';
import { useParameterTrends } from '../../hooks/useParameterTrends';
import { useInsertParameterToChat } from '../../hooks/useInsertParameterToChat';
import { ParameterCard } from '../ui/parameter-card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { LineChart, Droplet, Thermometer, Waves, Search, BarChart3, AlertTriangle } from 'lucide-react';
import { WaterQualityParameter } from '../../types/parameters';
import { Spinner } from '../ui/spinner';
import { categoryColors } from '../../lib/parameter-colors';

// 视图类型
type ViewType = 'category' | 'priority' | 'charts';

export const WaterQualityPanel: React.FC = () => {
  const { t } = useTranslation('monitoring');
  const { parameters, loading, error } = useMonitoringData();
  const trends = useParameterTrends(parameters);
  const insertParameter = useInsertParameterToChat();
  
  const [viewType, setViewType] = useState<ViewType>('category');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // 根据分类和状态过滤参数
  const filteredParameters = parameters.filter(param => {
    if (filterCategory !== 'all' && param.category !== filterCategory) {
      return false;
    }
    return true;
  });
  
  // 根据状态获取参数列表
  const criticalParameters = filteredParameters.filter(p => p.status === 'critical');
  const warningParameters = filteredParameters.filter(p => p.status === 'warning');
  const goodParameters = filteredParameters.filter(p => p.status === 'good');
  
  // 获取分类数量
  const getCategoryCount = (category: string) => {
    return parameters.filter(p => p.category === category).length;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">{t('panel.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {t('panel.error')}
      </div>
    );
  }
  
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 flex-shrink-0">
        <h3 className="text-lg font-semibold">
          {t('panel.title')} <span className="text-sm font-normal text-muted-foreground">({parameters.length} {t('panel.items')})</span>
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* 视图切换 */}
          <div className="hidden sm:flex items-center rounded-md border p-1">
            <Button
              variant={viewType === 'category' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewType('category')}
            >
              <Waves className="h-4 w-4" />
              <span className="sr-only">{t('panel.views.category')}</span>
            </Button>
            <Button
              variant={viewType === 'priority' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewType('priority')}
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="sr-only">{t('panel.views.priority')}</span>
            </Button>
            <Button
              variant={viewType === 'charts' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewType('charts')}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="sr-only">{t('panel.views.charts')}</span>
            </Button>
          </div>
          
          {/* 视图过滤 */}
          {viewType === 'category' && (
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-8 text-xs w-[150px]">
                <SelectValue placeholder={t('panel.filter.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('panel.filter.all')}
                </SelectItem>
                {Object.entries(categoryColors).map(([category, color]) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center">
                      <Badge className="w-2 h-2 mr-2 p-0" style={{ backgroundColor: color }} />
                      {t(`parameters.categories.${category}`)} ({getCategoryCount(category)})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <div className="flex-grow min-h-0 overflow-y-auto">
        {/* 分类视图 */}
        {viewType === 'category' && (
          <div className="grid gap-3 w-full" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' 
          }}>
            {filteredParameters.length > 0 ? (
              filteredParameters.map((param) => (
                <ParameterCard 
                  key={param.id}
                  parameter={param}
                  trend={trends[param.id]}
                  onClick={insertParameter}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('panel.noParameters')}
              </div>
            )}
          </div>
        )}
        
        {/* 优先级视图 */}
        {viewType === 'priority' && (
          <Tabs defaultValue="critical" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="critical" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {t('dashboard.critical')}
                <Badge variant="outline" className="ml-1 text-xs">
                  {criticalParameters.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="warning" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {t('dashboard.warning')}
                <Badge variant="outline" className="ml-1 text-xs">
                  {warningParameters.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="good" className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {t('dashboard.normal')}
                <Badge variant="outline" className="ml-1 text-xs">
                  {goodParameters.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="critical" className="mt-0">
              <div className="grid gap-3 w-full" style={{ 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' 
              }}>
                {criticalParameters.length > 0 ? (
                  criticalParameters.map((param) => (
                    <ParameterCard 
                      key={param.id}
                      parameter={param}
                      trend={trends[param.id]}
                      onClick={insertParameter}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {t('panel.noCriticalParameters')}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="warning" className="mt-0">
              <div className="grid gap-3 w-full" style={{ 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' 
              }}>
                {warningParameters.length > 0 ? (
                  warningParameters.map((param) => (
                    <ParameterCard 
                      key={param.id}
                      parameter={param}
                      trend={trends[param.id]}
                      onClick={insertParameter}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {t('panel.noWarningParameters')}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="good" className="mt-0">
              <div className="grid gap-3 w-full" style={{ 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' 
              }}>
                {goodParameters.length > 0 ? (
                  goodParameters.map((param) => (
                    <ParameterCard 
                      key={param.id}
                      parameter={param}
                      trend={trends[param.id]}
                      onClick={insertParameter}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {t('panel.noGoodParameters')}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {/* 图表视图 */}
        {viewType === 'charts' && (
          <div className="grid gap-3 w-full" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' 
          }}>
            {filteredParameters.length > 0 ? (
              filteredParameters.map((param) => (
                <div key={param.id} className="bg-card rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{param.name}</h4>
                    <Badge 
                      variant={param.status === 'critical' ? 'destructive' : param.status === 'warning' ? 'warning' : 'outline'}
                      className={param.status === 'good' ? 'text-emerald-500' : ''}
                    >
                      {t(`parameters.status.${param.status}`)}
                    </Badge>
                  </div>
                  <div className="h-40 flex items-center justify-center bg-muted/50 rounded-md">
                    <div className="text-center">
                      <LineChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">{t('panel.chartsComingSoon')}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('panel.noParameters')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};