'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react';
import { categories } from '@/data/products';

export default function WritePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '디지털기기',
    location: '',
    image_url: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다!');
      router.push('/auth');
      return;
    }
    setUser(user);
    
    // 저장된 위치 정보 가져오기
    const savedDong = localStorage.getItem('selectedDong');
    if (savedDong) {
      setFormData(prev => ({ ...prev, location: savedDong }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }

    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert('가격을 입력해주세요!');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseInt(formData.price),
            category: formData.category,
            location: formData.location,
            image_url: formData.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop',
            status: 'selling'
          }
        ])
        .select();

      if (error) throw error;

      alert('상품이 등록되었습니다!');
      router.push('/');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('상품 등록에 실패했습니다. 데이터베이스 설정을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <div className="max-w-screen-xl mx-auto">
        {/* 헤더 */}
        <div className="bg-base-100 p-4 border-b border-base-300 sticky top-14 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="btn btn-ghost btn-circle"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">상품 등록</h1>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 이미지 */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">상품 이미지</span>
                </div>
                <div className="flex gap-4 items-start">
                  {formData.image_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-base-300">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="이미지 URL을 입력하세요"
                      className="input input-bordered w-full"
                    />
                    <div className="label">
                      <span className="label-text-alt text-base-content/60">
                        예: https://images.unsplash.com/...
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 제목 */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">제목 *</span>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="상품 제목을 입력하세요"
                  className="input input-bordered"
                  required
                />
              </label>
            </div>
          </div>

          {/* 카테고리 & 가격 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">카테고리 *</span>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select select-bordered"
                  >
                    {categories.filter(c => c !== '전체').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">가격 *</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="input input-bordered"
                    min="0"
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 위치 */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">거래 위치</span>
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="거래 희망 위치"
                  className="input input-bordered"
                />
              </label>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">상품 설명</span>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="상품에 대해 자세히 설명해주세요"
                  className="textarea textarea-bordered h-32"
                />
              </label>
            </div>
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                등록 중...
              </>
            ) : (
              '상품 등록하기'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

