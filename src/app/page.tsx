'use client';

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Image from 'next/image'; // Import Image component

interface CardData {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: 'Home' | 'Software' | 'Games';
  imagePath?: string;
  productLink?: string;
  videoLink?: string;
  createdAt: number;
}

import IntroSection from '../components/IntroSection';

export default function Home() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [numberOfHighlights, setNumberOfHighlights] = useState(1);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const introSection = document.getElementById('intro');

      // Nav visibility
      
      if (currentScrollY > 80) {
        console.log('Scroll Y:', currentScrollY);
        setIsNavVisible(true);
        setIsScrollButtonVisible(false);
      } else {
        setIsNavVisible(false);
        setIsScrollButtonVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchCards();
    fetchSettings();
  }, []);

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    if (res.ok) {
      const data = await res.json();
      setCards(data);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setNumberOfHighlights(data.numberOfHighlights);
    }
  };

  const openModal = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleScrollButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' });
  };

  const allSortedCards = [...cards].sort((a, b) => b.createdAt - a.createdAt);
  const highlightCards = allSortedCards.slice(0, numberOfHighlights);

  const softwareCards = cards.filter((card) => card.category === 'Software');
  const gamesCards = cards.filter((card) => card.category === 'Games');

  // Filter out highlight cards from other sections
  const remainingCards = cards.filter(card => !highlightCards.some(hCard => hCard.id === card.id));

  // Home cards are those not in highlights, and not explicitly Software or Games
  const homeCards = remainingCards.filter(card => card.category !== 'Software' && card.category !== 'Games');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className={`bg-white shadow-md fixed w-full z-10 transition-transform duration-300 ease-in-out ${!isNavVisible ? '-translate-y-full' : ''}`}>
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            {/* Blue banner is the logo */}
          </div>
          <div className="flex space-x-4">
            <a href="#intro" className="text-gray-800 hover:text-blue-600">Homepage</a>
            <a href="#about-me" className="text-gray-800 hover:text-blue-600">About Me</a>
            <a href="#highlight" className="text-gray-800 hover:text-blue-600">Highlight</a>
            <a href="#software" className="text-gray-800 hover:text-blue-600">Software</a>
            <a href="#games" className="text-gray-800 hover:text-blue-600">Games</a>
          </div>
        </nav>
      </header>

      {/* Intro Section */}
      <section id="intro" className="relative overflow-hidden pt-20 text-white py-20 text-center cursor-pointer min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url('/imgs/logo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[30deg] animate-shimmer"></div>
      </section>

      <IntroSection />

      {/* Highlight Section */}
      <section id="highlight" className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Highlight</h2>
        <div className="flex flex-wrap justify-center">
          {highlightCards.map((card) => (
              <Card
                title={card.title}
                description={card.description}
                shortDescription={card.shortDescription}
                category={card.category}
                imagePath={card.imagePath}
                productLink={card.productLink}
                videoLink={card.videoLink}
                onClick={() => openModal(card)}
              />
          ))}
        </div>
      </section>

      {/* Software Section */}
      <section id="software" className="bg-gray-200 py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Software</h2>
        <div className="flex flex-wrap justify-center">
          {softwareCards.length > 0 ? (
            softwareCards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={card.description}
                shortDescription={card.shortDescription}
                category={card.category}
                imagePath={card.imagePath}
                productLink={card.productLink}
                videoLink={card.videoLink}
                onClick={() => openModal(card)}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg">There's no "Software" right now.</p>
          )}
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Games</h2>
        <div className="flex flex-wrap justify-center">
          {gamesCards.length > 0 ? (
            gamesCards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={card.description}
                shortDescription={card.shortDescription}
                category={card.category}
                imagePath={card.imagePath}
                productLink={card.productLink}
                videoLink={card.videoLink}
                onClick={() => openModal(card)}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg">There's no "Games" right now.</p>
          )}
        </div>
      </section>

      {selectedCard && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedCard.title}
          description={selectedCard.description}
          shortDescription={selectedCard.shortDescription}
          imagePath={selectedCard.imagePath}
          productLink={selectedCard.productLink}
          videoLink={selectedCard.videoLink}
          category={selectedCard.category}
        />
      )}

      {/* Scroll Down Button - Fixed Layer */}
      <a 
        href="#about-me" 
        onClick={handleScrollButtonClick}
        className={`fixed bottom-10 right-10 animate-bounce bg-white/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/50 transition-opacity duration-500 z-20 ${isScrollButtonVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll down">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </a>
    </div>
  );
}

