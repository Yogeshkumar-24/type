import { useEffect, useState } from "react";
import randomWords from "random-words";
import './App.css'
const NO_OF_WORDS = 120;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [count, setCount] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [toggle,setToggle] = useState(false) 

  const [currentChar, setCurrentChar] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);

  const alpha = /[a-z]/;
  function start() {
    setToggle(false)

    if (status === "finished") {
      setWords(generateWords);
      setCurrentWordIndex(0);
      setCorrectWords(0);
      setIncorrectWords(0);
      setCurrentCharIndex(-1);
      setCurrentChar("");
    }

    if (status !== "started") {
      setStatus("started");
    }
  }

  function startTest() {
    let interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 0) {
          setStatus("finished");
          clearInterval(interval);
          setCurrInput("");
          return SECONDS;
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);
  }

  const handleRestart = () => {
    setCount(0);
    setWords(generateWords);
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setCurrentCharIndex(-1);
    setCurrentChar("");
  };

  const handleKeyDown = ({ keyCode, key }) => {
    if (keyCode === 32) {
      if (alpha.test(currInput)) {
        checkMatch();
        setCurrInput("");
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentCharIndex(-1);
      } else {
        setCurrInput("");
      }
    } else if (keyCode === 8) {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar("");
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key);
    }
  };

  const showInfo = () => {
    if(toggle){
      setToggle(false)
    }
    else{
      setToggle(true)
    }
  }

  const checkMatch = () => {
    const wordToCompare = words[currentWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();

    if (doesItMatch) {
      setCorrectWords(correctWords + 1);
    } else {
      setIncorrectWords(incorrectWords + 1);
    }
  };

  const getCharClass = (wordIndex, charIndex, char) => {
    if (
      wordIndex === currentWordIndex &&
      charIndex === currentCharIndex &&
      currentChar &&
      status !== "finished"
    ) {
      if (char === currentChar) {
      
        return "has-text-primary-light has-background-success-dark";
      } else {
      
        return "has-text-primary-light has-background-danger";
      }
    } else {
      return "";
    }
  };

  useEffect(() => {
    setWords(generateWords());
  }, []);
  function generateWords() {
    return new Array(NO_OF_WORDS).fill(null).map(() => randomWords());
  }

  return (
    <div className="App">
      <h1 className="is-size-1 has-text-info" id="title">
        TYPING TEST
      </h1>
      {status === "started" && (
        <div className="section" id="box">
          <div className="is-size-2 has-text-centered has-text-primary">
            {count}
          </div>
          <div className="card " id="sub-box">
            <div className="card-content ">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span className="is-size-5 test">
                      {word.split("").map((char, idx) => (
                        <span
                          id="text"
                          className={getCharClass(i, idx, char)}
                          key={idx}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="control is-expanded section" id="box">
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            style={{ margin: "5px" }}
            disabled={status !== "started"}
            type="text"
            className="input is-info"
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value)}
            onClick={startTest}
          />
          <button
            disabled={status !== "started"}
            className="button is-info"
            onClick={handleRestart}
          >
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div className="section box1" id="box">
        <button className="button is-info is-fullwidth" onClick={start}>
          Start
        </button>
        <i onClick={showInfo} className="fa fa-info-circle has-text-info" id="info"></i>
        <div style={{ display: toggle ? 'block' : 'none'}} className="info-content card">
          <div className="card-content">
            <div className="content">
              <pre id="info-flow">
                <span id="green">Green </span>- Represents right character Entered <br />
                <span id="red">Red </span>  - Represents wrong character Entered <br /><br />
                <span id="q">Why My WPM is low in this typing Test:</span> <br />
                    Since the words are of average size <br />
                    compared to small words in other typing <br />
                    test, You may find it lower compared <br />
                    to other websites! <br />
              </pre>

             
            </div>
          </div>
        </div>
      </div>
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words Per Minute</p>
              <p className="has-text-primary is-size-1">{correctWords}</p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy</p>
              <p className="has-text-info is-size-1">
                {Math.round(
                  (correctWords / (correctWords + incorrectWords)) * 100
                )}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
