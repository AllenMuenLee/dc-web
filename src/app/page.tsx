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

export default function Home() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [numberOfHighlights, setNumberOfHighlights] = useState(1);

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
      <header className="bg-white shadow-md fixed w-full z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            {/* Blue banner is the logo */}
          </div>
          <div className="flex space-x-4">
            <a href="#intro" className="text-gray-800 hover:text-blue-600">Homepage</a>
            <a href="#highlight" className="text-gray-800 hover:text-blue-600">Highlight</a>
            <a href="#software" className="text-gray-800 hover:text-blue-600">Software</a>
            <a href="#games" className="text-gray-800 hover:text-blue-600">Games</a>
          </div>
        </nav>
      </header>

      {/* Intro Section */}
      <section id="intro" className="pt-20 text-white py-20 text-center cursor-pointer min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url('/imgs/logo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}>
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>Welcome to Dream Crown</h1>
          <p className="text-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Hello, my name is Allen Lee. The name "Dream Crown" is a name I came up with in junior high school,
            and I kept it to mark where my my dream started. This platform is a testament to that journey.
          </p>
        </div>
      </section>

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
    </div>
  );
}

