import React from "react";

export const Table = ({ header, data }) => {
    return (
        <div className="table-wrapper position-relative">
            <table className="table">
                <thead>
                    <tr>
                        {header.map((header, index) => (
                            //(header, index): header represents the current item (a header name) in the iteration
                            //and index is the current index of the item in the array
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
