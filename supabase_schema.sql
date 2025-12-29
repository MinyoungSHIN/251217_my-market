-- 프로필 테이블 생성
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security 활성화
alter table profiles enable row level security;

-- 프로필 정책: 자신의 프로필은 읽기/쓰기 가능
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- 회원가입 시 자동으로 프로필 생성하는 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (new.id, new.email, '');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 상품 테이블 (향후 사용)
create table if not exists items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  price integer not null,
  category text not null,
  location text,
  image_url text,
  status text default 'selling' check (status in ('selling', 'reserved', 'sold')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 상품 테이블 RLS
alter table items enable row level security;

-- 모든 사람이 상품을 볼 수 있음
create policy "Anyone can view items"
  on items for select
  using (true);

-- 로그인한 사용자만 상품 등록 가능
create policy "Authenticated users can insert items"
  on items for insert
  with check (auth.role() = 'authenticated');

-- 자신의 상품만 수정/삭제 가능
create policy "Users can update their own items"
  on items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own items"
  on items for delete
  using (auth.uid() = user_id);

-- 찜하기 테이블
create table if not exists likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id uuid references items on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id)
);

-- 찜하기 테이블 RLS
alter table likes enable row level security;

-- 자신의 찜 목록은 읽기/쓰기 가능
create policy "Users can view their own likes"
  on likes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own likes"
  on likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on likes for delete
  using (auth.uid() = user_id);

