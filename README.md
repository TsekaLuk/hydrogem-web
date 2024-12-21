# Water Quality Monitoring System

A React-based water quality monitoring system that provides real-time tracking of various water quality parameters.

## Features

- Monitors 37 different water quality parameters
- Real-time data updates every 5 seconds
- Comprehensive parameter categories:
  - Organic compounds
  - Physical parameters
  - Metal ions
  - Ion components
  - Toxic substances
  - Biological indicators

## Tech Stack

- React
- TypeScript
- React Hooks

## Installation

```bash
npm install
```

## Usage

```typescript
import { useMonitoringData } from './hooks/useMonitoringData';

function WaterQualityDashboard() {
  const { parameters, lastUpdated } = useMonitoringData();
  
  return (
    // Your component implementation
  );
}
```

## Parameter Categories

1. Organic Parameters (11 indicators)
2. Physical Parameters (6 indicators)
3. Metal Ions (9 indicators)
4. Ion Components (7 indicators)
5. Toxic Substances (2 indicators)
6. Biological Indicators (2 indicators)

## License

MIT License

## Author

TsekaLuk 