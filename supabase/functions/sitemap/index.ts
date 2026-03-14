import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

const BASE_URL = "https://lmautos.lovable.app";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/catalogo", priority: "0.9", changefreq: "daily" },
  { loc: "/consignacion", priority: "0.7", changefreq: "monthly" },
  { loc: "/servicios", priority: "0.7", changefreq: "monthly" },
  { loc: "/sobre-nosotros", priority: "0.6", changefreq: "monthly" },
  { loc: "/contacto", priority: "0.6", changefreq: "monthly" },
];

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("slug, updated_at")
    .eq("status", "disponible")
    .order("updated_at", { ascending: false });

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  if (vehicles) {
    for (const v of vehicles) {
      const lastmod = v.updated_at ? v.updated_at.split("T")[0] : today;
      xml += `  <url>
    <loc>${BASE_URL}/vehiculo/${v.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, { status: 200, headers: corsHeaders });
});
