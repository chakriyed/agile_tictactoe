import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CHAT_PATH = path.join(process.cwd(), 'app', 'api', 'chat.json');

async function getMessages() {
  try {
    const data = await fs.readFile(CHAT_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMessages(messages: any[]) {
  await fs.writeFile(CHAT_PATH, JSON.stringify(messages), 'utf-8');
}

// Get chat messages
export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}

// Send a new message
export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }
    const messages = await getMessages();
    const newMessage = {
      id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    await saveMessages(messages);
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
  }
}