-- drugsテーブルにpatient_idの外部キー制約を追加し、patientsテーブルのレコードが削除された際に対応するdrugsテーブルのレコードも自動的に削除されるようにする
ALTER TABLE public.drugs
ADD CONSTRAINT fk_drugs_patient
FOREIGN KEY (patient_id)
REFERENCES public.patients (id)
ON DELETE CASCADE;