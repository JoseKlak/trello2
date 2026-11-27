export class CloudBoard {
  constructor(client) { this.client = client; this.revision = 0; }
  async read() {
    const { data, error } = await this.client.from('demandas_boards').select('document,revision').maybeSingle();
    if (error) throw error;
    return data;
  }
  async load() {
    const data = await this.read();
    this.revision = data?.revision ?? 0;
    return data?.document ?? null;
  }
  async save(document) {
    const { data, error } = await this.client.rpc('save_demandas_board', {
      expected_revision: this.revision, new_document: document
    });
    if (error) {
      if (error.code === '40001') throw new Error('CONFLICT');
      throw error;
    }
    this.revision = data;
  }
  async changed() {
    const { data, error } = await this.client.from('demandas_boards').select('revision').maybeSingle();
    if (error) throw error;
    return (data?.revision ?? 0) !== this.revision;
  }
}
export async function connectCloud(config) {
  if (!config.url || !config.publishableKey) return null;
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)) throw new Error('URL do Supabase inválida.');
  if (!globalThis.supabase) await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/dist/umd/supabase.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Não foi possível carregar o acesso à conta. Confira a conexão.'));
    document.head.append(script);
  });
  let storage;try{storage=globalThis.localStorage}catch{}
  const session = new DaySessionStorage(storage);
  const client = globalThis.supabase.createClient(config.url, config.publishableKey, {
    auth: { storage:session, storageKey:session.key, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  return { client, board: new CloudBoard(client), session };
}
import{DaySessionStorage}from'./session-storage.js?v=1.12.0';
