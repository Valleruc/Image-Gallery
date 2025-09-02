import { NextRequest, NextResponse } from "next/server";
import { unlink, readdir } from "fs/promises";
import path from "path";

import { ALLOWED_TYPES } from '../../../types';

const UPLOAD_DIR = path.join(process.cwd(), "public/temp-images");

// DELETE: Remove image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find file with this ID
    const files = await readdir(UPLOAD_DIR, { withFileTypes: true });
    const fileToDelete = files.find((file) => file.name.split(".")[0] === id);

    if (!fileToDelete) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileToDelete.name.split(".")[1])) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Delete the file
    const filePath = path.join(UPLOAD_DIR, fileToDelete.name);
    await unlink(filePath);

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
