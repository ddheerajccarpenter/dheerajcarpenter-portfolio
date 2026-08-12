-- ============================================================================
-- Storage buckets — run AFTER schema.sql, BEFORE seed.sql.
--
-- resume  : public-read, admin-write. Holds the single latest PDF.
-- images  : public-read, admin-write. Holds project images and gallery files.
-- ============================================================================

-- Resume bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resume', 'resume', true, 5242880,  -- 5 MB, PDF only
  array['application/pdf']
) on conflict (id) do nothing;

-- Images bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images', 'images', true, 10485760,  -- 10 MB, common image formats
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp']
) on conflict (id) do nothing;

create policy "Resume: public read" on storage.objects
  for select using (bucket_id = 'resume');

create policy "Resume: admin write" on storage.objects
  for all using (bucket_id = 'resume' and public.is_admin())
  with check (bucket_id = 'resume' and public.is_admin());

create policy "Images: public read" on storage.objects
  for select using (bucket_id = 'images');

create policy "Images: admin write" on storage.objects
  for all using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());
