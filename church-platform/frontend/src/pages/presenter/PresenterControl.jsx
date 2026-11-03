import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import GridLayout from "react-grid-layout/legacy";
import "./PresenterControl.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const API_BASE = "http://127.0.0.1:8000/api/presenter";
const LAYOUT_STORAGE_KEY = "ebucity-presenter-layout-v3";
const DEFAULT_LAYOUT = [
  { i: "quick", x: 0, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
  { i: "scripture", x: 0, y: 5, w: 3, h: 13, minW: 2, minH: 10 },
  { i: "transcript", x: 0, y: 18, w: 3, h: 6, minW: 2, minH: 5 },
  { i: "preview", x: 3, y: 0, w: 5, h: 15, minW: 3, minH: 8 },
  { i: "detections", x: 3, y: 15, w: 5, h: 9, minW: 3, minH: 5 },
  { i: "live", x: 8, y: 0, w: 4, h: 9, minW: 2, minH: 6 },
  { i: "queue", x: 8, y: 9, w: 4, h: 7, minW: 2, minH: 4 },
  { i: "theme", x: 8, y: 16, w: 4, h: 8, minW: 2, minH: 5 },
];

const freshLayout = () => DEFAULT_LAYOUT.map((item) => ({ ...item }));

const loadSavedLayout = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(LAYOUT_STORAGE_KEY) || "null"
    );

    const valid =
      Array.isArray(saved) &&
      saved.length === DEFAULT_LAYOUT.length &&
      DEFAULT_LAYOUT.every((expected) =>
        saved.some(
          (item) =>
            item?.i === expected.i &&
            Number.isInteger(item.x) &&
            Number.isInteger(item.y) &&
            Number.isInteger(item.w) &&
            Number.isInteger(item.h) &&
            item.x >= 0 &&
            item.y >= 0 &&
            item.w > 0 &&
            item.h > 0 &&
            item.x + item.w <= 12
        )
      );

    return valid ? saved : freshLayout();
  } catch {
    return freshLayout();
  }
};

const readResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `The server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.detail || `Request failed (${response.status}).`
    );
  }

  return data;
};

const verseKey = (item) =>
  `${item.translation_abbreviation || ""}:${item.reference || item.id}`;

const PresenterControl = () => {
  const { sessionKey } = useParams();

  const [books, setBooks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [session, setSession] = useState(null);

  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState("3");
  const [verse, setVerse] = useState("16");
  const [translation, setTranslation] = useState("KJV");

  const [results, setResults] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [queue, setQueue] = useState([]);
  const [detections, setDetections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [sendingLive, setSendingLive] = useState(false);
  const [error, setError] = useState("");

  const [quickSearch, setQuickSearch] = useState("");
  const [quickResults, setQuickResults] = useState([]);
  const [quickLoading, setQuickLoading] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    book: null,
    chapter: null,
  });

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const [layoutLocked, setLayoutLocked] = useState(true);
  const [layout, setLayout] = useState(loadSavedLayout);
  const [gridWidth, setGridWidth] = useState(1200);

  const [theme, setTheme] = useState({
    background: "#0b1730",
    reference: "#ffd447",
    text: "#ffffff",
  });


const [gridHeight, setGridHeight] = useState(600);

const gridRowHeight = Math.max(
  1,
  (gridHeight - 23 * 10) / 24
);


  const dashboardRef = useRef(null);
  const quickTimerRef = useRef(null);
  const quickRequestRef = useRef(0);
  const quickAbortRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const translationRef = useRef(translation);

  useEffect(() => {
    translationRef.current = translation;
  }, [translation]);

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        const [booksData, translationsData, sessionData] =
          await Promise.all([
            fetch(`${API_BASE}/bible/books/`, {
              signal: controller.signal,
            }).then(readResponse),

            fetch(`${API_BASE}/bible/translations/`, {
              signal: controller.signal,
            }).then(readResponse),

            fetch(`${API_BASE}/sessions/${sessionKey}/`, {
              signal: controller.signal,
            }).then(readResponse),
          ]);

        if (!Array.isArray(booksData) || !Array.isArray(translationsData)) {
          throw new Error("Unexpected Bible data returned by the server.");
        }

        setBooks(booksData);
        setTranslations(translationsData);
        setSession(sessionData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load presenter data.");
        }
      }
    };

    loadInitialData();

    return () => controller.abort();
  }, [sessionKey]);

 useEffect(() => {
  const element = dashboardRef.current;
  if (!element) return;

  const updateSize = () => {
    setGridWidth(Math.max(1, element.clientWidth));
    setGridHeight(Math.max(1, element.clientHeight));
  };

  updateSize();

  const observer = new ResizeObserver(updateSize);
  observer.observe(element);

  return () => observer.disconnect();
}, []);
  useEffect(() => {
    return () => {
      clearTimeout(quickTimerRef.current);
      quickAbortRef.current?.abort();
      listeningRef.current = false;

      const recognition = recognitionRef.current;

      if (recognition) {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;

        try {
          recognition.abort();
        } catch {
          // Recognition may already be stopped.
        }
      }

      recognitionRef.current = null;
    };
  }, []);

  const currentBookOptions = useMemo(
    () => books.map((item) => item.name),
    [books]
  );

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);

    try {
      localStorage.setItem(
        LAYOUT_STORAGE_KEY,
        JSON.stringify(newLayout)
      );
    } catch {
      // Layout editing still works when browser storage is unavailable.
    }
  };

  const resetLayout = () => {
    setLayout(freshLayout());

    try {
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } catch {
      // Reset remains available without browser storage.
    }
  };

  const selectVerse = (item) => {
    if (!item) return;

    setSelectedVerse(item);

    if (item.book_name) {
      setBook(item.book_name);
    }

    if (item.chapter != null) {
      setChapter(String(item.chapter));
    }

    if (item.verse != null) {
      setVerse(String(item.verse));
    }

    if (item.book_name && item.chapter != null) {
      setCurrentContext({
        book: item.book_name,
        chapter: item.chapter,
      });
    }
  };

  const searchVerse = async () => {
    if (!book || !chapter) return;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        book,
        chapter,
        translation,
      });

      if (verse) params.append("verse", verse);

      const data = await fetch(
        `${API_BASE}/bible/verses/?${params.toString()}`
      ).then(readResponse);

      const verses = Array.isArray(data.verses) ? data.verses : [];

      setResults(verses);
      setSelectedVerse(verses[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goLiveVerse = async (item) => {
    if (!item || sendingLive) return;

    try {
      setSendingLive(true);
      setError("");

      const data = await fetch(
        `${API_BASE}/sessions/${sessionKey}/live/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: item.reference,
            text: item.text,
            translation:
              item.translation_abbreviation || translation,
            theme,
          }),
        }
      ).then(readResponse);

      setSession((previous) => ({
        ...previous,
        current_reference: data.reference,
        current_text: data.text,
        current_translation: data.translation,
        is_live: true,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingLive(false);
    }
  };

  const clearLive = async () => {
    try {
      setError("");

      await fetch(
        `${API_BASE}/sessions/${sessionKey}/clear/`,
        { method: "POST" }
      ).then(readResponse);

      setSession((previous) => ({
        ...previous,
        is_live: false,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const addToQueue = (item) => {
    if (!item) return;

    setQueue((previous) => {
      const exists = previous.some(
        (queued) => verseKey(queued) === verseKey(item)
      );

      return exists ? previous : [...previous, item];
    });
  };

  const removeFromQueue = (item) => {
    setQueue((previous) =>
      previous.filter(
        (queued) => verseKey(queued) !== verseKey(item)
      )
    );
  };

  const openOutput = () => {
    window.open(
      `/presenter/${encodeURIComponent(sessionKey)}/output`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const runQuickSearch = async (value) => {
    clearTimeout(quickTimerRef.current);
    quickAbortRef.current?.abort();

    const requestId = ++quickRequestRef.current;
    const query = value.trim();

    if (!query) {
      setQuickResults([]);
      setQuickLoading(false);
      return;
    }

    const controller = new AbortController();
    quickAbortRef.current = controller;

    try {
      setQuickLoading(true);
      setError("");

      const data = await fetch(`${API_BASE}/quick-search/`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          translation,
          current_book: currentContext.book,
          current_chapter: currentContext.chapter,
        }),
      }).then(readResponse);

      if (requestId !== quickRequestRef.current) return;

      setQuickResults(
        Array.isArray(data.verses) ? data.verses : []
      );

      if (data.match) {
        setCurrentContext({
          book: data.match.book,
          chapter: data.match.chapter,
        });
      }
    } catch (err) {
      if (
        err.name !== "AbortError" &&
        requestId === quickRequestRef.current
      ) {
        setError(err.message);
      }
    } finally {
      if (requestId === quickRequestRef.current) {
        setQuickLoading(false);
      }
    }
  };

  const handleQuickSearchChange = (event) => {
    const value = event.target.value;

    setQuickSearch(value);
    clearTimeout(quickTimerRef.current);

    quickAbortRef.current?.abort();
    quickRequestRef.current += 1;
    setQuickResults([]);
    setQuickLoading(false);

    if (!value.trim()) return;

    quickTimerRef.current = setTimeout(() => {
      runQuickSearch(value);
    }, 180);
  };

  const handleQuickSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (quickResults.length > 0) {
      selectVerse(quickResults[0]);
    } else {
      runQuickSearch(quickSearch);
    }
  };

  const detectFromTranscript = async (spokenText) => {
    if (!spokenText.trim()) return;

    try {
      const data = await fetch(
        `${API_BASE}/detect-scriptures/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: spokenText,
            translation: translationRef.current,
          }),
        }
      ).then(readResponse);

      if (!Array.isArray(data.detections)) return;

      setDetections((previous) => {
        const existing = new Set(previous.map(verseKey));

        const newItems = data.detections.filter((item) => {
          const key = verseKey(item);

          if (existing.has(key)) return false;

          existing.add(key);
          return true;
        });

        return [...newItems, ...previous].slice(0, 15);
      });
    } catch (err) {
      console.error("Scripture detection error:", err);
      setError(err.message);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported by this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    if (recognitionRef.current) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GH";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];
        const spoken = result[0].transcript;

        if (result.isFinal) {
          finalText += `${spoken} `;
        } else {
          interim += `${spoken} `;
        }
      }

      setInterimTranscript(interim);

      if (finalText.trim()) {
        setTranscript((previous) =>
          `${previous} ${finalText}`.trim().slice(-5000)
        );

        detectFromTranscript(finalText);
      }
    };

    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        listeningRef.current = false;
        setIsListening(false);

        setError(
          event.error === "audio-capture"
            ? "No microphone is available. Check your microphone connection."
            : "Microphone access was denied. Allow microphone access and try again."
        );

        return;
      }

      if (
        event.error !== "no-speech" &&
        event.error !== "aborted"
      ) {
        setError(`Microphone error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          listeningRef.current = false;
          recognitionRef.current = null;
          setIsListening(false);
          setError("Microphone stopped. Click Start Listening to retry.");
        }
      } else {
        recognitionRef.current = null;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    listeningRef.current = true;

    try {
      recognition.start();
    } catch {
      listeningRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);
      setError("Unable to start microphone.");
    }
  };

  const stopListening = () => {
    listeningRef.current = false;
    setIsListening(false);
    setInterimTranscript("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        recognitionRef.current = null;
      }
    }
  };

  const panelTitleClass =
    "pew-panel-title panel-drag-handle";

  return (
    <main className="pew-control">
      <header className="pew-topbar">
        <div className="pew-brand">
          <span>EBUCITY MEDIA</span>
          <h1>Scripture Presenter</h1>
        </div>

        <nav className="pew-tabs">
          <button type="button" className="active">
            Presenter
          </button>
          <button type="button">Themes</button>
          <button type="button">Scriptures</button>
          <button type="button">History</button>
          <button type="button">Settings</button>
        </nav>

        <div className="pew-status-actions">
          <button
            type="button"
            className={
              layoutLocked
                ? "layout-control-btn"
                : "layout-control-btn editing"
            }
            onClick={() => setLayoutLocked((previous) => !previous)}
          >
            {layoutLocked ? "Edit Layout" : "Lock Layout"}
          </button>

          <button
            type="button"
            className="layout-control-btn"
            onClick={resetLayout}
          >
            Reset Layout
          </button>

          <button
            type="button"
            className="open-output"
            onClick={openOutput}
          >
            Open OBS Output
          </button>

          <div
            className={
              session?.is_live
                ? "broadcast-status live"
                : "broadcast-status"
            }
          >
            <span />
            {session?.is_live ? "LIVE" : "OFF AIR"}
          </div>
        </div>
      </header>

      {error && (
        <div className="pew-error" role="alert">
          {error}
        </div>
      )}

      <section
        ref={dashboardRef}
        className={`pew-dashboard ${
          layoutLocked ? "layout-locked" : "layout-editing"
        }`}
      >
        <GridLayout
          className="presenter-grid-layout"
          layout={layout}
          cols={12}
    rowHeight={gridRowHeight}
          width={gridWidth}
          margin={[10, 10]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          isDraggable={!layoutLocked}
          isResizable={!layoutLocked}
          draggableHandle=".panel-drag-handle"
          compactType="vertical"
          maxRows={24}
          isBounded
        >
          <section
            key="quick"
            className="quick-scripture-panel"
          >
            <div className="quick-scripture-heading panel-drag-handle">
              <div>
                <span>QUICK SCRIPTURE</span>
                <h3>Fast Reference Search</h3>
              </div>

              {currentContext.book && (
                <div className="quick-current-context">
                  Current:{" "}
                  <strong>
                    {currentContext.book} {currentContext.chapter}
                  </strong>
                </div>
              )}
            </div>

            <div className="quick-scripture-search">
              <input
                type="text"
                aria-label="Quick scripture reference"
                value={quickSearch}
                onChange={handleQuickSearchChange}
                onKeyDown={handleQuickSearchKeyDown}
                placeholder="Try: j 14 6, rom 8 28, ps 23..."
                autoComplete="off"
              />

              <button
                type="button"
                onClick={() => runQuickSearch(quickSearch)}
                disabled={quickLoading}
              >
                {quickLoading ? "..." : "Search"}
              </button>
            </div>

            <div className="quick-scripture-examples">
              <span>Examples:</span>

              {["j 3 16", "rom 8 28", "ps 23"].map((example) => (
                <button
                  type="button"
                  key={example}
                  onClick={() => {
                    setQuickSearch(example);
                    runQuickSearch(example);
                  }}
                >
                  {example}
                </button>
              ))}
            </div>

            {quickResults.length > 0 && (
              <div className="quick-scripture-results">
                {quickResults.slice(0, 8).map((item) => (
                  <button
                    type="button"
                    className="quick-result-item"
                    key={verseKey(item)}
                    onClick={() => selectVerse(item)}
                  >
                    <strong>{item.reference}</strong>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section
            key="scripture"
            className="pew-panel scripture-panel"
          >
            <div className={panelTitleClass}>
              Scripture Search
            </div>

            <div className="quick-search">
              <input
                type="text"
                aria-label="Selected scripture reference"
                value={`${book} ${chapter}${verse ? `:${verse}` : ""}`}
                readOnly
              />
            </div>

            <div className="pew-form-field">
              <label htmlFor="presenter-translation">
                Translation
              </label>

              <select
                id="presenter-translation"
                value={translation}
                onChange={(event) =>
                  setTranslation(event.target.value)
                }
              >
                {!translations.some(
                  (item) => item.abbreviation === translation
                ) && (
                  <option value={translation}>{translation}</option>
                )}

                {translations.map((item) => (
                  <option
                    key={item.id || item.abbreviation}
                    value={item.abbreviation}
                  >
                    {item.abbreviation}
                  </option>
                ))}
              </select>
            </div>

            <div className="pew-form-field">
              <label htmlFor="presenter-book">Book</label>

              <select
                id="presenter-book"
                value={book}
                onChange={(event) => setBook(event.target.value)}
              >
                {!currentBookOptions.includes(book) && (
                  <option value={book}>{book}</option>
                )}

                {currentBookOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pew-reference-row">
              <div className="pew-form-field">
                <label htmlFor="presenter-chapter">
                  Chapter
                </label>

                <input
                  id="presenter-chapter"
                  type="number"
                  min="1"
                  value={chapter}
                  onChange={(event) =>
                    setChapter(event.target.value)
                  }
                />
              </div>

              <div className="pew-form-field">
                <label htmlFor="presenter-verse">Verse</label>

                <input
                  id="presenter-verse"
                  type="number"
                  min="1"
                  value={verse}
                  onChange={(event) =>
                    setVerse(event.target.value)
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className="pew-search-btn"
              onClick={searchVerse}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Scripture"}
            </button>

            <div className="pew-results-heading">
              <span>Search Results</span>
              <strong>{results.length}</strong>
            </div>

            <div className="pew-results-list">
              {results.map((item) => (
                <button
                  type="button"
                  key={verseKey(item)}
                  className={
                    selectedVerse &&
                    verseKey(selectedVerse) === verseKey(item)
                      ? "pew-result active"
                      : "pew-result"
                  }
                  onClick={() => selectVerse(item)}
                >
                  <strong>{item.reference}</strong>
                  <p>{item.text}</p>
                </button>
              ))}
            </div>
          </section>

          <section
            key="transcript"
            className="pew-panel transcript-panel"
          >
            <div className="pew-panel-header-row">
              <div className={panelTitleClass}>
                Live Transcript
              </div>

              <span
                className={
                  isListening
                    ? "listening-state active"
                    : "listening-state"
                }
              >
                {isListening ? "Listening" : "Stopped"}
              </span>
            </div>

            <div
              className={isListening ? "waveform active" : "waveform"}
              aria-hidden="true"
            >
              {Array.from({ length: 15 }, (_, index) => (
                <span key={index} />
              ))}
            </div>

            <div className="live-transcript-box">
              {transcript || interimTranscript ? (
                <p>
                  {transcript}
                  {interimTranscript && (
                    <span className="interim-text">
                      {" "}
                      {interimTranscript}
                    </span>
                  )}
                </p>
              ) : (
                <p className="no-transcript">
                  Start listening to capture the sermon transcript.
                </p>
              )}
            </div>

            <button
              type="button"
              className={
                isListening
                  ? "stop-listening active"
                  : "stop-listening"
              }
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
          </section>

          <section
            key="preview"
            className="pew-panel preview-panel"
          >
            <div className={panelTitleClass}>Preview</div>

            <div
              className="pew-preview-canvas"
              style={{ background: theme.background }}
            >
              {selectedVerse ? (
                <div className="pew-preview-content">
                  <h3 style={{ color: theme.reference }}>
                    {selectedVerse.reference}
                  </h3>

                  <p style={{ color: theme.text }}>
                    {selectedVerse.text}
                  </p>

                  <span>
                    {selectedVerse.translation_abbreviation ||
                      translation}
                  </span>
                </div>
              ) : (
                <div className="pew-preview-empty">
                  <h3>No scripture selected</h3>
                  <p>Search and select a scripture to preview.</p>
                </div>
              )}
            </div>

            <div className="pew-preview-actions">
              <button
                type="button"
                className="pew-clear-btn"
                onClick={clearLive}
                disabled={sendingLive}
              >
                Clear Screen
              </button>

              <button
                type="button"
                className="pew-live-btn"
                onClick={() => goLiveVerse(selectedVerse)}
                disabled={!selectedVerse || sendingLive}
              >
                {sendingLive ? "Sending..." : "GO LIVE"}
              </button>
            </div>
          </section>

          <section
            key="detections"
            className="pew-panel detections-panel"
          >
            <div className="pew-panel-header-row">
              <div className={panelTitleClass}>
                Detected Scriptures
              </div>

              <span className="queue-count">
                {detections.length}
              </span>
            </div>

            {detections.length > 0 ? (
              <div className="detections-list">
                {detections.map((item) => (
                  <div
                    className="detection-item"
                    key={verseKey(item)}
                  >
                    <div className="detection-main">
                      <div className="detection-reference">
                        <strong>{item.reference}</strong>

                        {Number.isFinite(item.confidence) && (
                          <span>
                            {Math.round(item.confidence * 100)}%
                          </span>
                        )}
                      </div>

                      <p>{item.text}</p>
                    </div>

                    <div className="detection-actions">
                      <button
                        type="button"
                        onClick={() => selectVerse(item)}
                      >
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => addToQueue(item)}
                      >
                        Queue
                      </button>

                      <button
                        type="button"
                        className="detection-live"
                        onClick={() => goLiveVerse(item)}
                        disabled={sendingLive}
                      >
                        Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="detection-empty">
                <span>No scripture detected</span>
                <p>
                  Spoken Bible references will automatically appear here.
                </p>
              </div>
            )}
          </section>

          <section
            key="live"
            className="pew-panel live-output-panel"
          >
            <div className={panelTitleClass}>Live Output</div>

            <div
              className="live-output-preview"
              style={{ background: theme.background }}
            >
              {session?.is_live ? (
                <div className="live-output-content">
                  <span className="small-live-badge">LIVE</span>

                  <h3 style={{ color: theme.reference }}>
                    {session.current_reference}
                  </h3>

                  <p style={{ color: theme.text }}>
                    {session.current_text}
                  </p>

                  <span className="live-translation">
                    {session.current_translation}
                  </span>
                </div>
              ) : (
                <div className="live-output-empty">
                  Nothing on air
                </div>
              )}
            </div>
          </section>

          <section
            key="queue"
            className="pew-panel queue-panel"
          >
            <div className="pew-panel-header-row">
              <div className={panelTitleClass}>Queue</div>
              <span className="queue-count">{queue.length}</span>
            </div>

            <div className="queue-list">
              {queue.length > 0 ? (
                queue.map((item, index) => (
                  <div
                    className="queue-item"
                    key={verseKey(item)}
                  >
                    <span className="queue-index">
                      {index + 1}
                    </span>

                    <div>
                      <strong>{item.reference}</strong>
                      <span>
                        {item.translation_abbreviation}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="queue-live"
                      onClick={() => goLiveVerse(item)}
                      disabled={sendingLive}
                    >
                      Live
                    </button>

                    <button
                      type="button"
                      className="queue-remove"
                      aria-label={`Remove ${item.reference} from queue`}
                      onClick={() => removeFromQueue(item)}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="queue-empty">
                  No scriptures queued.
                </div>
              )}
            </div>

            <button
              type="button"
              className="add-queue-btn"
              disabled={!selectedVerse}
              onClick={() => addToQueue(selectedVerse)}
            >
              Add Selected to Queue
            </button>
          </section>

          <section
            key="theme"
            className="pew-panel theme-panel"
          >
            <div className={panelTitleClass}>Theme Controls</div>

            <div className="theme-controls">
              {[
                ["background", "Background"],
                ["reference", "Reference"],
                ["text", "Text"],
              ].map(([property, label]) => (
                <div className="theme-control" key={property}>
                  <label htmlFor={`theme-${property}`}>
                    {label}
                  </label>

                  <input
                    id={`theme-${property}`}
                    type="color"
                    value={theme[property]}
                    onChange={(event) => {
                      const value = event.target.value;

                      setTheme((previous) => ({
                        ...previous,
                        [property]: value,
                      }));
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              className="theme-mini-preview"
              style={{ background: theme.background }}
            >
              <strong style={{ color: theme.reference }}>
                {selectedVerse?.reference || "John 3:16"}
              </strong>

              <p style={{ color: theme.text }}>
                {selectedVerse?.text || "Scripture preview"}
              </p>
            </div>
          </section>
        </GridLayout>
      </section>
    </main>
  );
};

export default PresenterControl;