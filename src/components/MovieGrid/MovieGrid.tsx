import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

interface MovieGridProps {
  movies: Movie[];
  onSelect?: (movie: Movie) => void;
}

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  if (movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li
          key={movie.id}
          className={css.card}
          onClick={() => onSelect?.(movie)}
        >
          {movie.poster_path && (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
              className={css.image}
            />
          )}
          <h2 className={css.title}>{movie.title}</h2>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;