import React from "react";
import styles from "./EqualsContent.module.css";

const EqualsContent = ({ judgmentData }) => {
  return (
    <div className={styles.scrollableText}>
      <h3>EQUAL CITATIONS</h3>
      {judgmentData && judgmentData.EqualCitations && judgmentData.EqualCitations.length > 0 ? (
        judgmentData.EqualCitations.map((citation) => (
          <p key={citation.equalCitationId}>{citation.equalCitationText}</p>
        ))
      ) : (
        'No equal citations available'
      )}
    </div>
  );
};

export default EqualsContent;
