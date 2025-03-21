import { Database, BookOpen, Search, BrainCircuit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';

export function KnowledgeGraph() {
  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    // 模拟从API获取数据
    const fetchGraphData = async () => {
      // 实际项目中，这将是一个API调用
      setTimeout(() => {
        setGraphData([
          { id: 1, name: 'Concept A' },
          { id: 2, name: 'Concept B' },
          { id: 3, name: 'Concept C' }
        ]);
      }, 500);
    };
    
    fetchGraphData();
  }, []);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">璇玑玉衡</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索知识库..."
              className="pl-8 h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <BookOpen className="h-4 w-4" />
            <span>文档</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="graph" className="flex-1 flex flex-col px-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="graph">知识图谱</TabsTrigger>
          <TabsTrigger value="entities">沧海遗珠</TabsTrigger>
          <TabsTrigger value="schemas">模式定义</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph" className="flex-1 bg-background/50 rounded-md p-4 border mt-2 overflow-auto">
          <div className="flex items-center justify-center h-full border-2 border-dashed border-primary/20 rounded-lg p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <BrainCircuit className="h-12 w-12 text-primary/40" />
              <h3 className="text-lg font-medium">知识图谱视图</h3>
              <p className="text-muted-foreground max-w-md">
                此区域将展示知识实体及其关系的可视化。支持实体关系查询、知识推理和图谱浏览。
              </p>
              <Button variant="outline" className="mt-1">
                加载样例图谱
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="entities" className="flex-1 bg-background/50 rounded-md p-4 border mt-2 overflow-auto">
          <div className="flex items-center justify-center h-full border-2 border-dashed border-primary/20 rounded-lg p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Database className="h-12 w-12 text-primary/40" />
              <h3 className="text-lg font-medium">沧海遗珠</h3>
              <p className="text-muted-foreground max-w-md">
                此区域将展示知识库中的实体和概念，可用于实体查询、管理和关联分析。
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schemas" className="flex-1 bg-background/50 rounded-md p-4 border mt-2 overflow-auto">
          <div className="flex items-center justify-center h-full border-2 border-dashed border-primary/20 rounded-lg p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <BookOpen className="h-12 w-12 text-primary/40" />
              <h3 className="text-lg font-medium">知识模式定义</h3>
              <p className="text-muted-foreground max-w-md">
                此区域将展示知识图谱的模式定义，包括实体类型、关系类型和属性定义等。
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default KnowledgeGraph;