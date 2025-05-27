import { useEffect, useState } from "react";
import CostComponent from "./CostComponent";
import EnergyComponent from "./EnergyComponent";
import PueComponent from "./PueComponent";
import { Spinner } from "@heroui/spinner";
import DrivingFactors from "./DrivingFactorsComponent";
import { CalendarDate, parseDate } from "@internationalized/date";
import CO2MeasureComponent from "./CO2MeasureComponent";
import SummaryComponent from "./SummaryComponent";

interface MeasureComponentProps {
  measureData: any;
  location: string;
}

const MeasureComponent: React.FC<MeasureComponentProps> = ({
  measureData,
  location,
}) => {

  const [apiResponse, setApiResponse] = useState<any>(measureData);
  const [loading, setLoading] = useState<boolean>(false);
  const [measureDate, setMeasureDate] = useState<CalendarDate | null>(null);

  useEffect(() => {
    console.log(`MeasureComponent.tsx:`);
    if (apiResponse) {
      setLoading(false);
      setApiResponse(measureData);
    } else {
      setLoading(false);
    }
    console.log(apiResponse);
  }, [measureData]);

  useEffect(() => {
    if (apiResponse?.measureDate) {
      setMeasureDate(parseDate(apiResponse.measureDate));
    }
  }, [apiResponse]);

  const recommendations = [
    {
      id: "1",
      factor: "Accelerators",
      status: "warning",
      magnitude: -2.268173,
      impact:
        "Negative impact: This means higher accelerator power dissipation significantly reduces PUE.",
      recommendation:
        "Optimize accelerator usage by leveraging workload scheduling, power-efficient accelerators, and dynamic voltage scaling.",
      source: "https://www.computer.org/csdl/magazine/it/2024/06/10832449/23jFinH8O2I",
    },
    {
      id: "2",
      factor: "Total Facility Energy (MWh)",
      status: "warning",
      magnitude: -1.93272,
      impact: "Negative impact: More IT power consumption decreases PUE.",
      recommendation:
        "Improve server efficiency, optimize hardware utilization, and use energy-efficient processors.",
      source: "https://www.sciencedirect.com/science/article/abs/pii/S0378778814003594",
    },
    {
      id: "3",
      factor: "Cooling Load Factor",
      status: "success",
      magnitude: 0.2386,
      impact: "Positive impact: More cooling load increases PUE.",
      recommendation:
        "Invest in liquid cooling, improve airflow management, and use AI-driven cooling strategies.",
      source: "https://www.sciencedirect.com/science/article/abs/pii/S1359431124007804",
    },
    {
      id: "4",
      factor: "Temperature in °C",
      status: "success",
      magnitude: -0.0062,
      impact: "Negative effect: Lower temperatures improve PUE.",
      recommendation:
        "Maintain optimal ambient temperatures and avoid excessive cooling.",
      source:"https://www.rehva.eu/rehva-journal/chapter/analysis-of-performance-metrics-for-data-center-efficiency-should-the-power-utilization-effectiveness-pue-still-be-used-as-the-main-indicator-part-2",
    },
    {
      id: "5",
      factor: "Humidity in %",
      status: "success",
      magnitude: 0.00365,
      impact: "Positive effect: Higher humidity slightly increases PUE.",
      recommendation:
        "Maintain optimal humidity (40-60%) to reduce excess cooling requirements.",
      source: "https://www.mdpi.com/2411-9660/7/1/3",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full space-y-4 mt-6">
      {loading && (
        <Spinner
          className="fixed h-screen w-screen z-50 top-0 left-0 bg-white/30 backdrop-blur-sm text-white"
          color="success"
          label="Fetching data"
          labelColor="success"
          size="lg"
        />
      )}
      {/* Cost Component listens to dropdown selections */}
      <SummaryComponent
        costData={apiResponse?.cost}
        totalEnergy={apiResponse?.totalEnergy}
        co2Consumption={apiResponse?.co2Consumption}
        pue={apiResponse?.pue}
        location={location}
        co2Equivalent={apiResponse?.co2_equivalents}
      />
      <CostComponent
        flag={true}
        costData={apiResponse?.cost}
        predictedPrice={apiResponse?.predictedPrice}
        energyPrice={apiResponse?.energyPrice}
        location={location}
        measureDate={measureDate}
        predictDate={apiResponse?.predictDate}
        costDiff={null}
        predictLocation={apiResponse?.predictlocation}
      />
      <EnergyComponent
        flag={true}
        totalEnergy={apiResponse?.totalEnergy}
        predictedTotalEnergy={apiResponse?.predicttotalEnergy}
        energyDiff={null}
        measureDate={measureDate}
        predictDate={apiResponse?.predictDate}
        location={location}
        predictLocation={apiResponse?.predictlocation}
      />
      <PueComponent
        pue={apiResponse?.pue}
        flag={true}
        predictedPue={apiResponse?.predictpue}
        measureDate={measureDate}
        predictDate={apiResponse?.predictDate}
        location={location}
        predictLocation={apiResponse?.predictlocation}
      />
      <CO2MeasureComponent
        co2equivalent={apiResponse?.co2_equivalents}
        co2Consumption={apiResponse?.co2Consumption}
        location={location}
        energyMix={apiResponse?.energyMix}
      />
      <DrivingFactors recommendations={recommendations} />
    </div>
  );
};

export default MeasureComponent;
