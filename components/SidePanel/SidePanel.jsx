import React, { useState, useEffect } from "react";
import styles from "./SidePanel.module.css";

function SidePanel({ setResults, setJudgmentCount, setError }) {
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
        const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
            .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
        setResults(uniqueResults);
        setJudgmentCount(uniqueResults.length);
        console.log('Search results:', data);
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
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
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
  } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
  }
};


const handleEquivalentSearch = async () => {
  try {
      const response = await fetch(`http://localhost:3000/api/searchByEquivalent?year=${year}&volume=${volume}&publicationName=${publicationName}&pageNo=${pageNo}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueResults = Array.from(new Set(data.map(result => result.judgmentId)))
          .map(judgmentId => data.find(result => result.judgmentId === judgmentId));
      setResults(uniqueResults);
      setJudgmentCount(uniqueResults.length);
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
      const response = await fetch('http://localhost:3000/api/all-legislation');
      if (!response.ok) {
        throw new Error('Failed to fetch legislation names');
      }
      const data = await response.json();
      setLegislationNames(data);
    } catch (error) {
      console.error('Error fetching legislation names:', error);
    }
  };

  fetchLegislationNames();
}, []);

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
};

const handleSectionChange = (e) => {
  const selectedSection = e.target.value;
  setSection(selectedSection);

  const selectedSectionObj = sections.find(sec => sec.legislationSectionName === selectedSection);
  if (selectedSectionObj) {
    fetchSubsections(selectedSectionObj.legislationSectionId);
  }
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
                  type="text"
                  placeholder="SECTION"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.searchelement}>
              <input
                  type="text"
                  placeholder="SUB-SECTION"
                  value={subsection}
                  onChange={(e) => setSubsection(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.subitem}>
                <button onClick={handleSearch}>Search</button>
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
              <div className={styles.searchelement}>
                <input
                  type="text"
                  placeholder="SEARCH RESULTS"
                  className={styles.search}
                />
              </div>
              <div className={styles.subitem}>
                <button onClick={handleTopicSearch}>Search</button>
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
          </div>
          <div className={styles.subitem}>
            <input
              type="number"
              placeholder="Volume No"
              className={styles.searchInput}
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
          <div className={styles.subitem}>
            <select
              className={styles.searchInput}
              value={publicationName}
              onChange={(e) => setPublicationName(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="ALD">ALD</option>
              <option value="ALD(NOC)">ALD(NOC)</option>
              <option value="ALD(Crl.)">ALD(Crl.)</option>
              <option value="ALD(Ctrl.)(NOC)">ALD(Ctrl.)(NOC)</option>
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
          </div>
          <div className={styles.searchelement}>
            <input
              type="text"
              placeholder="SEARCH RESULTS"
              className={styles.search}
            />
          </div>
          <div className={styles.subitem}>
            <button onClick={handleCitationSearch} className={styles.searchButton}>Search</button>
          </div>
          <div className={styles.subitem}>
            <button onClick={() => { setYear(''); setVolume(''); setPublicationName('ALL'); setPageNo(''); setResults([]); setJudgmentCount(0); setError(null); }} className={styles.clearButton}>Clear</button>
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
              <div className={styles.searchelement}>
                <button onClick={handleNominalSearch} className={styles.searchButton}>
                    SEARCH RESULTS
                </button>
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
            <div className={styles.searchelement}>
                <button onClick={handleCasenoSearch} className={styles.searchButton}>
                    SEARCH RESULTS
                </button>
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
                  type="text"
                  placeholder="Judge"
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.searchelement}>
                <input
                  type="text"
                  placeholder="SEARCH RESULTS"
                  className={styles.search}
                />
              </div>
            </>
          )}
        </div>

        {/* Advocate Index */}
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
      <div className={styles.searchelement}>
        <button onClick={handleAdvocateSearch} className={styles.searchButton}>
          Search
        </button>
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
        />
      </div>
      <div className={styles.subitem}>
        <input
          type="number"
          placeholder="Volume No"
          className={styles.searchInput}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>
      <div className={styles.subitem}>
        <input
          type="number"
          placeholder="Page No"
          className={styles.searchInput}
          value={pageNo}
          onChange={(e) => setPageNo(e.target.value)}
        />
      </div>
      <div className={styles.subitem}>
        <button onClick={handleEquivalentSearch} className={styles.searchButton}>Search</button>
      </div>
      <div className={styles.subitem}>
        <button onClick={() => { setYear(''); setVolume(''); setPageNo(''); setResults([]); setJudgmentCount(0); setError(null); }} className={styles.clearButton}>Clear</button>
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
}

export default SidePanel;
