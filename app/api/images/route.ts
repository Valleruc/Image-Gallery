import { NextRequest, NextResponse } from "next/server";
import { writeFile, readdir, stat, mkdir } from "fs/promises";
import path from "path";

import { ALLOWED_TYPES } from '../../types';

// Define allowed image types
const UPLOAD_DIR = path.join(process.cwd(), "public/temp-images");

// GET: List all images
export async function GET() {
  try {
    // Check if Directory is ready
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Read all files from temp-images
    const files = await readdir(UPLOAD_DIR, {
      withFileTypes: true,
    });

    // Get metadata for each image
    const images = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(UPLOAD_DIR, file.name);
        const stats = await stat(filePath);

        return {
          id: file.name.split(".")[0],
          filename: file.name,
          path: `/temp-images/${file.name}`,
          size: stats.size,
          uploadedAt: stats.birthtime,
        };
      })
    );

    return NextResponse.json({ images });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST: Upload new image
export async function POST(request: NextRequest) {
  try {
    // Check if Directory is ready
    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Save file
    const filePath = path.join(UPLOAD_DIR, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    const filename = file.name;
    const stats = await stat(filePath);

    //TODO: Make id unique

    // Return image metadata
    const image = {
      id: filename.split(".")[0],
      filename: filename,
      path: `/temp-images/${filename}`,
      size: stats.size,
      uploadedAt: stats.birthtime,
    };

    return NextResponse.json({ image });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
