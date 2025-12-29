'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Heart, Package, Edit2, Camera, Mail, Loader2 } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { products } from '@/data/products';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, myItems, likedItems
  const [profile, setProfile] = useState({
    nickname: '',
    avatar_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/auth');
        return;
      }

      setUser(user);
      
      // 프로필 정보 가져오기
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          nickname: profileData.nickname || '',
          avatar_url: profileData.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 업데이트
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nickname: profile.nickname,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert('프로필이 업데이트되었습니다!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 찜한 상품 토글
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

  // 내가 등록한 상품 (임시 - 실제로는 DB에서 가져와야 함)
  const myProducts = products.filter(p => p.id <= 3);
  
  // 찜한 상품 (임시)
  const likedProducts = products.filter(p => likedItems.has(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <div className="max-w-screen-xl mx-auto">
        {/* 프로필 헤더 */}
        <div className="bg-base-100 p-6 border-b border-base-300">
          <div className="flex items-center gap-4">
            {/* 아바타 */}
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-20 h-20">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" />
                ) : (
                  <span className="text-3xl">
                    {profile.nickname ? profile.nickname[0].toUpperCase() : user?.email[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* 사용자 정보 */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.nickname || '사용자'}
              </h2>
              <p className="text-sm text-base-content/60 flex items-center gap-1">
                <Mail size={14} />
                {user?.email}
              </p>
            </div>

            {/* 편집 버튼 */}
            <button
              onClick={() => setActiveTab('profile')}
              className="btn btn-outline btn-sm gap-2"
            >
              <Edit2 size={16} />
              프로필 편집
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-base-100 border-b border-base-300">
          <div className="tabs tabs-boxed bg-transparent p-4 gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`tab tab-lg gap-2 ${activeTab === 'profile' ? 'tab-active' : ''}`}
            >
              <User size={18} />
              프로필
            </button>
            <button
              onClick={() => setActiveTab('myItems')}
              className={`tab tab-lg gap-2 ${activeTab === 'myItems' ? 'tab-active' : ''}`}
            >
              <Package size={18} />
              내 상품
              <span className="badge badge-sm">{myProducts.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('likedItems')}
              className={`tab tab-lg gap-2 ${activeTab === 'likedItems' ? 'tab-active' : ''}`}
            >
              <Heart size={18} />
              찜한 상품
              <span className="badge badge-sm">{likedProducts.length}</span>
            </button>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-4">
          {/* 프로필 편집 */}
          {activeTab === 'profile' && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-4">프로필 설정</h3>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">닉네임</span>
                  </label>
                  <input
                    type="text"
                    value={profile.nickname}
                    onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                    placeholder="닉네임을 입력하세요"
                    className="input input-bordered"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">프로필 이미지 URL</span>
                  </label>
                  <input
                    type="url"
                    value={profile.avatar_url}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="input input-bordered"
                    disabled={!isEditing}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      프로필 이미지 URL을 입력하세요
                    </span>
                  </label>
                </div>

                <div className="card-actions justify-end mt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          checkUser(); // 원래 값으로 복원
                        }}
                        className="btn btn-ghost"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? '저장 중...' : '저장'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary gap-2"
                    >
                      <Edit2 size={18} />
                      수정하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 내 상품 */}
          {activeTab === 'myItems' && (
            <div className="space-y-3">
              {myProducts.length > 0 ? (
                myProducts.map(product => (
                  <ItemCard
                    key={product.id}
                    product={product}
                    isLiked={likedItems.has(product.id)}
                    onToggleLike={toggleLike}
                  />
                ))
              ) : (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body text-center py-16">
                    <Package size={48} className="mx-auto text-base-content/40 mb-4" />
                    <p className="text-lg font-semibold text-base-content/60">
                      등록한 상품이 없습니다
                    </p>
                    <p className="text-sm text-base-content/40">
                      첫 상품을 등록해보세요!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 찜한 상품 */}
          {activeTab === 'likedItems' && (
            <div className="space-y-3">
              {likedProducts.length > 0 ? (
                likedProducts.map(product => (
                  <ItemCard
                    key={product.id}
                    product={product}
                    isLiked={true}
                    onToggleLike={toggleLike}
                  />
                ))
              ) : (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body text-center py-16">
                    <Heart size={48} className="mx-auto text-base-content/40 mb-4" />
                    <p className="text-lg font-semibold text-base-content/60">
                      찜한 상품이 없습니다
                    </p>
                    <p className="text-sm text-base-content/40">
                      마음에 드는 상품을 찜해보세요!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

