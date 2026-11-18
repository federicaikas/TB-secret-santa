# TB Secret Santa

Sito per il Babbo Natale segreto dei dipendenti TeleBoario (max ~30 persone). Si registrano con nome + password, l'organizzatrice (admin) avvia l'abbinamento, ognuno gratta il suo biglietto e scopre a chi fare il regalo. Tono sempre allegro.

## Regole di lavoro
- Soluzione piu semplice, niente over-engineering, risposte brevi.
- Stile, font (Amore Christmas, fallback Caveat Brush + Fredoka), palette, animazioni ed elfo restano quelli di 24 Elf Games.

## Stack
Next.js (App Router, TypeScript) su Vercel + Supabase (progetto "tb-secret-santa", ref ieanonobnoyxgqkwruhv). Variabili in `.env.example` (copiate in `.env.local`).

## Flusso
- Registrazione: solo nome + password (min 6). Nessuna email vera: `emailFor(nome)` in `lib/supabase.ts` crea un indirizzo interno `@tbsanta.app`. Avatar elfo assegnato a caso (modificabile da Profilo). Richiede "Confirm email" DISATTIVATO in Supabase > Authentication > Providers > Email.
- Home: regole (budget e frase "quando si scambiano" editabili da admin), elenco partecipanti.
- Pescata (`/pescata`): gratta e vinci col nome da regalare, visibile dopo l'abbinamento.
- Admin: avvia/rifai abbinamento, testi, rinomina, blocca, reset password (genera una password nuova e la mostra).
- Password dimenticata: la reimposta l'admin.

## Database
Tabelle `profiles`, `settings` (budget, event_text), `assignments` (nessuna policy: si legge solo con `get_my_assignment()`).
RPC: `is_admin`, `matching_done`, `list_participants`, `get_my_assignment`, `admin_users`, `admin_set_blocked`, `admin_set_nickname`, `admin_get_setting`, `admin_set_setting`, `admin_reset_password`, `admin_run_matching` (un solo cerchio casuale, nessuno pesca se stesso, minimo 3 persone).
Trigger su `auth.users`: crea il profilo e blocca le nuove iscrizioni dopo l'abbinamento.
Per rendere admin una persona: `update public.profiles set is_admin = true where lower(nickname) = lower('Nome');`
