import React from "react";
import { useParams } from "react-router-dom";
import Styles from "./ArticleView/ArticleViewNoList.module.css";
import FDB from "../components/ArticleViewTools/FDBArticle.jsx";
import { pdfjs } from 'react-pdf';
import PDFFile from "./ArticleView/Pdfviewer.jsx";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const ArticleRead = () => {
    const { fileName } = useParams();
    const handleClick = () => {
            navigate("/articles");        
      };
    return (
        <div className={Styles.AVNLcontainer}>
            <div className={Styles.AVNLcol}>
                <div>
                    <button onClick={handleClick}> Back </button>
                </div>

                <div className={Styles.AVNLbox}>
                    <PDFFile fileUrl={`http://localhost:3000/pdfs/${decodeURIComponent(fileName)}.pdf`} />
                </div>
            </div>
        </div>
    );
};

export default ArticleRead;
