import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  shortDescription?: string; // New field
  category: string;
  imagePath?: string;
  productLink?: string;
  videoLink?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, shortDescription, category, imagePath, onClick }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 m-4 w-72 flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      {imagePath && (
        <div className="relative w-full h-auto min-h-[160px] mb-4 rounded-md overflow-hidden">
          <Image src={imagePath} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4 flex-grow">{shortDescription || description}</p>
      <span className="inline-block bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full uppercase font-semibold mt-auto">
        {category}
      </span>
    </div>
  );
};

export default Card;
