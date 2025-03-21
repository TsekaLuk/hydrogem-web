import React from 'react';
import { useSearch } from '@/contexts/search-context';
import { WaterQualityParameter } from '@/types/parameters';
import StatusIndicator from '@/components/ui/status-indicator';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, DropletIcon, ServerIcon, MapPinIcon, SearchX } from 'lucide-react';

/**
 * 水质参数卡片组件
 */
const ParameterCard: React.FC<{ parameter: WaterQualityParameter }> = ({ parameter }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-2 hover:shadow-md transition-all border-border/50 hover:border-border hover:translate-y-[-1px]">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <StatusIndicator status={parameter.status} size="sm" />
            {parameter.name}
          </CardTitle>
          <Badge variant="outline" className="capitalize text-xs font-normal">
            {t(`categories.${parameter.category}.name`, parameter.category)}
          </Badge>
        </div>
        <CardDescription className="text-xs opacity-70">
          ID: {parameter.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {parameter.current.toFixed(2)} {parameter.unit}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(`status.${parameter.status}`)}
            </span>
          </div>
          {parameter.importance && (
            <Badge variant="secondary" className="text-xs font-normal">
              {t(`importance.${parameter.importance}`)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 设备卡片组件
 */
const DeviceCard: React.FC<{ device: any }> = ({ device }) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-all border-border/50 hover:border-border hover:translate-y-[-1px]">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ServerIcon className="h-4 w-4 text-primary opacity-70" />
            {device.name}
          </CardTitle>
        </div>
        <CardDescription className="text-xs opacity-70">
          ID: {device.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{device.type}</span>
            {device.status && (
              <span className="text-xs text-muted-foreground">
                {device.status}
              </span>
            )}
          </div>
          {device.location && (
            <Badge variant="outline" className="text-xs font-normal">
              {typeof device.location === 'string'
                ? device.location
                : JSON.stringify(device.location)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 区域卡片组件
 */
const AreaCard: React.FC<{ area: any }> = ({ area }) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-all border-border/50 hover:border-border hover:translate-y-[-1px]">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-primary opacity-70" />
            {area.name}
          </CardTitle>
        </div>
        <CardDescription className="text-xs opacity-70">
          ID: {area.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{area.type}</span>
            {area.description && (
              <span className="text-xs text-muted-foreground">
                {area.description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 搜索结果组件
 */
const SearchResults: React.FC = () => {
  const { t } = useTranslation();
  const { isSearching, searchResults, hasResults, searchQuery } = useSearch();

  // 如果正在搜索，显示加载状态
  if (isSearching) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        <span className="text-sm text-muted-foreground">{t('search.searching')}</span>
      </div>
    );
  }

  // 如果没有结果，显示空状态
  if (!hasResults && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
        <SearchX className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-lg font-medium">{t('search.noResults')}</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t('search.tryDifferentQuery')}
        </p>
      </div>
    );
  }

  // 如果没有搜索查询，不显示任何内容
  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
        <DropletIcon className="h-10 w-10 text-primary/20" />
        <p className="text-base text-muted-foreground">
          {t('search.startTyping')}
        </p>
      </div>
    );
  }

  // 计算每个标签的结果数量
  const parametersCount = searchResults.parameters.length;
  const devicesCount = searchResults.devices.length;
  const areasCount = searchResults.areas.length;
  const allCount = parametersCount + devicesCount + areasCount;

  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            {t('search.all')} ({allCount})
          </TabsTrigger>
          <TabsTrigger value="parameters" disabled={parametersCount === 0} className="text-xs">
            {t('search.parameters')} ({parametersCount})
          </TabsTrigger>
          <TabsTrigger value="devices" disabled={devicesCount === 0} className="text-xs">
            {t('search.devices')} ({devicesCount})
          </TabsTrigger>
          <TabsTrigger value="areas" disabled={areasCount === 0} className="text-xs">
            {t('search.areas')} ({areasCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="custom-scrollbar h-[calc(100vh-300px)] pr-4 overflow-y-auto">
            {parametersCount > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DropletIcon className="h-4 w-4 text-primary/70" />
                  {t('search.parameters')} ({parametersCount})
                </h3>
                {searchResults.parameters.map((parameter) => (
                  <ParameterCard
                    key={parameter.id}
                    parameter={parameter}
                  />
                ))}
              </div>
            )}

            {devicesCount > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ServerIcon className="h-4 w-4 text-primary/70" />
                  {t('search.devices')} ({devicesCount})
                </h3>
                {searchResults.devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}

            {areasCount > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-primary/70" />
                  {t('search.areas')} ({areasCount})
                </h3>
                {searchResults.areas.map((area) => (
                  <AreaCard key={area.id} area={area} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="parameters">
          <div className="custom-scrollbar h-[calc(100vh-300px)] pr-4 overflow-y-auto">
            {searchResults.parameters.map((parameter) => (
              <ParameterCard
                key={parameter.id}
                parameter={parameter}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices">
          <div className="custom-scrollbar h-[calc(100vh-300px)] pr-4 overflow-y-auto">
            {searchResults.devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="areas">
          <div className="custom-scrollbar h-[calc(100vh-300px)] pr-4 overflow-y-auto">
            {searchResults.areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults; 