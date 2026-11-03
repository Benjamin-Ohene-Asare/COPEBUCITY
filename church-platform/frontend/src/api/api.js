const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";


const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
};


// ==========================================
// SITE SETTINGS
// ==========================================

export const getSiteSettings = () => {
  return request("/site-settings/");
};


// ==========================================
// HERO
// ==========================================

export const getHeroSlides = () => {
  return request("/hero-slides/");
};

// ABOUT

export const getAbout = () => {
  return request("/about/");
};


// MINISTRIES

export const getMinistries = () => {
  return request("/ministries/");
};


// LEADERS

export const getLeaders = () => {
  return request("/leaders/");
};


// ==========================================
// SERMONS
// ==========================================

export const getSermonSeries = () => {
  return request("/sermon-series/");
};


export const getSermons = () => {
  return request("/sermons/");
};


export const getSermon = (slug) => {
  return request(`/sermons/${slug}/`);
};


// ==========================================
// LIVE STREAMS / VIDEOS
// ==========================================

export const getStreams = () => {
  return request("/streams/");
};

export const getStream = (slug) => {
  return request(`/streams/${slug}/`);
};


// ==========================================
// DOCUMENTS
// ==========================================

export const getDocumentCategories = () => {
  return request("/document-categories/");
};

export const getDocuments = () => {
  return request("/documents/");
};


// ==========================================
// EVENTS
// ==========================================

export const getEvents = () => {
  return request("/events/");
};

export const getEvent = (slug) => {
  return request(`/events/${slug}/`);
};

// ==========================================
// GALLERY
// ==========================================

export const getGalleryAlbums = () => {
  return request("/gallery/");
};


export const getGalleryAlbum = (slug) => {
  return request(`/gallery/${slug}/`);
};


export const uploadGalleryImage = (
  slug,
  formData
) => {
  return request(
    `/gallery/${slug}/upload/`,
    {
      method: "POST",
      body: formData,
    }
  );
};



// PHOTO TAGS
export const getPhotoTags = () =>
  request("/photo-tags/");

export const applyPhotoTag = async (formData) => {
  const response = await fetch(
    `${API_BASE_URL}/photo-tags/apply/`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    let message = "Failed to apply photo tag.";

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {
      // Response was not JSON
    }

    throw new Error(message);
  }

  return response.blob();
};


// ANNOUNCEMENTS
export const getAnnouncements = () =>
  request("/announcements/");

export const getAnnouncement = (slug) =>
  request(`/announcements/${slug}/`);