// RearDashboard.jsx

import React, { useState, useEffect } from "react";
import styles from "./RearDashboard.module.css";
import JudgmentsTable from "../JudgmentsTable/JudgmentsTable";

function RearDashboard({ results, onRowClick, onSaveToPad, judgmentCount }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentJudgmentCitation, setCurrentJudgmentCitation] = useState("");

  useEffect(() => {
    // Set the selected row to the first row when results are loaded
    if (results.length > 0 && !selectedRow) {
      setSelectedRow(results[0]);
      setCurrentJudgmentCitation(results[0].judgmentCitation); // Set initial citation
      onRowClick(results[0]);
    }
  }, [results, selectedRow, onRowClick]);

  const handleShowClick = () => {
    setShowTable(!showTable);
    if (!showTable && selectedRow) {
      onSaveToPad(selectedRow); // Pass the selected row to be saved
    }
  };

  const handleNextClick = () => {
    const currentIndex = results.findIndex((row) => row === selectedRow);
    const nextIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
    const nextRow = results[nextIndex];
    setSelectedRow(nextRow);
    setCurrentJudgmentCitation(nextRow.judgmentCitation); // Update citation on row change
    onRowClick(nextRow);
  };

  const handlePrevClick = () => {
    const currentIndex = results.findIndex((row) => row === selectedRow);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
    const prevRow = results[prevIndex];
    setSelectedRow(prevRow);
    setCurrentJudgmentCitation(prevRow.judgmentCitation); // Update citation on row change
    onRowClick(prevRow);
  };

  const handleFirstClick = () => {
    const firstRow = results[0];
    setSelectedRow(firstRow);
    setCurrentJudgmentCitation(firstRow.judgmentCitation); // Update citation on row change
    onRowClick(firstRow);
  };

  const handleLastClick = () => {
    const lastRow = results[results.length - 1];
    setSelectedRow(lastRow);
    setCurrentJudgmentCitation(lastRow.judgmentCitation); // Update citation on row change
    onRowClick(lastRow);
  };

  const handleSaveToPadClick = () => {
    if (selectedRow) {
      let existingData = localStorage.getItem("padData");
      try {
        existingData = JSON.parse(existingData);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (error) {
        existingData = [];
      }
      const newData = existingData.concat(selectedRow);
      localStorage.setItem("padData", JSON.stringify(newData));
      alert("Data saved to Pad!");
    }
  };

  const handleRowClick = (judgment) => {
    setSelectedRow(judgment);
    setCurrentJudgmentCitation(judgment.judgmentCitation); // Update citation on row change
    onRowClick(judgment);
  };

  return (
    <main className={styles.main}>
      <div className={styles.rectangle}></div>
      <header className={styles.header}>
        <div className={styles.dateRangeSelector}>
          <label className={styles.dateLabel}>From Date</label>
          <input className={styles.dateInput} type="date" placeholder="mm/dd/yyyy" />
          <span className={styles.toLabel}>To Date</span>
          <input className={styles.dateInput} type="date" placeholder="mm/dd/yyyy" />
        </div>
        <div className={styles.allSelector}>
          <div className={styles.allInputContainer}>
            <div className={styles.allInput}>All</div>
          </div>
          <div className={styles.allInputContainer}>
            <div className={styles.allInput}>All</div>
          </div>
        </div>
      </header>
      <footer className={styles.footer}>
        <div className={styles.pagination}>
          <button className={styles.paginationButton} onClick={handleFirstClick}>
            First
          </button>
          <button className={styles.paginationButton} onClick={handlePrevClick}>
            Prev
          </button>
          <span className={styles.paginationInfo}>
            Judgment {results.findIndex((row) => row === selectedRow) + 1} of {results.length}
          </span>
          <button className={styles.paginationButton} onClick={handleNextClick}>
            Next
          </button>
          <button className={styles.paginationButton} onClick={handleLastClick}>
            Last
          </button>
        </div>
        <div className={styles.caseInfo}>
          {currentJudgmentCitation} {/* Display current judgment citation */}
        </div>
        <button className={styles.prevCaseButton}>Prev Case</button>
        <button className={styles.searchButton}>Search</button>
        <div className={styles.searchBar}>
          <input className={styles.searchblock} />
        </div>
        <button className={styles.padButton} onClick={handleSaveToPadClick}>
          Pad
        </button>
        <button className={styles.showButton} onClick={handleShowClick}>
          {showTable ? "Hide" : "Show"}
        </button>
      </footer>
      {showTable ? (
        <div className={styles.table}>
          {results.length > 0 ? (
            <JudgmentsTable
              judgmentData={results}
              onRowClick={handleRowClick} // Pass local handler to update selectedRow
              selectedRow={selectedRow}
            />
          ) : (
            <p>No judgments found</p>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default RearDashboard;
