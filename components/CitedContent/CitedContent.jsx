import React from "react";
import styles from "./CitedContent.module.css";

const CitedContent = ({ judgmentData }) => {
  return (
    <div className={styles.scrollableText}>
      <h3>CASES CITED</h3>
      {judgmentData && judgmentData.JudgmentTexts ? (
        judgmentData.JudgmentTexts.map((text) => (
          <div key={text.judgementTextId}>
            <p>{text.judgementTextParaText}</p>
            {text.judgmentsCiteds && text.judgmentsCiteds.length > 0 ? (
              <div style={{ textAlign: 'left' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {text.judgmentsCiteds.map((citation, index) => (
                    <li key={index}>
                      {citation.judgmentsCitedParties}
                      {citation.judgmentsCitedEqualCitation}
                      {citation.judgmentsCitedRefferedCitation &&
                        ` = ${citation.judgmentsCitedRefferedCitation}`}
                      {citation.judgmentsCitedParaLink &&
                        ` (Para: ${citation.judgmentsCitedParaLink})`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Citations not available</p>
            )}
          </div>
        ))
      ) : (
        'No Cited Information available'
      )}
    </div>
  );
};

export default CitedContent;
