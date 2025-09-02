'use client';

import React from "react";
import { Image } from "../types";
import ImageCard from "./ImageCard";

interface ImageGalleryProps {
    images: Image[];
    onDeleteImage: (image: Image) => boolean;
    isLoading?: boolean;
}

export default function ImageGallery({ images, onDeleteImage, isLoading }: ImageGalleryProps) {
    // Simple passthrough - no local state or context usage

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 p-4">
                {/* Loading skeleton */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {images.map((image) => (
                <ImageCard
                    key={image.id}
                    image={image}
                    onDelete={onDeleteImage}
                />
            ))}
        </div>
    );
}