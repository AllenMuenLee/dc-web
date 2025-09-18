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

export default function HighlightPage() {
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

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">Highlight</h1>
      <div className="flex flex-wrap justify-center">
        {highlightCards.map((card) => (
          <div key={card.id} className="w-full lg:w-3/4 xl:w-2/3 mb-8 mx-auto">
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
          </div>
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
