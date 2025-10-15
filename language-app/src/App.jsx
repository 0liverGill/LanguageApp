import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


export default function BookSelection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    fetchBooks();
  }, []);



/*
  const fetchData = () => {
    fetch(`http://localhost:8080/api/books/allBooks`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching data:', error));
  };
   useEffect(() => {
    fetchData();
  }, []);
*/ 
  
  
  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/books/allBooks');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      //temporary mock data for testing
      setBooks([
        { id: 1, title: 'Der Kleine Prinz', author: 'Antoine de Saint-Exupéry', description: 'A classic tale of a young prince traveling through the universe', difficulty: 'Beginner'},
        { id: 2, title: 'Die Verwandlung', author: 'Franz Kafka', description: 'A man wakes up to find himself transformed into a giant insect', difficulty: 'Intermediate'},
        { id: 3, title: 'Siddharta', author: 'Hermann Hesse', description: 'A spiritual journey of self-discovery', difficulty: 'Advanced'},
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  //make sure search terms include lower case aswell
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  //colour code the difficulty
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-primary py-5">
      <div className="container-fluid px-3 px-md-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                <h1 className="display-3 fw-bold text-primary mb-0">
                  German Language Helper
                </h1>
              </div>
              <p className="lead text-secondary">
                Pick a book and start learning
              </p>
            </div>

            
            {/*simple search bar*/}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body py-3">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0">
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search books by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Do so while loading books */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading books...</p>
              </div>
            )}

            {/* Books Grid */}
            {!loading && (
              <>
                {filteredBooks.length === 0 ? (
                  <div className="card shadow-lg border-0">
                    <div className="card-body text-center py-5">
                      <h3 className="text-muted">No books found</h3>
                      <p className="text-secondary">Try adjusting your search terms</p>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredBooks.map((book) => (
                      <div key={book.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 book-card">
                          <div className="card-body d-flex flex-column">

                            {/* All Books info listed */}
                            <h3 className="card-title text-center mb-2 fw-bold">
                              {book.title}
                            </h3>
                            <p className="text-center text-muted mb-3">
                              by {book.author}
                            </p>

                            <p className="card-text text-secondary mb-3 flex-grow-1">
                              {book.description}
                            </p>

                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                              <span className={`badge bg-${getDifficultyColor(book.difficulty)} px-3 py-2`}>
                                {book.difficulty}
                              </span>
                            </div>

                            {/* Start Reading Button */}
                            <Link to={'/textReader/{book.id}/1/false'}>
                            <h2> here </h2>
                            </Link>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%);
        }
        
        .book-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        
        .book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
        }
        
        .input-group-text {
          border-right: none;
        }
        
        .form-control:focus {
          border-color: #dee2e6;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
