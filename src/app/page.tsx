'use client';
import { createContext } from 'react';
import BlogsPage from './blogs-page';

export default function Home() {
  const Context = createContext(null);
  return (
    <Context.Provider value={null}>
      <BlogsPage />
    </Context.Provider>
  );
}
