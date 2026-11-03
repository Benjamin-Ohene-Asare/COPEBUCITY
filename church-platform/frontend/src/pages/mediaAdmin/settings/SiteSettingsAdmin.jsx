import React, {
  useEffect,
  useState,
} from "react";

import "./SiteSettingsAdmin.css";


const API_BASE =
  "http://127.0.0.1:8000/api";


const SiteSettingsAdmin = () => {
  const [form, setForm] =
    useState({
      church_name:
        "Ebucity Church",

      district_name:
        "Ebukrom District",

      area_name:
        "Elmina Area",

      tagline:
        "An Epitome of Grace and True Pentecostalism",

      email: "",

      phone: "",

      whatsapp: "",

      address: "",

      facebook_url: "",

      youtube_url: "",

      instagram_url: "",

      default_stream_platform:
        "youtube",

      enable_gallery_uploads:
        true,

      enable_announcements:
        true,

      enable_live_stream:
        true,

      enable_documents:
        true,
    });


  const [logo, setLogo] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =====================================
     LOAD SETTINGS
  ===================================== */

  const loadSettings =
    async () => {

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE}/site-settings/`
          );

        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to load site settings."
          );
        }


        setForm(
          (prev) => ({
            ...prev,
            ...data,
          })
        );


        if (data.logo) {
          setLogoPreview(
            data.logo
          );
        }


      } catch (err) {
        console.error(err);

        /*
          Do not break the whole page
          if settings endpoint has not
          been created yet.
        */

        setError(
          "Settings API is not connected yet."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadSettings();
  }, []);


  /* =====================================
     FORM
  ===================================== */

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;


      setForm(
        (prev) => ({
          ...prev,

          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );
    };


  const handleLogo =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;


      setLogo(file);


      setLogoPreview(
        URL.createObjectURL(file)
      );
    };


  /* =====================================
     SAVE
  ===================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {
        setSaving(true);

        setError("");
        setSuccess("");


        const formData =
          new FormData();


        Object.entries(form)
          .forEach(
            ([key, value]) => {

              formData.append(
                key,

                typeof value ===
                "boolean"
                  ? value
                    ? "true"
                    : "false"
                  : value
              );

            }
          );


        if (logo) {
          formData.append(
            "logo",
            logo
          );
        }


        const response =
          await fetch(
            `${API_BASE}/site-settings/`,
            {
              method: "PATCH",

              body: formData,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to save settings."
          );
        }


        setSuccess(
          "Site settings saved successfully."
        );


      } catch (err) {
        setError(
          err.message
        );

      } finally {
        setSaving(false);
      }
    };


  if (loading) {
    return (
      <div className="site-settings-loading">
        Loading site settings...
      </div>
    );
  }


  return (
    <div className="site-settings-page">

      {/* HEADER */}

      <div className="site-settings-heading">

        <div>

          <span>
            SYSTEM SETTINGS
          </span>

          <h2>
            Site Settings
          </h2>

          <p>
            Manage general church information,
            media preferences and website features.
          </p>

        </div>


        <button
          type="button"
          className="site-settings-view-site"
          onClick={() =>
            window.open(
              "/",
              "_blank"
            )
          }
        >
          View Website
        </button>

      </div>


      {error && (
        <div className="site-settings-message error">
          {error}
        </div>
      )}


      {success && (
        <div className="site-settings-message success">
          {success}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
      >

        <div className="site-settings-grid">


          {/* LEFT */}

          <div className="site-settings-main">


            {/* CHURCH INFO */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  GENERAL
                </span>

                <h3>
                  Church Information
                </h3>

              </div>


              <div className="settings-field">

                <label>
                  Church Name
                </label>

                <input
                  type="text"
                  name="church_name"
                  value={
                    form.church_name
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="settings-two-columns">

                <div className="settings-field">

                  <label>
                    District
                  </label>

                  <input
                    type="text"
                    name="district_name"
                    value={
                      form.district_name
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="settings-field">

                  <label>
                    Area
                  </label>

                  <input
                    type="text"
                    name="area_name"
                    value={
                      form.area_name
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>


              <div className="settings-field">

                <label>
                  Church Tagline
                </label>

                <input
                  type="text"
                  name="tagline"
                  value={
                    form.tagline
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </section>


            {/* CONTACT */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  CONTACT
                </span>

                <h3>
                  Contact Information
                </h3>

              </div>


              <div className="settings-two-columns">

                <div className="settings-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={
                      handleChange
                    }
                    placeholder="church@example.com"
                  />

                </div>


                <div className="settings-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={
                      handleChange
                    }
                    placeholder="024..."
                  />

                </div>

              </div>


              <div className="settings-field">

                <label>
                  WhatsApp Number
                </label>

                <input
                  type="text"
                  name="whatsapp"
                  value={
                    form.whatsapp
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="settings-field">

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Church location..."
                />

              </div>

            </section>


            {/* SOCIAL MEDIA */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  SOCIAL MEDIA
                </span>

                <h3>
                  Social Links
                </h3>

              </div>


              <div className="settings-field">

                <label>
                  Facebook
                </label>

                <input
                  type="url"
                  name="facebook_url"
                  value={
                    form.facebook_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://facebook.com/..."
                />

              </div>


              <div className="settings-field">

                <label>
                  YouTube
                </label>

                <input
                  type="url"
                  name="youtube_url"
                  value={
                    form.youtube_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://youtube.com/..."
                />

              </div>


              <div className="settings-field">

                <label>
                  Instagram
                </label>

                <input
                  type="url"
                  name="instagram_url"
                  value={
                    form.instagram_url
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://instagram.com/..."
                />

              </div>

            </section>

          </div>


          {/* RIGHT */}

          <aside className="site-settings-side">


            {/* LOGO */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  BRANDING
                </span>

                <h3>
                  Church Logo
                </h3>

              </div>


              <label className="site-logo-upload">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={
                    handleLogo
                  }
                />


                {logoPreview ? (

                  <img
                    src={
                      logoPreview
                    }
                    alt="Church logo"
                  />

                ) : (

                  <div>

                    <strong>
                      Upload Logo
                    </strong>

                    <span>
                      PNG recommended
                    </span>

                  </div>

                )}

              </label>

            </section>


            {/* MEDIA DEFAULTS */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  MEDIA
                </span>

                <h3>
                  Media Preferences
                </h3>

              </div>


              <div className="settings-field">

                <label>
                  Default Stream Platform
                </label>

                <select
                  name="default_stream_platform"
                  value={
                    form.default_stream_platform
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="youtube">
                    YouTube
                  </option>

                  <option value="facebook">
                    Facebook
                  </option>
                </select>

              </div>

            </section>


            {/* FEATURES */}

            <section className="site-settings-card">

              <div className="site-settings-card-heading">

                <span>
                  FEATURES
                </span>

                <h3>
                  Website Features
                </h3>

              </div>


              <div className="settings-option">

                <div>

                  <strong>
                    Gallery Uploads
                  </strong>

                  <span>
                    Allow public gallery
                    submissions where enabled.
                  </span>

                </div>

                <input
                  type="checkbox"
                  name="enable_gallery_uploads"
                  checked={
                    form.enable_gallery_uploads
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="settings-option">

                <div>

                  <strong>
                    Announcements
                  </strong>

                  <span>
                    Show church announcements.
                  </span>

                </div>

                <input
                  type="checkbox"
                  name="enable_announcements"
                  checked={
                    form.enable_announcements
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="settings-option">

                <div>

                  <strong>
                    Live Stream
                  </strong>

                  <span>
                    Enable the Watch Live
                    section.
                  </span>

                </div>

                <input
                  type="checkbox"
                  name="enable_live_stream"
                  checked={
                    form.enable_live_stream
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="settings-option">

                <div>

                  <strong>
                    Documents
                  </strong>

                  <span>
                    Enable the church
                    resource library.
                  </span>

                </div>

                <input
                  type="checkbox"
                  name="enable_documents"
                  checked={
                    form.enable_documents
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </section>

          </aside>

        </div>


        {/* SAVE */}

        <div className="site-settings-actions">

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving Settings..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};


export default SiteSettingsAdmin;