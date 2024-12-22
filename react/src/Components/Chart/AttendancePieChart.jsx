import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components for the pie chart
Chart.register(PieController, ArcElement, Tooltip, Legend);

const AttendancePieChart = ({ attendanceRate, absentRate }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = new Chart(chartRef.current, {
            type: "pie",
            data: {
                labels: ["Attendance", "Absent"], // Labels for the chart
                datasets: [
                    {
                        label: "Attendance Rate",
                        data: [attendanceRate, absentRate], // Data values for attendance and absent rates
                        backgroundColor: ["#28a745", "#dc3545"], // Color for each section of the pie
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
    }, [attendanceRate, absentRate]); // Rerun the chart update when data changes

    return <canvas ref={chartRef}></canvas>;
};

export default AttendancePieChart;
