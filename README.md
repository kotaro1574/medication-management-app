# medication-management-app

## use

- .env.local を作成する 👩‍💻
- supabase CLI が無ければインストールする(https://supabase.com/docs/guides/cli/getting-started)
- supabase stop --no-backup を実行後に supabase start を実行する。supabase stop --no-backup をしないとエラーになることがある。😭(https://github.com/supabase/cli/issues/1083)
- npm でライブラリをインストールして、プロジェクトを起動する

```bash
brew install supabase/tap/supabase
supabase stop --no-backup
supabase start
npm install
npm run dev
```
