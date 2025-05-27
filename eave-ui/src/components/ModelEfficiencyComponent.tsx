import React, { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import axios from "axios";
import { CalendarDate, parseDate } from "@internationalized/date";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DropdownData {
  model_mlc: string;
  date: CalendarDate | null;
  cooling_efficiency: number;
  location: string;
  onModelStatsUpdate: (stats: any) => void;
  processor: string;
  accelerator: string;
  num_nodes: number;
  num_accelerator: number;
}

interface ModelData {
  cost: number;
  performance: number;
  totalEnergy: number;
  params: number;
  co2Equivalent: number;
}

const ModelEfficiencyComponent: React.FC<DropdownData> = ({
  model_mlc= "resnet",
  date= parseDate("2024-01-01"),
  cooling_efficiency= 0.6,
  location="Germany",
  onModelStatsUpdate,
  processor="Intel(R) Xeon(R) CPU E5-2698 v4 @ 2.20GHz",
  accelerator="V100-16GB",
  num_nodes=100,
  num_accelerator=8,
}) => {

  const [, setLoading] = useState<boolean>(false);
  const [selectedTechnique, setSelectedTechnique] =  useState<string>();
  const [selectedBaselineModel, setSelectedBaselineModel] =  useState<string>();

  const [initialModel, setInitialModel] = useState<any>({
    cost: 0.0,
    performance: 0,
    totalEnergy: 0,
    params: 0,
    co2Equivalent: 0,
    // pue: 0,
  });
  

  const [compressedModel, setCompressedModel] = useState<ModelData>({
    cost: 0.0,
    performance: 0,
    totalEnergy: 0,
    params: 0,
    co2Equivalent: 0,
    // pue: 0,
  });

  const [dropdownSelections] = useState<DropdownData>({
    model_mlc: model_mlc,
    cooling_efficiency: cooling_efficiency,
    date: date,
    location: location,
    onModelStatsUpdate: onModelStatsUpdate,
    processor: processor,
    accelerator: accelerator,
    num_nodes: num_nodes,
    num_accelerator: num_accelerator,
  });

  const [baselineModelDropdown, setBaselineModelsDropdown] = useState<string[]>([]);
  const [compressedModelDropdown, setCompressedModelsDropdown] = useState<string[]>([]);
  const [costDiff, setCostDiff] = useState<number>(0);
  const [energyDiff, setEnergyDiff] = useState<number>(0);
  const [co2Diff, setCo2Diff] = useState<number>(0);
  const [performanceDiff, setPerformanceDiff] = useState<number>(0);
  const [sizeDiff, setSizeDiff] = useState<number>(0);

  useEffect(() => {
    // Simulating an API call or calculation for modelStats
    const fetchModelStats = async () => {
      if (initialModel && compressedModel) {
        const calculatePercentageReduction = (
          initial: number,
          compressed: number
        ): string => {
          if (initial && compressed) {
            const reduction = ((initial - compressed)/initial) * 100;
            return `${reduction.toFixed(2)}`;
            // const sign = reduction >= 0 ? "+" : "-";  // note: positive reduction = size decrease = minus
            // return `${sign}${Math.abs(reduction).toFixed(2)}%`;
          }
          return "N/A";
        };

        const costReduction = calculatePercentageReduction(
          initialModel.cost,
          compressedModel.cost
        );
        const energyReduction = calculatePercentageReduction(
          initialModel.totalEnergy,
          compressedModel.totalEnergy
        );
        const perfDiff = calculatePercentageReduction(
          compressedModel.performance,
          initialModel.performance
        );
        const co2Reduction = calculatePercentageReduction(
          initialModel.co2Equivalent * initialModel.totalEnergy,
          compressedModel.co2Equivalent * compressedModel.totalEnergy
        );
        const sizeReduction = calculatePercentageReduction(
          initialModel.params,
          compressedModel.params
        );

        console.log("Cost Reduction:", costReduction);
        console.log("Energy Reduction:", energyReduction);
        // console.log("PUE Increase:", pueIncrease);
        console.log("CO2 Reduction:", co2Reduction);

        const modelStats = {
          cost: costReduction,
          energyConsumption: energyReduction,
          // pue: pueIncrease,
          co2Equivalent: co2Reduction,
        };

        onModelStatsUpdate(modelStats);
        setCostDiff(Number(costReduction));
        setPerformanceDiff(Number(perfDiff));
        setEnergyDiff(Number(energyReduction));
        setCo2Diff(Number(co2Reduction));
        setSizeDiff(Number(sizeReduction));

      }
    }
    fetchModelStats();
  }, [initialModel, compressedModel]);

  useEffect(() => {
    const fetchBaselineModels = async () => {
      setLoading(true);
      setSelectedBaselineModel("");
      try {
        const response = await axios.post(`${API_BASE_URL}/api/optimize/getBaselineList`);
        if (response.status === 200) {
          setBaselineModelsDropdown(response.data.baselineList);
          if (response.data.baselineList.length > 0) {
            setSelectedBaselineModel(response.data.baselineList[0]);
          }
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching baseline models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBaselineModels();
  }, [dropdownSelections, location, date]);

  useEffect(() => {
    if (selectedBaselineModel) {
      fetchOptimizeData();
      fetchCompressionModels();
    }
  }, [selectedBaselineModel]);

  useEffect(() => {
    if (selectedTechnique) {
      fetchCompressedModel();
    }
  }, [selectedTechnique]);

  
  const fetchOptimizeData = async () => {
    setLoading(true);
    const requestBody = {
      model_name: selectedBaselineModel,
      date: `${dropdownSelections.date?.year}-${dropdownSelections.date?.month}-${dropdownSelections.date?.day}`,
      cooling_efficiency: dropdownSelections.cooling_efficiency,
      location: dropdownSelections.location,
      compressionTech: "original",
      system_name: "Supermicro SuperServer H13 (2x speedAI240 Preview)",
      processor: dropdownSelections.processor,
      accelerator: dropdownSelections.accelerator,
      num_nodes: dropdownSelections.num_nodes,
      num_accelerator: dropdownSelections.num_accelerator,
    };

    console.log(requestBody);

    const predictResponse = await axios.post(
      `${API_BASE_URL}/api/optimize/baseline`,
      requestBody
    );

    if (predictResponse.status === 200) {
      setInitialModel(predictResponse.data);
      console.log(predictResponse.data);
      setLoading(false);
    }
  };

  const fetchCompressionModels = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const requestBody = {
        model_name: selectedBaselineModel,
      };
      const response = await axios.post(`${API_BASE_URL}/api/optimize/getCompressionList`, requestBody);
      if (response.status === 200) {
        setCompressedModelsDropdown(response.data.compressionList);
        setSelectedTechnique("");
        setCompressedModel({
          cost: 0.0,
          performance: 0,
          totalEnergy: 0,
          params: 0,
          co2Equivalent: 0,
          // pue: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching baseline models:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCompressedModel = async () => {
    setLoading(true);
    const requestBody = {
      model_name: selectedBaselineModel,
      date: `${dropdownSelections.date?.year}-${dropdownSelections.date?.month}-${dropdownSelections.date?.day}`,
      cooling_efficiency: dropdownSelections.cooling_efficiency,
      location: dropdownSelections.location,
      compressionTech: selectedTechnique,
      system_name: "Supermicro SuperServer H13 (2x speedAI240 Preview)",
      processor: dropdownSelections.processor,
      accelerator: dropdownSelections.accelerator,
      num_nodes: dropdownSelections.num_nodes,
      num_accelerator: dropdownSelections.num_accelerator,
    };

    const compressedModelResponse = await axios.post(
      `${API_BASE_URL}/api/optimize/baseline`,
      requestBody
    );

    if (compressedModelResponse.status === 200) {
      setCompressedModel(compressedModelResponse.data);
      setLoading(false);
      console.log(compressedModelResponse.data);
    }

  };



  const getStatusIcon = (initial: number | null, compressed: number | null) => {
    if (typeof initial === "number" && typeof compressed === "number") {
      if (compressed < initial) {
        return <span className="text-green-500 text-4xl font-bold">↓</span>;
      } else if (compressed > initial) {
        return <span className="text-red-500 text-4xl font-bold">↑</span>;
      }
    }
    return null;
  };

  const getStatusPerf = (initial: number | null, compressed: number | null) => {
    if (typeof initial === "number" && typeof compressed === "number") {
      if (compressed > initial) {
        return <span className="text-green-500 text-4xl font-bold">↑</span>;
      } else if (compressed < initial) {
        return <span className="text-red-500 text-4xl font-bold">↓</span>;
      }
    }
    return null;
  };


  return (
    <Card className="w-2/5 p-6">
      <h1 className="text-2xl font-bold mb-4">Model Efficiency</h1>

      {/* Left section - Model comparison */}
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Initial Model */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Baseline Model</h2>
            <div className="mb-4">
              <Select
                className=""
                size="sm"
                label="Select Baseline"
                labelPlacement="inside"
                items={baselineModelDropdown.map((task) => ({
                  key: task,
                  label: task,
                }))}
                onChange={(e) => {
                  setSelectedBaselineModel(e.target.value);
                }}
                selectedKeys={
                  selectedBaselineModel ? [selectedBaselineModel] : []
                }
              >
                {(item) => <SelectItem>{item.label}</SelectItem>}
              </Select>
            </div>

            <div className="border rounded p-3 mb-2">
              <label className="block text-sm text-gray-600">Cost</label>
              <div className="font-medium">
                {initialModel.cost
                  ? `€${initialModel.cost.toLocaleString("EN")}`
                  : "N/A"}
              </div>
            </div>

            <div className="border rounded p-3 mb-2">
              <label className="block text-sm text-gray-600">Performance (Accuracy)</label>
              <div className="font-medium">
                {initialModel.performance
                  ? `${Number(initialModel.performance).toLocaleString("EN")}%`
                  : "N/A"}
              </div>
            </div>

            <div className="border rounded p-3 mb-2">
              <label className="block text-sm text-gray-600">
                Energy consumption
              </label>
              <div className="font-medium">
                {initialModel.totalEnergy.toLocaleString("EN")} MWh
              </div>
            </div>

            <div className="border rounded p-3 mb-2">
              <label className="block text-sm text-gray-600">Size (Parameters)</label>
              <div className="font-medium">
                {initialModel.params
                  ? `${initialModel.params.toLocaleString("EN")}`
                  : `N/A`}
              </div>
            </div>

            <div className="border rounded p-3 mb-2">
              <label className="block text-sm text-gray-600">
                CO2 Emission
              </label>
              <div className="font-medium">
                {initialModel.co2Equivalent ? `${(Math.round(Number(initialModel.co2Equivalent) * Number(initialModel.totalEnergy)*100)/100).toLocaleString("EN")}kg` : "N/A"}
              </div>
            </div>
          </div>

          {/* Compressed Model */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Compression method</h2>

            <div className="mb-4">
              <Select
                className=""
                size="sm"
                label="Select Compression"
                labelPlacement="inside"
                items={compressedModelDropdown.map((task) => ({
                  key: task,
                  label: task,
                }))}
                onChange={(e) => {
                  setSelectedTechnique(e.target.value);
                }}
                selectedKeys={selectedTechnique ? [selectedTechnique] : []}
              >
                {(item) => <SelectItem>{item.label}</SelectItem>}
              </Select>
            </div>

            <div className="mb-4">
            </div>

            <div className="border rounded p-3 mb-2 flex justify-between items-center">
                <div>
                <label className="block text-sm text-gray-600">Cost</label>
                  <div className="font-medium flex items-center">
                      {compressedModel.cost
                        ? `€${Number(compressedModel.cost).toLocaleString("EN")}`
                        : "N/A"}
                      <p className="text-gray-500 text-sm ml-2">
                        {/* {costDiff ? `(${Number(costDiff.toFixed(2)).toLocaleString("EN")}%)` : ""} */}
                        {costDiff ? `(${costDiff >= 0 ? "-" : "+"}${Math.abs(costDiff).toFixed(2)}%)` : ""}
                        {/* {costDiff ? `(${costDiff >= 0 ? "-" : "+"}${Math.abs(costDiff).toLocaleString("EN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)` : ""} */}
                      </p>
                  </div>
                </div>
                {getStatusIcon(initialModel.cost, compressedModel.cost)}
            </div>

            <div className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <label className="block text-sm text-gray-600">
                  Performance (Accuracy)
                </label>
                <div className="font-medium flex items-center">
                  {compressedModel.performance
                    ? `${Number(compressedModel.performance).toLocaleString("EN")}%`
                    : "N/A"}
                  <p className="text-gray-500 text-sm ml-2">
                    {performanceDiff ? `(${Number(performanceDiff.toFixed(2)).toLocaleString("EN")}%)` : ""}
                  </p>
                </div>
              </div>
              {getStatusPerf(
                initialModel.performance,
                compressedModel.performance
              )}
            </div>

            <div className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <label className="block text-sm text-gray-600">
                  Energy consumption
                </label>
                <div className="font-medium flex items-center">

                    {compressedModel.totalEnergy
                      ? `${Number(compressedModel.totalEnergy).toLocaleString("EN")} MWh`
                      : "N/A"}
                    <p className="text-gray-500 text-sm ml-2">
                      {energyDiff ? `(${Number(energyDiff.toFixed(2)).toLocaleString("EN")}%)` : ""}
                    </p>
                </div>
              </div>
              {getStatusIcon(
                initialModel.totalEnergy,
                compressedModel.totalEnergy
              )}
            </div>

            <div className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <label className="block text-sm text-gray-600">Size (Parameters)</label>
                <div className="font-medium flex items-center">
                  {compressedModel.params &&
                  compressedModel.params !== null &&
                  initialModel.params !== null
                    ? `${compressedModel.params.toLocaleString("EN")}`
                    : `N/A`}
                  <p className="text-gray-500 text-sm ml-2">
                    {sizeDiff ? `(${Number(sizeDiff.toFixed(2)).toLocaleString("EN")}%)` : ""}
                  </p>
                </div>
              </div>
              {getStatusIcon(initialModel.params, compressedModel.params)}
            </div>

            <div className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <label className="block text-sm text-gray-600">
                  CO2 Emission
                </label>
                <div className="font-medium flex items-center">
                  {compressedModel.co2Equivalent && compressedModel.totalEnergy
                    ? `${(Math.round(Number(compressedModel.co2Equivalent) * Number(compressedModel.totalEnergy)*100)/100).toLocaleString("EN")} kg`
                    : "N/A"}
                  <p className="text-gray-500 text-sm ml-2">
                    {co2Diff ? `(${Number(co2Diff.toFixed(2)).toLocaleString("EN")}%)` : ""}
                  </p>
                </div>
              </div>
              {getStatusIcon(
                initialModel.totalEnergy,
                compressedModel.totalEnergy
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModelEfficiencyComponent;
