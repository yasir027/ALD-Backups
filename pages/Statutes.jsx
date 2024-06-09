import React, { useState, useEffect } from "react";
import styles from "./Statutes.module.css";
import FrontDBS from "../components/Statutes/FrontDBS";
import RearDBS from "../components/Statutes/RearDBS";
import SidePanel from "../components/SidePanel/StatuesSidePanel";
import parse from 'html-react-parser';

const Statutes = () => {
  const [topHtmlContent, setTopHtmlContent] = useState('');
  const [bottomHtmlContent, setBottomHtmlContent] = useState('');
  const [bareActIndex, setBareActIndex] = useState('');

  const updateTopHtmlContent = (index) => {
    const fetchedHtml = `
      <div class="${styles.scrollableContent}">
        <p>${index}</p>
      </div>
    `;
    setTopHtmlContent(fetchedHtml);
    setBareActIndex(index);
    // Reset bottom frame content
    setBottomHtmlContent('');
  };

  const updateBottomHtmlContent = (htmlData) => {
    setBottomHtmlContent(htmlData);
  };

  useEffect(() => {
    setTimeout(() => {
      setTopHtmlContent('<p>No Results Found.</p>');
    }, 1000);
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
    const hrefData = e.target.getAttribute('data-href');
    if (hrefData) {
      updateBottomHtmlContent(hrefData);
    }
  };

  const handleClearAll = () => {
    setTopHtmlContent(''); // Correct state variable names
    setBottomHtmlContent(''); // Correct state variable names
  };

  return (
    <div className={styles.fullcontainer}>
      <SidePanel 
        onBareActSelect={updateTopHtmlContent} 
        onSectionSelect={updateTopHtmlContent} 
        onClear={handleClearAll} // pass handleClearAll to SidePanel
      />
      <div className={styles.frame}>
        <div className={styles.topframe}>
          <FrontDBS />
          <div className={`${styles.textStyles} ${styles.scrollableContent}`}>
            {parse(topHtmlContent, {
              replace: (domNode) => {
                if (domNode.type === 'tag' && domNode.name === 'a' && domNode.attribs.href) {
                  return (
                    <a
                      href="#"
                      data-href={domNode.attribs.href}
                      onClick={handleLinkClick}
                    >
                      {domNode.children[0].data}
                    </a>
                  );
                }
              }
            })}
          </div>
        </div>
        <div className={styles.bottomframe}>
          <RearDBS />
          <div className={`${styles.textStyles} ${styles.scrollableContent}`}>
            {parse(bottomHtmlContent)}
          </div>
        </div>
          <div className={styles.pagebox}>
            </div>
          </div>
        </div>
  );
};

export default Statutes;
