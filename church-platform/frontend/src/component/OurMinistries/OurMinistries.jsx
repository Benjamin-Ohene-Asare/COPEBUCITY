import React from "react";
import "./OurMinistries.css";

import youthImg from "../../assets/youth.png";
import pememImg from "../../assets/pemem.jpg";
import childrenImg from "../../assets/children.jpg";
import evangelismImg from "../../assets/ev.jpg";
import womenImg from "../../assets/women.png";

const ministries = [
  {
    id: "01",
    name: "Youth Ministry",
    short: "YOUTH",
    description:
      "Raising a generation of young people who are grounded in Christ and equipped to impact their world.",
    image: youthImg,
    className: "ministry-large",
  },
  {
    id: "02",
    name: "PEMEM",
    short: "MEN'S MINISTRY",
    description:
      "Building godly men who lead their homes, church and communities with purpose and integrity.",
    image: pememImg,
    className: "ministry-large",
  },
  {
    id: "03",
    name: "Children's Ministry",
    short: "CHILDREN",
    description:
      "Helping children know Jesus, grow in faith and develop strong Christian foundations.",
    image: childrenImg,
    className: "ministry-small",
  },
  {
    id: "04",
    name: "Evangelism Ministry",
    short: "EVANGELISM",
    description:
      "Sharing the gospel of Jesus Christ and reaching lives with the message of salvation.",
    image: evangelismImg,
    className: "ministry-small",
  },
  {
    id: "05",
    name: "Women's Ministry",
    short: "WOMEN",
    description:
      "Empowering women to grow spiritually, serve faithfully and influence their families and communities.",
    image: womenImg,
    className: "ministry-small",
  },
];

const OurMinistries = () => {
  return (
    <section className="ministries-section">
      <div className="ministries-container">

        {/* TOP */}
        <div className="ministries-header">
          <div>
            <span className="ministries-eyebrow">
              SERVING WITH PURPOSE
            </span>

            <h2>
              Our <span>Ministries</span>
            </h2>
          </div>

          {/* <p>
            There is a place for everyone to grow, serve and make an
            impact. Discover the ministries helping us fulfil our mission.
          </p> */}
        </div>

        {/* CARDS */}
        <div className="ministries-grid">
          {ministries.map((ministry) => (
            <article
              className={`ministry-card ${ministry.className}`}
              key={ministry.id}
            >
              <img
                src={ministry.image}
                alt={ministry.name}
                className="ministry-image"
              />

              <div className="ministry-overlay"></div>

              <span className="ministry-number">
                {ministry.id}
              </span>

              <div className="ministry-content">
                <span className="ministry-category">
                  {ministry.short}
                </span>

                <h3>{ministry.name}</h3>

                <p>{ministry.description}</p>

                <div className="ministry-accent"></div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurMinistries;