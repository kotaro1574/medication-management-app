-- 既存のトリガー関数を更新
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- 新しいユーザーのID、userName、belongIdをprofilesテーブルに挿入
  insert into public.profiles (id, name, email, facility_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'userName',  -- JSONデータからuserNameを抽出
    (new.raw_user_meta_data ->> 'facilityId')::uuid   -- JSONデータからbelongIdを抽出
  );
  return new;
end;
$$;
