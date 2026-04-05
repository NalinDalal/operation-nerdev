import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/utils/extract";
import fs from "fs";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const webFile = file as File;
    const buffer = Buffer.from(await webFile.arrayBuffer());
    const filepath = `/tmp/${Date.now()}-${webFile.name}`;

    await fs.promises.writeFile(filepath, buffer);

    const text = await extractTextFromFile(filepath, webFile.type || "");

    try {
      await fs.promises.unlink(filepath);
    } catch (e) {
      console.error("Error deleting temp file:", e);
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error extracting text:", err);
    return NextResponse.json(
      { error: "An error occurred while extracting text" },
      { status: 500 }
    );
  }
}
