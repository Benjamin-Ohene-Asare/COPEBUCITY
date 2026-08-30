import React from "react";
import "./UpcomingEvents.css";

import event1 from "../../assets/event1.jpg";
import event2 from "../../assets/event2.jpg";
import event3 from "../../assets/event3.jpg";

const events = [
  {
    id: 1,
    day: "06",
    month: "SEP",
    image: event1,
    category: "WORSHIP",
    title: "Sunday Worship Service",
    description:
      "Join us for a refreshing time in God's presence as we worship, pray and receive His Word.",
    time: "8:00 AM",
    venue: "Church Auditorium",
  },
  {
    id: 2,
    day: "12",
    month: "SEP",
    image: event2,
    category: "PRAYER",
    title: "District Prayer Meeting",
    description:
      "A special gathering of believers seeking the face of God through prayer and intercession.",
    time: "6:30 PM",
    venue: "Central Assembly",
  },
  {
    id: 3,
    day: "19",
    month: "SEP",
    image: event3,
    category: "EVANGELISM",
    title: "Community Outreach",
    description:
      "Taking the message of Jesus Christ beyond the walls of the church and reaching our community.",
    time: "4:00 PM",
    venue: "Ebukrom Community",
  },
];

const UpcomingEvents = () => {
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
            Stay connected and be part of our upcoming services,
            programmes and special gatherings.
          </p>
        </div>

        {/* EVENTS */}
        <div className="events-grid">
          {events.map((event) => (
            <article className="event-card" key={event.id}>

              <div className="event-image-wrapper">

                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />

                <div className="event-image-overlay"></div>

                <div className="event-date">
                  <span className="event-day">
                    {event.day}
                  </span>

                  <span className="event-month">
                    {event.month}
                  </span>
                </div>

                <span className="event-category">
                  {event.category}
                </span>

              </div>

              <div className="event-content">

                <h3>{event.title}</h3>

                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-info">

                  <div className="event-info-item">
                    <span className="info-label">
                      TIME
                    </span>
                    <span>{event.time}</span>
                  </div>

                  <div className="event-divider"></div>

                  <div className="event-info-item">
                    <span className="info-label">
                      VENUE
                    </span>
                    <span>{event.venue}</span>
                  </div>

                </div>

                <button className="event-button">
                  View Event
                  <span>→</span>
                </button>

              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UpcomingEvents;