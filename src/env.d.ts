interface ImportMetaEnv {
  readonly VITE_NODE_ADDRESS: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_FT_ADDRESS: string;
  readonly VITE_TESTNET_WEBSITE_ADDRESS: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;

  
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
