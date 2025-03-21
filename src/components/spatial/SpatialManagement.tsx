import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { 
  MapPin, LayoutDashboard, Globe, Droplets, Filter, Map
} from 'lucide-react';

// Spatial types
type SpatialType = 'watershed' | 'region' | 'waterBody';

// Spatial entity interface
interface SpatialEntity {
  id: string;
  name: string;
  type: SpatialType;
  area: number; // Area in km²
  description: string;
}

// Mock spatial data
const mockSpatialEntities: SpatialEntity[] = [
  {
    id: 'spatial-1',
    name: '太湖流域',
    type: 'watershed',
    area: 36500,
    description: '太湖流域位于长江三角洲南翼，跨江苏、浙江、上海、安徽四省市，是中国重要的经济区域。'
  },
  {
    id: 'spatial-2',
    name: '东太湖水域',
    type: 'waterBody',
    area: 2250,
    description: '东太湖水域是太湖的重要组成部分，水质清澈，生态环境良好。'
  },
  {
    id: 'spatial-3',
    name: '西太湖片区',
    type: 'region',
    area: 1200,
    description: '西太湖片区位于太湖西侧，是重要的水源保护区和生态功能区。'
  }
];

export function SpatialManagement() {
  const [activeTab, setActiveTab] = useState<string>('watershed');
  const [spatialEntities] = useState<SpatialEntity[]>(mockSpatialEntities);

  // Get appropriate icon for spatial type
  const EntityIcon = ({ type }: { type: SpatialType }) => {
    switch (type) {
      case 'watershed':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'region':
        return <Map className="h-4 w-4 text-emerald-500" />;
      case 'waterBody':
        return <Globe className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Info card component
  const InfoCard = () => (
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
      <div className="flex items-center mb-2">
        <Filter className="h-4 w-4 text-blue-500 mr-2" />
        <h2 className="text-sm font-medium text-blue-700 dark:text-blue-300">空间管理</h2>
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400">
        通过空间管理功能，您可以管理不同的水域、流域和区域，并关联监测设备和水质数据。
      </p>
    </div>
  );

  // Spatial card component
  const SpatialCard = ({ entity }: { entity: SpatialEntity }) => (
    <Card key={entity.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">{entity.name}</h4>
          <EntityIcon type={entity.type} />
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">面积:</span>
            <span>{entity.area} km²</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{entity.description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button size="sm" variant="outline" className="h-8">
          <LayoutDashboard className="h-3 w-3 mr-1" />
          查看详情
        </Button>
      </CardFooter>
    </Card>
  );

  // Tab content component
  const TabContent = ({ type, title }: { type: SpatialType, title: string }) => {
    const filteredEntities = spatialEntities.filter(entity => entity.type === type);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <Button size="sm" variant="outline" className="h-8">
            <MapPin className="h-3 w-3 mr-2" />
            添加{title.replace('信息', '')}
          </Button>
        </div>
        
        {filteredEntities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map(entity => (
              <SpatialCard key={entity.id} entity={entity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            暂无{title}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <InfoCard />
      
      <Tabs defaultValue="watershed" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="watershed" className="flex items-center justify-center">
            <Droplets className="h-4 w-4 mr-2" />
            流域管理
          </TabsTrigger>
          <TabsTrigger value="region" className="flex items-center justify-center">
            <Map className="h-4 w-4 mr-2" />
            片区管理
          </TabsTrigger>
          <TabsTrigger value="waterBody" className="flex items-center justify-center">
            <Globe className="h-4 w-4 mr-2" />
            水域管理
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="watershed">
          <TabContent type="watershed" title="流域信息" />
        </TabsContent>
        
        <TabsContent value="region">
          <TabContent type="region" title="片区信息" />
        </TabsContent>
        
        <TabsContent value="waterBody">
          <TabContent type="waterBody" title="水域信息" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SpatialManagement; 