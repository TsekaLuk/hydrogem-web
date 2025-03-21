import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Wifi, WifiOff, Search, Plus, Download, Trash2,
  Edit, ServerCrash, Server, Smartphone, Router
} from 'lucide-react';

// 设备类型
type DeviceType = 'gateway' | 'sensor' | 'network';
// 设备连接状态
type ConnectionStatus = 'online' | 'offline';

// 设备接口
interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: ConnectionStatus;
  model: string;
  serial: string;
  productId: string;
  lastOnline?: Date;
}

// 模拟设备数据
const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: '温湿度监控设备',
    type: 'sensor',
    status: 'online',
    model: 'e3t88Wz9R0qLXpY7',
    serial: '9820630576993008',
    productId: '9820630576993008'
  },
  {
    id: 'device-2',
    name: '摄像头-1',
    type: 'sensor',
    status: 'offline',
    model: '343454',
    serial: '13971389759993856',
    productId: '13971389759993856'
  },
  {
    id: 'device-3',
    name: '海康监控-1223334',
    type: 'sensor',
    status: 'offline',
    model: '12331233243254',
    serial: '13971389759993856',
    productId: '13971389759993856'
  },
  {
    id: 'device-4',
    name: '海康监控-12233',
    type: 'sensor',
    status: 'offline',
    model: '123312332432',
    serial: '13971389759993856',
    productId: '13971389759993856'
  }
];

export function DeviceManagement() {
  const [devices] = useState<Device[]>(mockDevices);
  const [activeTab, setActiveTab] = useState<string>('list');

  // 设备统计信息
  const deviceStats = {
    total: devices.length,
    gateway: devices.filter(d => d.type === 'gateway').length,
    network: devices.filter(d => d.type === 'network').length,
    sensor: devices.filter(d => d.type === 'sensor').length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'gateway':
        return <Router className="h-5 w-5 text-blue-500" />;
      case 'network':
        return <Server className="h-5 w-5 text-purple-500" />;
      case 'sensor':
        return <Smartphone className="h-5 w-5 text-emerald-500" />;
      default:
        return <ServerCrash className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderDeviceStats = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">设备总数</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-amber-500">{deviceStats.total}</p>
                <p className="text-xs text-gray-500">总通设备</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-blue-500">{deviceStats.network}</p>
                <p className="text-xs text-gray-500">网关设备</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-green-500">{deviceStats.sensor}</p>
                <p className="text-xs text-gray-500">子设备</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">连接状态</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-blue-500">{deviceStats.online}</p>
                <p className="text-xs text-gray-500">在线</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-gray-500">{deviceStats.offline}</p>
                <p className="text-xs text-gray-500">离线</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">设备状态</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-emerald-500">{deviceStats.online}</p>
                <p className="text-xs text-gray-500">已激活</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-2xl font-bold text-gray-500">{deviceStats.offline}</p>
                <p className="text-xs text-gray-500">未激活</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDeviceFilters = () => {
    return (
      <div className="mb-4">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">设备列表</TabsTrigger>
            <TabsTrigger value="batch">批次列表</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="设备名称" className="w-full" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="所属产品" className="w-full" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="设备标识" className="w-full" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="设备SN号" className="w-full" />
          </div>
          
          <div className="flex gap-2">
            <Button variant="default" size="default" className="bg-teal-600 hover:bg-teal-700">
              <Search className="h-4 w-4 mr-2" />
              查询
            </Button>
            <Button variant="outline" size="default">
              重置
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeviceList = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">设备信息档案列表</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              添加设备
            </Button>
            <Button size="sm" variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              批量添加
            </Button>
            <Button size="sm" variant="outline" className="flex items-center">
              <Trash2 className="h-4 w-4 mr-1" />
              批量删除
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map(device => (
            <Card key={device.id} className="bg-white dark:bg-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <h4 className="font-medium">{device.name}</h4>
                  <div className="flex items-center mt-1">
                    {device.status === 'online' ? (
                      <>
                        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200 dark:border-emerald-800">
                          <Wifi className="h-3 w-3 mr-1" />
                          在线
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-2 bg-blue-50 text-blue-600 border-blue-200 dark:border-blue-800">
                          已激活
                        </Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:border-gray-700">
                          <WifiOff className="h-3 w-3 mr-1" />
                          离线
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-2 bg-gray-50 text-gray-600 border-gray-200 dark:border-gray-700">
                          未激活
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-gray-500">设备类型:</span>
                  <span>{device.type === 'gateway' ? '网关设备' : device.type === 'network' ? '网络设备' : '传感器设备'}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-gray-500">设备型号:</span>
                  <span>{device.model}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-gray-500">设备编码:</span>
                  <span>{device.serial}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr]">
                  <span className="text-gray-500">产品编号:</span>
                  <span>{device.productId}</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  编辑
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderDeviceStats()}
      {renderDeviceFilters()}
      {renderDeviceList()}
    </div>
  );
}

export default DeviceManagement; 