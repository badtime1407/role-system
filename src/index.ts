import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

/* =========================
   READ ALL ROLES
========================= */
app.get('/roles', async (c) => {
  const { results } = await c.env.DB
    .prepare("SELECT * FROM roles")
    .all()

  return c.json(results)
})

/* =========================
   READ ONE ROLE
========================= */
app.get('/roles/:id', async (c) => {
  const id = c.req.param('id')

  const result = await c.env.DB
    .prepare("SELECT * FROM roles WHERE id = ?")
    .bind(id)
    .first()

  if (!result) {
    return c.json({ message: "Role not found" }, 404)
  }

  return c.json(result)
})

/* =========================
   CREATE ROLE
========================= */
app.post('/roles', async (c) => {
  const { name } = await c.req.json()

  await c.env.DB
    .prepare("INSERT INTO roles (name) VALUES (?)")
    .bind(name)
    .run()

  return c.json({ message: "Role created successfully" })
})

/* =========================
   UPDATE ROLE
========================= */
app.put('/roles/:id', async (c) => {
  const id = c.req.param('id')
  const { name } = await c.req.json()

  await c.env.DB
    .prepare("UPDATE roles SET name = ? WHERE id = ?")
    .bind(name, id)
    .run()

  return c.json({ message: "Role updated successfully" })
})

/* =========================
   DELETE ROLE
========================= */
app.delete('/roles/:id', async (c) => {
  const id = c.req.param('id')

  await c.env.DB
    .prepare("DELETE FROM roles WHERE id = ?")
    .bind(id)
    .run()

  return c.json({ message: "Role deleted successfully" })
})

export default app