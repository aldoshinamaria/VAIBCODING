/**
 * MA.digital — сервис заявок (Supabase)
 */
(function (global) {
  'use strict';

  var client = null;

  function getConfig() {
    return global.MA_SUPABASE || null;
  }

  function isConfigured() {
    var cfg = getConfig();
    return !!(cfg && cfg.url && cfg.anonKey && cfg.url.indexOf('YOUR_') === -1);
  }

  function getClient() {
    if (client) return client;
    if (!global.supabase || !global.supabase.createClient) {
      throw new Error('Supabase SDK не загружен');
    }
    var cfg = getConfig();
    if (!isConfigured()) {
      throw new Error('Supabase не настроен. Скопируйте supabase.config.example.js → supabase.config.js');
    }
    client = global.supabase.createClient(cfg.url, cfg.anonKey);
    return client;
  }

  function normalizeTelegram(value) {
    var v = String(value || '').trim();
    if (!v) return v;
    if (v.charAt(0) !== '@' && v.indexOf('t.me/') === -1) {
      v = '@' + v.replace(/^@+/, '');
    }
    return v;
  }

  function insertLead(payload) {
    var db = getClient();
    return db.from('leads').insert([
      {
        name: String(payload.name || '').trim(),
        telegram: normalizeTelegram(payload.telegram),
        client_type: String(payload.client_type || '').trim(),
        goal: String(payload.goal || '').trim(),
        current_state: String(payload.current_state || '').trim(),
        urgency: String(payload.urgency || '').trim(),
        recommendation: String(payload.recommendation || '').trim(),
        description: String(payload.description || '').trim() || null,
      },
    ]);
  }

  function fetchLeads() {
    var db = getClient();
    return db
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
  }

  function signIn(email, password) {
    var db = getClient();
    return db.auth.signInWithPassword({ email: email, password: password });
  }

  function signOut() {
    var db = getClient();
    return db.auth.signOut();
  }

  function getSession() {
    var db = getClient();
    return db.auth.getSession();
  }

  function onAuthStateChange(callback) {
    var db = getClient();
    return db.auth.onAuthStateChange(callback);
  }

  global.LeadsService = {
    isConfigured: isConfigured,
    insertLead: insertLead,
    fetchLeads: fetchLeads,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    onAuthStateChange: onAuthStateChange,
    normalizeTelegram: normalizeTelegram,
  };
})(window);
