'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Image as ImageType } from "../types";

interface ImagePreviewProps {
    image: ImageType;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (image: ImageType) => Promise<boolean>;
}

export default function ImagePreview({ image, isOpen, onClose, onDelete }: ImagePreviewProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle delete
    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/images/${image.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            const success = await onDelete(image);
            if (success) {
                onClose(); // Close modal on successful deletion
            }
        } catch (err) {
            setError("Failed to delete image");
            console.error('Delete error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-75"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className="relative z-10 bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-20"
                    aria-label="Close preview"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <div className="relative w-full h-[70vh]">
                    <Image
                        src={image.path}
                        alt={image.filename}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t">
                    <h2 className="text-xl font-semibold text-black mb-4">{image.filename}</h2>

                    <div className="flex gap-4">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>

                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md
                                     transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}