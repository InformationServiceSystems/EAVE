import { Card } from '@heroui/card';
import React from 'react';

interface DataCenterImpactProps {
  costs: number | null;
  energyConsumption: number | null;
  pue: number | null;
  co2Equivalents: number | null;
}

const DataCenterImpact: React.FC<DataCenterImpactProps> = ({ costs, energyConsumption, pue, co2Equivalents}) => {
  return (
    <Card className="w-full p-6">
          <div className="text-2xl font-bold mb-4">Potential Impact</div>
          <p className="text-md font-semibold text-gray-600 mb-4">
            Difference between the Baseline Model and the Compressed Model
          </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Costs */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm mb-2">Cost </span>
          <div className="border border-gray-200 rounded-lg p-4 bg-white h-24 flex items-center justify-center">
            <span className="text-2xl font-bold">{costs ? `€${Number(costs).toLocaleString("EN")}` : `N/A`}</span>
          </div>
        </div>
        
        {/* Overall Energy Consumption */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm mb-2">Energy Consumption</span>
          <div className="border border-gray-200 rounded-lg p-4 bg-white h-24 flex items-center justify-center">
            <span className="text-2xl font-bold">{energyConsumption ? `${Number(energyConsumption).toLocaleString("EN")} MWh` : `N/A`}</span>
          </div>
        </div>
        
        {/* Overall PUE */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm mb-2">PUE</span>
          <div className="border border-gray-200 rounded-lg p-4 bg-white h-24 flex items-center justify-center">
            <span className="text-2xl font-bold">{pue ? `${Number(pue).toLocaleString("EN")}` : `N/A`}</span>
          </div>
        </div>
        
        {/* Overall CO2 Equivalents */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm mb-2">CO<sub>2</sub> Emissions</span>
          <div className="border border-gray-200 rounded-lg p-4 bg-white h-24 flex items-center justify-center">
            <span className="text-2xl font-bold">{co2Equivalents ? `${Number(co2Equivalents).toLocaleString("EN")} kg` : `N/A`}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataCenterImpact;