import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SermonList.css";

import {
  getSermons,
  getSermonSeries,
} from "../../api/api";

const SermonList = () => {
  const [sermons, setSermons] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSermons = async () => {
      try {
        const [sermonsData, seriesData] = await Promise.all([
          getSermons(),
          getSermonSeries(),
        ]);

        setSermons(sermonsData);
        setSeriesList(seriesData);
      } catch (error) {
        console.error("Failed to load sermons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSermons();
  }, []);

  const filters = [
    "All",
    ...seriesList.map((series) => series.name),
  ];

  const filteredSermons = sermons.filter((sermon) => {
    const title = sermon.title || "";
    const preacher = sermon.preacher || "";
    const scripture = sermon.scripture || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      preacher.toLowerCase().includes(search.toLowerCase()) ||
      scripture.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      sermon.series_name === filter;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="sermon-list-section">
        <div className="sermon-list-container">
          <div className="no-sermons">
            <p>Loading sermons...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sermon-list-section">
      <div className="sermon-list-container">

        <div className="sermon-list-heading">
          <span>MESSAGES FOR YOUR JOURNEY</span>

          <h2>
            Explore Our <strong>Sermons</strong>
          </h2>

          <p>
            Listen to messages that strengthen your faith,
            deepen your understanding of God's Word and help
            you grow in Christ.
          </p>
        </div>


        <div className="sermon-tools">

          <div className="sermon-search">
            <input
              type="text"
              placeholder="Search sermon, preacher or scripture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <div className="sermon-filter">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

        </div>


        <div className="sermon-filter-pills">

          {filters.map((item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "filter-pill active"
                  : "filter-pill"
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}

        </div>


        <div className="sermons-grid">

          {filteredSermons.map((sermon) => (

            <article
              className="sermon-card"
              key={sermon.id}
            >

              <div className="sermon-card-image">

                {sermon.thumbnail && (
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                  />
                )}

                <Link
                  to={`/sermons/${sermon.slug}`}
                  className="sermon-play-overlay"
                  aria-label={`Listen to ${sermon.title}`}
                >
                  <span className="play-icon">
                    ▶
                  </span>
                </Link>

                <span className="sermon-date">
                  {formatDate(sermon.sermon_date)}
                </span>

              </div>


              <div className="sermon-card-body">

                {sermon.series_name && (
                  <span className="sermon-series">
                    {sermon.series_name}
                  </span>
                )}

                <h3>
                  {sermon.title}
                </h3>

                <p className="sermon-preacher">
                  {sermon.preacher}
                </p>

                <p className="sermon-scripture">
                  {sermon.scripture}
                </p>


                <div className="sermon-card-footer">

                  <Link
                    to={`/sermons/${sermon.slug}`}
                    className="sermon-listen"
                  >
                    <span>▶</span>
                    Listen Now
                  </Link>

                  <Link
                    to={`/sermons/${sermon.slug}`}
                    className="sermon-arrow"
                    aria-label="Open sermon"
                  >
                    →
                  </Link>

                </div>

              </div>

            </article>

          ))}

        </div>


        {filteredSermons.length === 0 && (
          <div className="no-sermons">
            <h3>No sermons found</h3>

            <p>
              Try searching with a different title,
              preacher or scripture.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default SermonList;