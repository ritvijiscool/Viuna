import { neon } from "@netlify/neon";

export const config = {
    path: "/api/get-content"
};

export default async (req) => {
    const sql = neon();

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

        // Get slug from query parameters
        const url = new URL(req.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return new Response(
                JSON.stringify({ error: 'Slug parameter is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Query content by slug
        const result = await sql`
      SELECT content, updated_at 
      FROM pages 
      WHERE slug = ${slug}
    `;

        if (result.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Content not found', slug }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                slug,
                content: result[0].content,
                updated_at: result[0].updated_at
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
