import React, { useRef, useEffect } from "react";
import styles from "./JudgmentContent.module.css";

const JudgmentContent = ({ judgmentData }) => {
  const paraRefs = useRef({});

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

  const scrollToPara = (paraNo) => {
    const paraElement = paraRefs.current[paraNo];
    if (paraElement) {
      setTimeout(() => {
        paraElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        paraElement.classList.add(styles.pop);
        setTimeout(() => {
          paraElement.classList.remove(styles.pop);
        }, 1000);
      }, 0); // Ensure the scrollIntoView is in the next event loop tick
    } else {
      console.warn(`Paragraph number ${paraNo} not found in references.`);
    }
  };

  //citationpara links
  const extractNumbersFromLink = (text) => {
    // Match numbers from string
    const regex = /\d+/g;
    const matches = text.match(regex);
    return matches ? matches.map(Number) : [];
  };

  const renderLongNoteParas = (longNoteParas) => {
    return longNoteParas.map((longNotePara) => (
      <p key={longNotePara.longNoteParaId}>
        {extractAndRenderLongNoteLinks(longNotePara.longNoteParaText)}
      </p>
    ));
  };


  //Longnotetextpara Links
  const extractAndRenderLongNoteLinks = (text) => {
    const regex = /Para\s*(\d+)(?:\s+and\s+(\d+))?/g;
    let match;
    const elements = [];

    // Clone the string to prevent mutation
    let textClone = text;

    // Find and replace "Para X" or "Para X and Y" with clickable links
    while ((match = regex.exec(textClone)) !== null) {
      const paraNos = match.slice(1).filter(Boolean); // Filter out undefined values

      // Split text based on the match
      const beforeText = textClone.substring(0, match.index);
      const afterText = textClone.substring(match.index + match[0].length);

      // Add text before the match
      elements.push(beforeText);

      // Add links for each paragraph number
      paraNos.forEach((paraNo, index) => {
        elements.push(
          <a
            key={`${match.index}_${index}`}
            href="#"
            onClick={() => scrollToPara(paraNo)}
          >
            {`Para ${paraNo}`}
          </a>
        );

        // Add "and" if it's the second number
        if (index === 0 && paraNos.length === 2) {
          elements.push(" and ");
        }

        // Add comma if it's not the last number
        if (index < paraNos.length - 1) {
          elements.push(", ");
        }
      });

      // Update textClone for the next iteration
      textClone = afterText;
    }

    // Add remaining text after replacements
    if (textClone) {
      elements.push(textClone);
    }

    return elements;
  };

  // Effect to log current refs for debugging
  useEffect(() => {
    console.log('Current paragraph refs:', paraRefs.current);
  }, [judgmentData]);

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
      {/* Short Notes */}
      <div>
        {judgmentData && judgmentData.ShortNotes && judgmentData.ShortNotes.length > 0 ? (
          judgmentData.ShortNotes.map((shortNote) => (
            <div key={shortNote.shortNoteId}>
              <h4>{shortNote.shortNoteText}</h4>
              {shortNote.LongNotes && shortNote.LongNotes.map((longNote) => (
                <React.Fragment key={longNote.longNoteId}>
                  {renderLongNoteParas(longNote.LongNoteParas)}
                </React.Fragment>
              ))}
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
                <div style={{ textAlign: 'left' }}>
                  <h4>Cases Cited:</h4>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {text.judgmentsCiteds.map((citation, index) => (
                      <li key={index}>
                        {citation.judgmentsCitedParties}
                        {citation.judgmentsCitedEqualCitation}
                        {citation.judgmentsCitedReferredCitation &&
                          ` = ${citation.judgmentsCitedReferredCitation}`}
                        {citation.judgmentsCitedParaLink && (
                          <>
                            {extractNumbersFromLink(citation.judgmentsCitedParaLink).map((paraNo, idx) => (
                              <React.Fragment key={`${index}_${idx}`}>
                                <a
                                  href="#"
                                  onClick={() => scrollToPara(paraNo)}
                                >
                                  {`  Para  ${paraNo}`}
                                </a>
                                {idx < extractNumbersFromLink(citation.judgmentsCitedParaLink).length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </>
                        )}
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
              <p
                key={para.judgementTextParaId}
                ref={(el) => paraRefs.current[para.judgementTextParaNo] = el}
              >
                {para.judgementTextParaText}
              </p>
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
