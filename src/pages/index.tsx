import { Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./Landing";
import { NotFound } from "./not-found";
import { Pool } from "./dob";
import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = "https://lwmvtiydijytxugorjrd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY";
console.log(SUPABASE_URL);
console.log(SUPABASE_ANON_KEY);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const routes = [
  { path: '/', Page: Landing },
  { path: '/dob', Page: Pool },

  { path: '/*', Page: NotFound }
];

function Routing() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
}

export { Routing };
