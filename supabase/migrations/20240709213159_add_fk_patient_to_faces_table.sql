ALTER TABLE public.faces
ADD CONSTRAINT fk_patient
FOREIGN KEY (patient_id)
REFERENCES public.patients (id)
ON DELETE CASCADE;