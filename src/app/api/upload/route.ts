import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
    await fs.mkdir(path.dirname(uploadPath), { recursive: true }); // Ensure directory exists
    await fs.writeFile(uploadPath, buffer);

    return NextResponse.json({ imagePath: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
  }
}
