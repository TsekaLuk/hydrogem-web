# HydroGem Water Monitoring System - Data Model Design

## Overview

This document outlines the data model design for the HydroGem water quality monitoring system, focusing on the entities, their relationships, and the flexible hierarchical structure that accommodates both large-scale water management systems and smaller water body monitoring use cases.

## Core Entities

### 1. Region (片区)

Represents an administrative or geographical region.

```typescript
interface Region {
  id: string;
  name: string;
  code: string;           // Administrative code
  level: number;          // Administrative level (e.g., 1: province, 2: city)
  parentId?: string;      // Optional parent region
  description?: string;
  boundary?: GeoJSON;     // Geographical boundary
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}
```

### 2. Watershed (流域)

Represents a natural watershed area.

```typescript
interface Watershed {
  id: string;
  name: string;
  regionId: string;       // Parent region
  parentId?: string;      // Optional parent watershed (for hierarchical watersheds)
  description?: string;
  area: number;           // Area in km²
  boundary?: GeoJSON;     // Geographical boundary
  mainRiver?: string;     // Main river name
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}
```

### 3. WaterArea (水域)

Represents a specific water body such as a lake, river section, reservoir, or pond.

```typescript
interface WaterArea {
  id: string;
  name: string;
  type: WaterAreaType;    // 'lake' | 'river' | 'reservoir' | 'pond' | 'wetland'
  regionId: string;       // Direct parent region
  watershedId?: string;   // Optional parent watershed (can be null for standalone water bodies)
  description?: string;
  area: number;           // Area in km²
  volume?: number;        // Volume in m³
  location: GeoJSON;      // Geographical location/boundary
  standardIds: string[];  // Applied water quality standards
  tags: string[];         // Custom tags for categorization
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}
```

### 4. Device (设备)

Represents a monitoring device or sensor deployed in a water area.

```typescript
interface Device {
  id: string;
  name: string;
  type: DeviceType;      // 'sensor' | 'gateway' | 'station'
  model: string;         // Device model
  serialNumber: string;  // Serial number
  status: DeviceStatus;  // 'online' | 'offline' | 'maintenance' | 'fault'
  waterAreaId: string;   // Associated water area
  location: GeoLocation; // Geographical coordinates
  deploymentDate: Date;  // When the device was deployed
  lastMaintenance?: Date; // Last maintenance date
  parameters: string[];  // List of parameter IDs this device can measure
  connectionInfo: {      // Connection information
    protocol: string;    // 'mqtt' | 'http' | 'coap'
    address: string;     // IP or domain
    port: number;
  };
  metadata: Record<string, any>; // Additional device-specific metadata
  createdAt: Date;
  updatedAt: Date;
  lastDataReceived?: Date; // Last time data was received
  isActive: boolean;
}
```

### 5. Parameter (参数)

Represents a water quality parameter measured by devices.

```typescript
interface Parameter {
  id: string;
  name: string;
  code: string;          // Parameter code (e.g., 'pH', 'DO', 'NH3-N')
  unit: string;          // Measurement unit
  category: ParameterCategory; // 'physical' | 'chemical' | 'biological' | 'metal' | 'organic'
  description?: string;
  standardRanges: {      // Standard acceptable ranges
    min: number;
    max: number;
    standardId: string;  // Reference to water quality standard
  }[];
  metadata: Record<string, any>; // Additional parameter metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### 6. Measurement (测量数据)

Represents a single parameter measurement from a device.

```typescript
interface Measurement {
  id: string;
  deviceId: string;      // Source device
  parameterId: string;   // Measured parameter
  timestamp: Date;       // Measurement time
  value: number;         // Measured value
  unit: string;          // Measurement unit
  quality: DataQuality;  // 'valid' | 'suspect' | 'invalid'
  metadata: Record<string, any>; // Additional measurement metadata
}
```

### 7. Alert (告警)

Represents an alert triggered by abnormal parameters or device issues.

```typescript
interface Alert {
  id: string;
  type: AlertType;       // 'parameter' | 'device' | 'system'
  level: AlertLevel;     // 'info' | 'warning' | 'critical' | 'emergency'
  status: AlertStatus;   // 'active' | 'acknowledged' | 'resolved' | 'closed'
  sourceId: string;      // Parameter ID or Device ID that triggered the alert
  sourceType: string;    // 'parameter' | 'device'
  waterAreaId: string;   // Associated water area
  value?: number;        // Value that triggered the alert (for parameter alerts)
  timestamp: Date;       // When the alert was generated
  description: string;   // Alert description
  resolvedAt?: Date;     // When the alert was resolved
  resolvedBy?: string;   // Who resolved the alert
  resolutionNotes?: string; // Notes about the resolution
}
```

## Flexible Hierarchical Relationships

The data model is designed to support flexible hierarchical relationships:

### 1. Direct Region to Water Area Relationship

For small water bodies (e.g., fish ponds) that don't need watershed management:

```
Region → WaterArea → Device → Parameter → Measurement
```

In this case, the `WaterArea` entity has:
- `regionId` pointing to its parent `Region`
- `watershedId` set to `null`

### 2. Full Hierarchical Relationship

For large water systems that benefit from watershed management:

```
Region → Watershed → WaterArea → Device → Parameter → Measurement
```

In this case, the `WaterArea` entity has:
- `regionId` pointing to its parent `Region`
- `watershedId` pointing to its parent `Watershed`

### 3. Mixed Hierarchical Relationships

A single Region can manage both:
- Water areas directly (independent water bodies)
- Watersheds, which contain their own water areas

This allows for maximum flexibility based on the actual geographical and management needs.

## Data Aggregation

Data can be aggregated at different levels of the hierarchy:

1. **Water Area Level**: Aggregates measurements from all devices within a water area
2. **Watershed Level**: Aggregates data from all water areas within a watershed
3. **Region Level**: Aggregates data from:
   - All directly managed water areas
   - All watersheds (and their water areas) within the region

## Data Access Patterns

### Forward Direction (Parent to Child)

1. Get all watersheds in a region:
   ```
   SELECT * FROM watersheds WHERE regionId = :regionId AND isActive = true
   ```

2. Get all water areas in a region (both direct and via watersheds):
   ```
   SELECT * FROM waterAreas 
   WHERE (regionId = :regionId OR watershedId IN 
     (SELECT id FROM watersheds WHERE regionId = :regionId)
   ) AND isActive = true
   ```

3. Get all devices in a water area:
   ```
   SELECT * FROM devices WHERE waterAreaId = :waterAreaId AND isActive = true
   ```

### Reverse Direction (Child to Parent)

1. Find water area for a device:
   ```
   SELECT * FROM waterAreas WHERE id = (
     SELECT waterAreaId FROM devices WHERE id = :deviceId
   ) AND isActive = true
   ```

2. Find region for a water area (either direct or via watershed):
   ```
   SELECT * FROM regions WHERE id = (
     SELECT COALESCE(
       (SELECT regionId FROM waterAreas WHERE id = :waterAreaId),
       (SELECT regionId FROM watersheds WHERE id = (
         SELECT watershedId FROM waterAreas WHERE id = :waterAreaId
       ))
     )
   ) AND isActive = true
   ```

## Data Model Adaptability

### Supporting Small Water Body Management

For users managing small water bodies:
1. They can create water areas directly under regions
2. No watershed creation is required
3. UI will automatically adapt to show the simplified hierarchy

### Supporting Large-Scale Water Management

For users managing large water systems:
1. They can create watersheds under regions
2. Water areas can be created under watersheds
3. UI will show the complete hierarchical structure

## Implementation Considerations

1. **Soft Delete**: All entities implement soft deletion through the `isActive` flag to maintain referential integrity and historical context.

2. **Audit Trail**: All entities include creation and modification timestamps and user references for auditability.

3. **Flexible Relationships**: The model allows water areas to be associated with either regions or watersheds, providing flexibility in the hierarchical structure.

4. **Performance Optimization**: Consider materializing common aggregate queries for performance in large-scale systems.

5. **Data Validation**: Implement validation rules to ensure data integrity across the hierarchical structure.

## User Permissions Model

Access to data is controlled through a role-based permission system with region-based access limitations:

```typescript
interface UserPermission {
  userId: string;
  regionIds: string[];  // Regions the user has access to
  role: UserRole;       // 'viewer' | 'operator' | 'manager' | 'administrator'
  permissions: {
    region: Permission[];   // e.g., ['view', 'create', 'update', 'delete']
    watershed: Permission[];
    waterArea: Permission[];
    device: Permission[];
    parameter: Permission[];
    measurement: Permission[];
    alert: Permission[];
  };
}
```

This ensures users can only access and manage data within their assigned regions and according to their role-based permissions.

---

This data model design provides a flexible foundation for the HydroGem water monitoring system, accommodating both simple and complex water management hierarchies while ensuring data integrity, traceability, and appropriate access controls. 