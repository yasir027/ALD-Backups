import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import SupremeCourt from "../assets/Supremecourt.png";
import HighCourtPhoto from "../assets/Highcourt.png";
import image8 from "../assets/image8.png";
import image10 from "../assets/image10.png";
import image11 from "../assets/image11.png";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios"; // Install axios if not already done (npm install axios)


const books = [
  {
    src: image8,
    alt: "Book 1",
    title: "First Edition",
    author: "Author Name",
    edition: "Edition 1",
    price: "",
  },
  {
    src: image10,
    alt: "Book 2",
    title: "second Edition",
    author: "Author Name",
    edition: "Edition 2",
    price: "",
  },
  {
    src: image11,
    alt: "Book 3",
    title: "Third Edition",
    author: "Author Name",
    edition: "Edition 3",
    price: "",
  },
  {
    src: image8,
    alt: "Book 4",
    title: "Forth Edition",
    author: "Author Name",
    edition: "Edition 4",
    price: "",
  },
];

function Home() {
  const { user, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  const boxesRef = useRef([]); // References for box1, box2, box3, box4

  const [boxVisible, setBoxVisible] = useState(false);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const [judgments, setJudgments] = useState([]);
  useEffect(() => {
    const fetchJudgments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/latest-judgments"
        );
        const data = await response.json();
        setJudgments(data);
      } catch (error) {
        console.error("Error fetching judgments:", error);
      }
    };

    fetchJudgments();
  }, []);

  const [currentbook, setCurrentbook] = useState(0);

  const handleNext = () => {
    setCurrentbook((prevIndex) =>
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentbook((prevIndex) =>
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const section2Ref = useRef(null); // Reference for Section 2

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setBoxVisible(true); // Trigger animation on entry
        } else {
          setBoxVisible(false); // Reset animation on exit
        }
      });
    }, observerOptions);

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate a data fetch
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setData("Here is your loaded content!");
        setLoading(false);
      }, 3000); // Simulates 3 seconds of loading
    };

    fetchData();
  }, []);

  //Marquee
  const [currentContent, setCurrentContent] = useState("");
  const [newContent, setNewContent] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    fetchCurrentContent();
  }, []);

  const fetchCurrentContent = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/marquee");
      if (response.data.success) {
        setCurrentContent(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleCitationClick = (citation) => {
    if (citation) {
      localStorage.setItem("referredCitation", citation); // Store citation in localStorage
      navigate("/index"); // Redirect to the index page
      window.location.reload(); // Reload the page
    }
  };

  
  return (
    <div className={styles.home}>
      <div class={styles.marqueecontainer}>
        <div class={styles.marquee}>
          <span>
            {" "}
           Flash sale starting at midnight! Hurry up and Buy subrcriptions at 50% off
            {" "}
          </span>
        </div>
      </div>

      <div className={styles.layer1}></div>

      <section
        ref={section2Ref}
        className={`${styles.section2} ${styles.sectionscroll}`}
      >
        <div className={styles.WelcomeContainer}>
          {" "}
          {/* New container for Welcome phrase */}
          
        </div>
        {/* Rest of Section 2 content */}
        <div className={styles.content}>
          <div className={styles.LeftCol}>
            <div
              ref={(el) => (boxesRef.current[1] = el)}
              className={`${styles.box3} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
            <h2>Latest Judgments</h2>
<div className={styles.judgmentsList}>
  {judgments.map((judgment) => (
    <div
      key={judgment.judgmentId}
      className={styles.judgment}
      onClick={() => handleCitationClick(judgment.newCitation || judgment.judgmentCitation)} // Box-wide click handler
      style={{ cursor: "pointer" }} // Ensure the whole box is clickable
    >
      <p className={styles.topline}>
        <span className={styles.citation}>
          {judgment.newCitation || judgment.judgmentCitation}
        </span>
        <p className={styles.judges}>{judgment.judgmentJudges}</p>
      </p>
      <p className={styles.bottomline}>
        <span className={styles.parties}>{judgment.judgmentParties}</span>
        <span className={styles.doj}>{judgment.formattedDOJ}</span>
      </p>
    </div>
  ))}
</div>

            </div>
          </div>
          <div className={styles.RightCol}>
            <div
              ref={(el) => (boxesRef.current[2] = el)}
              className={`${styles.box2} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
              <div className={styles.homeSlider}>
                <Slider {...settings}>
                  <div>
                    <img
                      className={styles.image}
                      src={SupremeCourt}
                      alt="Supreme Court"
                    />
                  </div>
                  <div>
                    <img
                      className={styles.image}
                      src={HighCourtPhoto}
                      alt="High Court of Andhra Pradesh"
                    />
                  </div>
                </Slider>
              </div>
            </div>
            <div
              ref={(el) => (boxesRef.current[3] = el)}
              className={`${styles.box4} ${
                boxVisible ? styles.boxVisible : ""
              }`}
            >
              <h2 className="mb-0">Discover Our Resources</h2>
              <p>
                Start your free trail now for 14 days, find its usage meets your
                requirements{" "}
              </p>
              <Button variant="light">Start Now</Button>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section3} ${styles.sectionscroll}`}>
        <div className={styles.layer2}>
          <svg preserveAspectRatio="xMidYMid slice" viewBox="-30 -30 80 80">
            <path
              fill="black"
              class={styles.outtop}
              d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
            />
          </svg>
        </div>

        <div className={styles.box6}>
          <div className={styles.booksWrapper}>
            <h2>Latest Publications</h2>
            <div className="d-flex">
              <div className={styles.booksContainer}>
                {books.map((book, index) => (
                  <div key={index} className={styles.bookCard}>
                    <img
                      src={book.src}
                      alt={book.alt}
                      className={styles.bookImage}
                    />
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                      <p className={styles.bookEdition}>{book.edition}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.booksContainer1}>
                {books.map((book, index) => (
                  <div key={index} className={styles.bookCard}>
                    <img
                      src={book.src}
                      alt={book.alt}
                      className={styles.bookImage}
                    />
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                      <p className={styles.bookEdition}>{book.edition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
