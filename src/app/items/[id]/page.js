'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Share2, MapPin, Clock, Edit, Trash2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { products as sampleProducts } from '@/data/products';

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // 시간 계산 함수
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 먼저 샘플 데이터에서 찾기 (숫자 ID)
        const sampleProduct = sampleProducts.find(p => p.id === parseInt(params.id));
        
        if (sampleProduct) {
          setProduct(sampleProduct);
          setLoading(false);
          return;
        }

        // Supabase에서 찾기 (UUID)
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          const formattedProduct = {
            id: data.id,
            user_id: data.user_id,
            title: data.title,
            price: data.price,
            location: data.location || '위치 미정',
            time: getTimeAgo(data.created_at),
            image: data.image_url || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400',
            status: data.status || 'selling',
            likes: data.likes || 0,
            chatCount: data.chat_count || 0,
            category: data.category || '기타',
            description: data.description
          };
          setProduct(formattedProduct);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        alert('상품을 불러올 수 없습니다.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  // 찜하기 토글
  const handleToggleLike = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다!');
      router.push('/auth');
      return;
    }
    setIsLiked(!isLiked);
    // TODO: Supabase에 찜하기 상태 저장
  };

  // 공유하기
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `${product.title} - ${product.price.toLocaleString()}원`,
        url: window.location.href
      });
    } else {
      // 공유 API 미지원 시 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  // 상품 삭제
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', product.id)
        .eq('user_id', user.id);

      if (error) throw error;

      alert('상품이 삭제되었습니다.');
      router.push('/');
    } catch (err) {
      console.error('Delete error:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  // 채팅하기
  const handleChat = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다!');
      router.push('/auth');
      return;
    }
    alert('채팅 기능은 준비 중입니다!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">상품을 찾을 수 없습니다</p>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && product.user_id === user.id;

  return (
    <div className="min-h-screen bg-base-200">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-300 z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.back()}
              className="btn btn-ghost btn-circle"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex gap-2">
              <button onClick={handleShare} className="btn btn-ghost btn-circle">
                <Share2 size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pt-14 pb-24">
        <div className="max-w-screen-xl mx-auto">
          {/* 상품 이미지 */}
          <div className="relative w-full aspect-square bg-base-300">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {product.status !== 'selling' && (
              <div className="absolute inset-0 bg-base-content/60 flex items-center justify-center">
                <div className="badge badge-lg badge-neutral">
                  {product.status === 'reserved' ? '예약중' : '거래완료'}
                </div>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="bg-base-100 p-6 space-y-4">
            {/* 카테고리 */}
            <div className="badge badge-outline">{product.category}</div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold">{product.title}</h1>

            {/* 가격 */}
            <p className="text-3xl font-bold text-primary">
              {product.price.toLocaleString()}원
            </p>

            {/* 위치 및 시간 */}
            <div className="flex items-center gap-4 text-base-content/60">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span className="text-sm">{product.location}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span className="text-sm">{product.time}</span>
              </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-4 text-base-content/60 text-sm">
              <span>조회 {Math.floor(Math.random() * 100) + 10}</span>
              <span>·</span>
              <span>찜 {product.likes}</span>
              <span>·</span>
              <span>채팅 {product.chatCount}</span>
            </div>

            <div className="divider"></div>

            {/* 상품 설명 */}
            <div>
              <h2 className="text-lg font-semibold mb-3">상품 정보</h2>
              <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed">
                {product.description || '상품 설명이 없습니다.'}
              </p>
            </div>

            {/* 소유자만 보이는 버튼 */}
            {isOwner && (
              <>
                <div className="divider"></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/')}
                    className="btn btn-outline flex-1 gap-2"
                  >
                    <Edit size={20} />
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-outline btn-error flex-1 gap-2"
                  >
                    <Trash2 size={20} />
                    삭제하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-40 pb-16">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex gap-3">
            <button
              onClick={handleToggleLike}
              className="btn btn-circle btn-lg"
            >
              <Heart
                size={28}
                className={isLiked ? 'fill-error text-error' : ''}
              />
            </button>
            <button
              onClick={handleChat}
              className="btn btn-primary flex-1 gap-2 btn-lg"
              disabled={isOwner}
            >
              <MessageCircle size={24} />
              {isOwner ? '내 상품입니다' : '채팅하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

