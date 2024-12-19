import React, { useState, useEffect, useRef } from "react";
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

const BarChart = ({
    xData,
    yData,
    chartTitle,
    xAxis,
    yAxis,
    stepSize,
    maxBars,
}) => {
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate the total number of pages
    const totalPages = Math.ceil(xData.length / maxBars) || 1;

    // Slice data for the current page
    const startIndex = currentPage * maxBars;
    const endIndex = startIndex + maxBars;
    const displayedXData = xData.slice(startIndex, endIndex);
    const displayedYData = yData.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const chartData = {
        labels: displayedXData,
        datasets: [
            {
                label: chartTitle,
                data: displayedYData,
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
                <div className="d-flex justify-content-between mt-3">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        className="previous-btn"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="next-btn"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default BarChart;
