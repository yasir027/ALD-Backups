import React from "react";
import styles from "./NotesContent.module.css";

const JudgmentContent = () => {
  return (
    <div className={styles.scrollableText}>
      <div className={styles.centered}>
        <h3>Notes</h3>
        <textarea className={styles.notesArea} placeholder="Write your notes here..."></textarea>
      </div>
    </div>
  );
};

export default JudgmentContent;
