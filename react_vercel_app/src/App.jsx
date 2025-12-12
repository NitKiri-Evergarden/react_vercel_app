import React, { useState, useEffect } from 'react';
import { Book, Heart, Home, ArrowLeft } from 'lucide-react';
import './App.css';

// Componente principal com roteamento
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar livro aleatório
  const fetchRandomBook = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://potterapi-fedeperin.vercel.app/en/books/random');
      const data = await response.json();
      setCurrentBook(data);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      alert('Erro ao carregar livro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar livro ao carregar a Home
  useEffect(() => {
    if (currentPage === 'home') {
      fetchRandomBook();
    }
  }, [currentPage]);

  // Função para adicionar aos favoritos
  const addToFavorites = (book) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoritesBooks') || '[]');
      
      // Verificar se já existe
      const exists = favorites.some(fav => fav.number === book.number);
      if (exists) {
        alert('Este livro já está nos favoritos!');
        return;
      }

      favorites.push(book);
      localStorage.setItem('favoritesBooks', JSON.stringify(favorites));
      alert('Livro adicionado aos favoritos!');
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      alert('Erro ao salvar favorito.');
    }
  };

  // Função para obter favoritos
  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem('favoritesBooks') || '[]');
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return [];
    }
  };

  // Navegação
  const navigateTo = (page, book = null) => {
    if (book) setCurrentBook(book);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <Book size={32} />
              <h1 className="text-2xl font-bold">Harry Potter Books</h1>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Início</span>
              </button>
              <button
                onClick={() => navigateTo('favorites')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
              >
                <Heart size={20} />
                <span className="hidden sm:inline">Favoritos</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <HomePage 
            book={currentBook} 
            loading={loading} 
            onBookClick={(book) => navigateTo('details', book)} 
          />
        )}
        {currentPage === 'details' && (
          <DetailsPage 
            book={currentBook}
            onBack={() => navigateTo('home')}
            onAddFavorite={addToFavorites}
          />
        )}
        {currentPage === 'favorites' && (
          <FavoritesPage favorites={getFavorites()} />
        )}
      </main>
    </div>
  );
};

// Tela 1 - Página Inicial (Home)
const HomePage = ({ book, loading, onBookClick }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
        <p className="mt-4 text-white text-xl">Carregando livro...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white text-xl">Nenhum livro disponível</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div 
          onClick={() => onBookClick(book)}
          className="cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
        >
          <img
            src={book.cover}
            alt={book.originalTitle}
            className="w-full rounded-lg shadow-2xl border-4 border-yellow-400"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            Livro {book.number} - {book.originalTitle}
          </p>
          <p className="mt-2 text-gray-300 text-sm">
            Clique na capa para ver mais detalhes
          </p>
        </div>
      </div>
    </div>
  );
};

// Tela 2 - Página de Detalhes do Livro
const DetailsPage = ({ book, onBack, onAddFavorite }) => {
  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white text-xl">Nenhum livro selecionado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-8 border border-purple-500">
        {/* Título */}
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          Livro {book.number} - {book.originalTitle}
        </h2>

        {/* Capa */}
        <div className="flex justify-center mb-8">
          <img
            src={book.cover}
            alt={book.originalTitle}
            className="max-w-sm w-full rounded-lg shadow-2xl border-4 border-yellow-400"
          />
        </div>

        {/* Detalhes */}
        <div className="space-y-4 text-white">
          <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">Data de publicação:</p>
            <p className="text-lg">{book.releaseDate}</p>
          </div>

          <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">Páginas:</p>
            <p className="text-lg">{book.pages}</p>
          </div>

          <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">Descrição:</p>
            <p className="text-lg leading-relaxed">{book.description}</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-lg"
          >
            <ArrowLeft size={24} />
            Voltar à Página Inicial
          </button>
          <button
            onClick={() => onAddFavorite(book)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition text-lg"
          >
            <Heart size={24} />
            Adicionar aos Favoritos
          </button>
        </div>
      </div>
    </div>
  );
};

// Tela 3 - Página de Favoritos
const FavoritesPage = ({ favorites }) => {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Heart size={64} className="text-pink-400 mb-4" />
        <p className="text-white text-2xl text-center">
          Nenhum livro favoritado ainda
        </p>
        <p className="text-gray-400 text-center mt-2">
          Adicione livros aos favoritos para vê-los aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-yellow-400 text-center mb-8">
        Meus Livros Favoritos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((book, index) => (
          <div
            key={index}
            className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500 hover:border-yellow-400 transition"
          >
            <img
              src={book.cover}
              alt={book.originalTitle}
              className="w-full rounded-lg shadow-lg mb-4"
            />
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              Livro {book.number}
            </h3>
            <p className="text-white font-semibold">{book.originalTitle}</p>
            <p className="text-gray-400 text-sm mt-2">{book.releaseDate}</p>
            <p className="text-gray-400 text-sm">{book.pages} páginas</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;