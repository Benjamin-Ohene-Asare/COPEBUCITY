import React from 'react'
import './Sermons.css'

import sermonHero from '../../assets/image1.jpeg'

const SermonHero = () => {
  return (
    <main className="sermons-page">

      <section
        className="sermons-hero"
        
      >
        <div className="sermons-hero-overlay"></div>

        <div className="sermons-hero-content">

          <span className="sermons-hero-label">
            SERMONS & MESSAGES
          </span>

          <h1>
            Word for
            <span> Life</span>
          </h1>

          <p>
            Watch and listen to messages that strengthen your faith,
            deepen your understanding of God's Word and help you grow
            in Christ.
          </p>

        </div>

        <div className="sermons-wave">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C220,110 390,20 620,55 C870,95 1050,20 1440,60 L1440,100 L0,100 Z"
            />
          </svg>
        </div>

      </section>

    </main>
  )
}

export default SermonHero