import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const COUNTER_PATH = path.join(process.cwd(), 'app', 'api', 'leaderboard.json');

async function getCounters() {
  try {
    const data = await fs.readFile(COUNTER_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, initialize
    return { xWins: 0, oWins: 0 };
  }
}

async function saveCounters(counters: { xWins: number; oWins: number }) {
  await fs.writeFile(COUNTER_PATH, JSON.stringify(counters), 'utf-8');
}

export async function GET() {
  const counters = await getCounters();
  return NextResponse.json([counters]);
}

export async function POST(req: Request) {
  const { winner } = await req.json();
  const counters = await getCounters();
  if (winner === 'X') counters.xWins++;
  if (winner === 'O') counters.oWins++;
  await saveCounters(counters);
  return NextResponse.json({ success: true });
}