import React, { useState, useRef, useEffect } from 'react';
import SidePanel from "../components/SidePanel/CFSidePanel";
import SubHeader from "../components/SubHeader/SubHeader.jsx";
import FrontDashboard from "../components/FrontDashboard/FrontDashboard";
import EditBar from "../components/EditBar/EditBar.jsx";
import RearDashboard from "../components/RearDashboard/RearDashboard";
import JudgmentContent from "../components/JudgmentContent/JudgmentContent";
import HeadnotesContent from "../components/HeadnotesContent/HeadnotesContent";
import StatusContent from "../components/StatusContent/StatusContent";
import EqualsContent from "../components/EqualsContent/EqualsContent";
import CitedContent from "../components/CitedContent/CitedContent";
import NotesContent from "../components/NotesContent/NotesContent";
import styles from "./IndexPage.module.css";

const IndexPage = () => {
  const [judgmentId, setJudgmentId] = useState('');
  const [judgmentData, setJudgmentData] = useState(null);
  const [activeContent, setActiveContent] = useState("headnotes");
  const [fontSize, setFontSize] = useState(16); // Default font size in px
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const contentRef = useRef();

  //adding affan
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [judgmentCount, setJudgmentCount] = useState(0);

  const formatDate = (dateString) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = parseInt(dateString.substring(0, 2), 10);
    const monthIndex = parseInt(dateString.substring(2, 4), 10) - 1;
    const year = parseInt(dateString.substring(4), 10);

    const formattedDate = `${toOrdinal(day)} day of ${months[monthIndex]}, ${year}`;
    return formattedDate;
  };

  const handleContentChange = (content) => {
    setActiveContent(content);
  };

  const toOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleSearchById = async (judgmentId) => {
    try {
      const response = await fetch(`http://localhost:3000/judgments/${judgmentId}`);
      const data = await response.json();
      console.log("Received data:", data); // Log the received data
      setJudgmentData(data);
    } catch (error) {
      console.error('Error fetching judgment:', error);
    }
  };

  const handleRowClick = (data) => {
    console.log('Row clicked with data:', data);
    setSelectedRow(data); // Update selected row
    handleSearchById(data.judgmentId);
  };

  useEffect(() => {
    // Set selected row to the first row when results are loaded
    if (results.length > 0) {
      setSelectedRow(results[0]);
      handleRowClick(results[0]); // Simulate click on the first row to load its content
    }
  }, [results]);

 

  const handleZoom = (type) => {
    setFontSize((prev) => (type === "plus" ? prev + 2 : prev - 2));
  };

  const handlePrint = () => {
    if (contentRef.current) {
      const printContents = contentRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore the original content
    }
  };

  const handleResultClick = (id) => {
    setJudgmentId(id);
    handleSearchById();
  };

  const handleSaveToPad = () => {
    const dataToSave = { results, selectedRow }; // Customize this according to the data you want to save
    localStorage.setItem("padData", JSON.stringify(dataToSave));
  };

  return (
    <div>
      <SubHeader judgmentData={judgmentData} />
      <FrontDashboard onItemSelect={handleContentChange} onZoom={handleZoom} onPrint={handlePrint} />
      {/* remove input later */}
      {/* Judgment ID Search */}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Judgment ID</th>
              <th>Short Notes</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map(result => (
              <tr key={result.id} onClick={() => handleResultClick(result.id)}>
                <td>{result.id}</td>
                <td>{result.shortNoteText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.sideNscroll}>
        <SidePanel setResults={setResults} setJudgmentCount={setJudgmentCount} setError={setError} />
        <div className={styles.scrollableText} ref={contentRef} style={{ fontSize: `${fontSize}px` }}>
          {activeContent === "judgment" && <JudgmentContent judgmentData={judgmentData} />}
          {activeContent === "headnotes" && <HeadnotesContent judgmentData={judgmentData} />}
          {activeContent === "status" && <StatusContent judgmentData={judgmentData} />}
          {activeContent === "equals" && <EqualsContent judgmentData={judgmentData} />}
          {activeContent === "cited" && <CitedContent judgmentData={judgmentData} />}
          {activeContent === "notes" && <NotesContent />}
        </div>
        <EditBar />
      </div>
      <RearDashboard results={results} onRowClick={handleRowClick} selectedRow={selectedRow} onSaveToPad={handleSaveToPad} />
    </div>
  );
};

export default IndexPage;

