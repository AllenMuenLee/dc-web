'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';

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

export default function GamesPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    if (res.ok) {
      const data = await res.json();
      setCards(data);
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

  const gamesCards = cards.filter((card) => card.category === 'Games');

  return (
    <div className="min-h-screen bg-gray-100 pt-16"> {/* Adjusted padding-top */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Games</h1>
      <div className="flex flex-wrap justify-center">
        {gamesCards.map((card) => (
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
        ))}
      </div>

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
