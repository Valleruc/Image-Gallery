'use client';

import { createContext, ReactNode, useState, useContext } from 'react';
import { Image, ImageGalleryContextType } from '../types';



const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

export function ImageGalleryProvider({ children }: { children: ReactNode }) {
    const [imageGallery, setImageGallery] = useState<Image[]>([]);

    const hasImage = (id: string) => {
        return imageGallery.some((i) => i.id === id);
    }

    const addImage = (newImage: Image) => {
        setImageGallery((previousImages) => [...previousImages, newImage]);

        return true;
    };

    const removeImage = (id: string) => {
        setImageGallery((previousImages) =>
            previousImages.filter(image => image.id !== id)
        );

        return true;
    };

    const setImages = (images: Image[]) => {
        setImageGallery(images);

        return true;
    };

    const updateImage = (image: Image) => {
        if (!hasImage(image.id)) {
            return false;
        }
        else {
            setImageGallery(prev => prev.map(img => img.id === image.id ? image : img));
            return true;
        }

        return false;
    };

    const searchImages = (name: string) => {
        //TODO: Update to be more intelligent search than just substrings
        return imageGallery.filter((image) => image.filename.includes(name));
    };

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
