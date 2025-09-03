'use client';

import React, { useState, useCallback } from "react";
import { Image as ImageType } from "../types";
import Image from "next/image";

interface ImageCardProps {
    image: ImageType,
    onDelete: (image: ImageType) => boolean;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
    const [isHover, setIsHover] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    const handleDelete = useCallback(async () => {
        setDelete(true);
        setError(null);

        try {
            const response = await fetch(`/api/images/${image.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            await onDelete(image);
        } catch (err) {
            setError("Failed to delete image");
            console.error('Delete error:', err);
        } finally {
            setDelete(false);
        }
    }, [image, onDelete]);

    return (
        <div
            className="relative group border rounded-lg overflow-hidden bg-gray-100
                 transition-all duration-300 hover:scale-105 hover:shadow-2xl
                 hover:-translate-y-1"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="relative aspect-square">
                {imageError ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <span>Failed to load image</span>
                    </div>
                ) : (
                    <Image
                        src={image.path}
                        alt={image.filename}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>

            <div className="p-2 text-sm text-center truncate text-black">
                {image.filename}
            </div>

            {/* Delete button */}
            {isHover && !isDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 
                               text-white rounded-full w-8 h-8 flex items-center 
                               justify-center transition-all duration-200 shadow-md"
                    aria-label="Delete image"
                >
                    ✕
                </button>
            )}

            {/* Loading overlay */}
            {isDelete && (
                <div className="absolute inset-0 bg-black bg-opacity-50 
                                flex items-center justify-center">
                    <span className="text-white">Deleting...</span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 
                                text-white text-xs p-1 text-center">
                    {error}
                </div>
            )}
        </div>
    )
}