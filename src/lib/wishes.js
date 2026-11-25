import { invitation } from '../data/invitation';

const cfg = invitation.wishes;

export const wishesConfigured = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);

const headers = () => ({
  apikey: cfg.supabaseAnonKey,
  Authorization: `Bearer ${cfg.supabaseAnonKey}`,
  'Content-Type': 'application/json',
});

/** Fetch approved wishes only (RLS also enforces this server-side). */
export async function fetchApprovedWishes(limit = 12, signal) {
  if (!wishesConfigured) return [];
  const url = `${cfg.supabaseUrl}/rest/v1/${cfg.table}?select=id,name,message,created_at&approved=eq.true&order=created_at.desc&limit=${limit}`;
  const res = await fetch(url, { headers: headers(), signal });
  if (!res.ok) throw new Error(`Failed to load wishes (${res.status})`);
  return res.json();
}

export async function submitWish({ name, message }) {
  if (!wishesConfigured) throw new Error('not-configured');
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/${cfg.table}`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify({ name, message }),
  });
  if (!res.ok) throw new Error(`Failed to save wish (${res.status})`);
}

export function validateWish({ name, message }) {
  const errors = {};
  const n = name.trim();
  const m = message.trim();
  if (n.length < 2) errors.name = 'Please enter your name.';
  else if (n.length > cfg.maxName) errors.name = `Name must be ${cfg.maxName} characters or fewer.`;
  if (m.length < 5) errors.message = 'Please write a few words for the couple.';
  else if (m.length > cfg.maxMessage) errors.message = `Message must be ${cfg.maxMessage} characters or fewer.`;
  return errors;
}
