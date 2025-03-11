import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useMonitoringData } from '../../hooks/useMonitoringData';
import { Badge } from '../ui/badge';
import { CheckCircle2, AlertTriangle, AlertCircle, Timer, BarChart3, MoveRight } from 'lucide-react';
import { WaterQualityPanel } from './WaterQualityPanel';
import { getTimeAgo } from '../../lib/utils';
import { Button } from '../ui/button';

// 定义系统状态类型
type SystemStatus = 'optimal' | 'warning' | 'critical' | 'offline';

export function MonitoringDashboard() {
  const { t } = useTranslation('monitoring');
  const { parameters, lastUpdated, loading } = useMonitoringData();

  // 计算系统状态
  const getSystemStatus = (): SystemStatus => {
    if (loading) return 'offline';
    
    const criticalCount = parameters.filter(p => p.status === 'critical').length;
    const warningCount = parameters.filter(p => p.status === 'warning').length;
    
    if (criticalCount > 0) return 'critical';
    if (warningCount > 2) return 'warning';
    return 'optimal';
  };

  // 系统状态
  const systemStatus = getSystemStatus();
  
  // 获取状态图标
  const getStatusIcon = (status: SystemStatus) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'offline':
        return <Timer className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // 获取状态标题
  const getStatusTitle = (status: SystemStatus) => {
    switch (status) {
      case 'optimal':
        return t('dashboard.status.optimal');
      case 'warning':
        return t('dashboard.status.warning');
      case 'critical':
        return t('dashboard.status.critical');
      case 'offline':
        return t('dashboard.status.offline');
    }
  };
  
  // 获取状态描述
  const getStatusDescription = (status: SystemStatus) => {
    switch (status) {
      case 'optimal':
        return t('dashboard.statusDescription.optimal');
      case 'warning':
        return t('dashboard.statusDescription.warning', { count: parameters.filter(p => p.status === 'warning').length });
      case 'critical':
        return t('dashboard.statusDescription.critical', { count: parameters.filter(p => p.status === 'critical').length });
      case 'offline':
        return t('dashboard.statusDescription.offline');
    }
  };
  
  // 获取状态颜色
  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800';
      case 'warning':
        return 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100 border-amber-200 dark:border-amber-800';
      case 'critical':
        return 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100 border-red-200 dark:border-red-800';
      case 'offline':
        return 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800';
    }
  };

  // 渲染警告信息
  const renderAlerts = () => {
    const criticalCount = parameters.filter(p => p.status === 'critical').length;
    const warningCount = parameters.filter(p => p.status === 'warning').length;
    
    if (criticalCount === 0 && warningCount === 0) return null;
    
    return (
      <Alert variant={criticalCount > 0 ? "destructive" : "default"} className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('alerts.title')}</AlertTitle>
        <AlertDescription>
          {criticalCount > 0 ? (
            t('alerts.criticalMessage', { count: criticalCount })
          ) : (
            t('alerts.warningMessage', { count: warningCount })
          )}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6 w-full pb-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <BarChart3 className="mr-2 h-4 w-4" />
          {t('dashboard.exportData')}
        </Button>
      </div>
      
      {renderAlerts()}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('system.status')}
            </CardTitle>
            {getStatusIcon(systemStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{getStatusTitle(systemStatus)}</div>
            <p className="text-xs text-muted-foreground">
              {getStatusDescription(systemStatus)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('system.lastUpdated')}
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {lastUpdated ? getTimeAgo(lastUpdated) : t('dashboard.updating')}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastUpdated 
                ? lastUpdated.toLocaleString('zh-CN') 
                : t('dashboard.connectingToSensors')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.parametersOverview')}
            </CardTitle>
            <MoveRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.critical')}</span>
              <Badge variant={parameters.filter(p => p.status === 'critical').length > 0 ? "destructive" : "outline"}>
                {parameters.filter(p => p.status === 'critical').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.warning')}</span>
              <Badge variant={parameters.filter(p => p.status === 'warning').length > 0 ? "warning" : "outline"}>
                {parameters.filter(p => p.status === 'warning').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.normal')}</span>
              <Badge variant="outline" className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950">
                {parameters.filter(p => p.status === 'good').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-full flex-grow min-h-0 overflow-hidden">
        <WaterQualityPanel />
      </div>
    </div>
  );
}