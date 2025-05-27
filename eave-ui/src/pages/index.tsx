import DefaultLayout from "@layouts/default";
import { Tabs, Tab } from "@heroui/tabs";
import MeasureComponent from "@components/MeasureComponent";
import PredictComponent from "@components/PredictComponent";
import OptimizeComponent from "@components/OptimizeComponent";

import jsonData from "@app/data/dropdown-mapping.json";
import { useEffect, useState } from "react";
import DropdownComponent from "@components/DropdownComponent";
import { MeasureType } from "../types/index";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import axios from "axios";
import { Spinner } from "@heroui/spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function IndexPage() {

  const [dropdownSelections, setDropdownSelections] = useState<MeasureType>({
    hardware: jsonData.hardware[0],
    processor: jsonData.processor[0],
    accelerator: jsonData.accelerator[0],
    location: jsonData.location[0],
    task: Object.keys(jsonData.task[0])[0],
    model_mlc: "PreActResNet18",
    cooling_efficiency: 0.6,
    date: today(getLocalTimeZone()),
    month: today(getLocalTimeZone()).month.toString(),
    year: today(getLocalTimeZone()).year.toString(),
    num_nodes: 100,
    num_accelerators: 8,
    data_center_size: "Small",
  });

  const [activeTab, setActiveTab] = useState<string>("measure");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<any>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile
      );
    };
  }, []);

  useEffect(() => {
    const populateGraphsAndData = async () => {
      setLoading(true);
      const requestBody = {
        system_name: dropdownSelections.hardware,
        processor: dropdownSelections.processor,
        accelerator: dropdownSelections.accelerator,
        location: dropdownSelections.location,
        task: dropdownSelections.task,
        model_mlc: dropdownSelections.model_mlc,
        cooling_efficiency: dropdownSelections.cooling_efficiency,
        date: `${dropdownSelections.year}-${dropdownSelections.month}-01`,
        num_nodes: dropdownSelections.num_nodes,
        num_accelerator: dropdownSelections.num_accelerators,
        data_center_size: dropdownSelections.data_center_size,
      };

      console.log(`Index.tsx:`);
      console.log(requestBody);

      const measureResponse = await axios.post(
        `${API_BASE_URL}/api/measure`,
        requestBody
      );

      if (measureResponse.status === 200) {
        console.log(measureResponse.data);
        setApiData(measureResponse.data);
        setLoading(false);
      }
    };

    populateGraphsAndData();
  }, []);

  useEffect(() => {
    console.log("Updated apiData:", apiData);
  }, [apiData]);


  const fetchMeasureData = async () => {
    setLoading(true);

    const requestBody = {
      system_name: dropdownSelections.hardware,
      processor: dropdownSelections.processor,
      accelerator: dropdownSelections.accelerator,
      location: dropdownSelections.location,
      task: dropdownSelections.task,
      model_mlc: dropdownSelections.model_mlc,
      cooling_efficiency: dropdownSelections.cooling_efficiency,
      date: `${dropdownSelections.year}-${dropdownSelections.month}-01`,
      num_nodes: dropdownSelections.num_nodes,
      num_accelerator: dropdownSelections.num_accelerators,
      data_center_size: dropdownSelections.data_center_size,
    };

    console.log(requestBody);

    const measureResponse = await axios.post(
      `${API_BASE_URL}/api/measure`,
      requestBody
    );

    if (measureResponse.status === 200) {
      console.log(`Index.tsx fetchMeasureData called:`);
      setApiData(measureResponse.data);
      console.log(measureResponse.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "predict" && dropdownSelections) {
      fetchPredictData();
    }
  }, [activeTab, dropdownSelections]);

  const fetchPredictData = async () => {
    if (!dropdownSelections) {
      return;
    }
    setLoading(true);

    const requestBody = {
      system_name: dropdownSelections.hardware,
      processor: dropdownSelections.processor,
      accelerator: dropdownSelections.accelerator,
      location: dropdownSelections.location,
      task: dropdownSelections.task,
      model_mlc: dropdownSelections.model_mlc,
      cooling_efficiency: dropdownSelections.cooling_efficiency,
      date: `${dropdownSelections.year}-${dropdownSelections.month}-01`,
      num_nodes: dropdownSelections.num_nodes,
      num_accelerator: dropdownSelections.num_accelerators,
      data_center_size: dropdownSelections.data_center_size,
    };

    console.log(requestBody);

    const measureResponse = await axios.post(
      `${API_BASE_URL}/api/predict`,
      requestBody
    );

    if (measureResponse.status === 200) {
      setApiData(measureResponse.data);
      console.log(measureResponse.data)
      setLoading(false);
    }
  };


  return (
    <DefaultLayout>
      <section className="bg-gradient-to-br from-green-300 to-amber-100 container w-full p-4">
        <div className="w-full justify-center">
          {isMobile && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold">
                We're still building our mobile version. For the best experience, please use a desktop.
              </p>
              <button 
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setIsMobile(false)}
              >
                Got it
              </button>
            </div>
          </div>
          )}
          {loading && (
              <Spinner
                className="fixed h-screen w-screen z-50 top-0 left-0 bg-white/30 backdrop-blur-sm text-white"
                color="success"
                label="Fetching data"
                labelColor="success"
                size="lg"
              /> 
            )}
          <Tabs className="text-xl flex justify-center" size={"lg"} selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
            <Tab key="measure" title="Measure" className="px-6 py-3 font-semibold">
              <Card className="flex flex-col p-10 w-full">
                <DropdownComponent
                  json={jsonData}
                  dropdownSelections={dropdownSelections}
                  setDropdownSelections={setDropdownSelections}
                />

                <div className="flex w-full justify-end mt-4">
                  <Button
                    variant="solid"
                    className="px-4 py-2 text-white"
                    color="success"
                    onPress={fetchMeasureData}
                    disabled={loading}
                  >
                    {loading ? "Measuring..." : "Measure"}
                  </Button>
                </div>
              </Card>
              {loading ? (
                <Spinner
                  color="success"
                  label="Fetching data..."
                  labelColor="success"
                  size="lg"
                />
              ) : (
                apiData && <MeasureComponent 
                measureData={apiData} 
                location={dropdownSelections?.location}
                />
              )}
            </Tab>
            <Tab key="predict" title="Predict" className="px-6 py-3 font-semibold">
                {loading ? (
                <Spinner
                  color="success"
                  label="Fetching data..."
                  labelColor="success"
                  size="lg"
                />
                ) : (
                apiData && <PredictComponent 
                predictData={apiData} 
                location={dropdownSelections?.location}
                 />
                )}
            </Tab>
            <Tab key="optimize" title="Optimize" className="px-6 py-3 font-semibold">
              <DropdownComponent
                      json={jsonData}
                      dropdownSelections={dropdownSelections}
                      setDropdownSelections={setDropdownSelections}     />
              {loading ? (
                <Spinner
                  color="success"
                  label="Fetching data..."
                  labelColor="success"
                  size="lg"
                />
              ) : (
                apiData && <OptimizeComponent 
                    optimizeData={apiData} 
                    month={dropdownSelections?.month} 
                    year={dropdownSelections?.year} 
                    location={dropdownSelections?.location}
                    processor={dropdownSelections?.processor}
                    accelerator={dropdownSelections?.accelerator}
                    num_nodes={dropdownSelections?.num_nodes}
                    num_accelerator={dropdownSelections?.num_accelerators}
                     />
              )}
            </Tab>
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
