import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect, useState } from 'react';

export default function GermanTextTranslator() {
  const [words, setWords] = useState([]);
  const [translations, setTranslations] = useState({});
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guesses, setGuesses] = useState({});
  const [guessResults, setGuessResults] = useState({});
  const [correctWords, setCorrectWords] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempGuess, setTempGuess] = useState('');
  const [title, setTitle] = useState('');
  const [germanText, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [game, setGame] = useState(false);
  const [loadingText, setLoadingText] = useState(true);
  
  
  const fetchData = () => {
    fetch(`http://localhost:8080/api/books/1/text/${page}/${game}`)
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  };
 
  
  

  useEffect(() => {
    fetch('http://localhost:8080/api/books/1/bookTitle')
      .then(response => response.text())
      .then(data => setTitle(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);
  
  useEffect(() => {
    fetchData();
  }, [game]);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
    setGuesses({});
    setGuessResults({});
    setCorrectWords({});
  };
  
  const handlePrevPage = () => {
    setPage(prevPage => Math.max(0, prevPage - 1));
    setGuesses({});
    setGuessResults({});
    setCorrectWords({});
  };

  const handleChangeGame = () => {
    setGame(!game);
    setGuesses({});
    setGuessResults({});
    setCorrectWords({});
  };

  useEffect(() => {
    if (germanText) {
      processText(germanText);
    }
  }, [germanText]); 

  const processText = (inputText) => {
    if (!inputText.trim()) {
      setWords([]);
      return;
    }
    
    const tokens = inputText.split(/(\s+|[.,!?;:])/);
    let wordPosition = 0;
    
    const processedWords = tokens.map((token, index) => {
      const isWord = /\w+/.test(token);
      const isMissing = /^_+$/.test(token);
      
      const wordData = {
        text: token,
        index: index,
        isWord: isWord,
        isMissing: isMissing,
        position: isWord ? wordPosition : null
      };
      
      if (isWord) {
        wordPosition++;
      }
      
      return wordData;
    });
    
    setWords(processedWords);
  };

  const translateWord = async (word, index) => {
    if (activeWordIndex === index) {
      setActiveWordIndex(null);
      return;
    }

    if (translations[word.toLowerCase()]) {
      setActiveWordIndex(index);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word,
          source: 'de',
          target: 'en'
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translation = data.translation;
      
      setTranslations(prev => ({
        ...prev,
        [word.toLowerCase()]: translation
      }));
      setActiveWordIndex(index);
      
    } catch (error) {
      console.error('Translation error:', error);
      setTranslations(prev => ({
        ...prev,
        [word.toLowerCase()]: '[Error]'
      }));
      setActiveWordIndex(index);
    } finally {
      setLoading(false);
    }
  };

  const handleGuessClick = (index, wordLength) => {
    setEditingIndex(index);
    setTempGuess(guesses[index] || '');
  };

  const verifyGuess = async (guess, position, index) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/books/verb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess: guess,
          position: position,
          page: page,
          bookId: 1
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();
      
      setGuessResults(prev => ({
        ...prev,
        [index]: data.correct
      }));

      setCorrectWords(prev => ({
        ...prev,
        [index]: {
          german: data.correctWord,
          english: data.translation
        }
      }));

      return data;
      
    } catch (error) {
      console.error('Verification error:', error);
      setGuessResults(prev => ({
        ...prev,
        [index]: false
      }));
      return { correct: false, correctWord: '[Error]', translation: '[Error]' };
    } finally {
      setLoading(false);
    }
  };

  const handleGuessSubmit = async (index) => {
    if (!tempGuess.trim()) {
      return;
    }

    const word = words.find(w => w.index === index);
    
    setGuesses(prev => ({
      ...prev,
      [index]: tempGuess.trim()
    }));

    await verifyGuess(tempGuess.trim(), word.position, index);
    
    setEditingIndex(null);
    setTempGuess('');
  };

  const handleGuessCancel = () => {
    setEditingIndex(null);
    setTempGuess('');
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleGuessSubmit(index);
    } else if (e.key === 'Escape') {
      handleGuessCancel();
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-primary py-5">
      <div className="container-fluid px-3 px-md-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                <h1 className="display-4 fw-bold text-primary mb-0">
                  {title}
                </h1>
              </div>
              <p className="lead text-secondary">
                Click any word to see its English translation • Fill in the missing verbs
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={handlePrevPage}
                      disabled={page <= 1}
                    >
                      ← Previous
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleNextPage}
                    >
                      Next →
                    </button>
                  </div>
                  
                  <div className="badge bg-primary fs-6 px-3 py-2">
                    Page {page}
                  </div>
                  
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={handleChangeGame}
                  >
                    Toggle Verbs
                  </button>
                </div>
              </div>
            </div>

            {/* Text Display Area */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <div className="fs-5 lh-lg mb-4" style={{ letterSpacing: '0.3px' }}>
                  {words.map((word, index) => {
                    if (!word.isWord) {
                      return <span key={index}>{word.text}</span>;
                    }

                    if (word.isMissing) {
                      const isEditing = editingIndex === index;
                      const currentGuess = guesses[index];
                      const isCorrect = guessResults[index];
                      const correctWord = correctWords[index];
                      const wordLength = word.text.length;
                      const hasBeenGuessed = currentGuess !== undefined;

                      return (
                        <span key={index} className="position-relative d-inline-block">
                          {isEditing ? (
                            <span className="d-inline-flex align-items-center gap-1">
                              <input
                                type="text"
                                className="form-control form-control-sm d-inline-block"
                                style={{ 
                                  width: `${Math.max(wordLength * 12, 100)}px`,
                                  fontSize: '1rem'
                                }}
                                value={tempGuess}
                                onChange={(e) => setTempGuess(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, index)}
                                autoFocus
                                placeholder="Type verb..."
                              />
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleGuessSubmit(index)}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              >
                                ✓
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={handleGuessCancel}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              >
                                ✕
                              </button>
                            </span>
                          ) : (
                            <>
                              {hasBeenGuessed && correctWord && (
                                <span 
                                  className={`position-absolute text-white px-3 py-2 rounded shadow-lg translation-tooltip semi-transparent ${
                                    isCorrect ? 'bg-success' : 'bg-danger'
                                  }`}
                                  style={{
                                    top: '-70px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.875rem',
                                    zIndex: 1000,
                                    minWidth: '150px',
                                    textAlign: 'center'
                                  }}
                                >
                                  <div className="fw-bold mb-1">
                                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                  </div>
                                  <div>
                                    <strong>{correctWord.german}</strong>
                                  </div>
                                  <div className="small mt-1">
                                    ({correctWord.english})
                                  </div>
                                  <span 
                                    className={`tooltip-arrow ${isCorrect ? 'bg-success' : 'bg-danger'}`}
                                    style={{
                                      position: 'absolute',
                                      bottom: '-4px',
                                      left: '50%',
                                      transform: 'translateX(-50%) rotate(45deg)',
                                      width: '8px',
                                      height: '8px'
                                    }}
                                  ></span>
                                </span>
                              )}
                              
                              <span
                                onClick={() => handleGuessClick(index, wordLength)}
                                className={`missing-word px-2 py-1 rounded ${
                                  hasBeenGuessed
                                    ? isCorrect 
                                      ? 'bg-success bg-opacity-25 text-success' 
                                      : 'bg-danger bg-opacity-25 text-danger'
                                    : 'bg-warning bg-opacity-25 text-warning'
                                }`}
                                style={{ 
                                  cursor: 'pointer',
                                  borderBottom: hasBeenGuessed ? 'none' : '2px dashed currentColor',
                                  fontWeight: '500'
                                }}
                              >
                                {currentGuess || word.text}
                              </span>
                            </>
                          )}
                        </span>
                      );
                    }

                    const isActive = activeWordIndex === index;
                    const translation = translations[word.text.toLowerCase()];

                    return (
                      <span key={index} className="position-relative d-inline-block">
                        {isActive && translation && (
                          <span 
                            className="position-absolute bg-primary text-white px-3 py-2 rounded shadow-lg translation-tooltip"
                            style={{
                              top: '-45px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              whiteSpace: 'nowrap',
                              fontSize: '0.875rem',
                              zIndex: 1000
                            }}
                          >
                            {translation}
                            <span 
                              className="position-absolute bg-primary"
                              style={{
                                bottom: '-4px',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(45deg)',
                                width: '8px',
                                height: '8px'
                              }}
                            ></span>
                          </span>
                        )}
                        
                        <span
                          onClick={() => translateWord(word.text, index)}
                          className={`clickable-word px-1 py-1 rounded ${
                            isActive ? 'bg-primary bg-opacity-25 text-primary fw-semibold' : ''
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          {word.text}
                        </span>
                      </span>
                    );
                  })}
                </div>


                {/* Stats */}
                <div className="border-top pt-3 mt-3">
                  <div className="d-flex gap-4 text-muted small flex-wrap">
                    <div>
                      <span className="fw-semibold text-dark">{words.filter(w => w.isWord).length}</span> words
                    </div>
                    <div>
                      <span className="fw-semibold text-dark">{Object.keys(translations).length}</span> translated
                    </div>
                    <div>
                      <span className="fw-semibold text-dark">{Object.keys(guesses).length}</span> guessed
                    </div>
                    <div>
                      <span className="fw-semibold text-success">
                        {Object.values(guessResults).filter(r => r === true).length}
                      </span> correct
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div 
                className="position-fixed bg-white rounded-circle shadow-lg p-3"
                style={{ bottom: '2rem', right: '2rem', zIndex: 1050 }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%);
        }
        
        .clickable-word:hover {
          background-color: rgba(13, 110, 253, 0.1) !important;
          color: #0d6efd !important;
        }

        .missing-word:hover {
          opacity: 0.8;
        }
        
        .translation-tooltip {
          animation: fadeIn 0.2s ease-out;
        }
        
        .semi-transparent {
          opacity: 0.75;
          backdrop-filter: blur(3px);
        }
        
        .semi-transparent * {
          opacity: 1;
        }
        
        .tooltip-arrow {
          opacity: 0.75;
        }
        
        .translation-tooltip:not(.semi-transparent) {
          opacity: 0.8;
          backdrop-filter: blur(2px);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}
