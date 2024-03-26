import { Bar } from "react-chartjs-2";
import type {ChartData, ChartOptions} from "chart.js";


export default function BarChart({chartData, chartOptions } : {chartData: ChartData<'bar'>, chartOptions: ChartOptions<'bar'>}) {
    return (
        <>
            <Bar data={chartData} options={chartOptions}/>
        </>
    );
}