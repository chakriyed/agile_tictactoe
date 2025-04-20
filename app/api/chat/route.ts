import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get chat messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 50, // Last 50 messages
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Chat fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching messages' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(req: Request) {
  try {
    const { userId, content } = await req.json();

    const message = await prisma.message.create({
      data: {
        content,
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
} 