# HydroGem Component Design Standards

## Introduction

This document provides detailed guidance on how to apply the component design standards from Cuicui, HeroUI, 21st.dev, Material UI, and Motion Primitives to the HydroGem water monitoring system. By adhering to these standards, we ensure a consistent, accessible, and visually refined user experience across all components and modules.

## Overarching Principles

1. **Consistency Over Creativity**: Prioritize consistent patterns over creative variations.
2. **Accessibility First**: Design with accessibility in mind from the beginning, not as an afterthought.
3. **Progressive Disclosure**: Present information and controls based on relevance and importance.
4. **Responsive by Default**: All components must function well across device sizes.
5. **Animation with Purpose**: Use animations to convey meaning, not for decoration.

## Component Library References

### Material UI

Material UI provides our foundational component architecture and accessibility standards.

#### Key Principles to Apply:

- **Component Composition**: Use composition over inheritance, with small reusable components that can be combined.
- **Prop API Design**: Follow Material UI's prop naming and behavioral patterns for consistency.
- **Grid System**: Use Material UI's Grid components for layout to ensure responsiveness.
- **Form Components**: Adhere to Material UI's form component patterns for validation and state management.
- **Theme Integration**: Extend Material UI's theming system to maintain customization flexibility.

#### Example Application:

```tsx
// Data grid for parameters list
<DataGrid
  rows={parameters}
  columns={parameterColumns}
  pageSize={10}
  rowsPerPageOptions={[5, 10, 25]}
  checkboxSelection
  disableSelectionOnClick
  components={{
    Toolbar: ParametersGridToolbar,
  }}
  getRowClassName={(params) => 
    `parameter-row-${params.row.status}`
  }
/>
```

### HeroUI

HeroUI influences our interaction design patterns and component state handling.

#### Key Principles to Apply:

- **State Transitions**: Follow HeroUI's patterns for component state transitions.
- **Loading States**: Implement consistent loading states for all asynchronous operations.
- **Error Handling**: Apply HeroUI's error state visualization patterns.
- **Empty States**: Design meaningful empty states following HeroUI's guidelines.
- **Interaction Feedback**: Provide immediate feedback for all user interactions.

#### Example Application:

```tsx
// Status indicator with loading and error states
<StatusIndicator
  status={waterAreaStatus}
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  emptyState={{
    icon: <WaterDropIcon />,
    message: "No data available for this water area",
    action: <Button onClick={handleAddData}>Add Data</Button>
  }}
/>
```

### 21st.dev

21st.dev influences our layout patterns and card-based information design.

#### Key Principles to Apply:

- **Card Layouts**: Use 21st.dev's card layout patterns for entity displays.
- **Information Hierarchy**: Apply their information density and hierarchy principles.
- **Content Sections**: Structure content following 21st.dev's sectioning approach.
- **Expandable Content**: Implement expandable/collapsible sections for detailed information.
- **Mobile Adaptations**: Follow their patterns for mobile layout adaptations.

#### Example Application:

```tsx
// Device card with expandable details
<DeviceCard
  device={device}
  compact={isMobile}
  expandable
  expandedContent={<DeviceDetails device={device} />}
  actions={[
    { icon: <EditIcon />, label: "Edit", onClick: handleEdit },
    { icon: <ChartIcon />, label: "View Data", onClick: handleViewData },
  ]}
/>
```

### Cuicui

Cuicui influences our visual design finesse and micro-interactions.

#### Key Principles to Apply:

- **Visual Refinement**: Apply Cuicui's attention to visual detail in component design.
- **Micro-interactions**: Implement subtle interactive elements that enhance usability.
- **Visual Hierarchy**: Use their approach to creating visual hierarchy.
- **Color Application**: Follow their color application principles for status indicators.
- **Typography Usage**: Apply their typography patterns for readability and hierarchy.

#### Example Application:

```tsx
// Parameter value display with subtle interaction and visual refinement
<ParameterValue
  value={parameter.value}
  unit={parameter.unit}
  status={parameter.status}
  thresholds={parameter.thresholds}
  trend={parameter.trend}
  showVisualIndicator
  hoverEffect="pulse"
  onClick={handleParameterClick}
/>
```

### Motion Primitives

Motion Primitives guides our animation patterns and transitions between states and views.

#### Key Principles to Apply:

- **Transition Timing**: Use consistent timing functions for animations.
- **State Transitions**: Apply animation for component state changes.
- **Page Transitions**: Implement smooth transitions between pages and views.
- **Hierarchy Navigation**: Use motion to indicate navigation between hierarchical levels.
- **Focus Indicators**: Animate focus indicators for improved accessibility.

#### Example Application:

```tsx
// Animated transition for hierarchical navigation
<AnimatedHierarchyView
  items={waterAreaHierarchy}
  currentLevel={currentLevel}
  onNavigate={handleNavigate}
  transitionType="slide"
  transitionDirection={isNavigatingDown ? "forward" : "backward"}
  animateItems
/>
```

## Specific Component Guidelines

### 1. MonitoringDashboard

Apply these specific principles:
- Material UI's Container and Grid for layout
- 21st.dev's card layout patterns for parameter sections
- HeroUI's state management for alerts and status indicators
- Cuicui's visual refinement for status badges
- Motion Primitives' transitions for tab switching

### 2. WaterQualityPanel

Apply these specific principles:
- Material UI's Data Grid for parameter lists
- 21st.dev's expandable card pattern for parameter details
- HeroUI's loading and error states for data fetching
- Cuicui's micro-interactions for parameter value displays
- Motion Primitives' animations for threshold violations

### 3. DeviceManagement

Apply these specific principles:
- Material UI's component composition for device cards
- 21st.dev's responsive grid layout for device listing
- HeroUI's empty states for areas without devices
- Cuicui's visual hierarchy for device status indicators
- Motion Primitives' transitions for device detail expansion

### 4. SpatialManagement

Apply these specific principles:
- Material UI's Tree View for hierarchical navigation
- 21st.dev's sectioning for spatial entity details
- HeroUI's interaction patterns for map interactions
- Cuicui's visual refinement for boundary highlighting
- Motion Primitives' animations for zooming and panning

## Application in Hierarchical Systems

### 1. Region Components

Apply:
- Material UI's Container and Tabs for layout
- 21st.dev's overview cards for region summaries
- HeroUI's interaction patterns for drill-down navigation
- Cuicui's visual treatment for administrative boundaries
- Motion Primitives' transitions for level changes

### 2. Watershed Components

Apply:
- Material UI's Paper and Divider for content sectioning
- 21st.dev's feature sections for watershed highlights
- HeroUI's state transitions for data loading
- Cuicui's typography for watershed names and descriptions
- Motion Primitives' flow animations for water movement

### 3. Water Area Components

Apply:
- Material UI's Cards and Chips for area information
- 21st.dev's expandable card pattern for water area details
- HeroUI's empty states for areas without data
- Cuicui's micro-interactions for water quality indicators
- Motion Primitives' transitions for parameter chart animation

## Mobile-Specific Adaptations

1. **Navigation**: Replace tab navigation with bottom navigation following Material UI patterns
2. **Information Density**: Reduce information density following 21st.dev's mobile patterns
3. **Touch Targets**: Increase touch target sizes according to HeroUI guidelines
4. **Gestures**: Implement gesture navigation with Motion Primitives animations
5. **Progressive Loading**: Apply Cuicui's progressive loading patterns for mobile networks

## Accessibility Specifications

1. **Color Contrast**: Follow Material UI's contrast requirements (WCAG AA minimum)
2. **Keyboard Navigation**: Implement focused navigation following HeroUI patterns
3. **Screen Reader Support**: Ensure all components have proper ARIA attributes
4. **Reduced Motion**: Provide reduced motion alternatives as specified by Motion Primitives
5. **Text Scaling**: Support text scaling without layout breaking following 21st.dev patterns

## Implementation Process

1. **Component Design Review**: Review designs against all referenced libraries
2. **Prototype Creation**: Create interactive prototypes focusing on state transitions
3. **Accessibility Testing**: Test all components for accessibility compliance
4. **Responsive Testing**: Verify behavior across device sizes
5. **Performance Benchmarking**: Ensure animations and transitions meet performance standards

## Example Implementation: Parameter Card

Here's how to apply all standards to a parameter card component:

```tsx
const ParameterCard = ({ parameter }) => {
  const [expanded, setExpanded] = useState(false);
  const { status, value, name, unit, trend } = parameter;
  
  // Follow Material UI's component composition pattern
  return (
    <Card
      elevation={1}
      className={clsx(
        "parameter-card",
        `parameter-card--${status}`,
        expanded && "parameter-card--expanded"
      )}
      // Apply 21st.dev's card layout pattern
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        transition: 'all 0.2s ease-in-out', // Motion Primitives timing
        '&:hover': {
          transform: 'translateY(-2px)', // Cuicui micro-interaction
          boxShadow: 2
        }
      }}
    >
      <CardHeader
        // HeroUI loading state pattern
        avatar={
          <StatusIndicator 
            status={status} 
            loading={parameter.loading} 
            animated
          />
        }
        title={name}
        // Cuicui typography pattern
        titleTypographyProps={{ 
          variant: "subtitle1", 
          fontWeight: "medium",
          color: "text.primary"
        }}
        action={
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'baseline',
            mb: 1 
          }}
        >
          {/* Cuicui visual refinement */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 0.5 }}
          >
            {unit}
          </Typography>
          {/* HeroUI trend indicator pattern */}
          <TrendIndicator 
            trend={trend} 
            size="small" 
            sx={{ ml: 'auto' }} 
          />
        </Box>
        
        {/* 21st.dev's expandable content pattern */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <ParameterChart 
              parameter={parameter} 
              // Motion Primitives animation
              animate={{
                y: [20, 0],
                opacity: [0, 1],
                transition: { duration: 0.3 }
              }} 
            />
            <ParameterThresholds parameter={parameter} />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
```

## Documentation and Support

1. **Component Storybook**: Document all components in Storybook with examples
2. **Interaction Patterns**: Document standard interaction patterns with examples
3. **Animation Guidelines**: Provide animation timing and easing function guidelines
4. **Accessibility Checklist**: Provide an accessibility checklist for all components
5. **Mobile Adaptation Guide**: Document standard mobile adaptations for components

---

By adhering to these standards consistently across all components, we ensure a cohesive, accessible, and visually refined user experience for the HydroGem water monitoring system that accommodates both simple use cases (small fish ponds) and complex hierarchical management systems. 