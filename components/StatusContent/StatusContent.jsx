import React from "react";
import styles from "./StatusContent.module.css";

const StatusContent = ({ judgmentData }) => {
  return (
    <div className={styles.scrollableText}>
      <h3>STATUS</h3>
      {judgmentData && judgmentData.JudgmentStatuses && judgmentData.JudgmentStatuses.length > 0 ? (
        judgmentData.JudgmentStatuses.map((status) => (
          <div key={status.judgmentStatusId}>
            <h3>{status.judgmentStatusLinkCitation}</h3>
            <p>{status.JudgmentStatusType ? status.JudgmentStatusType.judgmentStatusTypeName : ''}</p>
          </div>
        ))
      ) : (
        <p>No status information available</p>
      )}
    </div>
  );
};

export default StatusContent;
