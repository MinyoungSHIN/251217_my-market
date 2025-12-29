// Kakao Map API 유틸리티

// Kakao Map 스크립트 로드
export const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    const script = document.createElement('script');
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    
    if (!apiKey) {
      console.warn('Kakao Map API 키가 설정되지 않았습니다.');
      reject(new Error('API 키가 없습니다'));
      return;
    }

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };

    script.onerror = () => {
      reject(new Error('Kakao Map 스크립트 로드 실패'));
    };

    document.head.appendChild(script);
  });
};

// 좌표를 주소로 변환 (Reverse Geocoding)
export const coordToAddress = async (lat, lng) => {
  try {
    await loadKakaoMapScript();
    
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (result[0]) {
            const address = result[0].address;
            resolve({
              dong: address.region_3depth_name || address.region_2depth_name,
              gu: address.region_2depth_name,
              city: address.region_1depth_name,
              fullAddress: address.address_name
            });
          } else {
            reject(new Error('주소를 찾을 수 없습니다'));
          }
        } else {
          reject(new Error('주소 변환 실패'));
        }
      });
    });
  } catch (error) {
    console.error('Kakao Map API 오류:', error);
    throw error;
  }
};

// 주소로 좌표 검색 (Geocoding)
export const addressToCoord = async (address) => {
  try {
    await loadKakaoMapScript();
    
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (result[0]) {
            resolve({
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x)
            });
          } else {
            reject(new Error('좌표를 찾을 수 없습니다'));
          }
        } else {
          reject(new Error('좌표 검색 실패'));
        }
      });
    });
  } catch (error) {
    console.error('Kakao Map API 오류:', error);
    throw error;
  }
};

