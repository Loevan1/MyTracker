/* =====================================================
   MyTracker — sync.js
   À inclure sur toutes les pages avec :
   <script src="sync.js"></script>
===================================================== */

(function () {
  // ⚙️ Remplace par ton URL Render après déploiement
  // Format : https://mytracker-api.onrender.com/api
  const SYNC_API       = 'https://mytracker-api.onrender.com';
  const SYNC_TOKEN_KEY = 'mytracker_sync_token';
  const SYNC_SERVER_TS = 'mytracker_sync_server_ts';
  const SYNC_KEYS      = [
    'sleep_entries_v2', 'habitData', 'taches', 'tachesFaites',
    'timerLog', 'taskStats', 'XP', 'global', 'mytracker_notes', 'streak_count'
  ];

  let pushTimer    = null;
  let pushDebounce = null;

  function getAllData() {
    const data = {};
    SYNC_KEYS.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) {
        try { data[k] = JSON.parse(v); } catch (e) { data[k] = v; }
      }
    });
    return data;
  }

  async function syncRequest(action, body) {
    const res = await fetch(SYNC_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body })
    });
    return res.json();
  }

  async function syncPush() {
    const token = localStorage.getItem(SYNC_TOKEN_KEY);
    if (!token) return;
    try {
      const r = await syncRequest('push', { token, data: getAllData() });
      if (r.ok && r.updated_at) {
        localStorage.setItem(SYNC_SERVER_TS, r.updated_at);
      } else if (r.error === 'invalid_token') {
        localStorage.removeItem(SYNC_TOKEN_KEY);
        localStorage.removeItem(SYNC_SERVER_TS);
      }
    } catch (e) { /* silencieux */ }
  }

  async function syncPull() {
    const token = localStorage.getItem(SYNC_TOKEN_KEY);
    if (!token) return;
    try {
      const r = await syncRequest('pull', { token });
      if (!r.ok) {
        if (r.error !== 'invalid_token') syncPush();
        return;
      }
      const serverTs = r.updated_at ? new Date(r.updated_at).toISOString() : null;
      const knownTs  = localStorage.getItem(SYNC_SERVER_TS) || null;

      if (serverTs && (!knownTs || serverTs > knownTs)) {
        const d = r.data || {};
        Object.keys(d).forEach(k => {
          if (SYNC_KEYS.includes(k)) {
            localStorage.setItem(k, typeof d[k] === 'string' ? d[k] : JSON.stringify(d[k]));
          }
        });
        localStorage.setItem(SYNC_SERVER_TS, serverTs);
        window.location.replace(window.location.href);
      } else {
        syncPush();
      }
    } catch (e) { /* silencieux */ }
  }

  /* Intercepte localStorage.setItem pour push automatique */
  const _setItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    _setItem(key, value);
    if (SYNC_KEYS.includes(key)) {
      if (pushDebounce) clearTimeout(pushDebounce);
      pushDebounce = setTimeout(syncPush, 1500);
    }
  };

  /* Changements depuis d'autres onglets */
  window.addEventListener('storage', (e) => {
    if (SYNC_KEYS.includes(e.key)) {
      if (pushDebounce) clearTimeout(pushDebounce);
      pushDebounce = setTimeout(syncPush, 1500);
    }
  });

  function init() {
    const token = localStorage.getItem(SYNC_TOKEN_KEY);
    if (!token) return;
    syncPull();
    if (pushTimer) clearInterval(pushTimer);
    pushTimer = setInterval(syncPush, 2 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
