import { Card, CardBody } from "@heroui/card";
import { CalendarDate } from "@internationalized/date";
import spring from "/images/icon_spring.png";
import summer from "/images/icon_summer.png";
import autumn from "/images/icon_fall.png";
import winter from "/images/icon_winter.png";
import { FC } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ReferenceLine,
  ScatterChart,
  Dot,
  DotProps,
  LabelList,
} from "recharts";

const RenderDot: FC<DotProps & { color?: string; size?: number }> = ({ cx, cy, color = "purple", size=1 }) => {
  return (
    <Dot cx={cx} cy={cy} fill={color} r={size} />
  )
}

const PueComponent = ({ 
  pue, 
  flag,
  predictedPue,
  measureDate,
  predictDate,
  location,
  predictLocation,
}: { 
  pue: number | null, 
  flag: boolean,
  predictedPue: number | null,
  measureDate: CalendarDate | null,
  predictDate: CalendarDate | null,
  location: string,
  predictLocation: string,
}) => {
  // Sample data for the chart
  const data = [{ x: 1, y: pue}];
  const predictedData = [{ x: 1, y: predictedPue}];
  const dummyData = [{x: 0, y: 1.7}, {x: 1, y: 1.7}, {x: 2, y: 1.7}];
  const color = (pue === null? "black": pue < 1.5 ? "green": pue <= 1.9? "blue": "red");

  const PUEFormula = () => {
    return (
      <div style={{ textAlign: "center", fontSize: "18px" }}>
        <div style={{ marginTop: "-20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ marginRight: "8px" }}>PUE =</span>
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <div>Total facility energy consumption</div>
            <hr style={{ margin: "2px 0", border: "1px solid black" }} />
            <div>IT equipment energy consumption</div>
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white shadow-lg rounded-md">
          <p className="text-sm font-semibold">{payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
        Power Usage Effectiveness (PUE)
      </h2>
      <CardBody className="flex flex-row gap-14 mt-4">
        {/* Comparison Chart */}
        <div className="w-2/5 justify-center">
          {!flag && measureDate && (
              <div className="my-4 flex justify-center items-center gap-4">
                <p className="text-md font-bold">{location.slice(0, 3).toUpperCase()}</p>
                <img
                src={
                  measureDate.month >= 3 && measureDate.month <= 5
                  ? spring
                  : measureDate.month >= 6 && measureDate.month <= 8
                  ? summer
                  : measureDate.month >= 9 && measureDate.month <= 11
                  ? autumn
                  : winter
                }
                alt="Season Icon"
                className={
                  measureDate.month >= 3 && measureDate.month <= 5
                  ? "h-14 w-auto"
                  : "h-14 w-auto"
                }
                />
              <p className="text-xs text-gray-400 mt-2">
                Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
              </p>
              </div>
            )}
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              {/* Hidden X-axis */}
              <XAxis dataKey="x" type="number" hide />

              {/* Y-axis for PUE values */}
              <YAxis
              domain={[0.9, 2.5]}
              label={{ value: "PUE", angle: -90, position: "insideLeft" }}
              dataKey="y"
              />

              {/* Tooltip */}
              <Tooltip content={<CustomTooltip />} />

              {/* Scatter point */}
              <Scatter name="PUE plot" data={data} shape={<RenderDot color={color} size={4}/>}>
                <LabelList dataKey="y" position="top"/>
              </Scatter>

              {/* Dummy Data to center the chart */}
              <Scatter name="Dummy Data" data={dummyData} shape={<RenderDot size={1}/>}/>

              {/* Benchmark Line at 1.7 */}
              <ReferenceLine
                y={1.7}
                stroke="purple"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ position: 'top', value: 'Current average (DE)', style: { fontSize: '12px' }  }}
              />
              <ReferenceLine
                y={1.5}
                stroke="orange"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ position: 'top', value: 'Regulatory threshold for data centers from 07/01/2027', style: { fontSize: '12px' }  }}
              />
              <ReferenceLine
                y={1.3}
                stroke="green"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ position: 'top', value: 'Regulatory threshold for data centers from 07/01/2030', style: { fontSize: '12px' }  }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {flag &&(
          <div className="w-2/5 mt-24">
            <p className="text-l text-gray-600 ml-6">
            <PUEFormula />
            </p>
          </div>
        )}

        {!flag && predictedPue && (
          <div className="w-2/5">
            {predictDate && (
              <div className="my-4 flex justify-center items-center gap-4">
                <p className="text-md font-bold">{predictLocation.slice(0, 3).toUpperCase()}</p>
                <img
                  src={
                  predictDate.month >= 3 && predictDate.month <= 5
                    ? spring
                    : predictDate.month >= 6 && predictDate.month <= 8
                    ? summer
                    : predictDate.month >= 9 && predictDate.month <= 11
                      ? autumn
                      : winter
                  }
                  alt="Season Icon"
                  className={
                    predictDate.month >= 3 && predictDate.month <= 5
                    ? "h-14 w-auto"
                    : "h-14 w-auto"
                  }
                  />
                <p className="text-xs text-gray-400 mt-2">
                  Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
                </p>
              </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                {/* Hidden X-axis */}
                <XAxis dataKey="x" type="number" hide />

                {/* Y-axis for PUE values */}
                <YAxis
                domain={[0.9, 2.5]}
                label={{ value: "PUE", angle: -90, position: "insideLeft", style: { fontSize: '12px' } }}
                dataKey="y"
                />

                {/* Tooltip */}
                <Tooltip content={<CustomTooltip />} />

                {/* Scatter point */}
                <Scatter name="PUE plot" data={predictedData} shape={<RenderDot color={color} size={4}/>}>
                  <LabelList dataKey="y" position="top"/>
                </Scatter>
                {/* Label */} 
                {/* Dummy Data to center the chart */}
                <Scatter name="Dummy Data" data={dummyData} shape={<RenderDot size={1}/>}/>
          
                {/* Benchmark Line at 1.7 */}
                <ReferenceLine
                  y={1.7}
                  stroke="purple"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ position: 'top', value: 'Current average (DE)', style: { fontSize: '12px' } }}
                />
                <ReferenceLine
                  y={1.5}
                  stroke="orange"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ position: 'top', value: 'Regulatory threshold for data centers from 07/01/2027', style: { fontSize: '12px' } }}
                />
                <ReferenceLine
                  y={1.3}
                  stroke="green"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ position: 'top', value: 'Regulatory threshold for data centers from 07/01/2030', style: { fontSize: '12px' } }}
                />
                </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Information Box */}
        {flag &&(
          <div className="w-1/5 border p-3 rounded-lg bg-gray-100 text-sm">
            <p className="font-bold">Background:</p>
            <ul className="list-disc list-inside">
              <li>
                Data centers built before 07/01/2026:
                <ul className="ml-4">
                  <li>07/01/2027: PUE ≤ 1.5</li>
                  <li>07/01/2030: PUE <strong>≤ 1.3</strong></li>
                </ul>
              </li>
              <li>
                Data centers built after 07/01/2026:
                <ul className="ml-4">
                  <li>PUE ≤ 1.2 on average</li>
                </ul>
              </li>
              <p className="font-bold">
                <li>Current average PUE (Statistic): 1.7</li>
              </p>
              <li>
                <a
                  href="https://www.germandatacenters.com/news/detail/ueberblick-enefg-fuer-rechenzentren/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 underline"
                >
                  Learn more about EnEfG for data centers regulations
                </a>
              </li>
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PueComponent;
