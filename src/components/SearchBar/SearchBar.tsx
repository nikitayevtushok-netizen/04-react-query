import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (formData: FormData) => {
    const searchQuery = formData.get('query');

    if (typeof searchQuery !== 'string') {
      toast.error('Please enter a search term');
      return;
    }

    if (!searchQuery?.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    onSubmit(searchQuery.trim());
    setQuery('');
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form action={handleSubmit} className={css.form}>
          <input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className={css.input}
            autoFocus
          />
          <button type="submit" className={css.button}>
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;