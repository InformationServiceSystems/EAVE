import React from "react";
import { Card, CardBody } from "@heroui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dc_energy_pie_chart from "/images/dc_energy_pie_chart.jpeg";
import spring from "/images/icon_spring.png";
import summer from "/images/icon_summer.png";
import autumn from "/images/icon_fall.png";
import winter from "/images/icon_winter.png";
import { CalendarDate } from "@internationalized/date";

interface CostComponentProps {
  flag: boolean;
  costData: string | number;
  predictedPrice?: string | number;
  energyPrice: { year: number; price: number }[];
  location: string;
  measureDate: CalendarDate | null;
  predictDate: CalendarDate | null;
  costDiff: number | null;
  predictLocation: string;
}

const CostComponent: React.FC<CostComponentProps> = ({
  flag = true,
  costData,
  predictedPrice,
  energyPrice,
  location,
  measureDate,
  predictDate,
  costDiff,
  predictLocation,
}) => {
  return (
    <Card className="w-full p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">Costs</h2>

      {/* Cost Breakdown */}
      <CardBody className="flex flex-row gap-4 p-4 rounded-lg mt-2 justify-between">
        {/* Left Column - Frame */}
        <div className="w-1/3 rounded-lg p-6 text-2xl font-bold text-center mt-2">
          {/* {!flag && <h3 className="text-md font-bold">Cost</h3>} */}
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
          {/* <h3 className="text-md font-bold mb-2">Cost</h3> */}
          <div className="border p-4 w-full text-center font-bold text-gray-600 pb-7">
            {costData ? `€${Number(costData).toLocaleString("EN")}` : "N/A"}
            <p className="text-sm text-gray-400 mt-2">
              Seasonal (3 months) cost to process 5B tokens/day</p>
            <p className="text-sm text-gray-400 mt-2">
              Cost = Energy consumption (MWh) x Cost
              per MWh
            </p>
          </div>
          
        </div>

        {/* Middle Column - Predicted Energy Price (conditionally rendered) */}

        {flag && (
          <div className="w-1/3 rounded-lg p-6 text-2xl font-bold text-center">
            <img
              src={dc_energy_pie_chart}
              alt="DC Energy Pie Chart"
              className="w-auto"
            />
            <p className="text-sm text-gray-400 mt-2">
              Source:{" "}
              <a
              href="https://www.energystar.gov/ia/partners/prod_development/downloads/EPA_Datacenter_Report_Congress_Final1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 underline"
              >
              Total Data Center Energy Breakdown (U.S. Environmental Protection Agency, 2007)
              </a>
            </p>
          </div>
        )}

        {!flag && predictedPrice && (
          <div className="w-1/3 rounded-lg p-6 text-2xl font-bold text-center mt-2">
            {/* <h3 className="text-md font-bold mb-2">Optimized predicted costs</h3> */}
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
            <div className={"border p-4 w-full text-center font-bold pb-9"}>
              <p
                className={"text-gray-600"}
              >
                {predictedPrice
                  ? `€${Number(predictedPrice).toLocaleString("EN")}`
                  : "N/A"}
              </p>
                <p
                className={
                  predictedPrice === null
                  ? "text-sm text-gray-600"
                  : Number(predictedPrice) < Number(costData)
                    ? "text-sm text-green-600"
                    : Number(predictedPrice) <= Number(costData) * 1.01
                    ? "text-sm text-gray-600"
                    : "text-sm text-red-600"
                }
                >
                {costDiff
                  ? `(${Number(costDiff).toLocaleString("EN")}%)`
                  : "N/A"}
                </p>
              <p className="text-sm text-gray-400 mt-2">
                Energy consumption (MWh) x Predicted cost per MWh
              </p>
              
            </div>
            
          </div>
        )}

        {/* Right Column - Graph */}
        {flag && (
          <div className="w-1/3 flex flex-col items-center">
            <h3 className="text-md font-bold mb-2 mt-2">
              Energy price development ({location})
            </h3>
            <div className="w-full h-60 border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyPrice || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    label={{ value: "€/MWh", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="price" fill="#17C964" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm font-bold text-gray-400 mt-2">
              Source:{" "}
              <a
                href="https://www.smard.de/home/downloadcenter/download-marktdaten/?downloadAttributes=%7B%22selectedCategory%22:1,%22selectedSubCategory%22:1,%22selectedRegion%22:false,%22selectedFileType%22:false,%22from%22:1742079600000,%22to%22:1743029999999%7D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 underline"
              >
                SMARD Market Data
              </a>
            </p>
          </div>
        )}

        {!flag && predictLocation && (
          <div className="w-1/3 flex flex-col items-center">
            <h3 className="text-md font-bold mb-2 mt-2">
              Energy price development ({predictLocation.charAt(0).toUpperCase() + predictLocation.slice(1)})
            </h3>
            <div className="w-full h-60 border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyPrice || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    label={{ value: "€/MWh", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="price" fill="#17C964" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm font-bold text-gray-400 mt-2">
              Source:{" "}
              <a
                href="https://www.smard.de/home/downloadcenter/download-marktdaten/?downloadAttributes=%7B%22selectedCategory%22:1,%22selectedSubCategory%22:1,%22selectedRegion%22:false,%22selectedFileType%22:false,%22from%22:1742079600000,%22to%22:1743029999999%7D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 underline"
              >
                SMARD Market Data
              </a>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CostComponent;
