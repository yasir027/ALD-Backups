import React, { useState, useEffect } from "react";
import styles from "./CFSidePanel.module.css";

function SidePanel({ setResults, setJudgmentCount, setError }) {
  const [section, setSection] = useState('');
  const [subsection, setSubsection] = useState('');
  const [judge, setJudge] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [court, setCourt] = useState('');
  const [publication, setPublication] = useState('');
  const [acts, setActs] = useState([]);
  const [legislationName, setLegislationName] = useState('');
  const [legislationNames, setLegislationNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [topics, setTopics] = useState([]);
  const [judges, setJudges] = useState([]);
  const [judgeName, setJudgeName] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [advocateName, setAdvocateName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [subsectionName, setSubsectionName] = useState('');

  const handleAddAct = () => {
    if (legislationName.trim() !== '') {
      setActs([...acts, legislationName.trim()]);
      setLegislationName('');
    }
  };

  const handleAddSection = () => {
    if (sectionName.trim() !== '') {
      setSections([...sections, sectionName.trim()]);
      setSectionName('');
    }
  };

  const handleAddSubsection = () => {
    if (subsectionName.trim() !== '') {
      setSubsections([...subsections, subsectionName.trim()]);
      setSubsectionName('');
    }
  };

  const handleAddTopic = () => {
    if (topicName.trim() !== '') {
      setTopics([...topics, topicName.trim()]);
      setTopicName('');
    }
  };

  const handleAddJudge = () => {
    if (judgeName.trim() !== '') {
      setJudges([...judges, judgeName.trim()]);
      setJudgeName('');
    }
  };

  const handleAddAdvocate = () => {
    if (advocateName.trim() !== '') {
      setAdvocates([...advocates, advocateName.trim()]);
      setAdvocateName('');
    }
  };

  const handleAdvancedSearch = async () => {
    try {
      const searchParams = new URLSearchParams();

      acts.forEach((act, index) => searchParams.append(`acts[${index}]`, act));
      sections.forEach((section, index) => searchParams.append(`sections[${index}]`, section));
      subsections.forEach((subsection, index) => searchParams.append(`subsections[${index}]`, subsection));
      topics.forEach((topic, index) => searchParams.append(`topics[${index}]`, topic));
      judges.forEach((judge, index) => searchParams.append(`judges[${index}]`, judge));
      advocates.forEach((advocate, index) => searchParams.append(`advocates[${index}]`, advocate));

      const searchUrl = `http://localhost:3000/api/searchAdvanced?${searchParams.toString()}`;

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setResults(data);
      setJudgmentCount(data.length);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setResults([]);
      setJudgmentCount(0);
    }
  };

  const handleRemoveItem = (indexToRemove, setState, state) => {
    setState(state.filter((_, index) => index !== indexToRemove));
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
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            ADVANCED SEARCH
          </div>
          <div>
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
            </datalist><button className={styles.button} onClick={handleAddAct}>Add</button>
          </div>

          

          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="SECTION (comma separated)"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className={styles.serchButton}
            />
            <button onClick={handleAddSection} className={styles.searchButton}>Add</button>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="SUBSECTION (comma separated)"
              value={subsectionName}
              onChange={(e) => setSubsectionName(e.target.value)}
              className={styles.serchButton}
            />
            <button onClick={handleAddSubsection} className={styles.searchButton}>Add</button>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="TOPIC (comma separated)"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className={styles.searchButton}
            />
            <button onClick={handleAddTopic} className={styles.searchButton}>Add</button>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="JUDGE (comma separated)"
              value={judgeName}
              onChange={(e) => setJudgeName(e.target.value)}
              className={styles.searchButton}
            />
            <button onClick={handleAddJudge} className={styles.searchButton}>Add</button>
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="ADVOCATE (comma separated)"
              value={advocateName}
              onChange={(e) => setAdvocateName(e.target.value)}
              className={styles.searchButton}
            />
            <button onClick={handleAddAdvocate} className={styles.searchButton}>Add</button>
          </div>

          <div>
            <div>
              
              {acts.map((act, index) => (
                <div key={index} className={styles.addedItem}>
                  {act}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setActs, acts)}>Remove</button>
                </div>
              ))}
            </div>
            <div>
              
              {sections.map((section, index) => (
                <div key={index} className={styles.addedItem}>
                  {section}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setSections, sections)}>Remove</button>
                </div>
              ))}
            </div>
            <div>
              
              {subsections.map((subsection, index) => (
                <div key={index} className={styles.addedItem}>
                  {subsection}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setSubsections, subsections)}>Remove</button>
                </div>
              ))}
            </div>
            <div>
              
              {topics.map((topic, index) => (
                <div key={index} className={styles.addedItem}>
                  {topic}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setTopics, topics)}>Remove</button>
                </div>
              ))}
            </div>
            <div>
             
              {judges.map((judge, index) => (
                <div key={index} className={styles.addedItem}>
                  {judge}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setJudges, judges)}>Remove</button>
                </div>
              ))}
            </div>
            <div>
             
              {advocates.map((advocate, index) => (
                <div key={index} className={styles.addedItem}>
                  {advocate}
                  <button className={styles.button} onClick={() => handleRemoveItem(index, setAdvocates, advocates)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.subitem}>
            <button onClick={handleAdvancedSearch} className={styles.searchButton}>
              Search
            </button>
          </div>
        </div>
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            <div className={styles.rectanglesubjectindex}></div>
            FILTER RESULTS
          </div>
          <div className={styles.subitem}>
            <input
              type="date"
              placeholder="DATE FROM"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.subitem}>
            <input
              type="date"
              placeholder="DATE TO"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.subitem}>
            <select
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className={styles.searchInput}
            >
              <option value="">Select Court</option>
              <option value="Allahabad">Allahabad</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Bombay">Bombay</option>
              <option value="Calcutta">Calcutta</option>
              <option value="Chandigarh">Chandigarh</option>
            </select>
          </div>
          <div className={styles.subitem}>
            <select
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              className={styles.searchInput}
            >
              <option value="">Select Publication</option>
              <option value="All">All</option>
              <option value="Civil">Civil</option>
              <option value="Criminal">Criminal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
