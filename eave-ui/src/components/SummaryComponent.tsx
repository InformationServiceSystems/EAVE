import { Card } from "@heroui/card";
import iconCoal from "/images/icon_coal.png";
import iconNuclear from "/images/icon_nuclear.jpg";
import iconWind from "/images/icon_wind.png";
import iconNaturalGas from "/images/icon_natural_gas.png";
import iconHydro from "/images/icon_hydro.png";
import iconOil from "/images/icon_oil.png";

const SummaryComponent = ({
  costData,
  totalEnergy,
  co2Consumption,
  pue,
  location,
  co2Equivalent,
}: {
  costData: number | null;
  totalEnergy: number | null;
  co2Consumption: number | null;
  pue: number | null;
  location: string;
  co2Equivalent: number | null;
}) => {
  return (
    <Card className="w-full p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
        Energy analytics summary
      </h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Frame Box */}
        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="border rounded-lg p-6 text-2xl font-bold text-center">
            <p className="text-gray-600 text-sm">Costs</p>
            <p className="text-gray-600">
              {costData ? `€${costData.toLocaleString("EN")}` : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Seasonal (3 months) cost to process 5B tokens/day
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Cost = Energy consumption (MWh) x Cost
              per MWh
            </p>
          </div>
        </div>
        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="border rounded-lg p-6 text-2xl font-bold text-center">
            <p className="text-gray-600 text-sm">Energy consumption</p>
            <p className="text-gray-600">
              {totalEnergy
                ? `${Number(totalEnergy).toLocaleString("EN")} MWh`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
                Measure total facility energy consumption per season (3 months)
            </p>
            <p className="text-sm text-gray-400 mt-2">
              E<sub>total</sub> = E<sub>IT</sub> + E<sub>Cooling</sub> + E<sub>Power</sub>
            </p>
          </div>
        </div>
        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="border rounded-lg p-6 text-2xl font-bold text-center">
            <p className="text-gray-600 text-sm">
              Power Usage Effectiveness (PUE)
            </p>
            <p className="text-gray-600">
              {pue
                ? `${pue.toLocaleString("EN")}`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
                Energy efficiency of a data center
            </p>
            <p className="text-sm text-gray-400 mt-2">
              PUE = E<sub>Total</sub> / E<sub>IT</sub>
            </p>
          </div>
        </div>
        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="border rounded-lg p-6 text-2xl font-bold text-center">
            <p className="text-gray-600 text-sm">
              CO<sub>2</sub> equivalent
            </p>
            <p className="text-gray-600">
              {co2Equivalent
                ? `${co2Equivalent.toLocaleString("EN")} kg/MWh`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Carbon intensity prediction: kilograms of CO<sub>2</sub> released to
              produce 1 MWh of energy
            </p>
          </div>
        </div>
        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="border rounded-lg p-6 text-2xl font-bold text-center pb-10">
            <p className="text-gray-600 text-sm">
              CO<sub>2</sub> emissions
            </p>
            <p className="text-gray-600">
              {co2Consumption
                ? `${co2Consumption.toLocaleString("EN")} kg`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
            CO<sub>2</sub> Emissions = CO<sub>2</sub> Equivalent x Energy consumption
            </p>
          </div>
        </div>

        <div className="rounded-lg p-6 text-2xl font-bold text-center">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-md font-bold mb-2 mt-2">
              Major energy source in {location}
            </h3>
            <div className="flex items-center justify-center">
              {(() => {
                const energyIcons: { [key: string]: string } = {
                  Germany: iconWind,
                  France: iconNuclear,
                  Netherlands: iconNaturalGas,
                  Italy: iconNaturalGas,
                  Poland: iconCoal,
                  Austria: iconHydro,
                  USA: iconOil,
                };

                const energyIcon = energyIcons[location] || null;

                return energyIcon ? (
                    <div className="flex flex-col items-center justify-center">
                      <img
                      src={energyIcon}
                      alt={`${location} Energy Source`}
                      className="h-20 w-auto"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                      Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
                      </p>
                    </div>
                  ) : (
                  <p className="text-gray-600 text-sm">No data available</p>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SummaryComponent;
