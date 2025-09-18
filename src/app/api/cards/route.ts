import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const cardsFilePath = path.join(process.cwd(), 'src/data/cards.json');

interface Card {
  id: string;
  title: string;
  description: string;
  shortDescription?: string; // New field
  category: 'Home' | 'Software' | 'Games';
  imagePath?: string;
  productLink?: string; // New field
  videoLink?: string; // New field
  createdAt: number;
}

async function readCards(): Promise<Card[]> {
  try {
    const fileContents = await fs.readFile(cardsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading cards file:', error);
    return [];
  }
}

async function writeCards(cards: Card[]): Promise<void> {
  await fs.writeFile(cardsFilePath, JSON.stringify(cards, null, 2), 'utf8');
}

export async function GET() {
  const cards = await readCards();
  return NextResponse.json(cards);
}

export async function POST(request: Request) {
  const newCardData: Omit<Card, 'id' | 'createdAt'> = await request.json();
  const cards = await readCards();

  const generatedShortDescription = newCardData.shortDescription || newCardData.description.split(' ').slice(0, 10).join(' ') + '...';

  const cardWithId: Card = {
    ...newCardData,
    id: Date.now().toString(),
    createdAt: Date.now(),
    shortDescription: generatedShortDescription,
  };
  cards.push(cardWithId);
  await writeCards(cards);
  return NextResponse.json(cardWithId, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedCard: Card = await request.json();
  let cards = await readCards();
  cards = cards.map((card) => (card.id === updatedCard.id ? updatedCard : card));
  await writeCards(cards);
  return NextResponse.json(updatedCard);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let cards = await readCards();
  cards = cards.filter((card) => card.id !== id);
  await writeCards(cards);
  return NextResponse.json({ message: 'Card deleted' });
}

