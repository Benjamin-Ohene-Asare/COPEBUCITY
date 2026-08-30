import React from "react";
import "./Footer.css";

import logo from "../../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      {/* TOP CTA */}
      <div className="footer-cta">
        <div className="footer-cta-content">
          <div>
            <span className="footer-cta-label">
              YOU ARE WELCOME
            </span>

            <h2>
              Come Worship <span>With Us</span>
            </h2>

            <p>
              We would love to have you fellowship with us at
              The Church of Pentecost, Ebukrom District.
            </p>
          </div>

          <a href="#contact" className="footer-cta-btn">
            PLAN YOUR VISIT
            <span>→</span>
          </a>
        </div>
      </div>


      {/* MAIN FOOTER */}
      <div className="footer-main">
        <div className="footer-container">

          {/* CHURCH INFO */}
          <div className="footer-brand">

            <div className="footer-logo-area">
              <img
                src={logo}
                alt="The Church of Pentecost"
                className="footer-logo"
              />

              <div>
                <h3>Ebukrom District</h3>
                <span>
                  The Church of Pentecost
                </span>
              </div>
            </div>

            <p className="footer-description">
              A family of believers committed to worship,
              discipleship, evangelism, fellowship and impacting
              our world with the gospel of Jesus Christ.
            </p>

            <div className="footer-area">
              ELMINA AREA • GHANA
            </div>

          </div>


          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>Quick Links</h4>

            <ul>
              <li>
                <a href="/">Home</a>
              </li>

              <li>
                <a href="#about">About Us</a>
              </li>

              <li>
                <a href="#leaders">Our Leaders</a>
              </li>

              <li>
                <a href="#ministries">Ministries</a>
              </li>

              <li>
                <a href="#events">Events</a>
              </li>

              <li>
                <a href="#announcements">
                  Announcements
                </a>
              </li>
            </ul>
          </div>


          {/* MINISTRIES */}
          <div className="footer-column">
            <h4>Ministries</h4>

            <ul>
              <li>
                <a href="#ministries">
                  Youth Ministry
                </a>
              </li>

              <li>
                <a href="#ministries">
                  PEMEM
                </a>
              </li>

              <li>
                <a href="#ministries">
                  Women's Ministry
                </a>
              </li>

              <li>
                <a href="#ministries">
                  Children's Ministry
                </a>
              </li>

              <li>
                <a href="#ministries">
                  Evangelism Ministry
                </a>
              </li>
            </ul>
          </div>


          {/* CONTACT */}
          <div
            className="footer-column footer-contact"
            id="contact"
          >
            <h4>Contact Us</h4>

            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                ⌖
              </span>

              <div>
                <small>LOCATION</small>
                <p>
                  Ebukrom, Elmina
                  <br />
                  Central Region, Ghana
                </p>
              </div>
            </div>


            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                ☎
              </span>

              <div>
                <small>PHONE</small>

                <a href="tel:+233547543730">
                  +233 54 125 4645
                </a>
              </div>
            </div>


            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                ✉
              </span>

              <div>
                <small>EMAIL</small>

                <a href="mailto:info@ebukromdistrict.org">
                  info@ebukromdistrict.org
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">

          <p>
            © {currentYear} The Church of Pentecost –
            Ebukrom District. All Rights Reserved.
          </p>

          <p className="footer-credit">
            Elmina Area
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;