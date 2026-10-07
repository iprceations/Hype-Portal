import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface ContactPayload {
  name: string;
  email: string;
  category: string;
  priority: string;
  message: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "contact_messages.json");

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function POST(req: Request) {
  try {
    const body: ContactPayload = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    ensureFileExists();

    const ticketId = `HP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEntry = {
      ticketId,
      timestamp: new Date().toISOString(),
      name: body.name.trim(),
      email: body.email.trim(),
      category: body.category || "General",
      priority: body.priority || "normal",
      message: body.message.trim(),
      targetEmail: "ask.hypeai@gmail.com",
    };

    const fileContent = fs.readFileSync(MESSAGES_FILE, "utf-8");
    const messages = JSON.parse(fileContent || "[]");
    messages.unshift(newEntry);

    // Keep up to 200 recent messages
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages.slice(0, 200), null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Inquiry logged and recorded successfully.",
      targetInbox: "ask.hypeai@gmail.com",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch message." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    ensureFileExists();
    const fileContent = fs.readFileSync(MESSAGES_FILE, "utf-8");
    const messages = JSON.parse(fileContent || "[]");
    return NextResponse.json({
      success: true,
      count: messages.length,
      targetInbox: "ask.hypeai@gmail.com",
      messages,
    });
  } catch (error) {
    return NextResponse.json({ success: true, count: 0, messages: [] });
  }
}
