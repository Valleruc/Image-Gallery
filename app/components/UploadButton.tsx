'use client';

import React, { useState, useRef } from "react";
import { ALLOWED_TYPES } from '../types';

interface UploadButtonProps {
    onUpload: (file: File) => Promise<void>;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Please select a valid image file (JPEG or PNG)");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            await onUpload(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        catch (err) {
            setError("Failed to upload image. Please try again.");
            console.error('Upload error:', err);
        }
        finally {
            setIsUploading(false);
        }

    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative">
            <button
                className="uploadButton"
                onClick={handleClick}
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} disabled={isUploading} />

            {error && (
                <div className="absolute top-full mt-1 text-red-500 text-sm">
                    {error}
                </div>
            )}
        </div>
    )
}