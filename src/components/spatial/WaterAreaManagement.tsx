import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Globe, LayoutDashboard, Droplets, Filter, Plus, Search, 
  MapPin, Trash2, Pencil, Eye
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Water area types
type WaterAreaType = 'lake' | 'river' | 'reservoir' | 'pond' | 'wetland';

// Water area interface
interface WaterArea {
  id: string;
  name: string;
  type: WaterAreaType;
  regionId: string;      // Direct parent region
  watershedId?: string;  // Optional parent watershed
  description?: string;
  area: number;          // Area in km²
  tags: string[];        // Custom tags for categorization
}

// Mock water areas data
const mockWaterAreas: WaterArea[] = [
  {
    id: 'water-1',
    name: '东太湖水域',
    type: 'lake',
    regionId: 'region-1',
    watershedId: 'watershed-1',
    description: '东太湖水域是太湖的重要组成部分，水质清澈，生态环境良好。',
    area: 2250,
    tags: ['饮用水源', '重点保护']
  },
  {
    id: 'water-2',
    name: '青溪河段',
    type: 'river',
    regionId: 'region-1',
    watershedId: 'watershed-1',
    description: '青溪河段流经多个乡镇，是重要的农业灌溉水源。',
    area: 120,
    tags: ['灌溉用水', '一般保护']
  },
  {
    id: 'water-3',
    name: '明珠湖',
    type: 'reservoir',
    regionId: 'region-2',
    description: '明珠湖是城市内重要的景观湖泊，也是附近居民的休闲场所。',
    area: 85,
    tags: ['景观用水', '一般保护']
  }
];

// Mock watersheds and regions for selection
const mockWatersheds = [
  { id: 'watershed-1', name: '太湖流域' },
  { id: 'watershed-2', name: '钱塘江流域' }
];

const mockRegions = [
  { id: 'region-1', name: '苏州片区' },
  { id: 'region-2', name: '杭州片区' }
];

export function WaterAreaManagement() {
  const [waterAreas] = useState<WaterArea[]>(mockWaterAreas);
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Get appropriate icon for water area type
  const getTypeIcon = (type: WaterAreaType) => {
    switch (type) {
      case 'lake':
        return <Globe className="h-4 w-4 text-blue-600" />;
      case 'river':
        return <Droplets className="h-4 w-4 text-sky-500" />;
      case 'reservoir':
        return <Droplets className="h-4 w-4 text-teal-500" />;
      case 'pond':
        return <Droplets className="h-4 w-4 text-emerald-500" />;
      case 'wetland':
        return <Droplets className="h-4 w-4 text-green-500" />;
      default:
        return <Globe className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get type label in Chinese
  const getTypeLabel = (type: WaterAreaType) => {
    const typeMap: Record<WaterAreaType, string> = {
      'lake': '湖泊',
      'river': '河流',
      'reservoir': '水库',
      'pond': '池塘',
      'wetland': '湿地'
    };
    return typeMap[type] || type;
  };

  // Info card component
  const InfoCard = () => (
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
      <div className="flex items-center mb-2">
        <Filter className="h-4 w-4 text-blue-500 mr-2" />
        <h2 className="text-sm font-medium text-blue-700 dark:text-blue-300">水域管理</h2>
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400">
        水域管理模块允许您创建和管理不同类型的水体，包括湖泊、河流、水库等，并可将其关联到相应的流域和区域。
      </p>
    </div>
  );

  // Filter and search bar
  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="搜索水域名称..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="所有类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有类型</SelectItem>
            <SelectItem value="lake">湖泊</SelectItem>
            <SelectItem value="river">河流</SelectItem>
            <SelectItem value="reservoir">水库</SelectItem>
            <SelectItem value="pond">池塘</SelectItem>
            <SelectItem value="wetland">湿地</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="sm:w-auto">
        <Plus className="h-4 w-4 mr-2" /> 添加水域
      </Button>
    </div>
  );

  // Water area card component
  const WaterAreaCard = ({ waterArea }: { waterArea: WaterArea }) => (
    <Card key={waterArea.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium flex items-center">
            {getTypeIcon(waterArea.type)}
            <span className="ml-2">{waterArea.name}</span>
          </h4>
          <Badge variant="outline">{getTypeLabel(waterArea.type)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">面积:</span>
            <span>{waterArea.area} km²</span>
          </div>
          {waterArea.watershedId && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">流域:</span>
              <span>{mockWatersheds.find(w => w.id === waterArea.watershedId)?.name || '-'}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">区域:</span>
            <span>{mockRegions.find(r => r.id === waterArea.regionId)?.name || '-'}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{waterArea.description}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {waterArea.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button size="sm" variant="outline" className="h-8">
          <Eye className="h-3.5 w-3.5 mr-1" />
          查看详情
        </Button>
      </CardFooter>
    </Card>
  );

  // Filter water areas based on search and type filter
  const filteredWaterAreas = waterAreas.filter(area => {
    const matchesSearch = searchTerm === '' || 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === 'all' || area.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Map view placeholder
  const MapView = () => (
    <div className="border rounded-md h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">地图视图</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md mt-2">
          此视图将显示所有水域的地理位置分布，支持交互式地图操作。
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <InfoCard />
      
      <FilterBar />
      
      <Tabs defaultValue="list" value={activeView} onValueChange={(v) => setActiveView(v as 'list' | 'map')} className="w-full">
        <TabsList className="grid grid-cols-2 w-[200px] mb-6">
          <TabsTrigger value="list" className="flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            列表视图
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center justify-center">
            <MapPin className="h-4 w-4 mr-2" />
            地图视图
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {filteredWaterAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWaterAreas.map(waterArea => (
                <WaterAreaCard key={waterArea.id} waterArea={waterArea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm border rounded-md bg-gray-50 dark:bg-gray-900">
              未找到符合条件的水域数据
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map">
          <MapView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WaterAreaManagement; 