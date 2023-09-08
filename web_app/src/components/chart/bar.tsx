import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { cn } from "~/lib/utils";
import { z } from "zod";

const TankDataSchema = z.object({
  tankName: z.string(),
  tankSerialNumber: z.string(),
  telemetryDatetimeEpoch: z.number(),
  tankLevel: z.number(),
  tankCustomerName: z.string(),
});

// Define the type for your TankData
type TankData = z.infer<typeof TankDataSchema>;

interface LiquidLevelChartProps {
  className?: string;
  title: string;
  tankData: TankData[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const LiquidLevelChart = ({
  className,
  title,
  tankData,
}: LiquidLevelChartProps) => {
  const maxLevel = 60000;
  const tankAreaM2 = 18.475;

  const data = tankData.map(
    (tankData) => tankData.tankLevel * tankAreaM2 * 1000,
  );

  const chartData = {
    labels: data.map((_, index) => `Time ${index + 1}`),
    datasets: [
      {
        data: data,
        backgroundColor: data.map(() => "darkblue"),
        borderWidth: 1,
      },
      {
        data: data.map((_) => maxLevel),
        backgroundColor: data.map(() => "lightgray"),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        max: maxLevel,
        ticks: {
          stepSize: maxLevel / 5,
        },
        stacked: true,
      },
    },
  };

  return (
    <div className={cn("mx-auto w-full max-w-lg", className)}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LiquidLevelChart;
