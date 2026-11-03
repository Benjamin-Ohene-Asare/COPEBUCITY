import React, { useEffect, useState } from "react";
import "./PastMinisters.css";

import { getLeaders } from "../../api/api";

const PastMinisters = () => {
  const [ministers, setMinisters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPastMinisters = async () => {
      try {
        const data = await getLeaders();

        const pastMinisters = data.filter(
          (leader) => leader.leader_type === "past"
        );

        setMinisters(pastMinisters);
      } catch (error) {
        console.error(
          "Failed to load past ministers:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPastMinisters();
  }, []);

  if (loading) {
    return null;
  }

  if (ministers.length === 0) {
    return null;
  }

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
            Honouring the ministers and their families whose
            service, leadership and dedication have contributed
            to the growth of Ebucity Church.
          </p>
        </div>

        <div className="ministers-grid">

          {ministers.map((item, index) => (

            <article
              className="minister-card"
              key={item.id}
            >

              <div className="minister-image">

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                )}

                <div className="minister-years">
                  {item.start_year || "START YEAR"}
                  {" - "}
                  {item.end_year || "END YEAR"}
                </div>

              </div>

              <div className="minister-details">

                <span className="minister-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>

                  <h3>
                    {item.name}
                  </h3>

                  {item.spouse_name && (
                    <p>
                      {item.spouse_name}
                    </p>
                  )}

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>
    </section>
  );
};

export default PastMinisters;