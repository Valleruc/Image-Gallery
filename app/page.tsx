'use client';

import { useState } from 'react';
import Image from 'next/image'
import SearchBar from './components/SearchBar';
import { useImageSearch } from './hooks/useImageSearch';
import UploadButton from './components/UploadButton';
import { useImageUpload } from './hooks/useImageUpload';

export default function Home() {
  // User Search Input State
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered images
  const { filteredImages, isSearching } = useImageSearch(searchQuery);

  const uploadImage = useImageUpload();

  return (
    <div>
      <SearchBar onSearch={setSearchQuery} />
      {isSearching && <div>Searching...</div>}
      <UploadButton onUpload={uploadImage}></UploadButton>
      <div className="grid grid-cols-2 gap-4">
        {filteredImages.map(image => (
          <Image key={image.id} src={image.path} alt={image.filename} />
        ))}
      </div>
    </div>
  );
}