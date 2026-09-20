import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const API_BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${API_BASE_URL}/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: 'application/json',
      },
    },
  );

  return response.data;
};
