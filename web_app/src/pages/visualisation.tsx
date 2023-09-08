import LiquidLevelChart from "~/components/chart/bar";
import TypographyH1 from "~/components/typography/h1";
import { set, z } from "zod";
import rawTanksData1 from "~/data/delivery_scenario_readings.json";
import rawTanksData2 from "~/data/delivery_usage_scenario_readings.json";
import rawTanksData3 from "~/data/leakage_scenario_readings.json";
import { type ChangeEvent, useState } from "react";

const TankDataSchema = z.object({
  tankName: z.string(),
  tankSerialNumber: z.string(),
  telemetryDatetimeEpoch: z.number(),
  tankLevel: z.number(),
  tankCustomerName: z.string(),
});

// Define the type for your TankData
type TankData = z.infer<typeof TankDataSchema>;

const TanksDataSchema = z.array(TankDataSchema);

const parsedTanksData1 = TanksDataSchema.parse(rawTanksData1);
const parsedTanksData2 = TanksDataSchema.parse(rawTanksData2);
const parsedTanksData3 = TanksDataSchema.parse(rawTanksData3);

const parseJSON = (tanksData: TankData[]) => {
  const tankDataBySerialNumber: Record<string, TankData[]> = {};

  // Loop through the tankDataList and group objects by serial number
  tanksData.forEach((tankData) => {
    const { tankSerialNumber } = tankData;

    // If the serial number doesn't exist in the tankDataBySerialNumber object, create an empty list for it
    if (!tankDataBySerialNumber[tankSerialNumber]) {
      tankDataBySerialNumber[tankSerialNumber] = [];
    }

    // Push the tank data object into its respective list
    tankDataBySerialNumber[tankSerialNumber]!.push(tankData);
  });

  const tankDataGroups: TankData[][] = Object.values(
    tankDataBySerialNumber,
  ).filter((group) => group !== undefined);

  return tankDataGroups;
};

const tankDataGroups1 = parseJSON(parsedTanksData1);
const tankDataGroups2 = parseJSON(parsedTanksData2);
const tankDataGroups3 = parseJSON(parsedTanksData3);

// Convert the tankDataBySerialNumber object into an array of objects

const Visualisation = () => {
  const [selectedDataset, setSelectedDataset] = useState(tankDataGroups1);
  const [maxLevel, setMaxLevel] = useState(20000);

  const handleDatasetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Update the selected dataset based on the radio button value
    if (value === "dataset1") {
      setSelectedDataset(tankDataGroups1);
      setMaxLevel(31000);
    } else if (value === "dataset2") {
      setSelectedDataset(tankDataGroups2);
      setMaxLevel(20000);
    } else if (value === "dataset3") {
      setSelectedDataset(tankDataGroups3);
      setMaxLevel(60000);
    }
  };

  return (
    <>
      <div className="mt-10 min-h-screen w-auto lg:ml-32 xl:ml-44 2xl:ml-72">
        <TypographyH1 className="mb-16 max-w-lg text-center text-6xl font-semibold text-grey-dark">
          Liquid Level Chart
        </TypographyH1>
        <div>
          <label>
            <input
              type="radio"
              name="dataset"
              value="dataset1"
              checked={selectedDataset === tankDataGroups1}
              onChange={handleDatasetChange}
              defaultChecked
              className="ml-2"
            />
            Delivery Scenario
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="dataset"
              value="dataset2"
              checked={selectedDataset === tankDataGroups2}
              onChange={handleDatasetChange}
              className="ml-2"
            />
            Delivery & Usage Scenario
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="dataset"
              value="dataset3"
              checked={selectedDataset === tankDataGroups3}
              onChange={handleDatasetChange}
              className="ml-2"
            />
            Leakage Scenario
          </label>
        </div>
        {selectedDataset.map(
          (tankData) =>
            tankData.length > 0 &&
            tankData[0] && (
              <LiquidLevelChart
                className="h-full w-[2500px]"
                key={tankData[0].tankSerialNumber}
                title={`${tankData[0].tankName} (${tankData[0].tankSerialNumber}) - ${tankData[0].tankCustomerName}`}
                tankData={tankData}
                maxLevel={maxLevel}
              />
            ),
        )}
      </div>
    </>
  );
};

export default Visualisation;
