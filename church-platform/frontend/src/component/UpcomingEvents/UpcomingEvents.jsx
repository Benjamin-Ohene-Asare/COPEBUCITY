import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UpcomingEvents.css";

import { getEvents } from "../../api/api";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data
          .filter((event) => {
            if (!event.start_date) return false;

            const eventDate = new Date(
              `${event.start_date}T00:00:00`
            );

            return eventDate >= today;
          })
          .sort(
            (a, b) =>
              new Date(a.start_date) -
              new Date(b.start_date)
          )
          .slice(0, 3);

        setEvents(upcoming);
      } catch (error) {
        console.error(
          "Failed to load upcoming events:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getDay = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`)
      .getDate()
      .toString()
      .padStart(2, "0");
  };

  const getMonth = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`)
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase();
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

  if (loading) {
    return null;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="events-section">

      <div className="events-container">

        {/* HEADER */}

        <div className="events-header">

          <div>

            <span className="events-eyebrow">
              WHAT'S HAPPENING
            </span>

            <h2>
              Upcoming <span>Events</span>
            </h2>

          </div>


          <p>
            Stay connected and be part of our
            upcoming services, programmes and
            special gatherings.
          </p>

        </div>


        {/* EVENTS */}

        <div className="events-grid">

          {events.map((event) => (

            <article
              className="event-card"
              key={event.id}
            >

              <div className="event-image-wrapper">

                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                )}


                <div className="event-image-overlay">
                </div>


                <div className="event-date">

                  <span className="event-day">
                    {getDay(event.start_date)}
                  </span>

                  <span className="event-month">
                    {getMonth(event.start_date)}
                  </span>

                </div>


                {event.organizer && (
                  <span className="event-category">
                    {event.organizer}
                  </span>
                )}

              </div>


              <div className="event-content">

                <h3>
                  {event.title}
                </h3>


                <p className="event-description">
                  {event.short_description ||
                    event.description}
                </p>


                <div className="event-info">

                  <div className="event-info-item">

                    <span className="info-label">
                      TIME
                    </span>

                    <span>
                      {formatTime(event.start_time)}
                    </span>

                  </div>


                  <div className="event-divider">
                  </div>


                  <div className="event-info-item">

                    <span className="info-label">
                      VENUE
                    </span>

                    <span>
                      {event.venue}
                    </span>

                  </div>

                </div>


                <Link
                  to={`/events/${event.slug}`}
                  className="event-button"
                >
                  View Event
                  <span>→</span>
                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default UpcomingEvents;