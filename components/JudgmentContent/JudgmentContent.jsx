import React from "react";
import styles from "./JudgmentContent.module.css";

const JudgmentContent = ({ judgmentData }) => {

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
      <h3 className={styles.centered}>
            {judgmentData ? (
              <>
                {judgmentData.judgmentCitation}<br />
                {judgmentData.judgmentCourtText}
                <br /><br />
                {judgmentData.judgmentJudges}
                <br /><br />

                {judgmentData.judgmentNo || judgmentData.judgmentDOJ ? (
                  <>{judgmentData.judgmentNo || formatDate(judgmentData.judgmentDOJ)}</>
                ) : (
                  <></>
                )}


                <br /><br />
                {judgmentData.judgmentNoText}
                <br /><br />
                {judgmentData.judgmentParties}
              </>
            ) : (
              ' '
            )}
          </h3>
          <div>
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
          {/* Citations */}
          <div>
  {judgmentData && judgmentData.JudgmentTexts ? (
    judgmentData.JudgmentTexts.map((text) => (
      <div key={text.judgementTextId}>
        {/* Display judgment text */}
        <p>{text.judgementTextParaText}</p>

        {/* Display citations */}
        {text.judgmentsCiteds && text.judgmentsCiteds.length > 0 && (
          <div style={{ textAlign: 'left' }}> {/* Set text alignment to left */}
            <h4>Cases Cited:</h4>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* Remove default list styles */}
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
        )}
      </div>
    ))
  ) : (
    ' '
  )}
  </div>


{/* Judgment Texts */}
<div>
  <h3> JUDGMENT</h3>
  {judgmentData && judgmentData.JudgmentTexts ? (
    judgmentData.JudgmentTexts.map((text) =>
      text.JudgmentTextParas.map((para) => (
        <p key={para.judgementTextParaId}>{para.judgementTextParaText}</p>
      ))
    )
  ) : (
    'No judgment text available'
  )}
  </div>
</div>
  );
};
export default JudgmentContent;

