import { sql } from "./_db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const event = (req.query.event || "").toString();
      if (!event) return res.status(400).json({ error: "missing event" });
      const rows = await sql`
        select id, name, avail, updated_at
        from responses where event_id = ${event}
        order by updated_at asc`;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const b = req.body || {};
      if (!b.id || !b.event || !b.name || typeof b.avail !== "object" || b.avail === null) {
        return res.status(400).json({ error: "invalid" });
      }
      await sql`
        insert into responses (id, event_id, name, avail, updated_at)
        values (${b.id}, ${b.event}, ${b.name}, ${JSON.stringify(b.avail)}::jsonb, now())
        on conflict (id) do update
          set name = excluded.name, avail = excluded.avail, updated_at = now()`;
      return res.status(200).json({ id: b.id });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
}
