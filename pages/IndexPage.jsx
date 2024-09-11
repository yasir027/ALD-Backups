import React, { useState, useEffect, useRef } from "react";
import SubHeader from "../components/SubHeader/SubHeader.jsx";
import FrontDashboard from "../components/FrontDashboard/FrontDashboard";
import EditBar from "../components/EditBar/EditBar.jsx";
import RearDashboard from "../components/RearDashboard/RearDashboard";
import SidePanel from "../components/SidePanel/SidePanel";
import JudgmentContent from "../components/JudgmentContent/JudgmentContent";
import HeadnotesContent from "../components/HeadnotesContent/HeadnotesContent";
import StatusContent from "../components/StatusContent/StatusContent";
import EqualsContent from "../components/EqualsContent/EqualsContent";
import CitedContent from "../components/CitedContent/CitedContent";
import NotesContent from "../components/NotesContent/NotesContent";
import PDFManipulator from '../components/PDFManipulator';
import styles from "./IndexPage.module.css";

const IndexPage = () => {
  const [judgmentId, setJudgmentId] = useState('');
  const [judgmentData, setJudgmentData] = useState(null);
  const [activeContent, setActiveContent] = useState("headnotes"); // Default to "headnotes"
  const [fontSize, setFontSize] = useState(16); // Default font size in px
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const [showPageUpButton, setShowPageUpButton] = useState(false); // State to show page up button
  const [searchTerms, setSearchTerms] = useState([]); // Add this line
  const [citation, setCitation] = useState(null);
  const [referredCitation, setReferredCitation] = useState(null);
  const [fullCitation, setFullCitation] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const contentRef = useRef();
  const [pdfUrl, setPdfUrl] = useState("");
  const [isManipulating, setIsManipulating] = useState(false);
  const [currentJudgmentCitation, setCurrentJudgmentCitation] = useState('');


  // Adding state for results, error, and judgment count
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



  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  const handleRowClick = (data) => {
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


  useEffect(() => {
    // Scroll to top whenever judgmentData changes
    if (judgmentData) {
      scrollToTop();
    }
  }, [judgmentData]);

  const handleZoom = (type) => {
    setFontSize((prev) => (type === "plus" ? prev + 2 : prev - 2));
  };

  const handlePrint = () => {
    if (contentRef.current) {
      const printContents = contentRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=500,width=800');
      
      printWindow.document.write('<html><head><title>ALD Online</title>');
      printWindow.document.write(`
        <style>
          /* Include your styles here or link to your stylesheet */
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          
          /* Include the same print media query styles */
          @media print {
            .container {
              height: auto;
              width: 100%;
              overflow: visible;
              background-color: transparent;
              border: none;
              padding: 0;
              margin: 0;
              display: block;
            }
            
            h2, h3 {
              text-align: center;
            }
  
            p, .justify-text {
              text-align: justify;
            }
          }
        </style>
      `);
  
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }
  };

  const handleTruePrint = () => {
    console.log('True Print clicked'); // Debug log
    const fileName = '1997 ALD(Art) 1.pdf';
    const url = `http://localhost:3000/pdfs/${fileName}`;
    setPdfUrl(url);
    setIsManipulating(true);
  };
  
  
  

  const handleResultClick = (id) => {
    setJudgmentId(id);
    handleSearchById(id); // Pass the id parameter here
  };

  const handleSaveToPad = () => {
    const dataToSave = { results, selectedRow }; // Customize this according to the data you want to save
    localStorage.setItem("padData", JSON.stringify(dataToSave));
  };

  const handlePageUp = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Function to update showPageUpButton state based on scroll position
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setShowPageUpButton(scrollTop > 100); // Adjust this value as needed
      }
    };

    // Attach scroll event listener to contentRef
    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", handleScroll);
    }

    // Clean up function to remove event listener
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  //judgmentreferredcitation click
  const handleSetCitation = (newCitation) => {
    setCitation(newCitation);
  };

  //fullscreen function
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

useEffect(() => {
  const storedCitation = localStorage.getItem('referredCitation');
  if (storedCitation) {
    setReferredCitation(storedCitation);
    localStorage.removeItem('referredCitation'); // Delete the citation after usage
  }
}, []);
 // Empty dependency array means this effect runs only once, after the initial render


const handleClear = () => {
  console.log('Clearing data...');
  setJudgmentData(null); 
  setCurrentJudgmentCitation("");
  setResults([]);
  setJudgmentCount(0);
  setError(null);
  setSearchTerms([]);
};

  return (
    <div>
      <SubHeader judgmentData={judgmentData} onToggleFullScreen={handleToggleFullScreen} isFullScreen={isFullScreen} /> {/* Pass the toggle function */}
      <FrontDashboard
  onItemSelect={handleContentChange}
  onZoom={handleZoom}
  onPrint={handlePrint}
  onTruePrint={handleTruePrint}
  judgmentCount={judgmentCount}
/>

            {isManipulating && <PDFManipulator pdfUrl={pdfUrl} />}


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

      <div className={`${styles.sideNscroll} ${isFullScreen ? styles.fullScreen : ''}`}> {/* Apply full-screen class */}
        {!isFullScreen && (
        <SidePanel 
          setResults={setResults} 
          setJudgmentCount={setJudgmentCount} 
          setError={setError} 
          setSearchTerms={setSearchTerms} 
          fullCitation={referredCitation} 
          setFullCitation={setReferredCitation} 
          onClear={handleClear}
        />


      )}<div 
          className={`${styles.scrollableText} ${isFullScreen ? styles.fullScreenText : ''}`} 
          ref={contentRef} 
          style={{ fontSize: `${fontSize}px` }}
        >          
          {activeContent === "judgment" && <JudgmentContent judgmentData={results.length > 0 ? judgmentData : null} searchTerms={searchTerms} setReferredCitation={setReferredCitation} />}
          {activeContent === "headnotes" && <HeadnotesContent judgmentData={results.length > 0 ? judgmentData : null} searchTerms={searchTerms} />}
          {activeContent === "status" && <StatusContent judgmentData={results.length > 0 ? judgmentData : null}
          setReferredCitation={setReferredCitation} />}
          {activeContent === "equals" && <EqualsContent judgmentData={results.length > 0 ? judgmentData : null} searchTerms={searchTerms} />}
          {activeContent === "cited" && <CitedContent judgmentData={results.length > 0 ? judgmentData : null} searchTerms={searchTerms} />}
          {activeContent === "notes" && <NotesContent />}
        </div>
        {showPageUpButton && (
          <button className={styles.pageUpButton} onClick={handlePageUp}>
            ↑
          </button>
        )}

      </div>
      <RearDashboard results={results} onRowClick={handleRowClick} selectedRow={selectedRow} onSaveToPad={handleSaveToPad} judgmentCount={judgmentCount}  currentJudgmentCitation={currentJudgmentCitation}
        setCurrentJudgmentCitation={setCurrentJudgmentCitation} />
    </div>
  );
};

export default IndexPage;
