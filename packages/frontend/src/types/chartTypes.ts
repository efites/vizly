export interface IChart {
  created_at: Date;
  download_url: string;
  filename: string;
  height: number;
  modified_at: Date;
  size: number;
  width: number;
}

export interface ChartWithPosition extends IChart {
  currentHeight: number;
  currentWidth: number;
  id: string;
  positionX: number;
  positionY: number;
  selected: boolean;
}

export interface ChartPosition {
  x: number;
  y: number;
}

export interface ChartSize {
  height: number;
  width: number;
}
