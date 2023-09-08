import LiquidLevelChart from "~/components/chart/bar";
import TypographyH1 from "~/components/typography/h1";
import { z } from "zod";
// import rawTanksData from "~/data/delivery_scenario_readings.json";
import rawTanksData from "~/data/delivery_usage_scenario_readings.json";
// import rawTanksData from "~/data/leakage_scenario_readings.json";

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

const tanksData = TanksDataSchema.parse(rawTanksData);

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

// Convert the tankDataBySerialNumber object into an array of objects
const tankDataGroups: TankData[][] = Object.values(
  tankDataBySerialNumber,
).filter((group) => group !== undefined);

const Visualisation = () => {
  return (
    <>
      <div className="mt-20 min-h-screen w-auto lg:ml-32 xl:ml-44 2xl:ml-72">
        <TypographyH1 className="mb-24 max-w-lg text-center text-6xl font-semibold text-grey-dark">
          Liquid Level Chart
        </TypographyH1>
        {tankDataGroups.map(
          (tankData) =>
            tankData.length > 0 &&
            tankData[0] && (
              <LiquidLevelChart
                key={tankData[0].tankSerialNumber}
                title={`${tankData[0].tankName} (${tankData[0].tankSerialNumber}) - ${tankData[0].tankCustomerName}`}
                tankData={tankData}
              />
            ),
        )}
      </div>
    </>
  );
};

export default Visualisation;
