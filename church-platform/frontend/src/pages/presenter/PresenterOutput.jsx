import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import "./PresenterOutput.css";


const API_BASE =
  "http://127.0.0.1:8000/api/presenter";


const DEFAULT_THEME = {
  background: "#0b1730",
  reference: "#ffd447",
  text: "#ffffff",
};


const PresenterOutput = () => {
  const { sessionKey } = useParams();

  const socketRef = useRef(null);

  const [verse, setVerse] = useState({
    reference: "",
    text: "",
    translation: "",
  });

  const [theme, setTheme] =
    useState(DEFAULT_THEME);

  const [visible, setVisible] =
    useState(false);


  /* ======================================
     LOAD CURRENT SESSION
  ====================================== */

  useEffect(() => {
    const loadCurrentState = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/sessions/${sessionKey}/`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Unable to load presenter session."
          );
        }


        setTheme({
          background:
            data.background_color ||
            DEFAULT_THEME.background,

          reference:
            data.reference_color ||
            DEFAULT_THEME.reference,

          text:
            data.text_color ||
            DEFAULT_THEME.text,
        });


        if (
          data.is_live &&
          data.current_text
        ) {
          setVerse({
            reference:
              data.current_reference,

            text:
              data.current_text,

            translation:
              data.current_translation,
          });

          setVisible(true);

        } else {
          setVisible(false);
        }

      } catch (error) {
        console.error(
          "Presenter session error:",
          error
        );
      }
    };


    loadCurrentState();

  }, [sessionKey]);


  /* ======================================
     WEBSOCKET
  ====================================== */

  useEffect(() => {
    const socket =
      new WebSocket(
        `ws://127.0.0.1:8000/ws/presenter/${sessionKey}/`
      );

    socketRef.current = socket;


    socket.onopen = () => {
      console.log(
        "Presenter WebSocket connected."
      );
    };


    socket.onmessage = (event) => {
      try {
        const data =
          JSON.parse(event.data);


        /* GO LIVE */

        if (data.action === "show") {

          setVerse({
            reference:
              data.reference || "",

            text:
              data.text || "",

            translation:
              data.translation || "",
          });


          if (data.theme) {
            setTheme({
              background:
                data.theme.background ||
                DEFAULT_THEME.background,

              reference:
                data.theme.reference ||
                DEFAULT_THEME.reference,

              text:
                data.theme.text ||
                DEFAULT_THEME.text,
            });
          }


          setVisible(true);
        }


        /* CLEAR */

        if (data.action === "clear") {
          setVisible(false);
        }

      } catch (error) {
        console.error(
          "Invalid presenter message:",
          error
        );
      }
    };


    socket.onerror = (error) => {
      console.error(
        "Presenter WebSocket error:",
        error
      );
    };


    socket.onclose = () => {
      console.log(
        "Presenter WebSocket disconnected."
      );
    };


    return () => {
      socket.close();
    };

  }, [sessionKey]);


  return (
    <main className="presenter-output-page">

      <div
        className={
          visible
            ? "presenter-output-wrapper visible"
            : "presenter-output-wrapper"
        }
      >

        <div
          className="presenter-output-card"
          style={{
            background: theme.background,
          }}
        >

          <div
            className="presenter-output-reference"
            style={{
              color: theme.reference,
            }}
          >
            {verse.reference}
          </div>


          <div
            className="presenter-output-text"
            style={{
              color: theme.text,
            }}
          >
            {verse.text}
          </div>


          <div className="presenter-output-translation">
            {verse.translation}
          </div>

        </div>

      </div>

    </main>
  );
};


export default PresenterOutput;