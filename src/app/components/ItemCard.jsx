'use client';

import { Heart, Clock, MapPin, Edit } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ItemCard({ product, isLiked, onToggleLike, currentUserId, onEdit }) {
  const router = useRouter();

  // 상품 클릭 시 상세 페이지로 이동
  const handleCardClick = () => {
    router.push(`/items/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* 상품 이미지 */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 bg-base-300 rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            {/* 상태 배지 */}
            {product.status !== 'selling' && (
              <div className="absolute inset-0 bg-base-content/60 rounded-xl flex items-center justify-center">
                <div className="badge badge-lg">
                  {product.status === 'reserved' ? '예약중' : '거래완료'}
                </div>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base line-clamp-2">
                {product.title}
              </h3>
              <div className="flex gap-1 flex-shrink-0">
                {/* 수정 버튼 (소유자만 보임) */}
                {currentUserId && product.user_id === currentUserId && onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="btn btn-ghost btn-circle btn-sm"
                    title="수정하기"
                  >
                    <Edit size={18} className="text-primary" />
                  </button>
                )}
                {/* 찜하기 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(product.id);
                  }}
                  className="btn btn-ghost btn-circle btn-sm"
                >
                  <Heart
                    size={20}
                    className={isLiked ? 'fill-error text-error' : ''}
                  />
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-base-content/60">
              <MapPin size={14} />
              <span>{product.location}</span>
              <span>·</span>
              <Clock size={14} />
              <span>{product.time}</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="font-bold text-lg">
                {product.price.toLocaleString()}원
              </p>
              
              <div className="flex items-center gap-3 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{product.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                  </svg>
                  <span>{product.chatCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

