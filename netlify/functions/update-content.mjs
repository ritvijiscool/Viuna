import { neon } from "@netlify/neon";

export const config = {
    path: "/api/update-content"
};

export default async (req) => {
    const sql = neon();

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            {
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    try {
        // Ensure table exists
        await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        await sql`
      CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)
    `;

        // Parse request body
        const body = await req.json();
        const { slug, content, auth } = body;

        // Validate required fields
        if (!slug || !content) {
            return new Response(
                JSON.stringify({ error: 'Slug and content are required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Basic auth validation (you can enhance this with proper JWT/session)
        // For now, we'll trust that the admin panel handles auth on the client side
        // In production, implement proper server-side authentication

        // Perform UPSERT operation
        const result = await sql`
      INSERT INTO pages (slug, content, updated_at)
      VALUES (${slug}, ${JSON.stringify(content)}, CURRENT_TIMESTAMP)
      ON CONFLICT (slug)
      DO UPDATE SET 
        content = EXCLUDED.content,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, slug, updated_at
    `;

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Content updated successfully',
                data: result[0]
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Database error:', error);
        return new Response(
            JSON.stringify({
                error: 'Database error',
                message: error.message
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};
