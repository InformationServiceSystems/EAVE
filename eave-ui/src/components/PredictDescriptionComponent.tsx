import { Card } from "@heroui/card"

const PredictDescriptionComponent = () => {
    return (
        <Card className="w-full p-6">
            {/* <h2 className="text-2xl font-bold py-1 inline-block rounded-md">
                Predictions
            </h2> */}
            <p className="text-gray-600 text-md text-center">
                Prediction of optimal setting of selected configurations. We select the optimal location and optimal season to run the job.
            </p>
        </Card>
    );
}

export default PredictDescriptionComponent;