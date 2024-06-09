import React from 'react';
import styles from './SubHeader.module.css'; // Ensure this import points to the correct CSS file

function SubHeader({ judgmentData }) {
  return (
    <div className={styles.frame}>
      <div className={styles.textBlock}>
        <div className={styles.citation}>
          {judgmentData ? judgmentData.judgmentCitation : null}
        </div>
        <div className={styles.caseTitle}>
          {judgmentData ? judgmentData.judgmentParties : null}
        </div>
      </div>
      <button className={styles.fullScreenButton}>
        Full Screen
      </button>
    </div>
  );
}

export default SubHeader;
