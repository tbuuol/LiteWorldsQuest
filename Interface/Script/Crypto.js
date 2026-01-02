function getEntropy() {
  const entropy = new Uint8Array(16)
  return crypto.getRandomValues(entropy)
}


async function saveEncryptedSeed(coin, seed, password) {
  const Meta = getMeta()

  const encrypted = await encryptAES(Meta[coin], seed, password);
  Meta[coin].Seeds.push(encrypted)

  setMeta(Meta)
}

async function saveEncryptedKey(coin, pkey, password) {
  const Meta = getMeta()
  
  const encrypted = await encryptAES(Meta[coin], pkey, password)
  Meta[coin].Keys.push(encrypted)

  setMeta(Meta)
}

async function loadEncryptedSeed(Meta, password) {
  const array = new Array

  if (Meta.Seeds.length > 0) {
    const encrypted = new Uint8Array(Object.values(Meta.Seeds[0]))
    return await decryptAES(Meta, encrypted, password)
  }
}

async function loadEncryptedKey(Meta, password) {
  const array = new Array

  for (let a = 0; a < Meta.Keys.length; a++) {
    const encrypted = new Uint8Array(Object.values(Meta.Keys[a]))
    const decrypted = await decryptAES(Meta, encrypted, password)
    array.push(decrypted)
  }
  
  return array
}

async function encryptAES(Meta, secret, password) {
  const enc = new TextEncoder()
  //const Meta = getMeta()

  // Passwort → Key ableiten (PBKDF2)
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  //const salt = crypto.getRandomValues(new Uint8Array(16))
  const salt = new Uint8Array(Object.values(Meta.Salt))

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  )

  //const iv = crypto.getRandomValues(new Uint8Array(12));
  const iv = new Uint8Array(Object.values(Meta.IV))

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    aesKey,
    secret
  )

  //return { ciphertext: new Uint8Array(ciphertext), iv, salt };
  return new Uint8Array(ciphertext)
}

async function decryptAES(Meta, ciphertext, password) {
    const enc = new TextEncoder();
    //const Meta = getMeta()
    const salt = new Uint8Array(Object.values(Meta.Salt))
    const iv = new Uint8Array(Object.values(Meta.IV))

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        ciphertext
    );

    return new Uint8Array(decrypted);
}

// async/await, modern und sicher
async function SHA256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);                 // Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', data); // ArrayBuffer
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToUint8Array(hex) {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");

    const bytes = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }

    return bytes;
}

