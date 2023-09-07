import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

interface LiquidLevelChartProps {
  title: string;
  data: number[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const LiquidLevelChart = ({ title, data }: LiquidLevelChartProps) => {
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

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
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
    <div className="mx-auto w-full max-w-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LiquidLevelChart;
