'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, MapPin, Loader2, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [selectedDong, setSelectedDong] = useState('내 동네');
  const [dongList, setDongList] = useState([]);
  const [notificationCount, setNotificationCount] = useState(5);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [user, setUser] = useState(null);
  
  const router = useRouter();

  // 컴포넌트 마운트 시 저장된 위치 정보 불러오기
  useEffect(() => {
    const savedDong = localStorage.getItem('selectedDong');
    const savedDongList = localStorage.getItem('dongList');
    
    if (savedDong) {
      setSelectedDong(savedDong);
    }
    
    if (savedDongList) {
      setDongList(JSON.parse(savedDongList));
    } else {
      // 기본 동 리스트
      setDongList([
        '역삼동',
        '삼성동',
        '대치동',
        '청담동',
        '압구정동',
        '신사동',
        '논현동',
        '개포동'
      ]);
    }
  }, []);

  // 사용자 인증 상태 확인
  useEffect(() => {
    // 현재 사용자 정보 가져오기
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없는 브라우저입니다.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Kakao Map API를 사용한 Reverse Geocoding
        // 실제 사용 시 Kakao API 키 필요
        try {
          const address = await reverseGeocode(latitude, longitude);
          
          if (address) {
            setSelectedDong(address.dong);
            localStorage.setItem('selectedDong', address.dong);
            
            // 주변 동 목록도 업데이트 (실제로는 API로 주변 동 가져오기)
            const nearbyDongs = getNearbyDongs(address.dong);
            setDongList(nearbyDongs);
            localStorage.setItem('dongList', JSON.stringify(nearbyDongs));
          }
        } catch (error) {
          console.error('주소 변환 실패:', error);
          alert('주소를 가져오는데 실패했습니다.');
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Reverse Geocoding (좌표 -> 주소)
  const reverseGeocode = async (lat, lng) => {
    // 1. Kakao Map API 시도
    try {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY) {
        const { coordToAddress } = await import('@/utils/kakaoMap');
        return await coordToAddress(lat, lng);
      }
    } catch (error) {
      console.warn('Kakao Map API 사용 불가:', error);
    }
    
    // 2. OpenStreetMap Nominatim API 사용 (무료, API 키 불필요)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`,
        {
          headers: {
            'User-Agent': 'MyMarketApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Nominatim API 요청 실패');
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        
        // 한국 주소 형식 파싱 개선
        // display_name에서 한국 주소 추출 (예: "신장동, 하남시, 경기도, 대한민국")
        const displayParts = data.display_name.split(',').map(part => part.trim());
        
        // 동 이름 찾기: "동"으로 끝나는 첫 번째 부분
        let dong = displayParts.find(part => part.endsWith('동')) || 
                   address.suburb || address.neighbourhood || address.village || 
                   address.town || address.hamlet || '알 수 없는 동';
        
        // 시/구 이름 찾기
        const gu = address.city || address.county || address.city_district || 
                   displayParts.find(part => part.endsWith('시') || part.endsWith('구')) || '';
        
        const city = address.state || address.province || '';
        
        console.log('위치 정보:', { 
          dong, 
          gu, 
          city, 
          displayName: data.display_name,
          rawAddress: address 
        });
        
        return {
          dong: dong,
          gu: gu,
          city: city,
          fullAddress: data.display_name
        };
      }
    } catch (error) {
      console.error('OpenStreetMap Nominatim API 오류:', error);
    }
    
    // 3. 모든 API 실패 시 기본값
    return {
      dong: '내 동네',
      gu: '',
      city: '',
      fullAddress: '위치를 가져올 수 없습니다'
    };
  };

  // 주변 동 목록 가져오기
  const getNearbyDongs = (currentDong) => {
    // 주변 동 데이터베이스 (확장 가능)
    const dongDatabase = {
      // 서울 강남구
      '역삼동': ['역삼동', '삼성동', '대치동', '청담동', '개포동'],
      '삼성동': ['삼성동', '역삼동', '대치동', '청담동', '신사동'],
      '대치동': ['대치동', '역삼동', '삼성동', '개포동', '도곡동'],
      '청담동': ['청담동', '삼성동', '신사동', '압구정동', '역삼동'],
      '압구정동': ['압구정동', '청담동', '신사동', '논현동', '삼성동'],
      '신사동': ['신사동', '압구정동', '논현동', '청담동', '삼성동'],
      '논현동': ['논현동', '신사동', '압구정동', '역삼동', '서초동'],
      '개포동': ['개포동', '대치동', '역삼동', '일원동', '수서동'],
      
      // 하남시
      '신장동': ['신장동', '덕풍동', '풍산동', '창우동', '하산곡동'],
      '덕풍동': ['덕풍동', '신장동', '풍산동', '춘궁동', '상산곡동'],
      '풍산동': ['풍산동', '신장동', '덕풍동', '창우동', '교산동'],
      '창우동': ['창우동', '풍산동', '신장동', '하산곡동', '춘궁동'],
      '춘궁동': ['춘궁동', '덕풍동', '창우동', '상산곡동', '망월동'],
      '하산곡동': ['하산곡동', '신장동', '창우동', '상산곡동', '초이동'],
      '상산곡동': ['상산곡동', '하산곡동', '덕풍동', '춘궁동', '초이동'],
      '교산동': ['교산동', '풍산동', '창우동', '미사동', '배알미동'],
      '미사동': ['미사동', '교산동', '망월동', '풍산동', '배알미동'],
      '망월동': ['망월동', '미사동', '춘궁동', '초이동', '배알미동'],
      '초이동': ['초이동', '하산곡동', '상산곡동', '망월동', '배알미동'],
      '배알미동': ['배알미동', '교산동', '미사동', '망월동', '초이동']
    };
    
    // 데이터베이스에 있으면 주변 동 반환, 없으면 현재 동만 반환
    return dongDatabase[currentDong] || [currentDong];
  };

  // 동 선택 시 저장
  const handleDongSelect = (dong) => {
    setSelectedDong(dong);
    localStorage.setItem('selectedDong', dong);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-base-300 border-b border-base-300 z-40">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* 왼쪽: 동 선택 드롭다운 */}
          <div className="dropdown">
            <button 
              tabIndex={0} 
              className="btn btn-ghost gap-1 text-lg font-semibold hover:bg-base-200"
            >
              {selectedDong}
              <ChevronDown size={20} strokeWidth={2.5} />
            </button>
            <ul 
              tabIndex={0} 
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-64 p-2 shadow-lg border border-base-300 mt-1"
            >
              {/* 현재 위치로 찾기 버튼 */}
              <li>
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="btn btn-sm btn-primary gap-2 mb-2"
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      위치 찾는 중...
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      현재 위치로 설정
                    </>
                  )}
                </button>
              </li>
              
              <div className="divider my-1"></div>
              
              {/* 동 목록 */}
              {dongList.length > 0 ? (
                dongList.map((dong) => (
                  <li key={dong}>
                    <a
                      onClick={() => handleDongSelect(dong)}
                      className={selectedDong === dong ? 'active' : ''}
                    >
                      {dong}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-center text-base-content/60 py-2">
                  동 목록이 없습니다
                </li>
              )}
            </ul>
          </div>

          {/* 오른쪽: 검색 & 알림 & 사용자 버튼 */}
          <div className="flex items-center gap-2">
            {/* 검색 버튼 */}
            <button className="btn btn-ghost btn-circle hover:bg-base-200">
              <Search size={22} strokeWidth={2} />
            </button>

            {/* 알림 버튼 */}
            <button className="btn btn-ghost btn-circle hover:bg-base-200 relative">
              <Bell size={22} strokeWidth={2} />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 bg-error text-error-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* 사용자 정보 / 로그인 버튼 */}
            {user ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle hover:bg-base-200">
                  <User size={22} strokeWidth={2} />
                </button>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300 mt-3">
                  <li className="menu-title px-4 py-2">
                    <span className="text-xs opacity-60">{user.email}</span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={() => router.push('/mypage')} className="flex items-center gap-2">
                      <User size={16} />
                      나의땅콩
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button 
                onClick={() => {
                  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
                    alert('로그인 기능을 사용하려면 Supabase 설정이 필요합니다!\n\n📖 QUICK_START.md 파일을 참조하세요.');
                    return;
                  }
                  router.push('/auth');
                }}
                className="btn btn-primary btn-sm gap-2"
              >
                <User size={18} />
                로그인/가입
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

