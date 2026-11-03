import React, { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import "./MediaAdminLayout.css";


const MediaAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();


  const menuItems = [
    {
      section: "MAIN",
      items: [
        {
          label: "Dashboard",
          path: "/media-admin",
          icon: "⌂",
          end: true,
        },
      ],
    },

    {
      section: "CONTENT",
      items: [
        {
          label: "Sermons",
          path: "/media-admin/sermons",
          icon: "S",
        },

        {
          label: "Events",
          path: "/media-admin/events",
          icon: "E",
        },

        {
          label: "Announcements",
          path: "/media-admin/announcements",
          icon: "A",
        },

        {
          label: "Gallery",
          path: "/media-admin/gallery",
          icon: "G",
        },

        {
          label: "Live Streams",
          path: "/media-admin/streams",
          icon: "L",
        },

        {
          label: "Documents",
          path: "/media-admin/documents",
          icon: "D",
        },
      ],
    },

    {
      section: "MEDIA TOOLS",
      items: [
        {
          label: "Photo Tags",
          path: "/media-admin/photo-tags",
          icon: "P",
        },

        {
          label: "Scripture Presenter",
          path: "/presenter/0fba85b0-3221-4cd7-9d70-4313a2e6501a",
          icon: "B",
          external: true,
        },
      ],
    },

    {
      section: "SYSTEM",
      items: [
        {
          label: "Site Settings",
          path: "/media-admin/settings",
          icon: "⚙",
        },
      ],
    },
  ];


  const getPageTitle = () => {
    if (
      location.pathname ===
      "/media-admin"
    ) {
      return "Dashboard";
    }

    if (
      location.pathname.includes(
        "/sermons"
      )
    ) {
      return "Sermons";
    }

    if (
      location.pathname.includes(
        "/events"
      )
    ) {
      return "Events";
    }

    if (
      location.pathname.includes(
        "/announcements"
      )
    ) {
      return "Announcements";
    }

    if (
      location.pathname.includes(
        "/gallery"
      )
    ) {
      return "Gallery";
    }

    if (
      location.pathname.includes(
        "/streams"
      )
    ) {
      return "Live Streams";
    }

    if (
      location.pathname.includes(
        "/documents"
      )
    ) {
      return "Documents";
    }

    if (
      location.pathname.includes(
        "/photo-tags"
      )
    ) {
      return "Photo Tags";
    }

    if (
      location.pathname.includes(
        "/settings"
      )
    ) {
      return "Site Settings";
    }

    return "Media Admin";
  };


  return (
    <div className="media-admin-shell">

      {/* SIDEBAR */}

      <aside
        className={
          sidebarOpen
            ? "media-admin-sidebar open"
            : "media-admin-sidebar"
        }
      >

        <div className="media-admin-logo">

          <div className="media-admin-logo-mark">
            EC
          </div>

          <div>
            <span>
              EBUCITY
            </span>

            <strong>
              Media Admin
            </strong>
          </div>

        </div>


        <nav className="media-admin-nav">

          {menuItems.map(
            (group) => (

              <div
                className="media-admin-nav-group"
                key={group.section}
              >

                <span className="media-admin-nav-section">
                  {group.section}
                </span>


                {group.items.map(
                  (item) => {

                    if (item.external) {
                      return (
                        <Link
                          key={item.label}
                          to={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="media-admin-nav-link"
                          onClick={() =>
                            setSidebarOpen(false)
                          }
                        >

                          <span className="media-admin-nav-icon">
                            {item.icon}
                          </span>

                          <span>
                            {item.label}
                          </span>

                        </Link>
                      );
                    }


                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        end={item.end}
                        className={({
                          isActive,
                        }) =>
                          isActive
                            ? "media-admin-nav-link active"
                            : "media-admin-nav-link"
                        }
                        onClick={() =>
                          setSidebarOpen(false)
                        }
                      >

                        <span className="media-admin-nav-icon">
                          {item.icon}
                        </span>

                        <span>
                          {item.label}
                        </span>

                      </NavLink>
                    );
                  }
                )}

              </div>

            )
          )}

        </nav>


        <div className="media-admin-sidebar-bottom">

          <Link
            to="/"
            className="media-admin-view-site"
          >
            View Website
            <span>→</span>
          </Link>

        </div>

      </aside>


      {/* MAIN */}

      <div className="media-admin-main">

        {/* HEADER */}

        <header className="media-admin-topbar">

          <div className="media-admin-topbar-left">

            <button
              type="button"
              className="media-admin-menu-btn"
              onClick={() =>
                setSidebarOpen(
                  (prev) => !prev
                )
              }
            >
              ☰
            </button>


            <div>

              <span className="media-admin-page-label">
                EBUCITY MEDIA
              </span>

              <h1>
                {getPageTitle()}
              </h1>

            </div>

          </div>


          <div className="media-admin-topbar-right">

            <div className="media-admin-search">
              <input
                type="text"
                placeholder="Search admin..."
              />
            </div>


            <div className="media-admin-user">

              <div className="media-admin-avatar">
                A
              </div>

              <div>
                <strong>
                  Media Admin
                </strong>

                <span>
                  Administrator
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <main className="media-admin-content">

          <Outlet />

        </main>

      </div>


      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="media-admin-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        />
      )}

    </div>
  );
};


export default MediaAdminLayout;