/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HMS_CHECKOUT_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
