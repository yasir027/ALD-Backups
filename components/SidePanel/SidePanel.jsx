import React, { useState, useEffect } from "react";
import styles from "./SidePanel.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import HighlightWords from 'react-highlight-words';




const SidePanel = ({ setResults, setJudgmentCount, setError, setSearchTerms }) => {
  const [legislationName, setLegislationName] = useState('');
  const [subsection, setSubsection] = useState('');
  const [topic, setTopicName] = useState('');
  const [year, setYear] = useState('');
  const [volume, setVolume] = useState('');
  const [publicationName, setPublicationName] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [nominal, setNominal] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [legislationNames, setLegislationNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [judges, setJudges] = useState([]);
  const [judgeName, setJudgeName] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [advocateName, setAdvocateName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [subsectionName, setSubsectionName] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [section, setSection] = useState('');
  const [judge, setJudge] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [court, setCourt] = useState('');
  const [publication, setPublication] = useState('');
  const [acts, setActs] = useState([]);
  const [query, setQuery] = useState(''); 




  const toggleIndex = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

const handleSearch = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/search?legislationName=${legislationName}&section=${section}&subsection=${subsection}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
            .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
        setResults(uniqueResults);
        setJudgmentCount(uniqueResults.length);

        // Create a custom highlighting function for the "section" field
        const sectionHighlight = (text) => {
            return text.replace(/\bsection\s*(-)?\s*(\d+)\b/gi, (match, p1, p2) => {
                return `section${p1}<mark>${p2}</mark>`; // Wrap the matched section number with <mark>
            });
        };

        // Add this to store search terms for highlighting
        setSearchTerms([
        legislationName,
            sectionHighlight(section), // Apply custom highlighting to the section term
            subsection 
        ].filter(term => term));

    } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setResults([]);
        setJudgmentCount(0);
    }
};


  const handleTopicSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/searchByTopic?topic=${topic}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Search results:', data); // Log the response to inspect its structure
      if (!Array.isArray(data.results)) {
        throw new Error('Expected array but got non-array data');
      }
      const uniqueResults = Array.from(new Set(data.results.map(result => result.judgmentId)))
        .map(judgmentId => data.results.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
                setSearchTerms([topic].filter(term => term));

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
    }
  };




const handleCitationSearch = async () => {
  try {
      // Fetch values safely from state, assuming default empty string if not set
      const yearValue = year || '';
      const volumeValue = volume || '';
      const publicationNameValue = publicationName || 'ALL';
      const pageNoValue = pageNo || '';

      const response = await fetch(`http://localhost:3000/api/searchByCitation?year=${yearValue}&volume=${volumeValue}&publicationName=${publicationNameValue}&pageNo=${pageNoValue}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([yearValue, volumeValue, publicationNameValue, pageNoValue].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


const handleNominalSearch = async () => {
    try {
      const nominalValue = nominal || '';
      const response = await fetch(`http://localhost:3000/api/searchByNominal?nominal=${nominalValue}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
        .map(judgmentId => data.find(result => result.judgmentId === judgmentId));

      setJudgmentCount(uniqueResults.length);
          setSearchTerms([nominalValue].filter(term => term));

      ;

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
    }
  };

const handleCasenoSearch = async () => {
  try {
      const caseTypeValue = caseType || '';
      const caseNoValue = caseNo || '';
      const caseYearValue = caseYear || '';

      const response = await fetch(`http://localhost:3000/api/searchByCaseno?caseType=${caseTypeValue}&caseNo=${caseNoValue}&caseYear=${caseYearValue}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([caseTypeValue, caseNoValue, caseYearValue].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};

const handleAdvocateSearch = async () => {
  try {
      const advocateNameValue = advocateName || '';

      const response = await fetch(`http://localhost:3000/api/searchByAdvocate?advocateName=${advocateNameValue}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([advocateNameValue].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


const handleEquivalentSearch = async () => {
  try {
    let formattedPublicationName = publicationName;
    if (publicationName === 'AIR AP' || publicationName === 'AIR SC') {
      formattedPublicationName = `AIR ${year} ${publicationName.split(' ')[1]}`;
    }

    const response = await fetch(`http://localhost:3000/api/searchByEquivalent?year=${year}&publicationName=${formattedPublicationName}&pageNo=${pageNo}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
      .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
    setResults(uniqueResults);
    setJudgmentCount(uniqueResults.length);
    setSearchTerms([year,  publicationName, pageNo].filter(term => term));
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err);
    setResults([]);
    setJudgmentCount(0);
  }
};

const handleJudgeSearch = async () => {
  try {
      const response = await fetch(`http://localhost:3000/api/searchByJudge?judge=${judge}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
          setSearchTerms([judge].filter(term => term));

  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


useEffect(() => {
  const fetchLegislationNames = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-legislation`);
      if (!response.ok) {
        throw new Error('Failed to fetch legislation names');
      }
      const data = await response.json();
      setLegislationNames(data);
    } catch (error) {
      console.error('Error fetching legislation names:', error);
    }
  };



  const fetchJudges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-judge`);
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setJudges(data);
    } catch (error) {
      console.error('Error fetching Judges:', error);
    }
  };

  const fetchAdvocates = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-advocate`);
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setAdvocates(data);
    } catch (error) {
      console.error('Error fetching Advocates:', error);
    }
  };

  const fetchNominal = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-nominal`);
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setNominal(data);
    } catch (error) {
      console.error('Error fetching Nominal:', error);
    }
  };

  fetchLegislationNames();
}, []);
  // Effect hook to fetch topics data when component mounts


useEffect(() => {
  const fetchJudges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/all-judge`);
      if (!response.ok) {
        throw new Error('Failed to fetch judges');
      }
      const data = await response.json();
      setJudges(data);
      console.log('Judges fetched:', data); // Log data
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  };
  fetchJudges();
}, []);


const fetchSections = async (legislationId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/sections?legislationId=${legislationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sections');
    }
    const data = await response.json();
    setSections(data);
  } catch (error) {
    console.error('Error fetching sections:', error);
  }
};

const fetchSubsections = async (legislationSectionId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/subsections?legislationSectionId=${legislationSectionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subsections');
    }
    const data = await response.json();
    setSubsections(data);
  } catch (error) {
    console.error('Error fetching subsections:', error);
  }
};

const handleLegislationChange = (e) => {
  const selectedLegislation = e.target.value;
  setLegislationName(selectedLegislation);

  const selectedLegislationObj = legislationNames.find(leg => leg.legislationName === selectedLegislation);
  if (selectedLegislationObj) {
    fetchSections(selectedLegislationObj.legislationId);
  }
};

const handleSectionChange = (e) => {
  const selectedSection = e.target.value;
  setSection(selectedSection);

  const selectedSectionObj = sections.find(sec => sec.legislationSectionName === selectedSection);
  if (selectedSectionObj) {
    fetchSubsections(selectedSectionObj.legislationSectionId);
  }
};


const clearInput = (setter) => {
  setter('');
};


  return (
    <div className={styles.sidebar}>
      <div className={styles.panelOutline}>
        {/* Subject Index */}
        <div className={styles.container}>
<div className={styles.subitem} onClick={() => toggleIndex(0)}>
  <span>SUBJECT INDEX</span>
</div>
{openIndex === 0 && (
  <>
    <div className={styles.subitem}>
      <input
        value={legislationName}
        onChange={handleLegislationChange}
        className={styles.drop}
        list="data"
        placeholder="ACT"
      />
      <datalist id="data">
        {legislationNames.map((name, index) => (
          <option key={index} value={name.legislationName}>
            {name.legislationName}
          </option>
        ))}
      </datalist>
    </div>
    <div className={styles.subitem}>
      <input
    value={section}
    onChange={handleSectionChange}
    className={styles.drop}
    list="datasection"  // Add list attribute here
    placeholder="SECTION"
  />
      <datalist id="datasection">
    {sections.map((sec, index) => (
      <option key={index} value={sec.legislationSectionName}>
        {sec.legislationSectionName}
      </option>
    ))}
  </datalist>
</div>

    <div className={styles.searchelement}>
      <input
        type="text"
        placeholder="SUB-SECTION"
         list="datasubsection" 
        value={subsection}
        onChange={(e) => setSubsection(e.target.value)}
        className={styles.searchInput}
      />
      <datalist id="datasubsection">
    {subsections.map((subsec, index) => (
        <option key={index} value={subsec.legislationSubSectionName}>{subsec.legislationSubSectionName}</option>
    ))}
</datalist>
    </div>
    <div className={styles.button}>
      <button onClick={handleSearch}>Search</button>
      <button
        onClick={() => {
          setLegislationName(''); // Clear ACT field
          setSection(''); // Clear SECTION field
          setSubsection(''); // Clear SUB-SECTION field
          setError(null); // Clear any errors
        }}
        className={styles.clearButton}
      >
        Clear
      </button>
    </div>
  </>
)}
</div>
        {/* Topic Index */}
        <div className={styles.container}>
<div className={styles.subitem} onClick={() => toggleIndex(1)}>
  <span>TOPIC INDEX</span>
</div>
{openIndex === 1 && (
  <>
    <div className={styles.subitem}>
      <input
        type="text"
        placeholder="ACT"
        value={topic}
        onChange={(e) => setTopicName(e.target.value)}
        className={styles.searchInput}
      />
    </div>
    <div className={styles.button}>
      <button onClick={handleTopicSearch}>Search</button>
      <button onClick={() => { setTopicName(''); setError(null); }} className={styles.clearButton}>Clear</button>
    </div>

  </>
)}
</div>


        {/* Citation Index */}
        <div className={styles.container}>
      <div className={styles.subitem} onClick={() => toggleIndex(2)}>
        <span>CITATION INDEX</span>
      </div>
      {openIndex === 2 && (
        <>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Year"
              className={styles.searchInput}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
                <FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setYear)} />

          </div>
          <div className={styles.subitem}>
            <input
              type="number"
              placeholder="Volume No"
              className={styles.searchInput}
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
                            <FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setVolume)} />

          </div>
          <div className={styles.subitem}>
            <select
              className={styles.searchInput}
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="ALD">ALD</option>
              <option value="ALD (NOC) ">ALD (NOC)</option>
              <option value="ALD (Crl.)">ALD (Crl.)</option>
              <option value="ALD (Crl.) (NOC)">ALD (Crl.) (NOC)</option>
            </select>
          </div>
          <div className={styles.subitem}>
            <input
              type="number"
              placeholder="Page No"
              className={styles.searchInput}
              value={pageNo}
              onChange={(e) => setPageNo(e.target.value)}
            />
                            <FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setPageNo)} />

          </div>
          <div className={styles.subitem}>
            <div className={styles.button}>
      <button onClick={handleCitationSearch}>Search</button>
      <button onClick={() => { setYear(''); setVolume(''); setPublicationName('ALL'); setPageNo(''); setResults([]); setJudgmentCount(0); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
          </div>
            </>
      )}
    </div>

          {/* Nominal Index */}
        <div className={styles.container}>
  <div className={styles.subitem} onClick={() => toggleIndex(3)}>
      <span>NOMINAL INDEX</span>
  </div>
  {openIndex === 3 && (
      <>
          <div className={styles.subitem}>
              <input
                type="text"
                placeholder="Nominal Index"
                className={styles.searchInput}
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
              />
            </div>
            <div className={styles.button}>
      <button onClick={handleNominalSearch}>Search</button>
      <button onClick={() => { setNominal(''); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
          </>
        )}
      </div>

      {/* Case No Index */}
      <div className={styles.container}>
  <div className={styles.subitem} onClick={() => toggleIndex(4)}>
      <span>CASE NO INDEX</span>
  </div>
  {openIndex === 4 && (
      <>
          <div className={styles.subitem}>
              <input
                  type="text"
                  placeholder="Case Type"
                  className={styles.searchInput}
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
              />
          </div>
          <div className={styles.subitem}>
              <input
                  type="number"
                  placeholder="Case No"
                  className={styles.searchInput}
                  value={caseNo}
                  onChange={(e) => setCaseNo(e.target.value)}
              />
          </div>
          <div className={styles.subitem}>
              <input
                  type="text"
                  placeholder="Case Year"
                  className={styles.searchInput}
                  value={caseYear}
                  onChange={(e) => setCaseYear(e.target.value)}
              />
          </div>
          <div className={styles.button}>
      <button onClick={handleCasenoSearch}>Search</button>
      <button onClick={() => { setCaseType(''); setCaseNo(''); setCaseYear(''); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
      </>
  )}
</div>

{/* Judge Index */}
        <div className={styles.container}>
    <div className={styles.subitem} onClick={() => toggleIndex(5)}>
        <span>JUDGE INDEX</span>
    </div>
    {openIndex === 5 && (
        <>
            <div className={styles.subitem}>
                <input
                list="data-j"
                    type="text"
                    placeholder="Judge"
                    className={styles.searchInput}
                    value={judge}
                    onChange={(e) => setJudge(e.target.value)}
                />                <FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setJudge)} />
                <datalist id="data-j">
    {judges.map((jname, index) => (
      <option key={index} value={jname.judgeName}>
        {jname.judgeName}
      </option>
    ))}
  </datalist>

            </div>
            <div className={styles.searchelement}>
                <button onClick={handleJudgeSearch} className={styles.searchButton}>
                    SEARCH 
                </button>
            </div>
        </>
    )}
</div>

      {/* Advocate Index */}
<div className={styles.container}>
<div className={styles.subitem} onClick={() => toggleIndex(6)}>
  <span>ADVOCATE INDEX</span>
</div>
{openIndex === 6 && (
  <>
    <div className={styles.subitem}>
      <input
        type="text"
        placeholder="Advocate Name"
        className={styles.searchInput}
        value={advocateName}
        onChange={(e) => setAdvocateName(e.target.value)}
      />
    </div>
    <div className={styles.button}>
      <button onClick={handleAdvocateSearch}>Search</button>
      <button onClick={() => { setAdvocateName(''); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
  </>
)}
</div>

       {/* Equivalent Index */}
<div className={styles.container}>
  <div className={styles.subitem} onClick={() => toggleIndex(7)}>
    <span>EQUIVALENT INDEX</span>
  </div>
  {openIndex === 7 && (
    <>
      <div className={styles.subitem}>
        <input
          type="number"
          placeholder="Year"
          className={styles.searchInput}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />                <FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setYear)} />

      </div>

       <div className={styles.subitem}>
            <select
              className={styles.searchInput}
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="SCC">SCC</option>
              <option value="SCC (Cri.)">SCC (Cri.)</option>
              <option value="SC">AIR SC</option>
              <option value="AIR SCW">AIR SCW</option>
              <option value="AIR %%% AP">AIR AP</option>
              <option value="ALT">ALT</option>
            </select>
            </div>
      <div className={styles.subitem}>
        <input
          type="number"
          placeholder="Page No"
          className={styles.searchInput}
          value={pageNo}
          onChange={(e) => setPageNo(e.target.value)}

        />                
<FontAwesomeIcon icon={faTimesCircle} onClick={() => clearInput(setPageNo)} />
      </div>

      <div className={styles.button}>
      <button onClick={handleEquivalentSearch}>Search</button>
      <button onClick={() => { setYear(''); setPageNo(''); setResults([]); setJudgmentCount(0); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
}

export default SidePanel;
