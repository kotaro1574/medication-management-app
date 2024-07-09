-- まず、列名をpatent_idからpatient_idに変更
ALTER TABLE public.drug_histories
RENAME COLUMN patent_id TO patient_id;

-- 次に、drug_historiesテーブルにpatient_idの外部キー制約を追加し、patientsテーブルのレコードが削除された際に対応するdrug_historiesテーブルのレコードも自動的に削除されるようにする
ALTER TABLE public.drug_histories
ADD CONSTRAINT fk_drug_histories_patient
FOREIGN KEY (patient_id)
REFERENCES public.patients (id)
ON DELETE CASCADE;