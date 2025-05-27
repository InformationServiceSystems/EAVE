import { Card } from "@heroui/card";
import spring from "/images/icon_spring.png";
import summer from "/images/icon_summer.png";
import autumn from "/images/icon_fall.png";
import winter from "/images/icon_winter.png";
import { CalendarDate } from "@internationalized/date";

const CO2Component = ({
  co2Consumption,
  predictedco2Consumption,
  co2Diff,
  measureDate,
  predictDate,
  location,
  predictLocation,
}: {
  co2Consumption: number | null;
  predictedco2Consumption: number | null;
  co2Diff: number | null;
  measureDate: CalendarDate | null;
  predictDate: CalendarDate | null;
  location: string;
  predictLocation: string;
}) => {

  return (
    <Card className="w-full p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
        CO<sub>2</sub> Emissions
      </h2>

      <div className="flex items-center mt-4">
        {/* Frame Box */}
        <div className="w-1/3 rounded-lg p-6 text-2xl font-bold flex-col text-center mr-3">
          {measureDate && (
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
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="text-gray-600">
              {co2Consumption
                ? `${co2Consumption.toLocaleString("EN")} kg`
                : "N/A"}
            </p>
            </div>
          
        </div>

        {/* Frame Box */}
        <div className="w-1/3 rounded-lg p-6 text-2xl font-bold flex-col text-center mr-3">
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
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="text-gray-600">
              {predictedco2Consumption
                ? `${predictedco2Consumption.toLocaleString("EN")} kg`
                : "N/A"}
            </p>
            <p
              className={
                predictedco2Consumption === null || co2Consumption === null
                ? "text-sm text-gray-600"
                : predictedco2Consumption < co2Consumption
                  ? "text-sm text-green-600"
                  : predictedco2Consumption <= co2Consumption * 1.01
                  ? "text-sm text-gray-600"
                  : "text-sm text-red-600"
              }
              >
              {co2Diff
                ? `(${Number(co2Diff).toLocaleString("EN")}%)`
                : "N/A"}
              </p>
          </div>
          
        </div>

        {/* <div className="w-1/3 rounded-lg p-6 text-2xl font-bold flex-col text-center mr-3">
          <div className="flex items-center justify-center">
            <img
              src={carIcon}
              alt="Company Logo"
              className="h-20 w-auto mr-3"
            />
            <p className="text-gray-600 text-xl font-bold mr-2">
              {predictedco2Consumption
                ? `${(Math.round((predictedco2Consumption * 100 * 1000) / 175) / 100).toLocaleString("EN")} km `
                : "N/A"}
            </p>
          </div>
          <div className="border p-3 rounded-lg bg-gray-100 text-sm">
            <p className="font-bold">Comparison with automobiles</p>
            <ul className="list-disc list-inside">
              <li>
                175g of CO<sub>2</sub> equivalent corresponds to 1 kilometer driven with a
                small car
              </li>
            </ul>
          </div>
        </div>   */}
      </div>
    </Card>
  );
};

export default CO2Component;
