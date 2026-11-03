import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Event.css";

import { getEvents } from "../../api/api";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // ==========================================
  // DATE HELPERS
  // ==========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    if (!event.start_date) return false;

    const eventDate = new Date(`${event.start_date}T00:00:00`);

    return eventDate >= today;
  });

  const pastEvents = events
    .filter((event) => {
      if (!event.start_date) return false;

      const eventDate = new Date(`${event.start_date}T00:00:00`);

      return eventDate < today;
    })
    .reverse();


  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  const formatPastDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };


  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };


  const getMonth = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`)
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase();
  };


  const getDay = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`)
      .getDate()
      .toString()
      .padStart(2, "0");
  };


  return (
    <main className="event-page">

      {/* HERO */}

      <section className="event-hero">

        <div className="event-hero-content">

          <span className="event-hero-label">
            UPCOMING GATHERINGS
          </span>

          <h1>
            Latest <span>Events</span>
          </h1>

        </div>

      </section>


      {/* EVENT DISCOVERY */}

      <section className="event-discovery">

        <div className="event-container">

          <div className="event-section-heading">

            <span>
              EVENT DISCOVERY
            </span>

            <h2>
              Explore Our
              <strong> Events</strong>
            </h2>

          </div>


          {/* DYNAMIC TIMELINE */}

          {upcomingEvents.length > 0 && (

            <div className="event-timeline">

              <div className="timeline-title">
                <h3>Timeline</h3>
              </div>


              <div className="timeline-list">

                {upcomingEvents.slice(0, 5).map(
                  (event, index) => (

                    <Link
                      to={`/events/${event.slug}`}
                      className={
                        index === 0
                          ? "timeline-item active"
                          : "timeline-item"
                      }
                      key={event.id}
                    >

                      <span>
                        {getMonth(event.start_date)}
                      </span>

                      <strong>
                        {getDay(event.start_date)}
                      </strong>

                    </Link>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ALL EVENTS */}

      <section className="all-events-section">

        <div className="event-container">

          <div className="event-section-heading">

            <span>
              ALL EVENTS
            </span>

            <h2>
              Upcoming
              <strong> Events</strong>
            </h2>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="no-events">
              Loading events...
            </div>
          )}


          {/* UPCOMING EVENTS */}

          {!loading && (
            <div className="upcoming-events-grid">

              {upcomingEvents.map((event) => (

                <Link
                  to={`/events/${event.slug}`}
                  className="upcoming-event-card"
                  key={event.id}
                >

                  <div className="upcoming-event-image">

                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                      />
                    )}

                    <span className="upcoming-badge">
                      Upcoming
                    </span>

                  </div>


                  <div className="upcoming-event-content">

                    <h3>
                      {event.title}
                    </h3>


                    <div className="event-meta">

                      <span>
                        {formatDate(event.start_date)}
                      </span>

                      {event.start_time && (
                        <span>
                          {formatTime(event.start_time)}
                        </span>
                      )}

                    </div>


                    <p>
                      {event.venue}
                    </p>


                    <div className="event-card-action">
                      View Event
                      <span>→</span>
                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}


          {!loading &&
            upcomingEvents.length === 0 && (

              <div className="no-events">

                <h3>
                  No upcoming events
                </h3>

                <p>
                  Check back soon for upcoming
                  church programmes.
                </p>

              </div>

            )}


          {/* PAST EVENTS */}

          {pastEvents.length > 0 && (
            <>

              <div className="past-events-header">

                <span>
                  ARCHIVE
                </span>

                <h2>
                  Past Events
                </h2>

              </div>


              <div className="past-events-grid">

                {pastEvents.map((event) => (

                  <Link
                    to={`/events/${event.slug}`}
                    className="past-event-card"
                    key={event.id}
                  >

                    <div className="past-event-image">

                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                        />
                      )}


                      <div className="past-event-overlay">
                        <span>
                          View Event
                        </span>
                      </div>

                    </div>


                    <div className="past-event-content">

                      <h3>
                        {event.title}
                      </h3>

                      <span>
                        {formatPastDate(
                          event.start_date
                        )}
                      </span>

                    </div>

                  </Link>

                ))}

              </div>

            </>
          )}

        </div>

      </section>

    </main>
  );
};

export default Event;