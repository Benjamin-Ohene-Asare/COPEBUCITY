import React from 'react'
import './PastMinisters.css'

import first from '../../assets/first.png'
import second from '../../assets/second.jpeg'

const ministers = [
  {
    image: first,
    minister: 'Ps. Joseph K. Amesinu',
    wife: 'Mrs. Juan Ella Amesinu',
    years: 'START YEAR - END YEAR',
  },
  {
    image: second,
    minister: 'Ps. John Inusah Aturi',
    wife: 'Mrs. Margaret Aturi',
    years: 'START YEAR - END YEAR',
  },
]

const PastMinisters = () => {
  return (
    <section className="past-ministers">
      <div className="past-ministers-container">

        <div className="past-ministers-heading">
          <span>OUR HERITAGE</span>

          <h2>
            Past Ministers Who
            <strong> Served Ebucity</strong>
          </h2>

          <p>
            Honouring the ministers and their families whose service,
            leadership and dedication have contributed to the growth
            of Ebucity Church.
          </p>
        </div>

        <div className="ministers-grid">
          {ministers.map((item, index) => (
            <article className="minister-card" key={index}>

              <div className="minister-image">
                <img
                  src={item.image}
                  alt={`${item.minister} and wife`}
                />

                <div className="minister-years">
                  {item.years}
                </div>
              </div>

              <div className="minister-details">
                <span className="minister-number">
                  0{index + 1}
                </span>

                <div>
                  <h3>{item.minister}</h3>
                  <p>{item.wife}</p>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default PastMinisters