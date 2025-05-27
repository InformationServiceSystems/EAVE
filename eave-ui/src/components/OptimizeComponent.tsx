import React, { useState } from "react";
import ModelEfficiencyComponent from "./ModelEfficiencyComponent";
import TradeoffComponent from "./TradeoffComponent";
import { useEffect } from "react";
import { CalendarDate } from "@internationalized/date";
import { Spinner } from "@heroui/spinner";
import { parseDate } from "@internationalized/date";

interface OptimizeComponentProps {
  optimizeData: string;
  month: string;
  year: string;
  location: string;
  processor: string;
  accelerator: string;
  num_nodes: number;
  num_accelerator: number;
}

const OptimizeComponent: React.FC<OptimizeComponentProps> = ({optimizeData, month, year, location, processor, accelerator, num_nodes, num_accelerator}) => {

  const [, setModelStats] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(optimizeData);
  const [loading, setLoading] = useState<boolean>(true);

  const handleModelStatsUpdate = (stats: any) => {
    console.log("Updating modelStats in OptimizeComponent:", stats);
    setModelStats(stats);
  };
  const [date, setDate] = useState<CalendarDate | null>(null);

  useEffect(() => {
    console.log(`OptimizeComponent.tsx:`);
    if (apiResponse) {
      setLoading(false);
      setApiResponse(optimizeData);
    } else {
      setLoading(false);
    }
    console.log(apiResponse);
  }, [optimizeData, location, month, year]);

  useEffect(() => {
    if (month && year) {
      setLoading(true);
      const constructedDate = parseDate(`${year}-${month.padStart(2, '0')}-01`);
      setDate(constructedDate);
      setLoading(false);
    }
  }, [month, year]);

  return (
    <div className="flex flex-col items-center w-full space-y-4 mt-6">
      <div className="flex justify-center w-full space-x-4">
      {loading ? (
                <Spinner
                  color="success"
                  label="Fetching data..."
                  labelColor="success"
                  size="lg"
                />
              ) : (apiResponse && date &&
          <ModelEfficiencyComponent 
            model_mlc={apiResponse?.model_mlc}
            date={date}
            cooling_efficiency={apiResponse?.cooling_efficiency}
            location={location}
            onModelStatsUpdate={handleModelStatsUpdate}
            processor={processor}
            accelerator={accelerator}
            num_nodes={num_nodes}
            num_accelerator={num_accelerator}
          />)}
        <TradeoffComponent />
        
      </div>
    </div>
  );
};

export default OptimizeComponent;
