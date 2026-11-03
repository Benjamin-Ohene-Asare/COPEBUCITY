import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Sermons",
      value: "24",
      link: "/media-admin/sermons",
    },
    {
      label: "Upcoming Events",
      value: "6",
      link: "/media-admin/events",
    },
    {
      label: "Gallery Albums",
      value: "12",
      link: "/media-admin/gallery",
    },
    {
      label: "Announcements",
      value: "8",
      link: "/media-admin/announcements",
    },
    {
      label: "Live Streams",
      value: "5",
      link: "/media-admin/streams",
    },
    {
      label: "Documents",
      value: "15",
      link: "/media-admin/documents",
    },
  ];

  const actions = [
    {
      title: "Add Sermon",
      description: "Upload a new sermon, audio, image and message details.",
      link: "/media-admin/sermons/add",
    },
    {
      title: "Add Event",
      description: "Create a new church programme or upcoming event.",
      link: "/media-admin/events/add",
    },
    {
      title: "Create Gallery",
      description: "Create a new gallery album and upload photos.",
      link: "/media-admin/gallery/create",
    },
    {
      title: "Add Announcement",
      description: "Publish church news and important notices.",
      link: "/media-admin/announcements",
    },
    {
      title: "Add Live Stream",
      description: "Add YouTube or livestream content to the website.",
      link: "/media-admin/streams",
    },
    {
      title: "Upload Document",
      description: "Upload Bible study outlines, manuals and resources.",
      link: "/media-admin/documents",
    },
  ];

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-heading">
        <div>
          <span>OVERVIEW</span>

          <h2>
            Media Dashboard
          </h2>

          <p>
            Manage Ebucity Church website content and media tools
            from one place.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="dashboard-view-site"
        >
          View Website
        </Link>
      </div>


      {/* STATS */}

      <section className="dashboard-stats">

        {stats.map((item) => (
          <Link
            to={item.link}
            className="dashboard-stat-card"
            key={item.label}
          >
            <span>
              {item.label}
            </span>

            <strong>
              {item.value}
            </strong>

            <p>
              View details →
            </p>
          </Link>
        ))}

      </section>


      {/* QUICK ACTIONS */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <span>QUICK ACTIONS</span>

          <h3>
            Create Content
          </h3>

          <p>
            Quickly add new content to the church website.
          </p>
        </div>


        <div className="dashboard-actions">

          {actions.map((item) => (
            <Link
              to={item.link}
              className="dashboard-action-card"
              key={item.title}
            >
              <div>
                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.description}
                </p>
              </div>

              <span>
                →
              </span>
            </Link>
          ))}

        </div>

      </section>


      {/* MEDIA TOOLS */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <span>MEDIA TOOLS</span>

          <h3>
            Service Tools
          </h3>

          <p>
            Tools used by the media team during services.
          </p>
        </div>


        <div className="dashboard-tools">

          <Link
            to="/photo-tag"
            className="dashboard-tool-card"
          >
            <span className="dashboard-tool-badge">
              PHOTO TOOL
            </span>

            <h4>
              Programme Photo Tag
            </h4>

            <p>
              Automatically apply programme tags to church photos.
            </p>

            <strong>
              Open Tool →
            </strong>
          </Link>


          <Link
            to="/presenter/0fba85b0-3221-4cd7-9d70-4313a2e6501a"
            target="_blank"
            className="dashboard-tool-card featured"
          >
            <span className="dashboard-tool-badge">
              LIVE TOOL
            </span>

            <h4>
              Scripture Presenter
            </h4>

            <p>
              Search, detect, preview and send Bible verses live to OBS.
            </p>

            <strong>
              Open Presenter →
            </strong>
          </Link>


          <Link
            to="/presenter/0fba85b0-3221-4cd7-9d70-4313a2e6501a/output"
            target="_blank"
            className="dashboard-tool-card"
          >
            <span className="dashboard-tool-badge">
              OBS
            </span>

            <h4>
              Scripture Output
            </h4>

            <p>
              Open the clean browser-source output used in OBS.
            </p>

            <strong>
              Open Output →
            </strong>
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;