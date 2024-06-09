import React, { useState, useEffect } from "react";
import axios from "../../axios";
import styles from "./SSPanel.module.css";

function SidePanel({ onBareActSelect, onSectionSelect }) {
  const [bareActs, setBareActs] = useState([]);
  const [selectedBareAct, setSelectedBareAct] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedSection, setSelectedSection] = useState(""); // State for selected section name

  useEffect(() => {
    async function fetchBareActs() {
      try {
        const response = await axios.get("/api/all-bareacts");
        setBareActs(response.data.map((bareAct) => bareAct.bareActName));
      } catch (error) {
        console.error("Error fetching bare act names:", error);
      }
    }

    fetchBareActs();
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleBareActClick = async (bareActName) => {
    try {
      const response = await axios.get("/api/search-bareacts", {
        params: { bareActName },
      });
      setSearchResults(response.data[0]); // Assuming you select the first result on click
      setSelectedBareAct(bareActName);
      setInputValue(bareActName); // Set input value to selected bare act
      onBareActSelect(response.data[0].bareActIndex);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSectionFilterChange = (event) => {
    const { value } = event.target;
    setSelectedSection(value); // Update selectedSection with typed value
    setSectionFilter(value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  const handleClear = () => {
    setInputValue("");
    setSearchResults(null); // Reset search results to null or [] depending on your implementation
    setSelectedBareAct(""); // Reset selected bare act
    setSectionFilter("");
    onSectionSelect("");
    setSelectedSection(""); // Reset selected section name
  };

  const handleSectionClick = (section) => {
    setSelectedSection(`${section.sectionPrefix} ${section.sectionNo}${section.sectionName ? ' - ' + section.sectionName : ''}`); // Concatenate prefix and name
    onSectionSelect(section.sectionText); // Trigger action with selected section text
  };

  const handleFormClick = (formHTML) => {
    onSectionSelect(formHTML);
  };

  const handleScheduleClick = (scheduleHTML) => {
    onSectionSelect(scheduleHTML);
  };

  const handleNotificationClick = (notificationHTML) => {
    onSectionSelect(notificationHTML);
  };

  const filteredBareActs = bareActs.filter((bareAct) =>
    bareAct.toLowerCase().includes(inputValue.toLowerCase())
  );

  const filteredResults = searchResults
    ? {
        sections: searchResults.sections.filter((section) =>
          section.sectionPrefix.toLowerCase().includes(sectionFilter) ||
          section.sectionNo.toLowerCase().includes(sectionFilter) ||
          (section.sectionName &&
            section.sectionName.toLowerCase().includes(sectionFilter))
        ),
        forms: searchResults.forms.filter((form) =>
          form.formName.toLowerCase().includes(sectionFilter)
        ),
        notifications: searchResults.notifications.filter((notification) =>
          notification.notificationName.toLowerCase().includes(sectionFilter)
        ),
        schedules: searchResults.schedules.filter((schedule) =>
          schedule.scheduleName.toLowerCase().includes(sectionFilter) ||
          schedule.scheduleHTML.toLowerCase().includes(sectionFilter)
        ),
      }
    : null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.panelOutline}>
        <div className={styles.subcontainer}>
          <div className={styles.subitem}>
            <div className={styles.rectanglesubjectindex}></div>
            STATUTES
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Search or select ACT"
              className={styles.searchInput}
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.subitem}>
            <input
              type="text"
              placeholder="Search or select SECTION"
              className={styles.searchInput}
              value={selectedSection} // Display selected section name here
              onChange={handleSectionFilterChange}
            />
          </div>
          
          <button
            className={styles.clearButton}
            onClick={handleClear}
          >
            Clear
          </button>
          
          <div className={styles.searchResults}>
            <div className={styles.resultContainer}>
              {searchResults ? (
                <div className={styles.resultContainer}>
                  {filteredResults.sections.map((section, secIndex) => (
                    <div
                      key={`sec-${secIndex}`}
                      className={styles.section}
                      onClick={() => handleSectionClick(section)}
                    >
                      {`${section.sectionPrefix} ${section.sectionNo}${section.sectionName ? ' - ' + section.sectionName : ''}`}
                    </div>
                  ))}
                  {filteredResults.forms.map((form, formIndex) => (
                    <div
                      key={`form-${formIndex}`}
                      className={styles.form}
                      onClick={() => handleFormClick(form.formHTML)}
                    >
                      {form.formName}
                    </div>
                  ))}
                  {filteredResults.notifications.map((notification, notifIndex) => (
                    <div
                      key={`notif-${notifIndex}`}
                      className={styles.notification}
                      onClick={() =>
                        handleNotificationClick(notification.notificationHTML)
                      }
                    >
                      {notification.notificationName}
                    </div>
                  ))}
                  {filteredResults.schedules.map((schedule, schedIndex) => (
                    <div
                      key={`sched-${schedIndex}`}
                      className={styles.schedule}
                      onClick={() => handleScheduleClick(schedule.scheduleHTML)}
                    >
                      {schedule.scheduleName}
                    </div>
                  ))}
                </div>
              ) : (
                filteredBareActs.map((bareActName, index) => (
                  <div
                    key={index}
                    className={`${styles.bareActName} ${
                      bareActName === selectedBareAct ? styles.active : ""
                    }`}
                    onClick={() => handleBareActClick(bareActName)}
                  >
                    {bareActName}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
