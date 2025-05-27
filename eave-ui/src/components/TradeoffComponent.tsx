import React from "react";
import { Card } from "@heroui/card";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from "recharts";
import * as d3 from "d3";

const TradeoffComponent: React.FC<{}> = () => {

  const data = [
    // {model: "Llama-3.3-70B-Instruct'", inference_time: 13.66, accuracy: 82, model_size: 70000, cost: 66142 },
    // {model: "PreActResNet18_NAS", inference_time: 22.07, accuracy: 71.34, model_size: 8000, cost: 66142 },
    { model: "ViT_FP32       ", inference_time: 83.17, accuracy: 84.5, model_size: 85.805577, cost: 111714 },
    { model: "ViT_FP32_(CPU_only)", inference_time: 1.90, accuracy: 86, model_size: 85.805577, cost: 55571 },
    { model: "ViT_Quantized_(CPU_only)", inference_time: 2.85, accuracy: 84.88, model_size: 85.805577, cost: 37875 },
    { model: "ViT FP32_KD", inference_time: 110.84, accuracy: 80.80, model_size: 5.528274, cost: 83714 },
    { model: "ViT_FP32_(CPU_only)_KD", inference_time: 13.86, accuracy: 84, model_size: 5.528274, cost: 7644},
    { model: "PreActResNet18", inference_time: 207.67, accuracy: 64.92, model_size: 11.177800, cost: 105571 },
    { model: "PreActResNet18_NAS", inference_time: 328.50, accuracy: 78.22, model_size: 1.288506, cost: 66142 },
  ];

  const inferenceMin = Math.min(...data.map((item) => item.inference_time));
  const inferenceMax = Math.max(...data.map((item) => item.inference_time));

  // Create a heatmap color scale using d3
  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([inferenceMax, inferenceMin]); // Inverted to match Red->Yellow->Green

  const getColor = (inferenceTime: number) => {
    return colorScale(inferenceTime);
  };

  const accuracyMin = Math.min(...data.map((item) => item.accuracy));
  const accuracyMax = Math.max(...data.map((item) => item.accuracy));
  const costMin = Math.min(...data.map((item) => item.cost));
  const costMax = Math.max(...data.map((item) => item.cost));

  const getBufferedDomain = (min: number, max: number) => {
    const buffer = (max - min) * 0.08;
    return [min - buffer, max + buffer];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { model, inference_time, accuracy, model_size, cost } = payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded shadow-md text-sm">
          <p className="font-bold">{model}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Cost: €{cost}</p>
          <p>Model Size: {model_size.toFixed(2)} MB</p>
          <p>Inference Time: {inference_time} ms</p>
        </div>
      );
    }
    return null;
  };

  const HeatmapLegend = () => {
    return (
      <div className="flex flex-col items-center mt-10">
        <span className="text-xs mb-1">Inference Time (ms)</span>
        
        <div className="flex flex-col text-xs">
          <span>{inferenceMin.toFixed(1)}</span>
            <div className="w-4 h-80 bg-gradient-to-b from-green-800 via-yellow-400 to-red-500"></div>
          <span >{inferenceMax.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-3/5 p-6">
      <h1 className="text-2xl font-bold py-1 inline-block rounded-md">
        Tradeoff Analysis
      </h1>
      <h2 className="text-xl font-bold text-center mb-4">Scatter plot with Pareto-optimal models</h2>
      <div className="flex">
        <ResponsiveContainer width="85%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="accuracy"
              name="Accuracy"
              unit="%"
              label={{ value: "Accuracy (%)", position: "bottom", offset: 10 }}
              domain={getBufferedDomain(accuracyMin, accuracyMax)}
              tickFormatter={(tick) => tick.toFixed(2)}
            />
            <YAxis
              type="number"
              dataKey="cost"
              name="Cost (€)"
              unit="€"
              domain={getBufferedDomain(costMin, costMax)}
              reversed
              label={{ value: "Cost (€)", angle: -90, position: "insideLeft", offset: -20 }}
              tickFormatter={(tick) => Number(tick.toFixed(0)).toLocaleString("EN")}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="center"
            />
            <Scatter
              name="Point Size = Model Size"
              data={data}
              shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                cx={cx}
                cy={cy}
                r={Math.sqrt(payload.model_size) * 2}
                fill={getColor(payload.inference_time)}
                stroke="#333"
                strokeWidth={1}
                />
              );
              }}
            >
              <LabelList dataKey="model" position="top" fontSize={"12px"} />
            </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
        <HeatmapLegend />
      </div>
    </Card>
  );
};

export default TradeoffComponent;
