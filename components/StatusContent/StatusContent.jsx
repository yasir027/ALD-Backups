import React from "react";
import styles from "./StatusContent.module.css";

const StatusContent = ({ judgmentData, searchTerms, setReferredCitation, setActiveContent }) => {
  const highlightText = (text) => {
    if (!searchTerms || searchTerms.length === 0) {
      return text;
    }

    const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
    return text.replace(regex, (match) => `<span class=${styles.highlight}>${match}</span>`);
  };

  // Handle citation click and call setReferredCitation and switch to judgment
  const handleCitationClick = (citation) => {
    console.log("Clicked Citation", citation);
    setReferredCitation(citation); // Set the referred citation
    setActiveContent("judgment"); // Switch to judgment content
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h3>Cases Overruled/Reversed/etc. in</h3>
        {judgmentData && judgmentData.JudgmentStatuses && judgmentData.JudgmentStatuses.length > 0 ? (
          judgmentData.JudgmentStatuses.map((status) => (
            <div key={status.judgmentStatusId} className={styles.statusItem}>
              <h4 dangerouslySetInnerHTML={{ __html: highlightText(status.judgmentStatusLinkCitation) }}></h4>
              <p dangerouslySetInnerHTML={{ __html: status.JudgmentStatusType ? highlightText(status.JudgmentStatusType.judgmentStatusTypeName) : '' }}></p>
            </div>
          ))
        ) : (
          <p>No status information available</p>
        )}
      </div>
      <div className={styles.rightSection}>
        <h3>Status Referred In</h3>
        {judgmentData && judgmentData.referringCitations && judgmentData.referringCitations.length > 0 ? (
          judgmentData.referringCitations.map((citation, index) => (
            <div key={index} className={styles.referredInItem}>
              {/* Making text clickable with a handleCitationClick function */}
              <h4>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default link action
                    handleCitationClick(citation.judgmentCitation); // Call the citation click handler
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightText(citation.judgmentCitation) }}
                />
              </h4>
            </div>
          ))
        ) : (
          <p>No referred statuses available</p>
        )}
      </div>
    </div>
  );
};

export default StatusContent;
