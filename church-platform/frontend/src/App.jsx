import React from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/home/Home";
import Header from "./component/header/Header";
import Footer from "./component/footer/Footer";
import About from "./pages/about/About";
import Sermons from "./pages/sermons/Sermons";
import SermonDetail from "./pages/sermonDetail/SermonDetail";
import WatchLive from "./pages/watchLive/WatchLive";
import StreamMainPage from "./pages/streamMainPage/StreamMainPage";
import Document from "./pages/Document/Document";
import Event from "./pages/event/Event";
import EventDetail from "./pages/eventDetail/EventDetail";
import Gallery from "./pages/gallery/Gallery";
import GalleryDetail from "./pages/gallery/GalleryDetail";
import GalleryUpload from "./pages/gallery/GalleryUpload";
import PhotoTag from "./pages/photoTag/PhotoTag";
import ScrollToTop from "./component/scrollToTop/ScrollToTop";
import Ann from "./pages/announcement/Ann";
import AnnDetails from "./pages/announcement/AnnDetails";

import PresenterControl from "./pages/presenter/PresenterControl";
import PresenterOutput from "./pages/presenter/PresenterOutput";

import MediaAdminLayout from "./pages/mediaAdmin/MediaAdminLayout";

import Dashboard from "./pages/mediaAdmin/dashboard/Dashboard";

import SermonAdmin from "./pages/mediaAdmin/sermons/SermonAdmin";
import AddSermon from "./pages/mediaAdmin/sermons/AddSermon";

import EventAdmin from "./pages/mediaAdmin/events/EventAdmin";
import AddEvent from "./pages/mediaAdmin/events/AddEvent";

import GalleryAdmin from "./pages/mediaAdmin/gallery/GalleryAdmin";
import CreateGallery from "./pages/mediaAdmin/gallery/CreateGallery";

import AnnouncementAdmin from "./pages/mediaAdmin/announcements/AnnouncementAdmin";

import StreamAdmin from "./pages/mediaAdmin/streams/StreamAdmin";

import DocumentAdmin from "./pages/mediaAdmin/documents/DocumentAdmin";

import PhotoTagAdmin from "./pages/mediaAdmin/tags/PhotoTagAdmin";

import SiteSettingsAdmin from "./pages/mediaAdmin/settings/SiteSettingsAdmin";
import GalleryUploads
  from "./pages/mediaAdmin/gallery/GalleryUploads";

import GallerySubmissions
  from "./pages/mediaAdmin/gallery/GallerySubmissions";
import AddAnnouncement
  from "./pages/mediaAdmin/announcements/AddAnnouncement";

import AddStream
  from "./pages/mediaAdmin/streams/AddStream";
import AddDocument
  from "./pages/mediaAdmin/documents/AddDocument";
import AddPhotoTag
  from "./pages/mediaAdmin/tags/AddPhotoTag";



const App = () => {
  const location = useLocation();


  const isSermonDetail =
    location.pathname.startsWith("/sermons/") &&
    location.pathname !== "/sermons";


  const isPresenterPage =
    location.pathname.startsWith(
      "/presenter/"
    );


  const isMediaAdmin =
    location.pathname.startsWith(
      "/media-admin"
    );


  const isMediaWorkspace =
    isPresenterPage ||
    isMediaAdmin;


  return (
    <>
      <ScrollToTop />


      {!isSermonDetail &&
        !isMediaWorkspace &&
        <Header />
      }


      <Routes>

        {/* PUBLIC WEBSITE */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />


        <Route
          path="/sermons"
          element={<Sermons />}
        />

        <Route
          path="/sermons/:slug"
          element={<SermonDetail />}
        />


        <Route
          path="/watch-live"
          element={<WatchLive />}
        />

        <Route
          path="/stream/:slug"
          element={<StreamMainPage />}
        />


        <Route
          path="/document"
          element={<Document />}
        />


        <Route
          path="/events"
          element={<Event />}
        />

        <Route
          path="/events/:slug"
          element={<EventDetail />}
        />


        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/gallery/:slug"
          element={<GalleryDetail />}
        />

        <Route
          path="/gallery/:slug/upload"
          element={<GalleryUpload />}
        />


        <Route
          path="/photo-tag"
          element={<PhotoTag />}
        />


        <Route
          path="/announcements"
          element={<Ann />}
        />

        <Route
          path="/announcements/:slug"
          element={<AnnDetails />}
        />


        {/* SCRIPTURE PRESENTER */}

        <Route
          path="/presenter/:sessionKey"
          element={<PresenterControl />}
        />

        <Route
          path="/presenter/:sessionKey/output"
          element={<PresenterOutput />}
        />


        {/* MEDIA ADMIN */}

        <Route
          path="/media-admin"
          element={<MediaAdminLayout />}
        >

          <Route
            index
            element={<Dashboard />}
          />


          {/* SERMONS */}

          <Route
            path="sermons"
            element={<SermonAdmin />}
          />

          <Route
            path="sermons/add"
            element={<AddSermon />}
          />


          {/* EVENTS */}

          <Route
            path="events"
            element={<EventAdmin />}
          />

          <Route
            path="events/add"
            element={<AddEvent />}
          />


          {/* GALLERY */}

          <Route
            path="gallery"
            element={<GalleryAdmin />}
          />

          <Route
            path="gallery/create"
            element={<CreateGallery />}
          />
          <Route
            path="gallery/:slug/submissions"
            element={<GallerySubmissions />}
          />

          {/* ANNOUNCEMENTS */}

          <Route
            path="announcements"
            element={<AnnouncementAdmin />}
          />


          {/* STREAMS */}

          <Route
            path="streams"
            element={<StreamAdmin />}
          />


          {/* DOCUMENTS */}

          <Route
            path="documents"
            element={<DocumentAdmin />}
          />
          <Route
            path="gallery/:slug/upload"
            element={<GalleryUploads />}
          />
          <Route
            path="announcements/add"
            element={<AddAnnouncement />}
          />
          {/* PHOTO TAGS */}

          <Route
            path="photo-tags"
            element={<PhotoTagAdmin />}
          />

<Route
  path="streams"
  element={<StreamAdmin />}
/>

<Route
  path="streams/add"
  element={<AddStream />}
/>

<Route
  path="documents/add"
  element={<AddDocument />}
/>
<Route
  path="photo-tags/add"
  element={<AddPhotoTag />}
/>

          {/* SETTINGS */}

          <Route
            path="settings"
            element={<SiteSettingsAdmin />}
          />

        </Route>

      </Routes>


      {!isMediaWorkspace &&
        <Footer />
      }

    </>
  );
};


export default App;