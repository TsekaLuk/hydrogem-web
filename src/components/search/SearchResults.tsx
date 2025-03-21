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
import { Loader2 } from 'lucide-react';

/**
 * 水质参数卡片组件
 */
const ParameterCard: React.FC<{ parameter: WaterQualityParameter }> = ({ parameter }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <StatusIndicator status={parameter.status} />
            {parameter.name}
          </CardTitle>
          <Badge variant="outline">{parameter.category}</Badge>
        </div>
        <CardDescription className="text-xs">
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
            <Badge variant="secondary" className="text-xs">
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
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="py-3">
        <CardTitle className="text-base">{device.name}</CardTitle>
        <CardDescription className="text-xs">
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
            <Badge variant="outline" className="text-xs">
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
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="py-3">
        <CardTitle className="text-base">{area.name}</CardTitle>
        <CardDescription className="text-xs">
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
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t('search.searching')}</span>
      </div>
    );
  }

  // 如果没有结果，显示空状态
  if (!hasResults && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-lg font-medium mb-2">{t('search.noResults')}</p>
        <p className="text-sm text-muted-foreground">
          {t('search.tryDifferentQuery')}
        </p>
      </div>
    );
  }

  // 如果没有搜索查询，不显示任何内容
  if (!searchQuery) {
    return null;
  }

  // 计算每个标签的结果数量
  const parametersCount = searchResults.parameters.length;
  const devicesCount = searchResults.devices.length;
  const areasCount = searchResults.areas.length;
  const allCount = parametersCount + devicesCount + areasCount;

  return (
    <div className="w-full">
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            {t('search.all')} ({allCount})
          </TabsTrigger>
          <TabsTrigger value="parameters" disabled={parametersCount === 0}>
            {t('search.parameters')} ({parametersCount})
          </TabsTrigger>
          <TabsTrigger value="devices" disabled={devicesCount === 0}>
            {t('search.devices')} ({devicesCount})
          </TabsTrigger>
          <TabsTrigger value="areas" disabled={areasCount === 0}>
            {t('search.areas')} ({areasCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {parametersCount > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
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
                <h3 className="text-lg font-medium mb-2">
                  {t('search.devices')} ({devicesCount})
                </h3>
                {searchResults.devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}

            {areasCount > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  {t('search.areas')} ({areasCount})
                </h3>
                {searchResults.areas.map((area) => (
                  <AreaCard key={area.id} area={area} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="parameters">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {searchResults.parameters.map((parameter) => (
              <ParameterCard
                key={parameter.id}
                parameter={parameter}
              />
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="devices">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {searchResults.devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="areas">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {searchResults.areas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults; 