-- 外部キー制約の追加
ALTER TABLE public.patients
ADD CONSTRAINT fk_facility
    FOREIGN KEY (facility_id)
    REFERENCES public.facilities(id);

ALTER TABLE public.patients
ADD CONSTRAINT fk_group
    FOREIGN KEY (group_id)
    REFERENCES public.groups(id);