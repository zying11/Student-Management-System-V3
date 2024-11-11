import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    plugins,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ xData, yData, chartTitle, xAxis, yAxis, stepSize }) => {
    const chartData = {
        labels: xData,
        datasets: [
            {
                label: chartTitle,
                data: yData,
                backgroundColor: "#A9A0E1",
                borderColor: "#A9A0E1",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            // title: {
            //     display: true,
            //     text: chartTitle,
            //     font: {
            //         family: "Poppins",
            //         size: 16, // Adjust font size as needed
            //         weight: "600",
            //     },
            // },
            legend: {
                labels: {
                    font: {
                        family: "Poppins",
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxis,
                    font: {
                        family: "Poppins",
                        size: 12,
                        weight: "400",
                    },
                },
                ticks: {
                    font: {
                        family: "Poppins",
                    },
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxis,
                    font: {
                        family: "Poppins",
                        size: 12,
                        weight: "400",
                    },
                },
                ticks: {
                    font: {
                        stepSize: stepSize,
                        family: "Poppins",
                    },
                },
            },
        },
    };

    return (
        <>
            <div className="chart-container w-100 h-100">
                <Bar options={chartOptions} data={chartData} />
            </div>
        </>
    );
};

export default BarChart;
