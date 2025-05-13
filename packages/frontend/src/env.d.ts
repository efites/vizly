/// <reference types="node" />

interface ImportMetaEnv {
  readonly PUBLIC_BACKEND_URL: string;
  // другие Vite переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
