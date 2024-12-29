import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://lwmvtiydijytxugorjrd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY");

function Countries() {
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    getCountries(); 
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data || []);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default Countries;