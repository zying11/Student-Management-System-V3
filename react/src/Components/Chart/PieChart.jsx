import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components for the pie chart
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = ({ maleCount, femaleCount }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = new Chart(chartRef.current, {
            type: "pie",
            data: {
                labels: ["Male", "Female"], // Labels for the chart
                datasets: [
                    {
                        label: "Students by Gender",
                        data: [maleCount, femaleCount], // Data values for male and female counts
                        backgroundColor: ["#904DBC", "#EE6137"], // Color for each section of the pie
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
            },
        });

        return () => {
            chartInstance.destroy(); // Cleanup chart instance on component unmount
        };
    }, [maleCount, femaleCount]); // Rerun the chart update when data changes

    return <canvas ref={chartRef}></canvas>;
};

export default PieChart;
