export const DEEPL_LANG: Record<string, string> = {
  en: "EN-US",
  ja: "JA",
  zh: "ZH-HANS",
};

// ── JWT / OAuth2 (Web Crypto — Cloudflare Workers compatible) ─────────────────

function b64url(str: string): string {
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlBuf(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const pemContents = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss:   email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud:   "https://oauth2.googleapis.com/token",
    iat:   now,
    exp:   now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${b64urlBuf(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth2:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
  if (tokenData.error || !tokenData.access_token) {
    throw new Error(`Google OAuth error: ${tokenData.error ?? "no access_token"}`);
  }
  return tokenData.access_token;
}

// ── Sheets REST helpers ───────────────────────────────────────────────────────

export async function sheetsGet(
  token: string,
  sheetId: string,
  range: string
): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
  const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json() as { values?: string[][] };
  return data.values ?? [];
}

async function sheetsBatchUpdate(
  token: string,
  sheetId: string,
  data: { range: string; values: string[][] }[]
): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ valueInputOption: "RAW", data }),
  });
}

// ── DeepL ─────────────────────────────────────────────────────────────────────

export async function translateBatch(
  texts: string[],
  targetLang: string,
  apiKey: string
): Promise<string[]> {
  if (!texts.length) return [];
  const baseUrl = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";

  const res = await fetch(`${baseUrl}/v2/translate`, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text: texts, source_lang: "KO", target_lang: targetLang }),
  });

  const data = await res.json() as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}

// ── resolveDescriptions ───────────────────────────────────────────────────────
// descStartCol: 0-indexed column where KO text sits
// colLetters:   e.g. { en: "C", ja: "D", zh: "E" }

export async function resolveDescriptions(
  rows: string[][],
  locale: string,
  descStartCol: number,
  colLetters: Record<string, string>,
  sheetTab: string,
  token: string,
  sheetId: string,
  deeplKey: string | undefined
): Promise<string[]> {
  const isKo = locale === "ko";
  const localeColOffsets: Record<string, number> = { ko: 0, en: 1, ja: 2, zh: 3 };
  const colOffset      = localeColOffsets[locale] ?? 1;
  const targetColIndex = descStartCol + colOffset;

  const needsTranslation: { rowIndex: number; koText: string }[] = [];

  if (!isKo && deeplKey && DEEPL_LANG[locale]) {
    rows.forEach((row, i) => {
      const koText     = row[descStartCol]?.trim();
      const targetText = row[targetColIndex]?.trim();
      if (koText && !targetText) needsTranslation.push({ rowIndex: i, koText });
    });
  }

  const translationMap: Record<number, string> = {};

  if (needsTranslation.length && deeplKey && DEEPL_LANG[locale] && colLetters[locale]) {
    const translations = await translateBatch(
      needsTranslation.map((n) => n.koText),
      DEEPL_LANG[locale],
      deeplKey
    );

    needsTranslation.forEach(({ rowIndex }, i) => {
      translationMap[rowIndex] = translations[i] ?? "";
    });

    const writeData = needsTranslation.map(({ rowIndex }, i) => ({
      range:  `${sheetTab}!${colLetters[locale]}${rowIndex + 2}`,
      values: [[translations[i] ?? ""]],
    }));

    try {
      await sheetsBatchUpdate(token, sheetId, writeData);
    } catch (e) {
      console.error("Failed to write translations back to sheet:", e);
    }
  }

  return rows.map((row, i) =>
    row[targetColIndex]?.trim() || translationMap[i] || row[descStartCol]?.trim() || ""
  );
}
