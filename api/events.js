import { sql } from "./_db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const id = (req.query.id || "").toString();
      if (!id) return res.status(400).json({ error: "missing id" });
      const rows = await sql`
        select id, name, organizer, place, dates, criteria, mode, created_at
        from events where id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: "not found" });
      return res.status(200).json(rows[0]);
    }

    if (req.method === "POST") {
      const b = req.body || {};
      if (!b.id || !b.name || !Array.isArray(b.dates) || !b.dates.length) {
        return res.status(400).json({ error: "invalid" });
      }
      await sql`
        insert into events (id, name, organizer, place, dates, criteria, mode)
        values (
          ${b.id}, ${b.name}, ${b.organizer || null}, ${b.place || null},
          ${JSON.stringify(b.dates)}::jsonb, ${b.criteria || null}, ${b.mode || null}
        )
        on conflict (id) do nothing`;
      return res.status(200).json({ id: b.id });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
}
