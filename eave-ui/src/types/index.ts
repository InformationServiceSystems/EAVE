import { CalendarDate } from "@internationalized/date";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type MeasureType = {
  hardware: string;
  processor: string;
  accelerator: string;
  location: string;
  task: string;
  model_mlc: string;
  cooling_efficiency: number;
  date: CalendarDate | null;
  month: string;
  year: string;
  num_nodes: number;
  num_accelerators: number;
  data_center_size: string;
};
