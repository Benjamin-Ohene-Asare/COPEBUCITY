import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./EventAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const EventAdmin = () => {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_BASE}/events/`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Unable to load events."
        );
      }

      setEvents(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadEvents();
  }, []);


  const deleteEvent =
    async (event) => {

      const confirmed =
        window.confirm(
          `Delete "${event.title}"?`
        );

      if (!confirmed) return;


      try {
        const response =
          await fetch(
            `${API_BASE}/events/${event.slug}/`,
            {
              method: "DELETE",
            }
          );


        if (
          !response.ok &&
          response.status !== 204
        ) {
          let data = {};

          try {
            data =
              await response.json();
          } catch {
            // no JSON response
          }

          throw new Error(
            data.detail ||
            "Unable to delete event."
          );
        }


        setEvents(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== event.id
            )
        );

      } catch (err) {
        setError(
          err.message
        );
      }
    };


  const filteredEvents =
    events.filter(
      (event) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          event.title
            ?.toLowerCase()
            .includes(query) ||

          event.location
            ?.toLowerCase()
            .includes(query) ||

          event.category
            ?.toLowerCase()
            .includes(query)
        );
      }
    );


  const getImage = (
    event
  ) => {
    return (
      event.image ||
      event.flyer ||
      null
    );
  };


  return (
    <div className="event-admin-page">

      {/* HEADER */}

      <div className="event-admin-heading">

        <div>

          <span>
            CONTENT MANAGEMENT
          </span>

          <h2>
            Events
          </h2>

          <p>
            Create and manage upcoming
            church programmes and events.
          </p>

        </div>


        <Link
          to="/media-admin/events/add"
          className="event-admin-add-btn"
        >
          + Add Event
        </Link>

      </div>


      {/* TOOLBAR */}

      <div className="event-admin-toolbar">

        <div className="event-admin-search">

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div className="event-admin-total">

          <span>
            Total Events
          </span>

          <strong>
            {events.length}
          </strong>

        </div>

      </div>


      {error && (
        <div className="event-admin-error">
          {error}
        </div>
      )}


      {/* TABLE */}

      <div className="event-admin-table-wrapper">

        {loading ? (

          <div className="event-admin-loading">
            Loading events...
          </div>

        ) : filteredEvents.length > 0 ? (

          <table className="event-admin-table">

            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {filteredEvents.map(
                (event) => (

                  <tr key={event.id}>

                    <td>

                      <div className="event-admin-event">

                        <div className="event-admin-thumb">

                          {getImage(
                            event
                          ) ? (

                            <img
                              src={
                                getImage(
                                  event
                                )
                              }
                              alt={
                                event.title
                              }
                            />

                          ) : (

                            <span>
                              No Image
                            </span>

                          )}

                        </div>


                        <div>

                          <strong>
                            {
                              event.title
                            }
                          </strong>

                          <span>
                            {
                              event.slug
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {
                        event.date ||
                        event.start_date ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        event.time ||
                        event.start_time ||
                        "-"
                      }
                    </td>


                    <td>
                      {
                        event.location ||
                        event.venue ||
                        "-"
                      }
                    </td>


                    <td>

                      <span
                        className={
                          event.is_past
                            ? "event-status past"
                            : "event-status upcoming"
                        }
                      >
                        {
                          event.is_past
                            ? "Past"
                            : "Upcoming"
                        }
                      </span>

                    </td>


                    <td>

                      <div className="event-admin-actions">

                        <Link
                          to={`/events/${event.slug}`}
                          target="_blank"
                          className="event-action view"
                        >
                          View
                        </Link>


                        <Link
                          to={`/media-admin/events/${event.slug}/edit`}
                          className="event-action edit"
                        >
                          Edit
                        </Link>


                        <button
                          type="button"
                          className="event-action delete"
                          onClick={() =>
                            deleteEvent(
                              event
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="event-admin-empty">

            <h3>
              No events found
            </h3>

            <p>
              Add your first event or try
              another search.
            </p>

            <Link
              to="/media-admin/events/add"
            >
              Add Event
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};


export default EventAdmin;