import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        wins: true,
        losses: true,
        draws: true,
      },
      orderBy: {
        wins: 'desc',
      },
      take: 10, // Top 10 players
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Error fetching leaderboard' },
      { status: 500 }
    );
  }
}

// Update user stats after a game
export async function POST(req: Request) {
  try {
    const { userId, result } = await req.json();

    const updateData = {
      wins: result === 'win' ? { increment: 1 } : undefined,
      losses: result === 'loss' ? { increment: 1 } : undefined,
      draws: result === 'draw' ? { increment: 1 } : undefined,
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json(
      { error: 'Error updating stats' },
      { status: 500 }
    );
  }
} 