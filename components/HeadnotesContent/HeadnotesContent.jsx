import React from "react";
import styles from "./HeadnotesContent.module.css";

const HeadnotesContent = ({ judgmentData }) => {
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
  const toOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };
  return (
    <div className={styles.scrollableText}>

      <div>
        <h3>HEADNOTES</h3>
        {judgmentData && judgmentData.ShortNotes && judgmentData.ShortNotes.length > 0 ? (
          judgmentData.ShortNotes.map((shortNote) => (
            <div key={shortNote.shortNoteId}>
              <h4>{shortNote.shortNoteText}</h4>
              {shortNote.LongNotes.map((longNote) =>
                longNote.LongNoteParas.map((longNotePara) => (
                  <p key={longNotePara.longNoteParaId}>{longNotePara.longNoteParaText}</p>
                ))
              )}
            </div>
          ))
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default HeadnotesContent;