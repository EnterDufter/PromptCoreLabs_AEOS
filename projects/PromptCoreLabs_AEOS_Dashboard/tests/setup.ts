import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';

function toNodeUint8Array(data: any): Uint8Array {
  if (Buffer.isBuffer(data)) return data;
  if (data && typeof data.byteLength === 'number') {
    if ('buffer' in data && data.buffer) {
      return Uint8Array.from(new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength));
    }
    return Uint8Array.from(new Uint8Array(data));
  }
  return Uint8Array.from(data);
}

const patchedCrypto = {
  getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
  randomUUID: webcrypto.randomUUID.bind(webcrypto),
  subtle: {
    digest: (algo: AlgorithmIdentifier, data: any) => webcrypto.subtle.digest(algo, toNodeUint8Array(data))
  }
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'crypto', {
    value: patchedCrypto,
    configurable: true
  });
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  }
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {}
      },
      configurable: true
    });
  }
}

if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: patchedCrypto,
    configurable: true
  });
}

if (typeof Blob !== 'undefined') {
  Blob.prototype.arrayBuffer = function () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const view = new Uint8Array(reader.result as ArrayBuffer);
        resolve(Uint8Array.from(view).buffer);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(this);
    });
  };

  Blob.prototype.text = async function () {
    const ab = await this.arrayBuffer();
    return new TextDecoder('utf-8').decode(ab);
  };
}
