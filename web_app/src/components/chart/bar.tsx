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

interface LiquidLevelChartProps {
  className?: string;
  title: string;
  data: number[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const LiquidLevelChart = ({
  className,
  title,
  data,
}: LiquidLevelChartProps) => {
  const maxLevel = 20000;

  const chartData = {
    labels: data.map((_, index) => `Time ${index + 1}`),
    datasets: [
      {
        data: data,
        backgroundColor: data.map(() => "lightblue"),
        borderWidth: 1,
      },
      {
        data: data.map((_) => maxLevel),
        backgroundColor: data.map(() => "gray"),
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
