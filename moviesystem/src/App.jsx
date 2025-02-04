import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = "b7f7b80597c116fd29fb38c45e818f37";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [releaseYear, setReleaseYear] = useState('');
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegionalLanguage, setSelectedRegionalLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State to keep track of the current page
  const [totalPages, setTotalPages] = useState(1); // State to track the total number of pages

  const genres = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Science Fiction" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" }
  ];

  const regionalLanguages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'or', name: 'Odia' }
  ];

  // Fetch movies from API with pagination, language, and regional language filter
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${selectedLanguage}&sort_by=${sortBy}&include_adult=false&vote_average.gte=${minRating}&with_genres=${selectedGenre}&primary_release_year=${releaseYear}&with_original_language=${selectedRegionalLanguage}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Set total pages from API response
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies when dependencies or page changes
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, minRating, releaseYear, sortBy, selectedLanguage, selectedRegionalLanguage, page]);

  // Search movies by term with language filter
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=${selectedLanguage}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search movies');
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Set total pages from API response
    } catch (error) {
      setError('Search failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add movie to favorites
  const addToFavorites = (movie, e) => {
    e.stopPropagation();
    if (!favorites.find((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  // Remove movie from favorites
  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((fav) => fav.id !== movie.id));
  };

  // Show movie details in a modal
  const showMovieInfo = (movie) => {
    setMovieInfo(movie);
  };

  // Generate years for the year filter
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <header>
        <h1>Movie Recommendation System</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a movie"
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <div className="filters">
        <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>

        <select onChange={(e) => setMinRating(e.target.value)} value={minRating}>
          <option value="0">All Ratings</option>
          <option value="5">5+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
        </select>

        <select onChange={(e) => setReleaseYear(e.target.value)} value={releaseYear}>
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="popularity.desc">Most Popular</option>
          <option value="release_date.desc">Newest</option>
          <option value="release_date.asc">Oldest</option>
          <option value="vote_average.desc">Highest Rated</option>
        </select>

        <select onChange={(e) => setSelectedLanguage(e.target.value)} value={selectedLanguage}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="zh">Chinese</option>
        </select>

        {/* Regional Language Filter */}
        <select onChange={(e) => setSelectedRegionalLanguage(e.target.value)} value={selectedRegionalLanguage}>
          <option value="">All Regional Languages</option>
          {regionalLanguages.map((language) => (
            <option key={language.code} value={language.code}>{language.name}</option>
          ))}
        </select>
      </div>

      <div className="movie-grid">
        {loading ? (
          <p>Loading movies...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          movies.map((movie) => (
            <div className="movie-card" key={movie.id} onClick={() => showMovieInfo(movie)}>
              <div className="movie-poster">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.jpg'}
                  alt={movie.title}
                />
                <button
                  onClick={(e) => addToFavorites(movie, e)}
                  className={`favorite-button ${favorites.find((fav) => fav.id === movie.id) ? 'favorited' : ''}`}
                  aria-label="Add to favorites"
                >
                  <i className={`fa ${favorites.find((fav) => fav.id === movie.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                </button>
              </div>
              <h3>{movie.title}</h3>
              <p>Rating: {movie.vote_average}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {movieInfo && (
        <div className="movie-info">
          <h2>{movieInfo.title}</h2>
          <p>{movieInfo.overview}</p>
          <p>Release Date: {movieInfo.release_date}</p>
          <button onClick={() => setMovieInfo(null)}>Close</button>
        </div>
      )}

      <footer>
        <h2>Favorites</h2>
        <div className="favorites-list">
          {favorites.map((movie) => (
            <div key={movie.id} className="favorite-card">
              <h3>{movie.title}</h3>
              <button onClick={() => removeFromFavorites(movie)}>Remove</button>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
