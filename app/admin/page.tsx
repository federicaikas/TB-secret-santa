"use client";

import { useEffect, useState } from "react";
import AuthGate, { useProfile } from "@/components/AuthGate";
import { supabase } from "@/lib/supabase";

type User = { id: string; nickname: string; blocked: boolean };

const KEYS = ["budget", "event_text"] as const;

function Admin() {
  const { profile } = useProfile();
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const [u, d] = await Promise.all([supabase.rpc("admin_users"), supabase.rpc("matching_done")]);
    setUsers(u.data ?? []);
    setDone(!!d.data);
    const vals = await Promise.all(KEYS.map((k) => supabase.rpc("admin_get_setting", { p_key: k })));
    setSettings(Object.fromEntries(KEYS.map((k, i) => [k, vals[i].data ?? ""])));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (profile.is_admin) load(); }, []);

  if (!profile.is_admin) return <p>Pagina riservata all&apos;organizzatrice.</p>;

  async function saveSetting(key: string, value: string) {
    const { error } = await supabase.rpc("admin_set_setting", { p_key: key, p_value: value });
    setMsg(error ? `Errore: ${error.message}` : "Salvato!");
    load();
  }

  async function rename(u: User) {
    const nick = prompt("Nuovo nome", u.nickname)?.trim();
    if (!nick || nick === u.nickname) return;
    const { error } = await supabase.rpc("admin_set_nickname", { p_user: u.id, p_nick: nick });
    setMsg(error ? "Nome non valido o già preso." : "Nome cambiato.");
    load();
  }

  async function resetPassword(u: User) {
    if (!confirm(`Generare una nuova password per ${u.nickname}?`)) return;
    const { data, error } = await supabase.rpc("admin_reset_password", { p_user: u.id });
    setMsg(error ? `Errore: ${error.message}` : `Nuova password per ${u.nickname}: ${data}`);
  }

  async function runMatching() {
    const ok = confirm(done
      ? "Gli abbinamenti ci sono già: rifarli CANCELLA i vecchi e tutti avranno un nuovo abbinato. Continuare?"
      : `Avviare l'abbinamento per ${users.filter((u) => !u.blocked).length} partecipanti? Da quel momento le iscrizioni si chiudono.`);
    if (!ok) return;
    const { data, error } = await supabase.rpc("admin_run_matching");
    setMsg(error ? `Errore: ${error.message}` : `Fatto! ${data} persone abbinate. Ognuno può grattare il suo biglietto.`);
    load();
  }

  return (
    <>
      <h1 className="ribbon">Admin</h1>
      {msg && <p className="note">{msg}</p>}

      <div className="card stack">
        <h2>Abbinamento</h2>
        <p style={{ margin: 0 }}>{done ? "✅ Abbinamenti già fatti." : "Non ancora avviato."} Iscritti: {users.length}</p>
        <button className="btn" onClick={runMatching}>{done ? "Rifai l'abbinamento" : "Avvia l'abbinamento"}</button>
      </div>

      <div className="card stack">
        <h2>Testi</h2>
        <label className="stack">Budget
          <input defaultValue={settings.budget} key={`b${settings.budget}`} onBlur={(e) => e.target.value !== settings.budget && saveSetting("budget", e.target.value)} />
        </label>
        <label className="stack">Quando si scambiano i regali (frase completa)
          <input defaultValue={settings.event_text} key={`e${settings.event_text}`} onBlur={(e) => e.target.value !== settings.event_text && saveSetting("event_text", e.target.value)} />
        </label>
      </div>

      <div className="card stack">
        <h2>Iscritti ({users.length})</h2>
        {users.map((u) => (
          <div key={u.id} className="admin-user">
            <b>{u.nickname}</b> {u.blocked && "🔒"}
            <div className="chips">
              <button className="chip" onClick={() => rename(u)}>Nome</button>
              <button className="chip" onClick={() => supabase.rpc("admin_set_blocked", { p_user: u.id, p_blocked: !u.blocked }).then(load)}>{u.blocked ? "Sblocca" : "Blocca"}</button>
              <button className="chip" onClick={() => resetPassword(u)}>Reset password</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Page() {
  return <AuthGate><Admin /></AuthGate>;
}
