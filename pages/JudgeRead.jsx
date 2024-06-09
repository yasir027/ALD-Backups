import React from "react";
import { useParams } from "react-router-dom";
import Styles from "./ArticleView/ArticleViewNoList.module.css"; 
import FDB from "../components/ArticleViewTools/FDBArticle.jsx";
import { pdfjs } from 'react-pdf';
import PDFFile from "./ArticleView/Pdfviewer.jsx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const JudgeRead = () => {
    const { fileName } = useParams();

    return (
        <div className={Styles.AVNLcontainer}>
            <div className={Styles.AVNLcol}>

                <div className={Styles.AVNLbox}>
                    <PDFFile fileUrl={`http://localhost:3000/pdfs/${decodeURIComponent(fileName)}.pdf`} />
                </div>
            </div>
        </div>
    );
};

export default JudgeRead;
