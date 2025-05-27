import { Card, CardBody } from "@heroui/card";
import carIcon from "/images/car_icon.png";
import worldEmissions from "/images/worldEmissions.png"; 
import iconCoal from "/images/icon_coal.png";
import iconNuclear from "/images/icon_nuclear.jpg";
import iconWind from "/images/icon_wind.png";
import iconNaturalGas from "/images/icon_natural_gas.png";
import iconHydro from "/images/icon_hydro.png";
import iconOil from "/images/icon_oil.png";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CO2Component = ({
  co2equivalent,
  co2Consumption,
  location,
  energyMix
}: {
  co2equivalent: number | null;
  co2Consumption: number | null;
  location: string;
  energyMix: { [key: string]: number };
}) => {

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
    <text x={x} y={y} fill="white" fontSize="10" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
    </text>
    );
};

return (
    <Card className="w-full p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
            CO<sub>2</sub> emissions
        </h2>

        <CardBody className="flex flex-row gap-14 mt-4 justify-between">
            {/* Frame Box */}
            <div className="w-1/4 rounded-lg p-6 text-2xl font-bold text-center">
                <div className="border rounded-lg p-6 text-2xl font-bold text-center">
                    <p className="text-gray-600 text-sm">CO<sub>2</sub> equivalent</p>
                    <p className="text-gray-600">
                        {co2equivalent
                            ? `${co2equivalent.toLocaleString("EN")} kg/MWh`
                            : "N/A"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Carbon intensity prediction: kilograms of CO<sub>2</sub> released to produce 1 MWh of energy
                    </p>
                </div>
                <div className="border rounded-lg p-6 text-2xl font-bold text-center mt-4">
                <p className="text-gray-600 text-sm">CO<sub>2</sub> emission</p>
                <p className="text-gray-600">
                    {co2Consumption
                        ? `${co2Consumption.toLocaleString("EN")} kg`
                        : "N/A"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                        CO<sub>2</sub> Emissions = CO<sub>2</sub> Equivalent x Energy consumption
                    </p>
                </div>
                <div className="border p-3 rounded-lg bg-gray-100 text-sm mt-10">
                    <p className="font-bold">Comparison with automobiles</p>
                    <p className="font-semibold text-sm">
                        175g of CO<sub>2</sub> equivalent corresponds to 1 kilometer driven with a
                        small car
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mt-6">
                        <img
                            src={carIcon}
                            alt="Car Icon"
                            className="h-20 w-auto mr-3"
                        />
                        <p className="text-gray-600 text-xl font-bold mr-2">
                            {co2Consumption
                                ? `${(Math.round((co2Consumption * 100 * 1000) / 175) / 100).toLocaleString("EN")} km `
                                : "N/A"}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Designed by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline">Freepik</a>
                    </p>
                </div>
            </div>

            <div className="w-1/4 rounded-lg p-6 text-2xl font-bold text-center">
                <h3 className="text-md font-bold mb-2 mt-2">Energy mix in {location}</h3>
                <div className="flex flex-col justify-center mt-10">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={Object.entries(energyMix).map(([key, value]) => ({
                                    name: key,
                                    value,
                                }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {Object.keys(energyMix).map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ fontSize: "12px" }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{ fontSize: "12px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-sm text-gray-500 mt-6">
                        <p className="text-gray-400 text-sm">Sources:</p>
                        <a
                            href="https://www.cleanenergywire.org/factsheets/how-energy-systems-and-policies-germany-and-france-compare"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 underline"
                        >
                            Clean Energy Wire
                        </a>
                        <br />
                        <a
                            href="https://lowcarbonpower.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 underline"
                        >
                            Low Carbon Power
                        </a>
                        <br />
                        <a
                            href="https://www.eia.gov/energyexplained/us-energy-facts/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 underline"
                        >
                            U.S. Energy Information Administration
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-1/2 rounded-lg p-6 text-2xl font-bold text-center">
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
                <div className="flex flex-col items-center mt-20">
                    <img
                        src={worldEmissions}
                        alt="Europe Emissions"
                        className="w-auto"
                    />
                    <div className="text-sm text-gray-400 ml-4">
                        Source:{" "}
                        <a
                            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 underline"
                        >
                            Global Carbon Budget (2024)
                        </a>
                    </div>
                </div>
                
            </div>        
        </CardBody>
    </Card>
  );
};

export default CO2Component;
