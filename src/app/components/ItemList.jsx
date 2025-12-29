'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import ItemCard from './ItemCard';

export default function ItemList({ products, selectedCategory, currentUserId, onEdit }) {
  const [likedItems, setLikedItems] = useState(new Set());

  // 카테고리별 필터링
  const filteredProducts = selectedCategory === '전체' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // 찜하기 토글
  const toggleLike = (productId) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* 상품 개수 표시 */}
      <div className="text-sm text-base-content/60 px-2 mb-2">
        {selectedCategory === '전체' ? '전체' : selectedCategory} 상품 {filteredProducts.length}개
      </div>
      
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ItemCard
            key={product.id}
            product={product}
            isLiked={likedItems.has(product.id)}
            onToggleLike={toggleLike}
            currentUserId={currentUserId}
            onEdit={onEdit}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-base-content/40 mb-4">
            <MapPin size={64} />
          </div>
          <p className="text-lg font-semibold text-base-content/60 mb-2">
            등록된 상품이 없습니다
          </p>
          <p className="text-sm text-base-content/40">
            {selectedCategory} 카테고리에 상품이 없어요
          </p>
        </div>
      )}
    </div>
  );
}

