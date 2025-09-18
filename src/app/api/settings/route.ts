import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src/data/settings.json');

interface Settings {
  numberOfHighlights: number;
}

async function readSettings(): Promise<Settings> {
  try {
    const fileContents = await fs.readFile(settingsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return { numberOfHighlights: 1 }; // Default value
  }
}

async function writeSettings(settings: Settings): Promise<void> {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const updatedSettings: Settings = await request.json();
  await writeSettings(updatedSettings);
  return NextResponse.json(updatedSettings);
}
