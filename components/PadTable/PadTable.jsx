import React from "react";
import Styles from "./PadTable.module.css";

function PadTable({ savedData }) {
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const year = dateString.slice(4, 8);
    return `${day}-${month}-${year}`;
  };

  return (
    <div id="padTable" className={Styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Date of Judgment</th>
            <th>Citation</th>
            <th>Parties</th>
            <th>Court</th>
          </tr>
        </thead>
        <tbody>
          {savedData.length > 0 ? (
            savedData.map((judgment, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(judgment.judgmentDOJ)}</td>
                <td>{judgment.judgmentCitation}</td>
                <td>{judgment.judgmentParties}</td>
                <td>{judgment.judgmentNo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data saved to Pad</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PadTable;
