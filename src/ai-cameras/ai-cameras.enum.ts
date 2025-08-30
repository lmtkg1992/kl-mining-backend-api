export enum AiCameraTypeEnum {
  perimeter = "perimeter",
  operational = "operational",
  monitoring = "monitoring",
}

export enum AiCameraStatusEnum {
  online = "online",
  maintenance = "maintenance",
  offline = "offline",
}

export enum AiCameraFeatureEnum {
  truck_detection = "truck_detection",
  boundary = "boundary",
  volume = "volume",
  personnel = "personnel",
  truck_load = "truck_load",
  safety = "safety",
  chemical = "chemical",
}

// src/ai-cameras/ai-cameras.enum.ts
export const AiCameraEnumDisplay = {
  "ai-cameras_type": {
    perimeter: "Perimeter",
    operational: "Operational",
    monitoring: "Monitoring",
  },
  "ai-cameras_status": {
    online: "Online",
    maintenance: "Maintenance",
    offline: "Offline",
  },
  "ai-cameras_ai_features": {
    truck_detection: "Truck Detection",
    boundary: "Boundary",
    volume: "Volume",
    personnel: "Personnel",
    truck_load: "Truck Load",
    safety: "Safety",
    chemical: "Chemical",
  },
};
