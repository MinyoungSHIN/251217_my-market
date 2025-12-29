'use client';

import { Plus, X, ImageIcon, DollarSign, MapPin, Package, FileText, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ItemList from './components/ItemList';
import ImageUpload from '@/components/ImageUpload';
import { products as sampleProducts, categories } from '@/data/products';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(sampleProducts); // 실시간 상품 데이터
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // 수정 중인 상품
  
  // 폼 데이터 (새 상품 등록용)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '디지털기기',
    imageUrl: '',
    location: ''
  });

  // 수정 폼 데이터
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '디지털기기',
    imageUrl: '',
    location: ''
  });
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Supabase에서 상품 목록 가져오기
  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Supabase 데이터를 화면 표시 형식으로 변환
        const formattedProducts = data.map((item, index) => ({
          id: item.id,
          user_id: item.user_id, // 소유자 ID 추가
          title: item.title,
          price: item.price,
          location: item.location || '위치 미정',
          time: getTimeAgo(item.created_at),
          image: item.image_url || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400',
          status: item.status || 'selling',
          likes: item.likes || 0,
          chatCount: item.chat_count || 0,
          category: item.category || '기타',
          description: item.description
        }));

        // 샘플 데이터와 실제 데이터를 합침 (샘플 데이터 먼저)
        setProducts([...formattedProducts, ...sampleProducts]);
      } else {
        // 데이터가 없으면 샘플 데이터만 표시
        setProducts(sampleProducts);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // 에러 발생 시에도 샘플 데이터는 표시
      setProducts(sampleProducts);
    } finally {
      setFetchLoading(false);
    }
  };

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

  // 컴포넌트 마운트 시 상품 목록 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);

  // 글쓰기 버튼 클릭
  const handleWriteClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다!');
      router.push('/auth');
      return;
    }
    setIsModalOpen(true);
    setError(null);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '디지털기기',
      imageUrl: '',
      location: ''
    });
    setError(null);
  };

  // 입력값 변경 처리 (등록)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 입력값 변경 처리 (수정)
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 버튼 클릭
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.image,
      location: product.location
    });
    setIsEditModalOpen(true);
    setError(null);
  };

  // 수정 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditFormData({
      title: '',
      description: '',
      price: '',
      category: '디지털기기',
      imageUrl: '',
      location: ''
    });
    setError(null);
  };

  // 상품 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 가격 유효성 검사
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('올바른 가격을 입력해주세요.');
      }

      // Supabase에 상품 등록
      const { data, error: insertError } = await supabase
        .from('items')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            price: price,
            category: formData.category,
            image_url: formData.imageUrl || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400',
            location: formData.location || '위치 미정',
            status: 'selling'
          }
        ])
        .select();

      if (insertError) throw insertError;

      // 성공 시 모달 닫기 및 상품 목록 새로고침
      alert('상품이 등록되었습니다!');
      handleCloseModal();
      await fetchProducts(); // 상품 목록 다시 불러오기
    } catch (err) {
      console.error('Item registration error:', err);
      setError(err.message || '상품 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상품 수정 제출
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 가격 유효성 검사
      const price = parseFloat(editFormData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('올바른 가격을 입력해주세요.');
      }

      // Supabase에 상품 수정
      const { data, error: updateError } = await supabase
        .from('items')
        .update({
          title: editFormData.title,
          description: editFormData.description,
          price: price,
          category: editFormData.category,
          image_url: editFormData.imageUrl,
          location: editFormData.location
        })
        .eq('id', editingProduct.id)
        .eq('user_id', user.id) // 소유자만 수정 가능
        .select();

      if (updateError) throw updateError;

      // 성공 시 모달 닫기 및 상품 목록 새로고침
      alert('상품이 수정되었습니다!');
      handleCloseEditModal();
      await fetchProducts(); // 상품 목록 다시 불러오기
    } catch (err) {
      console.error('Item update error:', err);
      setError(err.message || '상품 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-screen-xl mx-auto">
        {/* 카테고리 탭 */}
        <div className="bg-base-100 sticky top-14 z-30 border-b border-base-300">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 px-4 py-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn btn-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'btn-primary' 
                      : 'btn-ghost hover:btn-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상품 리스트 */}
        {fetchLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <ItemList 
            products={products} 
            selectedCategory={selectedCategory}
            currentUserId={user?.id}
            onEdit={handleEditClick}
          />
        )}

        {/* 플로팅 액션 버튼 (글쓰기) */}
        <button 
          onClick={handleWriteClick}
          className="btn btn-primary btn-circle btn-lg fixed bottom-24 right-6 shadow-xl z-30 hover:scale-110 transition-transform"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* 상품 등록 모달 */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Package size={28} />
                상품 등록
              </h3>
              <button 
                onClick={handleCloseModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={20} />
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 상품 등록 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 상품명 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    상품명
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 아이폰 14 Pro 256GB 딥퍼플"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 카테고리 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Package size={18} />
                    카테고리
                  </span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  disabled={loading}
                >
                  {categories.filter(cat => cat !== '전체').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 가격 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <DollarSign size={18} />
                    가격
                  </span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                  placeholder="예: 950000"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {formData.price ? `${parseInt(formData.price).toLocaleString()}원` : '가격을 입력하세요'}
                  </span>
                </label>
              </div>

              {/* 상품 설명 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    상품 설명
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="상품 상태, 구매 시기, 사용감 등을 자세히 적어주세요."
                  className="textarea textarea-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 위치 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <MapPin size={18} />
                    거래 위치
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="예: 서울시 강남구 역삼동"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <ImageIcon size={18} />
                    상품 이미지
                  </span>
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  userId={user?.id}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      등록 중...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      상품 등록
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* 모달 배경 (클릭 시 닫기) */}
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
        </div>
      )}

      {/* 상품 수정 모달 */}
      {isEditModalOpen && editingProduct && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Edit size={28} />
                상품 수정
              </h3>
              <button 
                onClick={handleCloseEditModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={20} />
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 상품 수정 폼 */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* 상품명 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    상품명
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  required
                  placeholder="예: 아이폰 14 Pro 256GB 딥퍼플"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 카테고리 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Package size={18} />
                    카테고리
                  </span>
                </label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  className="select select-bordered w-full"
                  disabled={loading}
                >
                  {categories.filter(cat => cat !== '전체').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 가격 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <DollarSign size={18} />
                    가격
                  </span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  required
                  min="0"
                  step="1000"
                  placeholder="예: 950000"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {editFormData.price ? `${parseInt(editFormData.price).toLocaleString()}원` : '가격을 입력하세요'}
                  </span>
                </label>
              </div>

              {/* 상품 설명 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FileText size={18} />
                    상품 설명
                  </span>
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  required
                  rows="4"
                  placeholder="상품 상태, 구매 시기, 사용감 등을 자세히 적어주세요."
                  className="textarea textarea-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 위치 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <MapPin size={18} />
                    거래 위치
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  placeholder="예: 서울시 강남구 역삼동"
                  className="input input-bordered w-full"
                  disabled={loading}
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <ImageIcon size={18} />
                    상품 이미지
                  </span>
                </label>
                <ImageUpload
                  value={editFormData.imageUrl}
                  onChange={(url) => setEditFormData(prev => ({ ...prev, imageUrl: url }))}
                  userId={user?.id}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      수정 중...
                    </>
                  ) : (
                    <>
                      <Edit size={20} />
                      수정 완료
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* 모달 배경 (클릭 시 닫기) */}
          <div className="modal-backdrop" onClick={handleCloseEditModal}></div>
        </div>
      )}

      {/* 스크롤바 숨기기 스타일 */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}