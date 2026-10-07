import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

/**
 * J.A.R.V.I.S. Neural Voice Synthesis API:
 * - Hindi Voice: hi-IN-MadhurNeural (deep baritone Indian male voice - Atul Kapoor)
 * - English Voice: en-GB-RyanNeural (calm British gentleman - Paul Bettany)
 *
 * Uses Python edge-tts stream script for instant binary MP3 generation.
 */
function synthesizeWithPython(
  text: string,
  voice: string,
  rate: string,
  pitch: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "tts_stream.py");
    const pyProcess = spawn("python", [scriptPath, text, voice, rate, pitch], {
      windowsHide: true,
    });

    const chunks: Buffer[] = [];
    let errOutput = "";

    pyProcess.stdout.on("data", (data: Buffer) => {
      chunks.push(data);
    });

    pyProcess.stderr.on("data", (data: Buffer) => {
      errOutput += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(
          new Error(
            `TTS process exited with code ${code}: ${errOutput || "No audio output"}`
          )
        );
      }
    });

    pyProcess.on("error", (err) => {
      reject(err);
    });

    // 8-second safety timeout
    setTimeout(() => {
      try {
        pyProcess.kill();
      } catch {}
      if (chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error("TTS generation timed out"));
      }
    }, 8000);
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || "").trim();
    const isHi = Boolean(body.isHi);

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit length for real-time speech
    const cleanText = text.slice(0, 600);

    // Hindi = Atul Kapoor (Iron Man 2, 3, Avengers Age of Ultron dub: F0 = 131.2 Hz)
    // English = Paul Bettany (British AI gentleman)
    const voice = isHi ? "hi-IN-MadhurNeural" : "en-GB-RyanNeural";
    const rate = isHi ? "-6%" : "-2%";
    const pitch = isHi ? "-12Hz" : "-5%";

    const audioBuffer = await synthesizeWithPython(cleanText, voice, rate, pitch);

    if (!audioBuffer || audioBuffer.length === 0) {
      return NextResponse.json(
        { error: "Audio generation empty" },
        { status: 502 }
      );
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[jarvis-tts] Error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Failed to synthesize neural audio" },
      { status: 500 }
    );
  }
}
