// 샘플 상품 데이터
export const products = [
  {
    id: 1,
    title: '아이폰 14 Pro 256GB 딥퍼플',
    price: 950000,
    location: '신장동',
    time: '10분 전',
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&h=400&fit=crop',
    status: 'selling', // selling, reserved, sold
    likes: 12,
    chatCount: 5,
    category: '디지털기기'
  },
  {
    id: 2,
    title: 'LG 통돌이 세탁기 12kg',
    price: 150000,
    location: '덕풍동',
    time: '1시간 전',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
    status: 'selling',
    likes: 8,
    chatCount: 3,
    category: '생활가전'
  },
  {
    id: 3,
    title: '까사미아 3인용 소파 (거의 새것)',
    price: 280000,
    location: '풍산동',
    time: '2시간 전',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    status: 'reserved',
    likes: 24,
    chatCount: 15,
    category: '가구/인테리어'
  },
  {
    id: 4,
    title: '다이슨 무선청소기 V11',
    price: 320000,
    location: '신장동',
    time: '3시간 전',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop',
    status: 'selling',
    likes: 18,
    chatCount: 8,
    category: '생활가전'
  },
  {
    id: 5,
    title: '삼성 갤럭시 탭 S8 128GB',
    price: 420000,
    location: '미사동',
    time: '5시간 전',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    status: 'sold',
    likes: 32,
    chatCount: 22,
    category: '디지털기기'
  },
  {
    id: 6,
    title: '나이키 에어맥스 270 (새상품)',
    price: 89000,
    location: '창우동',
    time: '6시간 전',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    status: 'selling',
    likes: 15,
    chatCount: 7,
    category: '남성의류'
  },
  {
    id: 7,
    title: '유아용 원목 책장',
    price: 45000,
    location: '신장동',
    time: '8시간 전',
    image: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=400&h=400&fit=crop',
    status: 'selling',
    likes: 6,
    chatCount: 2,
    category: '유아동'
  },
  {
    id: 8,
    title: '여름 원피스 5종 세트',
    price: 35000,
    location: '덕풍동',
    time: '1일 전',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    status: 'selling',
    likes: 22,
    chatCount: 11,
    category: '여성의류'
  }
];

// 카테고리 목록
export const categories = [
  '전체',
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '생활/주방',
  '유아동',
  '유아도서',
  '여성의류',
  '남성의류'
];

