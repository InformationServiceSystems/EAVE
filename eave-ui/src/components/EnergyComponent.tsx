import { Card } from "@heroui/card";
import house from "/images/family-home.svg";
import spring from "/images/icon_spring.png";
import summer from "/images/icon_summer.png";
import autumn from "/images/icon_fall.png";
import winter from "/images/icon_winter.png";
import { CalendarDate } from "@internationalized/date";

const EnergyComponent = ({
  flag,
  totalEnergy,
  predictedTotalEnergy,
  energyDiff,
  measureDate,
  predictDate,
  location,
  predictLocation,
}: {
  flag: boolean;
  totalEnergy: number | null;
  predictedTotalEnergy: number | null;
  energyDiff: number | null;
  measureDate: CalendarDate | null;
  predictDate: CalendarDate | null;
  location: string;
  predictLocation: string;
}) => {
  return (
    <Card className="w-full p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
        Energy consumption
      </h2>

      <div className="flex items-center mt-4">
        {/* Frame Box */}
        <div className="w-1/3 rounded-lg p-6 text-2xl font-bold flex-col text-center mr-3">
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
          <div className="border p-5 rounded-lg bg-gray-50 pb-8">
            
            <p className="text-gray-600">
              {totalEnergy
                ? `${Number(totalEnergy.toFixed(2)).toLocaleString("EN")} MWh/season`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Measure total facility energy consumption per season (3 months)
            </p>
            {flag && (
              <p className="text-sm text-gray-400 mt-2">
                E<sub>total</sub> = E<sub>IT</sub> + E<sub>Cooling</sub> + E
                <sub>Power</sub>
              </p>
            )}
          </div>
          {!flag && (
            <div className="flex items-center justify-center mt-6">
              <p className="text-gray-600 text-xl font-bold mr-2">
                {totalEnergy
                  ? `${Math.round(totalEnergy / 4).toLocaleString("EN")} x`
                  : "N/A"}
              </p>
              <img
                src={house}
                alt="Energy comparison icon"
                className="w-20 h-20 ml-2"
              />
              <p className="text-xs text-gray-400 mt-2">
                Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
              </p>
            </div>
          )}
        </div>

        {!flag && (
          <div className="w-1/3 rounded-lg p-6 text-2xl font-bold text-center mr-3">
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
                  <p className="text-xs text-gray-400 mt-2 ml-2">
                    Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
                  </p>
                </div>
            )}
            <div className="border p-4 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm"></p>
              <p className="text-gray-600">
                {predictedTotalEnergy
                  ? `${Number(predictedTotalEnergy.toFixed(2)).toLocaleString("EN")} MWh/season`
                  : "N/A"}
              </p>
              <p
                className={
                  predictedTotalEnergy === null || totalEnergy === null
                    ? "text-sm text-gray-600"
                    : predictedTotalEnergy < totalEnergy
                      ? "text-sm text-green-600"
                      : predictedTotalEnergy <= 1.01 * totalEnergy
                        ? "text-sm text-gray-600"
                        : "text-sm text-red-600"
                }
              >
                {energyDiff
                  ? `(${Number(energyDiff).toLocaleString("EN")}%)`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Predicted total facility energy consumption per season (3 months)
              </p>
            </div>

            <div className="flex items-center justify-center mt-6">
              <p className="text-gray-600 text-xl font-bold mr-2">
                {predictedTotalEnergy
                  ? `${Math.round(predictedTotalEnergy / 4).toLocaleString("EN")} x`
                  : "N/A"}
              </p>
              <img
                src={house}
                alt="Energy comparison icon"
                className="w-20 h-20 ml-2"
              />
              <p className="text-xs font-bold text-gray-400 mt-2 ml-2">
                Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
              </p>
            </div>
          </div>
        )}

        {/* {!flag && (
          <div className="w-1/3 rounded-lg p-6 text-2xl text-center">
          
            <div className="border p-2 rounded-lg bg-gray-100 text-sm">
              <p className="font-bold">Energy comparison:</p>
              <p>
                House with a family of 4 people requires approx. <br />
                4,000 kWh/year
              </p>
            </div>
          </div>
        )} */}

        {flag && (
          <div className="w-2/3 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <p className="text-gray-600 text-xl font-bold mr-2">
                  {totalEnergy
                    ? `${Math.round(totalEnergy / 4).toLocaleString("EN")} x`
                    : "N/A"}
                </p>
                <img
                  src={house}
                  alt="Energy comparison icon"
                  className="w-20 h-20 ml-2"
                />
              </div>
              <p className="text-xs font-bold text-gray-400 mt-2">
                Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
              </p>
            </div>
            {/* Text Box */}
            <div className="border p-2 rounded-lg bg-gray-100 text-sm">
              <p className="font-bold">Energy comparison:</p>
              <p>
                House with a family of 4 people requires approx. <br />
                4,000 kWh/year
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnergyComponent;
