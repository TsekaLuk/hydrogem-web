import React from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { FilterX, Calendar, CheckCircle2, AlertTriangle, AlertCircle, Sliders } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ParameterCategory, ParameterStatus } from '../../types/parameters';

// 时间范围选项
export type TimeRange = '1h' | '6h' | '12h' | '24h' | '3d' | '7d' | '30d' | 'custom';

// 过滤器配置接口
export interface FilterConfig {
  timeRange: TimeRange;
  status: ParameterStatus[] | null;
  categories: ParameterCategory[] | null;
  importance: ('high' | 'medium' | 'low')[] | null;
}

// 组件Props接口
interface MonitoringFilterProps {
  onFilterChange: (config: FilterConfig) => void;
  currentFilter: FilterConfig;
  isMobile?: boolean;
}

// 状态映射和图标
const statusMap: Record<ParameterStatus, { label: string; icon: React.ReactNode; color: string }> = {
  critical: {
    label: '严重异常',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-500'
  },
  warning: {
    label: '警告状态',
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-amber-500'
  },
  good: {
    label: '正常状态',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-500'
  },
  inactive: {
    label: '未活动',
    icon: <FilterX className="h-4 w-4" />,
    color: 'text-gray-500'
  }
};

// 类别映射
const categoryMap: Record<ParameterCategory, { label: string; color: string }> = {
  temperature: { label: '温度', color: 'bg-orange-100 text-orange-700' },
  chemical: { label: '化学指标', color: 'bg-purple-100 text-purple-700' },
  mineral: { label: '矿物质', color: 'bg-indigo-100 text-indigo-700' },
  biological: { label: '生物指标', color: 'bg-green-100 text-green-700' },
  physical: { label: '物理指标', color: 'bg-blue-100 text-blue-700' },
  metal: { label: '重金属', color: 'bg-stone-100 text-stone-700' },
  organic: { label: '有机物', color: 'bg-rose-100 text-rose-700' },
  other: { label: '其他', color: 'bg-gray-100 text-gray-700' }
};

// 主要监控等级
const importanceMap = {
  high: { label: '高重要性', color: 'bg-red-100 text-red-700' },
  medium: { label: '中等重要性', color: 'bg-amber-100 text-amber-700' },
  low: { label: '低重要性', color: 'bg-emerald-100 text-emerald-700' }
};

export function MonitoringFilter({
  onFilterChange,
  currentFilter,
  isMobile = false
}: MonitoringFilterProps) {
  const { t } = useTranslation('monitoring');
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tempFilter, setTempFilter] = React.useState<FilterConfig>(currentFilter);
  const [activeTab, setActiveTab] = React.useState<'timeRange' | 'status' | 'categories'>('timeRange');

  // 应用过滤器
  const applyFilter = () => {
    onFilterChange(tempFilter);
    setOpen(false);
    setDialogOpen(false);
  };

  // 清除所有过滤器
  const clearFilters = () => {
    const clearedFilter: FilterConfig = {
      timeRange: '24h',
      status: null,
      categories: null,
      importance: null
    };
    setTempFilter(clearedFilter);
    onFilterChange(clearedFilter);
    setOpen(false);
    setDialogOpen(false);
  };

  // 切换状态选择
  const toggleStatus = (status: ParameterStatus) => {
    setTempFilter(prev => {
      if (!prev.status) return { ...prev, status: [status] };
      
      if (prev.status.includes(status)) {
        const newStatus = prev.status.filter(s => s !== status);
        return { ...prev, status: newStatus.length ? newStatus : null };
      } else {
        return { ...prev, status: [...prev.status, status] };
      }
    });
  };

  // 切换类别选择
  const toggleCategory = (category: ParameterCategory) => {
    setTempFilter(prev => {
      if (!prev.categories) return { ...prev, categories: [category] };
      
      if (prev.categories.includes(category)) {
        const newCategories = prev.categories.filter(c => c !== category);
        return { ...prev, categories: newCategories.length ? newCategories : null };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  // 切换重要性选择
  const toggleImportance = (importance: 'high' | 'medium' | 'low') => {
    setTempFilter(prev => {
      if (!prev.importance) return { ...prev, importance: [importance] };
      
      if (prev.importance.includes(importance)) {
        const newImportance = prev.importance.filter(i => i !== importance);
        return { ...prev, importance: newImportance.length ? newImportance : null };
      } else {
        return { ...prev, importance: [...prev.importance, importance] };
      }
    });
  };

  // 获取激活的过滤器数量
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (currentFilter.status && currentFilter.status.length > 0) count++;
    if (currentFilter.categories && currentFilter.categories.length > 0) count++;
    if (currentFilter.importance && currentFilter.importance.length > 0) count++;
    if (currentFilter.timeRange && currentFilter.timeRange !== '24h') count++;
    return count;
  };

  // 时间范围选择
  const TimeRangeTab = () => (
    <div className="space-y-4 py-2">
      <RadioGroup 
        value={tempFilter.timeRange} 
        onValueChange={(value) => setTempFilter(prev => ({ ...prev, timeRange: value as TimeRange }))}
        className="grid grid-cols-2 gap-2"
      >
        <Label 
          htmlFor="1h" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="1h" id="1h" />
          <span>最近1小时</span>
        </Label>
        <Label 
          htmlFor="6h" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="6h" id="6h" />
          <span>最近6小时</span>
        </Label>
        <Label 
          htmlFor="12h" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="12h" id="12h" />
          <span>最近12小时</span>
        </Label>
        <Label 
          htmlFor="24h" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="24h" id="24h" />
          <span>最近24小时</span>
        </Label>
        <Label 
          htmlFor="3d" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="3d" id="3d" />
          <span>最近3天</span>
        </Label>
        <Label 
          htmlFor="7d" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="7d" id="7d" />
          <span>最近7天</span>
        </Label>
        <Label 
          htmlFor="30d" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="30d" id="30d" />
          <span>最近30天</span>
        </Label>
        <Label 
          htmlFor="custom" 
          className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value="custom" id="custom" />
          <span>自定义范围</span>
        </Label>
      </RadioGroup>
    </div>
  );

  // 状态选择
  const StatusTab = () => (
    <div className="space-y-4 py-2">
      {(Object.keys(statusMap) as ParameterStatus[]).map((status) => (
        <div key={status} className="flex items-center space-x-2">
          <Checkbox 
            id={`status-${status}`} 
            checked={tempFilter.status?.includes(status) || false}
            onCheckedChange={() => toggleStatus(status)}
          />
          <Label 
            htmlFor={`status-${status}`}
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <span className={statusMap[status].color}>{statusMap[status].icon}</span>
            <span>{statusMap[status].label}</span>
          </Label>
        </div>
      ))}
    </div>
  );

  // 类别选择
  const CategoriesTab = () => (
    <div className="space-y-4 py-2">
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">参数类别</h4>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(categoryMap) as ParameterCategory[]).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={tempFilter.categories?.includes(category) || false}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {categoryMap[category].label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">参数重要性</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['high', 'medium', 'low'] as const).map((importance) => (
            <div key={importance} className="flex items-center space-x-2">
              <Checkbox 
                id={`importance-${importance}`} 
                checked={tempFilter.importance?.includes(importance) || false}
                onCheckedChange={() => toggleImportance(importance)}
              />
              <Label 
                htmlFor={`importance-${importance}`}
                className="text-sm cursor-pointer"
              >
                {importanceMap[importance].label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 根据视口大小渲染不同的过滤器UI
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="p-0 h-8 w-8 rounded-full relative"
          title={t('filter.title', '过滤')}
        >
          <Sliders className="h-4 w-4" />
          {getActiveFilterCount() > 0 && (
            <Badge
              variant="secondary"
              className="h-4 w-4 p-0 flex items-center justify-center absolute -top-1 -right-1 text-[10px]"
            >
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>过滤监测数据</DialogTitle>
              <DialogDescription>
                设置过滤条件以查看特定的水质参数数据。
              </DialogDescription>
            </DialogHeader>
            
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="timeRange" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  时间范围
                </TabsTrigger>
                <TabsTrigger value="status" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  状态
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-xs">
                  <Sliders className="h-3 w-3 mr-1" />
                  类别
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'timeRange' && <TimeRangeTab />}
              {activeTab === 'status' && <StatusTab />}
              {activeTab === 'categories' && <CategoriesTab />}
            </Tabs>
            
            <DialogFooter className="flex gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm">
                清除过滤
              </Button>
              <Button onClick={applyFilter} size="sm">
                应用过滤
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-1 relative"
        >
          <FilterX className="h-3.5 w-3.5" />
          <span className="text-xs">{t('actions.filter', '过滤')}</span>
          {getActiveFilterCount() > 0 && (
            <Badge
              variant="secondary"
              className="h-4 w-4 p-0 flex items-center justify-center ml-1 text-[10px]"
            >
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">过滤监测数据</h3>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">时间范围</h4>
            <Select 
              value={tempFilter.timeRange} 
              onValueChange={(value) => setTempFilter(prev => ({ ...prev, timeRange: value as TimeRange }))}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">最近1小时</SelectItem>
                <SelectItem value="6h">最近6小时</SelectItem>
                <SelectItem value="12h">最近12小时</SelectItem>
                <SelectItem value="24h">最近24小时</SelectItem>
                <SelectItem value="3d">最近3天</SelectItem>
                <SelectItem value="7d">最近7天</SelectItem>
                <SelectItem value="30d">最近30天</SelectItem>
                <SelectItem value="custom">自定义范围</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">参数状态</h4>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(statusMap) as ParameterStatus[]).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filter-status-${status}`} 
                    checked={tempFilter.status?.includes(status) || false}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <Label 
                    htmlFor={`filter-status-${status}`}
                    className="flex items-center space-x-1 text-xs cursor-pointer"
                  >
                    <span className={statusMap[status].color}>{statusMap[status].icon}</span>
                    <span>{statusMap[status].label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">参数类别</h4>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(categoryMap) as ParameterCategory[]).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filter-category-${category}`} 
                    checked={tempFilter.categories?.includes(category) || false}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label 
                    htmlFor={`filter-category-${category}`}
                    className="text-xs cursor-pointer"
                  >
                    {categoryMap[category].label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">参数重要性</h4>
            <div className="flex flex-wrap gap-2">
              {(['high', 'medium', 'low'] as const).map((importance) => (
                <Label 
                  key={importance}
                  className="flex items-center space-x-1 text-xs cursor-pointer"
                >
                  <Checkbox 
                    id={`filter-importance-${importance}`} 
                    checked={tempFilter.importance?.includes(importance) || false}
                    onCheckedChange={() => toggleImportance(importance)}
                  />
                  <span>{importanceMap[importance].label}</span>
                </Label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              清除过滤
            </Button>
            <Button size="sm" onClick={applyFilter}>
              应用过滤
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MonitoringFilter; 