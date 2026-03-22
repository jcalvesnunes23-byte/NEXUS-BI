export type ThemeId = 'dark-purple' | 'dark-blue' | 'dark-green' | 'dark-orange' | 'light' | 'dark-red';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  emoji: string;
  bg: string;
  bgCard: string;
  bgInput: string;
  primary: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  chart: string[];
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'dashboard';
  parentId: string | null;
  children?: string[]; // IDs of children (for folders)
  data?: SavedDashboard; // for dashboards
  createdAt: string;
}

export interface SheetColumn {
  name: string;
  type: 'numeric' | 'date' | 'categorical' | 'text';
  values: (string | number | null)[];
  unique?: string[];
}

export interface SheetData {
  fileName: string;
  sheetNames: string[];
  activeSheet: string;
  columns: SheetColumn[];
  rowCount: number;
  rawData: Record<string, unknown>[];
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  unit?: string;
  trend?: number; // % change
  trendUp?: boolean;
  icon: string;
  column: string;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xColumn: string;
  yColumn: string;
  data: { label: string; value: number }[];
  description: string;
}

export interface InsightCard {
  id: string;
  number: number;
  title: string;
  text: string;
  action?: string;
  type: 'trend' | 'alert' | 'suggestion' | 'highlight';
}

export interface ActiveFilter {
  column: string;
  value: string;
}

export interface SavedDashboard {
  id: string;
  name: string;
  kpis: KPI[];
  charts: ChartConfig[];
  insights: InsightCard[];
  themeId: ThemeId;
  fileName: string;
  savedAt: string;
  activeFilters: ActiveFilter[];
  sheetData?: SheetData;
}
