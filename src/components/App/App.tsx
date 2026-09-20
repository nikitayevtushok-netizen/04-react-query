import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

// 🔥 Спеціальний імпорт для react-paginate у Vite 8+
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query.trim(),
    placeholderData: (previousData) => previousData,
  });

  const movies: Movie[] = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  // 🔥 Toast для відсутності результатів (через useEffect)
  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast.error(`No movies found for "${query}"`);
    }
  }, [isLoading, isError, query, movies.length]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    setSelectedMovie(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      
      <SearchBar onSubmit={handleSearch} />
      
      <main className={css.main}>
        {(isLoading || isFetching) && <Loader />}
        
        {isError && (
          <ErrorMessage
            message={
              error instanceof Error ? error.message : 'Failed to fetch movies'
            }
          />
        )}
        
        {!isLoading && !isError && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
            
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
          </>
        )}
        
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </main>
    </div>
  );
};

export default App;