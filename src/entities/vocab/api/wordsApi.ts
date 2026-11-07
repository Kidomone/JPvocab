import type { VocabItem } from '../model/types';
import type { WordDetail } from '../../word';
import { authStorage } from '../../../features/auth';

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessTokenSilently(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return null;

  refreshPromise = (async () => {
    try {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshRes.ok) {
        const authData = await refreshRes.json();
        authStorage.saveAuth(authData);
        return authData.access_token as string;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function authorizedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = authStorage.getAccessToken();
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    const newAccessToken = await refreshAccessTokenSilently();
    if (newAccessToken) {
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      res = await fetch(input, { ...init, headers });
    } else {
      authStorage.clearAuth();
      window.location.href = '/login';
    }
  }

  return res;
}

export async function fetchUserWordsApi(): Promise<VocabItem[]> {
  const res = await authorizedFetch('/api/words/', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch words: ${res.status}`);
  }

  const data = await res.json();
  return (data || []).map((item: any) => ({
    id: item.id,
    word: item.word,
    reading: item.reading || '',
    meaning: item.meaning || '',
    notes: item.notes || '',
  }));
}

export async function addWordApi(word: WordDetail, notes: string = ''): Promise<VocabItem> {
  const res = await authorizedFetch('/api/words/', {
    method: 'POST',
    body: JSON.stringify({
      word: word.word,
      reading: word.reading || '',
      meaning: word.meaning || '',
      notes: notes.trim(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error((errorData && errorData.detail) || `Failed to add word: ${res.status}`);
  }

  const item = await res.json();
  return {
    id: item.id,
    word: item.word,
    reading: item.reading || '',
    meaning: item.meaning || '',
    notes: item.notes || '',
  };
}

export async function addCustomWordApi(data: {
  word: string;
  reading?: string;
  meaning?: string;
  notes?: string;
}): Promise<VocabItem> {
  const res = await authorizedFetch('/api/words/', {
    method: 'POST',
    body: JSON.stringify({
      word: data.word.trim(),
      reading: (data.reading || '').trim(),
      meaning: (data.meaning || '').trim(),
      notes: (data.notes || '').trim(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error((errorData && errorData.detail) || `Failed to add word: ${res.status}`);
  }

  const item = await res.json();
  return {
    id: item.id,
    word: item.word,
    reading: item.reading || '',
    meaning: item.meaning || '',
    notes: item.notes || '',
  };
}

export async function updateWordNotesApi(id: number, notes: string): Promise<VocabItem> {
  const res = await authorizedFetch(`/api/words/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update word notes: ${res.status}`);
  }

  const item = await res.json();
  return {
    id: item.id,
    word: item.word,
    reading: item.reading || '',
    meaning: item.meaning || '',
    notes: item.notes || '',
  };
}

export async function deleteWordApi(id: number): Promise<void> {
  const res = await authorizedFetch(`/api/words/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete word: ${res.status}`);
  }
}
