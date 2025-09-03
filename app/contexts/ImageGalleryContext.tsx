'use client';

import { createContext, ReactNode, useState, useContext, useCallback } from 'react';
import { Image, ImageGalleryContextType } from '../types';



const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

export function ImageGalleryProvider({ children }: { children: ReactNode }) {
    const [imageGallery, setImageGallery] = useState<Image[]>([]);

    const hasImage = useCallback((id: string) => {
        return imageGallery.some((i) => i.id === id);
    }, [imageGallery])

    const addImage = useCallback((newImage: Image) => {
        setImageGallery((previousImages) => [...previousImages, newImage]);

        return true;
    }, []);

    const removeImage = useCallback((id: string) => {
        setImageGallery((previousImages) =>
            previousImages.filter(image => image.id !== id)
        );

        return true;
    }, []);

    const setImages = useCallback((images: Image[]) => {
        setImageGallery(images);

        return true;
    }, []);

    const updateImage = useCallback((image: Image) => {
        setImageGallery(prev => {
            const exists = prev.some(img => img.id === image.id);
            if (!exists) return prev;
            return prev.map(img => img.id === image.id ? image : img);
        });
        return true;
    }, []);

    const searchImages = useCallback((name: string) => {
        //TODO: Update to be more intelligent search than just substrings
        return imageGallery.filter((image) => image.filename.includes(name));
    }, [imageGallery]);

    return (
        <ImageGalleryContext.Provider value={{ imageGallery, hasImage, addImage, removeImage, setImages, updateImage, searchImages }}>
            {children}
        </ImageGalleryContext.Provider>
    );
}

export function useImageGallery() {
    const context = useContext(ImageGalleryContext);
    if (!context) {
        throw new Error('useImageGallery must be used within ImageGalleryProvider');
    }
    return context;
}