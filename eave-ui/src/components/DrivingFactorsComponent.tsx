import React from 'react';
import { Card } from '@heroui/card';
import { AlertCircle, Award, Check } from 'lucide-react';

interface DrivingFactorsProps {
  recommendations: Array<{
    id: string;
    factor: string;
    status: string;
    magnitude: number | null;
    impact: string;
    recommendation?: string;
    source?: string;  
  }>;
}

const DrivingFactors: React.FC<DrivingFactorsProps> = ({ 
    recommendations = [
        {
          id: "1",
          factor: "Accelerators",
          status: "warning",
          magnitude: "-2.268173",
          impact: "Large negative impact: This means higher accelerator power dissipation significantly reduces PUE.",
          recommendation: "Optimize accelerator usage by leveraging workload scheduling, power-efficient accelerators, and dynamic voltage scaling.",
          source: "",
        },
        {
          id: "2",
          factor: "Total Facility Energy (MWh)",
          status: "warning",
          magnitude: "-1.93272",
          impact: "High negative impact: More IT power consumption decreases PUE.",
          recommendation: "Improve server efficiency, optimize hardware utilization, and use energy-efficient processors.",
          source: "",
        },
        {
          id: "3",
          factor: "Cooling Load Factor",
          status: "optimal",
          magnitude: "0.2386",
          impact: "Positive impact: More efficient cooling increases PUE.",
          recommendation: "Invest in liquid cooling, improve airflow management, and use AI-driven cooling strategies.",
          source: "",
        },
        {
          id: "4",
          factor: "Temperature in °C",
          status: "positive",
          magnitude: "-0.0062",
          impact: "<strong>Slight negative effect:</strong> Lower temperatures improve PUE.",
          recommendation: "Maintain optimal ambient temperatures and avoid excessive cooling.",
          source: "",
        },
        {
          id: "5",
          factor: "Humidity in %",
          status: "positive",
          magnitude: "0.00365",
          impact: "Slight positive effect: Higher humidity slightly increases PUE.",
          recommendation: "Maintain optimal humidity (40-60%) to reduce excess cooling requirements.",
          source: "",
        },
      ]
      
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning':
        return <AlertCircle size={30} className="text-red-500" />;
      case 'optimal':
        return <Award size={30} className="text-green-500" />;
      case 'success':
        return <Check size={30} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full p-6">
      <div className="text-2xl font-bold mb-4">
        Driving factors for status quo
      </div>
      <div className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr_2fr] gap-4">
          <div className="p-4 text-l font-bold">Features</div>
          <div className="p-4 text-l font-bold">Causal effect value</div>
          <div className="p-4 text-l font-bold">Interpretation</div>
          <div className="p-4 text-l font-bold">Recommendations</div>
        </div>
        {recommendations.map((item) => (
            <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr_2fr] gap-4"
            >
            <div className="flex flex-1 p-4">
              <div className="flex-shrink-0 mr-3">
              {getStatusIcon(item.status)}
              </div>
              <p className="text-base text-gray-800">
                {item.factor}
              </p>
            </div>

            <div className="p-4">
              <p className="text-base text-gray-800">
              {item.magnitude !== null
                ? Math.round(Number(item.magnitude) * 1000) / 1000
                : "N/A"}
              </p>
            </div>

            <div className="p-4">
              <p className="text-base text-gray-800">{item.impact}</p>
            </div>

            <div className="p-4">
              {item.recommendation && (
              <p className="text-base text-gray-800">
                {item.recommendation}{" "}
                {item.source && (
                <a href={item.source} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline">
                  [{item.id}]
                </a>
                )}
              </p>
              )}
            </div>
            </div>
        ))}
      </div>
    </Card>
  );
};

export default DrivingFactors;