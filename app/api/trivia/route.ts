import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://the-trivia-api.com/v2/questions?categories=film&difficulties=hard&tags=academy_awards');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trivia question:', error);
    return NextResponse.json({ error: 'Failed to fetch trivia question' }, { status: 500 });
  }
}
