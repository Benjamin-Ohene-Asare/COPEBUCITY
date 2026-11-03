import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./EventDetail.css";

import { getEvent } from "../../api/api";

const EventDetail = () => {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEvent(slug);

        setEvent(data);
      } catch (error) {
        console.error(
          "Failed to load event:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);


  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`)
      .toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );
  };


  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };


  if (loading) {
    return (
      <main className="event-detail-page">

        <section className="event-detail-body">

          <div className="event-detail-container">

            <p>
              Loading event...
            </p>

          </div>

        </section>

      </main>
    );
  }


  if (!event) {
    return (
      <main className="event-detail-page">

        <section className="event-detail-body">

          <div className="event-detail-container">

            <div className="event-detail-main">

              <h2>
                Event Not Found
              </h2>

              <Link
                to="/events"
                className="event-detail-back"
              >
                ← Back to Events
              </Link>

            </div>

          </div>

        </section>

      </main>
    );
  }


  const eventDate =
    new Date(`${event.start_date}T00:00:00`);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const isUpcoming =
    eventDate >= today;


  return (
    <main className="event-detail-page">

      {/* HERO */}

      <section
        className="event-detail-hero"
        style={
          event.image
            ? {
                backgroundImage:
                  `url(${event.image})`,
              }
            : {}
        }
      >

        <div className="event-detail-overlay">
        </div>


        <div className="event-detail-content">

          <Link
            to="/events"
            className="event-detail-back"
          >
            ← Back to Events
          </Link>


          <span className="event-detail-label">
            {isUpcoming
              ? "UPCOMING EVENT"
              : "PAST EVENT"}
          </span>


          <h1>
            {event.title}
          </h1>


          <div className="event-detail-meta">

            <span>
              {formatDate(event.start_date)}
            </span>


            {event.start_time && (
              <span>
                {formatTime(event.start_time)}
              </span>
            )}


            <span>
              {event.venue}
            </span>

          </div>

        </div>

      </section>


      {/* EVENT BODY */}

      <section className="event-detail-body">

        <div className="event-detail-container">

          <div className="event-detail-main">

            <span className="event-about-label">
              ABOUT THE EVENT
            </span>

            <h2>
              Event Details
            </h2>


            {event.short_description && (
              <p>
                {event.short_description}
              </p>
            )}


            {event.description && (
              <p>
                {event.description}
              </p>
            )}

          </div>


          {/* INFORMATION CARD */}

          <aside className="event-info-card">

            <h3>
              Event Information
            </h3>


            <div className="event-info-row">

              <span>
                Date
              </span>

              <strong>
                {formatDate(event.start_date)}
              </strong>

            </div>


            {event.end_date && (
              <div className="event-info-row">

                <span>
                  End Date
                </span>

                <strong>
                  {formatDate(event.end_date)}
                </strong>

              </div>
            )}


            {event.start_time && (
              <div className="event-info-row">

                <span>
                  Time
                </span>

                <strong>
                  {formatTime(event.start_time)}
                </strong>

              </div>
            )}


            {event.end_time && (
              <div className="event-info-row">

                <span>
                  End Time
                </span>

                <strong>
                  {formatTime(event.end_time)}
                </strong>

              </div>
            )}


            <div className="event-info-row">

              <span>
                Venue
              </span>

              <strong>
                {event.venue}
              </strong>

            </div>


            {event.organizer && (
              <div className="event-info-row">

                <span>
                  Organizer
                </span>

                <strong>
                  {event.organizer}
                </strong>

              </div>
            )}

          </aside>

        </div>

      </section>

    </main>
  );
};

export default EventDetail;