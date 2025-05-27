import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody } from "@heroui/card";
import { Slider } from "@heroui/slider";
import dcSmall from "/images/data_center_small.jpg";
import dcMedium from "/images/data_center_med.png";
import dcLarge from "/images/data_center_large.jpg";
import { MeasureType } from "../types/index";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DropdownComponentProps {
  json: any;
  dropdownSelections: MeasureType;
  setDropdownSelections: (selections: MeasureType) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  json,
  dropdownSelections,
  setDropdownSelections,
}) => {
  const [jsonData] = useState<any>(json);
  const locationOptions = jsonData?.location;
  const dataCenterSizeOptions = jsonData?.datacenter;

  // Extract task options and build a mapping of tasks to models
  const taskModelMapping: Record<string, string[]> = {};
  const taskOptions: string[] = [];

  const [processorOptions, setProcessorOptions] = useState<string[]>([]);
  const [acceleratorOptions, setAcceleratorOptions] = useState<string[]>([]);

  const [isLoadingProcessors, setIsLoadingProcessors] = useState<boolean>(false);
  const [isLoadingAccelerators, setIsLoadingAccelerators] = useState<boolean>(false);

  const canSelectHardware = Boolean(dropdownSelections.task && dropdownSelections.model_mlc);
  const canSelectNumNodes = Boolean(dropdownSelections.processor);
  const canSelectNumAccelerators = Boolean(dropdownSelections.accelerator);

  jsonData?.task?.forEach((taskObj: any) => {
    const taskName = Object.keys(taskObj)[0];
    taskOptions.push(taskName);
    const models = taskObj[taskName as keyof typeof taskObj]?.model || [];
    taskModelMapping[taskName] = models;
  });

  // Get available models based on selected task
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const impactLevels: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };
  
  // Define impact levels for each dropdown
  const dropdownImpacts: Record<string, string> = {
    task: "low",
    model_mlc: "low",
    processor: "low",
    accelerator: "high",
    time: "medium",
    location: "low",
    num_nodes: "low",
    num_accelerators: "low",
    cooling_efficiency: "high",
  };

  // Update available models when task changes
  useEffect(() => {
    if (dropdownSelections.task) {
      setAvailableModels(taskModelMapping[dropdownSelections.task]);
      setDropdownSelections({
        ...dropdownSelections,
        model_mlc: taskModelMapping[dropdownSelections.task][0],
      });
    } else {
      setAvailableModels([]);
    }
  }, [dropdownSelections.task]);

  useEffect(() => {
    if (canSelectHardware) {
      console.log("Fetching hardware options");
      fetchHardwareOptions();
    } else {
      setProcessorOptions([]);
      setAcceleratorOptions([]);
      const newSelections = {
        ...dropdownSelections,
        processor: "",
        accelerator: "",
      };
      setDropdownSelections(newSelections);
    }
  }, [dropdownSelections.task, dropdownSelections.model_mlc]);

  useEffect(() => {
    if (canSelectHardware && dropdownSelections.processor) {
      fetchAcceleratorOptions();
    }
  }, [dropdownSelections.processor]);

  const fetchHardwareOptions = async () => {
    setIsLoadingProcessors(true);
    setIsLoadingAccelerators(true);

    const requestBody = {
      model_mlc: dropdownSelections.model_mlc,
    };

    const hardwareData = await axios.post(
      `${API_BASE_URL}/api/common/getHardware`,
      requestBody
    );

    if (hardwareData.status === 200) {
      setProcessorOptions(hardwareData.data.processors);
      setAcceleratorOptions(hardwareData.data.accelerators);
      setIsLoadingProcessors(false);
      setIsLoadingAccelerators(false);
    }
  }

  const fetchAcceleratorOptions = async () => {
    if (!dropdownSelections.processor) return;

    setIsLoadingAccelerators(true);

    const requestBody = {
      model_mlc: dropdownSelections.model_mlc,
      processor: dropdownSelections.processor,
    };

    const acceleratorData = await axios.post(
      `${API_BASE_URL}/api/common/getAccelerators`,
      requestBody
    );

    if (acceleratorData.status === 200) {
      setAcceleratorOptions(acceleratorData.data.accelerators || []);

      if (dropdownSelections.accelerator && !acceleratorData.data.accelerators.includes(dropdownSelections.accelerator)) {
        setDropdownSelections({
          ...dropdownSelections,
          accelerator: "",
        });
      }

      setIsLoadingAccelerators(false);
    }
  }

  return (
    <Card className="flex flex-col p-10 w-full">
      <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
        Configuration
      </h2>
      <CardBody className="flex flex-col gap-4 w-full px-10">
        <div className="flex justify-center items-center w-full border-b-medium pb-4">
          <Select
            className="w-48 mr-4"
            label="Data Center Size"
            labelPlacement="outside"
            items={dataCenterSizeOptions.map((loc: any) => ({
              key: loc,
              label: loc,
            }))}
            onChange={(e) => {
              const selectedSize = e.target.value;
              let numNodes = 100;
              let numAccelerators = 8;

              if (selectedSize === "Medium") {
                numNodes = 500;
                numAccelerators = 8;
              } else if (selectedSize === "Large") {
                numNodes = 2000;
                numAccelerators = 8;
              }

              setDropdownSelections({
                ...dropdownSelections,
                data_center_size: selectedSize,
                num_nodes: numNodes,
                num_accelerators: numAccelerators,
              });
            }}
            selectedKeys={[dropdownSelections.data_center_size]}
          >
            {(item: { key: string; label: string }) => (
              <SelectItem>{item.label}</SelectItem>
            )}
          </Select>
          <div className="mt-2">
            {dropdownSelections.data_center_size === "Small" && (
              <div className="flex flex-col items-center">
              <img
                src={dcSmall}
                alt="Small Data Center"
                className="w-auto h-40"
              />
              <p className="mt-2 text-sm text-gray-600">
                <a
                    href="https://vantage-dc.com/data-center-locations/emea/berlin-ii-germany/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline"
                  >
                  Vantage Berlin II Data Center Campus
                </a>
              </p>
              </div>
            )}
            {dropdownSelections.data_center_size === "Medium" && (
              <div className="flex flex-col items-center">
              <img
                src={dcMedium}
                alt="Medium Data Center"
                className="w-auto h-40"
              />
                <p className="mt-2 text-sm text-gray-600">
                <a
                  href="https://www.datacenterdynamics.com/en/news/meta-to-expand-sarpy-data-center-in-nebraska/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 underline"
                >
                  Meta Data Center Nebraska
                </a>
                </p>
              </div>
            )}
            {dropdownSelections.data_center_size === "Large" && (
              <div className="flex flex-col items-center">
              <img
                src={dcLarge}
                alt="Large Data Center"
                className="w-auto h-40"
              />
              <p className="mt-2 text-sm text-gray-600">
                <a
                  href="https://inf.news/en/tech/5ae643e850449c6123471b7652bf3348.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 underline"
                >
              
                China Telecom-Inner Mongolia Information Park
                </a>
              </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Select
              className=""
              label={
                <div className="flex items-center gap-2">
                  Task
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.task]}`}
                  />
                </div>
              }
              labelPlacement="outside"
              items={taskOptions.map((task) => ({ key: task, label: task }))}
              onChange={(e) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  task: e.target.value,
                })
              }
              selectedKeys={[dropdownSelections.task]}
            >
              {(item: any) => <SelectItem>{item.label}</SelectItem>}
            </Select>
          </div>
          {/* Model Dropdown - Dependent on Task selection */}
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Select
              className=""
              label={
                <div className="flex items-center gap-2">
                  AI Model
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.model_mlc]}`}
                  />
                </div>
              }
              labelPlacement="outside"
              items={availableModels.map((model) => ({
                key: model,
                label: model,
              }))}
              onChange={(e) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  model_mlc: e.target.value,
                })
              }
              selectedKeys={[dropdownSelections.model_mlc]}
            >
              {(item: { key: string; label: string }) => (
                <SelectItem>{item.label}</SelectItem>
              )}
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Select
              className=""
              label={
                <div className="flex items-center gap-2">
                  Processor
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.processor]}`}
                  />
                </div>
              }
              labelPlacement="outside"
              items={processorOptions.map((pr) => ({ key: pr, label: pr }))}
              onChange={(e) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  processor: e.target.value,
                  // accelerator: "",
                })
              }
              selectedKeys={
                dropdownSelections.processor
                  ? [dropdownSelections.processor]
                  : []
              }
              isDisabled={!canSelectHardware || isLoadingProcessors}
              isLoading={isLoadingProcessors}
              placeholder={
                !canSelectHardware
                  ? "Select Task & Model first"
                  : "Select Processor"
              }
            >
              {(item: { key: string; label: string }) => (
                <SelectItem>{item.label}</SelectItem>
              )}
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Select
              className=""
              label={
                <div className="flex items-center gap-2">
                  Accelerator
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.accelerator]}`}
                  />
                </div>
              }
              labelPlacement="outside"
              items={acceleratorOptions.map((ac) => ({ key: ac, label: ac }))}
              onChange={(e) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  accelerator: e.target.value,
                })
              }
              selectedKeys={
                dropdownSelections.accelerator
                  ? [dropdownSelections.accelerator]
                  : []
              }
              isDisabled={!canSelectHardware || isLoadingAccelerators}
              isLoading={isLoadingAccelerators}
              placeholder={
                !canSelectHardware
                  ? "Select Task & Model first"
                  : "Select Accelerator"
              }
            >
              {(item: { key: string; label: string }) => (
                <SelectItem>{item.label}</SelectItem>
              )}
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-48 mx-1">
            <div className="flex items-center gap-2 text-sm">
              Time
              <span
                className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.time]}`}
              />
            </div>
            <div className="flex gap-2">
              <Select
                className="w-36"
                // label="Month"
                labelPlacement="outside"
                items={[
                  { key: "1", label: "January" },
                  { key: "2", label: "February" },
                  { key: "3", label: "March" },
                  { key: "4", label: "April" },
                  { key: "5", label: "May" },
                  { key: "6", label: "June" },
                  { key: "7", label: "July" },
                  { key: "8", label: "August" },
                  { key: "9", label: "September" },
                  { key: "10", label: "October" },
                  { key: "11", label: "November" },
                  { key: "12", label: "December" },
                ]}
                onChange={(e) =>
                  setDropdownSelections({
                    ...dropdownSelections,
                    month: e.target.value,
                  })
                }
                selectedKeys={[dropdownSelections.month]}
              >
                {(item: { key: string; label: string }) => (
                  <SelectItem>{item.label}</SelectItem>
                )}
              </Select>
              <Select
                className="w-32"
                defaultSelectedKeys="2026"
                // label="Year"
                labelPlacement="outside"
                items={Array.from({ length: 36 }, (_, i) => ({
                  key: (2015 + i).toString(),
                  label: (2015 + i).toString(),
                }))}
                onChange={(e) =>
                  setDropdownSelections({
                    ...dropdownSelections,
                    year: e.target.value,
                  })
                }
                selectedKeys={[dropdownSelections.year]}
              >
                {(item: { key: string; label: string }) => (
                  <SelectItem>{item.label}</SelectItem>
                )}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-b-medium pb-4">
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Select
              className=""
              label={
                <div className="flex items-center gap-2">
                  Location
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.location]}`}
                  />
                </div>
              }
              labelPlacement="outside"
              items={locationOptions.map((loc: any) => ({
                key: loc,
                label: loc,
              }))}
              onChange={(e) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  location: e.target.value,
                })
              }
              selectedKeys={[dropdownSelections.location]}
            >
              {(item: { key: string; label: string }) => (
                <SelectItem>{item.label}</SelectItem>
              )}
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-48 mx-1">
            <Slider
              className="max-w-md"
              defaultValue={dropdownSelections.num_nodes}
              label={
                <div className="flex items-center gap-2">
                  No. of Nodes
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.num_nodes]}`}
                  />
                </div>
              }
              minValue={50}
              color="success"
              maxValue={2500}
              step={50}
              // showSteps
              value={dropdownSelections.num_nodes}
              onChange={(value) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  num_nodes: value as number,
                })
              }
              isDisabled={!canSelectNumNodes}
            />
          </div>
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Slider
              className="max-w-md"
              defaultValue={dropdownSelections.num_accelerators}
              label={
                <div className="flex items-center gap-2">
                  No. of Accelerators
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.num_accelerators]}`}
                  />
                </div>
              }
              color="success"
              minValue={1}
              maxValue={20}
              step={1}
              value={dropdownSelections.num_accelerators}
              onChange={(value) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  num_accelerators: value as number,
                })
              }
              isDisabled={!canSelectNumAccelerators}
            />
          </div>
          <div className="flex flex-col gap-2 w-48 mx-1">
            <Slider
              className="max-w-md"
              defaultValue={dropdownSelections.cooling_efficiency}
              label={
                <div className="flex items-center gap-2">
                  Cooling Load
                  <span
                    className={`w-3 h-3 rounded-full ${impactLevels[dropdownImpacts.cooling_efficiency]}`}
                  />
                </div>
              }
              color="success"
              minValue={0.2}
              maxValue={0.7}
              step={0.01}
              value={dropdownSelections.cooling_efficiency}
              onChange={(value) =>
                setDropdownSelections({
                  ...dropdownSelections,
                  cooling_efficiency: value as number,
                })
              }
            />
          </div>
        </div>

        {/* Display selected values */}
        <div className="col-span-1 md:col-span-2 mt-4 rounded-lg">
          <p className="text-sm">Causal Effects</p>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" /><p className="text-sm">Low Impact</p>
              <span className="ml-4 w-3 h-3 rounded-full bg-yellow-500" /><p className="text-sm">Medium Impact</p>
              <span className="ml-4 w-3 h-3 rounded-full bg-red-500" /><p className="text-sm">High Impact</p>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default DropdownComponent;
