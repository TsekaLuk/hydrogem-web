# Hydrogem Web

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Version](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0.0-blue.svg)

A professional React-based water quality monitoring system that provides real-time tracking and analysis of various water quality parameters. Built with modern web technologies and best practices, this system offers comprehensive monitoring capabilities for water quality management.

## 🌟 Features

### Real-time Monitoring
- **37 Parameter Tracking**: Comprehensive monitoring of water quality indicators
- **5-Second Updates**: Real-time data refresh every 5 seconds
- **Trend Analysis**: Track parameter changes and trends over time
- **Automated Alerts**: Instant notifications for out-of-range parameters

### Parameter Categories
| Category | Count | Description |
|----------|--------|-------------|
| Organic | 11 | Total nitrogen, phosphorus, carbon, etc. |
| Physical | 6 | pH, turbidity, conductivity, etc. |
| Metals | 9 | Zinc, copper, cadmium, etc. |
| Ions | 7 | Chloride, sulfate, fluoride, etc. |
| Toxins | 2 | Phenols, methanol |
| Biological | 2 | Chlorophyll, dissolved oxygen |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/TsekaLuk/hydrogem-web.git
cd hydrogem-web
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## 💻 Usage

### Basic Implementation
```typescript
import { useMonitoringData } from './hooks/useMonitoringData';

function WaterQualityDashboard() {
  const { parameters, lastUpdated } = useMonitoringData();
  
  return (
    <div>
      <h2>Water Quality Parameters</h2>
      <p>Last Updated: {lastUpdated.toLocaleString()}</p>
      {parameters.map(param => (
        <ParameterCard key={param.id} parameter={param} />
      ))}
    </div>
  );
}
```

### Available Hooks
- `useMonitoringData`: Core hook for accessing water quality data
- `useAlerts`: Manage monitoring alerts and notifications
- `useAnalyticsData`: Access historical data and analytics

## 🏗️ Project Structure

```
hydrogem-web/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── contexts/      # React contexts
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static files
└── docs/             # Documentation
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.0.0
- **State Management**: React Hooks & Context
- **Development Tools**:
  - ESLint for code quality
  - React Testing Library for testing
  - React Scripts for build tooling

## 📈 Performance

- Real-time updates with minimal latency
- Optimized rendering with React's virtual DOM
- Efficient data structures for large datasets
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**TsekaLuk** - *Initial work and maintenance*

## 🙏 Acknowledgments

- React team for the amazing framework
- Contributors and testers
- Water quality monitoring standards organizations

## 📞 Support

For support and questions, please [open an issue](https://github.com/TsekaLuk/hydrogem-web/issues) on our GitHub repository.

---
Made with ❤️ by TsekaLuk 