import React, { useState, useCallback, useEffect } from "react";
import styles from "./RearDashboard.module.css";
import JudgmentsTable from "../JudgmentsTable/JudgmentsTable";

function RearDashboard({ results, onRowClick, onSaveToPad, judgmentCount }) {
  const [showTable, setShowTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const [currentJudgmentCitation, setCurrentJudgmentCitation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredResults, setFilteredResults] = useState(results);

  const handleShowClick = () => {
    setShowTable(!showTable);
    if (!showTable && selectedRow) {
      onSaveToPad(selectedRow); // Pass the selected row to be saved
    }
  };

  const handleNextClick = () => {
    const currentIndex = filteredResults.findIndex((row) => row === selectedRow);
    const nextIndex = currentIndex < filteredResults.length - 1 ? currentIndex + 1 : 0;
    const nextRow = filteredResults[nextIndex];
    setSelectedRow(nextRow);
    setCurrentJudgmentCitation(nextRow.judgmentCitation); // Update citation on row change
    onRowClick(nextRow);
  };

  const handlePrevClick = () => {
    const currentIndex = filteredResults.findIndex((row) => row === selectedRow);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredResults.length - 1;
    const prevRow = filteredResults[prevIndex];
    setSelectedRow(prevRow);
    setCurrentJudgmentCitation(prevRow.judgmentCitation); // Update citation on row change
    onRowClick(prevRow);
  };

  const handleFirstClick = () => {
    const firstRow = filteredResults[0]; // Select the first row
    setSelectedRow(firstRow);
    setCurrentJudgmentCitation(firstRow.judgmentCitation); // Update citation on row change
    onRowClick(firstRow);
  };

  const handleLastClick = () => {
    const lastRow = filteredResults[filteredResults.length - 1];
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

  const handleInitialLoad = useCallback(
    (initialRow) => {
      if (!selectedRow) {
        setSelectedRow(initialRow);
        setCurrentJudgmentCitation(initialRow.judgmentCitation);
        onRowClick(initialRow);
      }
    },
    [selectedRow, onRowClick]
  );

  const filterResultsByDate = () => {
    const from = fromDate ? new Date(fromDate) : new Date("1900-01-01");
    const to = toDate ? new Date(toDate) : new Date();
    const filtered = results.filter((result) => {
      const judgmentDate = new Date(
        result.judgmentDOJ.slice(4, 8) + "-" + result.judgmentDOJ.slice(2, 4) + "-" + result.judgmentDOJ.slice(0, 2)
      );
      return judgmentDate >= from && judgmentDate <= to;
    });
    setFilteredResults(filtered);
  };

  useEffect(() => {
    filterResultsByDate();
  }, [fromDate, toDate, results]);

  useEffect(() => {
    // Load initial row if results are available
    if (filteredResults.length > 0) {
      handleInitialLoad(filteredResults[0]); // Select the first row by default
    }
  }, [filteredResults, handleInitialLoad]);

  const handleClearDates = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <main className={styles.main}>
      <div className={styles.rectangle}></div>
      <header className={styles.header}>
        <div className={styles.dateRangeSelector}>
          <label className={styles.dateLabel}>From Date</label>
          <input
            className={styles.dateInput}
            type="date"
            placeholder="mm/dd/yyyy"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className={styles.toLabel}>To Date</span>
          <input
            className={styles.dateInput}
            type="date"
            placeholder="mm/dd/yyyy"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button className={styles.clearButton} onClick={handleClearDates}>
            Clear
          </button>
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
          Judgment {filteredResults.findIndex((row) => row === selectedRow) + 1} of {filteredResults.length} {/* ChatGPT modified this line to start pagination from 1 */}
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
          {filteredResults.length > 0 ? (
            <JudgmentsTable
              judgmentData={filteredResults}
              onRowClick={handleRowClick} // Pass local handler to update selectedRow
              selectedRow={selectedRow}
              onInitialLoad={handleInitialLoad} // Pass initial load callback
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
