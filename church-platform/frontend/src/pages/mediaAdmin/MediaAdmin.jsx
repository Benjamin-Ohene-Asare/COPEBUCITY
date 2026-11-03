import React from "react";
import { Link } from "react-router-dom";
import "./MediaAdmin.css";

const PRESENTER_SESSION =
  "0fba85b0-3221-4cd7-9d70-4313a2e6501a";


const MediaAdmin = () => {

  const tools = [
    {
      title: "Scripture Presenter",
      description:
        "Search, preview and send Bible verses live to OBS.",
      path: `/presenter/${PRESENTER_SESSION}`,
      category: "media",
      badge: "LIVE TOOL",
    },

    {
      title: "OBS Scripture Output",
      description:
        "Open the clean scripture output used inside OBS.",
      path: `/presenter/${PRESENTER_SESSION}/output`,
      category: "media",
      badge: "OBS",
      newTab: true,
    },

    {
      title: "Photo Tag Tool",
      description:
        "Apply programme tags automatically to church photos.",
      path: "/photo-tag",
      category: "media",
      badge: "PHOTO",
    },

    {
      title: "Gallery",
      description:
        "Manage church photo collections and approved uploads.",
      path: "/gallery",
      category: "content",
      badge: "CONTENT",
    },

    {
      title: "Sermons",
      description:
        "View and manage sermon messages and audio content.",
      path: "/sermons",
      category: "content",
      badge: "CONTENT",
    },

    {
      title: "Events",
      description:
        "Manage upcoming and past church programmes.",
      path: "/events",
      category: "content",
      badge: "CONTENT",
    },

    {
      title: "Announcements",
      description:
        "Manage church news, notices and announcements.",
      path: "/announcements",
      category: "content",
      badge: "CONTENT",
    },

    {
      title: "Documents",
      description:
        "Manage Bible study outlines, manuals and resources.",
      path: "/document",
      category: "content",
      badge: "CONTENT",
    },

    {
      title: "Watch Live",
      description:
        "View and manage church livestream and media videos.",
      path: "/watch-live",
      category: "content",
      badge: "MEDIA",
    },
  ];


  const mediaTools =
    tools.filter(
      (tool) =>
        tool.category === "media"
    );


  const contentTools =
    tools.filter(
      (tool) =>
        tool.category === "content"
    );


  const renderTool = (tool) => {

    const card = (
      <article className="media-admin-card">

        <div className="media-admin-card-top">

          <span className="media-admin-badge">
            {tool.badge}
          </span>

          <span className="media-admin-arrow">
            →
          </span>

        </div>


        <div className="media-admin-card-content">

          <h3>
            {tool.title}
          </h3>

          <p>
            {tool.description}
          </p>

        </div>


        <div className="media-admin-card-footer">

          <span>
            Open Tool
          </span>

          <span>
            →
          </span>

        </div>

      </article>
    );


    if (tool.newTab) {
      return (
        <a
          key={tool.title}
          href={tool.path}
          target="_blank"
          rel="noopener noreferrer"
          className="media-admin-card-link"
        >
          {card}
        </a>
      );
    }


    return (
      <Link
        key={tool.title}
        to={tool.path}
        className="media-admin-card-link"
      >
        {card}
      </Link>
    );
  };


  return (
    <main className="media-admin-page">

      {/* TOP BAR */}

      <header className="media-admin-header">

        <div>

          <span className="media-admin-brand-label">
            EBUCITY MEDIA
          </span>

          <h1>
            Media Administration
          </h1>

          <p>
            Church media tools and content management
            in one workspace.
          </p>

        </div>


        <div className="media-admin-header-status">

          <span className="media-admin-status-dot"></span>

          Media Workspace

        </div>

      </header>


      {/* MAIN CONTENT */}

      <section className="media-admin-container">


        {/* INTRO */}

        <div className="media-admin-intro">

          <div>

            <span>
              CONTROL CENTRE
            </span>

            <h2>
              Welcome to the
              <strong> Media Dashboard</strong>
            </h2>

          </div>


          <p>
            Access presentation tools, broadcast controls,
            church media and website content from one place.
          </p>

        </div>


        {/* MEDIA TOOLS */}

        <section className="media-admin-section">

          <div className="media-admin-section-heading">

            <div>

              <span>
                BROADCAST & MEDIA
              </span>

              <h2>
                Media Tools
              </h2>

            </div>

            <p>
              Tools used during services and media production.
            </p>

          </div>


          <div className="media-admin-grid media-admin-grid-featured">

            {mediaTools.map(renderTool)}

          </div>

        </section>


        {/* CONTENT */}

        <section className="media-admin-section">

          <div className="media-admin-section-heading">

            <div>

              <span>
                WEBSITE MANAGEMENT
              </span>

              <h2>
                Content Management
              </h2>

            </div>

            <p>
              Quickly access the public content sections
              of the church website.
            </p>

          </div>


          <div className="media-admin-grid">

            {contentTools.map(renderTool)}

          </div>

        </section>

      </section>

    </main>
  );
};


export default MediaAdmin;