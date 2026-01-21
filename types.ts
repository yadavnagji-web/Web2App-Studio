
export interface AppConfig {
  url: string;
  name: string;
  packageName: string;
  themeColor: string;
  category: string;
  permissions: {
    camera: boolean;
    location: boolean;
    microphone: boolean;
    storage: boolean;
  };
  iconUrl?: string;
}

export interface StoreMetadata {
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  featureGraphicUrl?: string;
}

export interface GeneratedCode {
  mainActivity: string;
  manifest: string;
  buildGradle: string;
  stringsXml: string;
  stylesXml: string;
}

export enum AppStep {
  INITIAL = 'INITIAL',
  BRANDING = 'BRANDING',
  FEATURES = 'FEATURES',
  GENERATING = 'GENERATING',
  BUILDING = 'BUILDING',
  STORE_LISTING = 'STORE_LISTING',
  COMPLETE = 'COMPLETE'
}
