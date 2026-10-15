/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARTISYS_CHECKOUT_ENABLED?: string;
  readonly VITE_ARTISYS_PAYMENTS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
