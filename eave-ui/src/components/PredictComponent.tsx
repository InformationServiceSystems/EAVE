import { useEffect, useState } from "react";
import CostComponent from "./CostComponent";
import EnergyComponent from "./EnergyComponent";
import PueComponent from "./PueComponent";
import CO2Component from "./CO2Component";
import { CalendarDate, parseDate } from "@internationalized/date";
import PredictDescriptionComponent from "./PredictDescriptionComponent";

interface PredictComponent {
  predictData: string;
  location: string;
}

const PredictComponent: React.FC<PredictComponent> = ({
  predictData,
  location,
}) => {
  const [apiResponse, setApiResponse] = useState<any>(predictData);

  const [measureDate, setMeasureDate] = useState<CalendarDate | null>(null);
  const [predictDate, setPredictDate] = useState<CalendarDate | null>(null);
  const [costDiff, setCostDiff] = useState<number>(0);
  const [energyDiff, setEnergyDiff] = useState<number>(0);
  const [, setPueDiff] = useState<number>(0);
  const [co2Diff, setCo2Diff] = useState<number>(0);

  useEffect(() => {
    if (apiResponse?.measureDate) {
      setMeasureDate(parseDate(apiResponse.measureDate));
    }
    if (apiResponse?.predictDate) {
      setPredictDate(parseDate(apiResponse.predictDate));
    }
  }, [apiResponse]);

  useEffect(() => {
    console.log(`PredictComponent.tsx:`);
    if (apiResponse) {
      setApiResponse(predictData);
    }
    console.log(apiResponse);
  }, [predictData]);

  const compareMetrics = () => {
    if (apiResponse) {
      const calculateDifference = (actual: number, predicted: number): string => {
        if (actual && predicted) {
          const difference = ((predicted - actual) / actual) * 100;
          return `${difference.toFixed(2)}`;
        }
        return "0";
      };

      const costDifference =calculateDifference(
        apiResponse.cost,
        apiResponse.predictedPrice
      );
      const energyDifference = calculateDifference(
        apiResponse.totalEnergy,
        apiResponse.predicttotalEnergy
      );
      const pueDifference = calculateDifference(
        apiResponse.pue,
        apiResponse.predictpue
      );
      const co2Difference = calculateDifference(
        apiResponse.co2Consumption,
        apiResponse.predictco2Consumption
      );

      console.log("Cost Difference:", costDifference);
      console.log("Energy Difference:", energyDifference);
      console.log("PUE Difference:", pueDifference);
      console.log("CO2 Difference:", co2Difference);

      setCostDiff(Number(costDifference));
      setEnergyDiff(Number(energyDifference));
      setPueDiff(Number(pueDifference));
      setCo2Diff(Number(co2Difference));
    }
  };

  useEffect(() => {
    compareMetrics();
  }, [apiResponse]);

  return (
    <div className="flex flex-col items-center w-full space-y-4 mt-6">
      <PredictDescriptionComponent />
      {/* Cost Component listens to dropdown selections */}
      <CostComponent
        flag={false}
        costData={apiResponse?.cost}
        predictedPrice={apiResponse?.predictedPrice}
        energyPrice={apiResponse?.energyPrice}
        location={location}
        measureDate={measureDate}
        predictDate={predictDate}
        costDiff={costDiff}
        predictLocation={apiResponse?.predictlocation}
      />
      <EnergyComponent
        flag={false}
        totalEnergy={apiResponse?.totalEnergy}
        predictedTotalEnergy={apiResponse?.predicttotalEnergy}
        energyDiff={energyDiff}
        measureDate={measureDate}
        predictDate={predictDate}
        location={location}
        predictLocation={apiResponse?.predictlocation}
      />
      <PueComponent
        pue={apiResponse?.pue}
        flag={false}
        predictedPue={apiResponse?.predictpue}
        measureDate={measureDate}
        predictDate={predictDate}
        location={location}
        predictLocation={apiResponse?.predictlocation}
      />
      <CO2Component
        co2Consumption={apiResponse?.co2Consumption}
        predictedco2Consumption={apiResponse?.predictco2Consumption}
        co2Diff={co2Diff}
        measureDate={measureDate}
        predictDate={predictDate}
        location={location}
        predictLocation={apiResponse?.predictlocation}
      />
    </div>
  );
};

export default PredictComponent;
