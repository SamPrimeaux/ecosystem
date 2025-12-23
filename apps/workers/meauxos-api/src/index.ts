/**
 * MeauxOS Analytics API
 * Serves real-time analytics from D1 database
 */

interface Env {
  DB: D1Database;
  R2_INFRA: R2Bucket;
  CORS_ORIGIN: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handlers
      if (path === '/api/analytics/overview') {
        return await getOverview(env);
      }
      if (path === '/api/analytics/projects') {
        return await getProjects(env, url);
      }
      if (path === '/api/analytics/deployments') {
        return await getDeployments(env, url);
      }
      if (path === '/api/analytics/costs') {
        return await getCosts(env);
      }
      if (path === '/api/analytics/r2') {
        return await getR2Stats(env);
      }
      if (path === '/api/analytics/builds') {
        return await getBuildSessions(env);
      }
      if (path === '/api/analytics/timeline') {
        return await getTimeline(env);
      }
      if (path === '/api/health') {
        return json({ status: 'ok', timestamp: new Date().toISOString() });
      }

      return json({ error: 'Not found', endpoints: [
        '/api/analytics/overview',
        '/api/analytics/projects',
        '/api/analytics/deployments', 
        '/api/analytics/costs',
        '/api/analytics/r2',
        '/api/analytics/builds',
        '/api/analytics/timeline',
        '/api/health'
      ]}, 404);
    } catch (error: any) {
      return json({ error: error.message }, 500);
    }
  },
};

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: corsHeaders,
  });
}

// Get overview stats
async function getOverview(env: Env): Promise<Response> {
  const result = await env.DB.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM cloudflare_projects) as total_projects,
      (SELECT COUNT(*) FROM deployments) as total_deployments,
      (SELECT COUNT(*) FROM r2_buckets) as r2_buckets_tracked,
      (SELECT COUNT(*) FROM r2_objects) as r2_objects,
      (SELECT COALESCE(SUM(total_cost), 0) FROM project_costs) as total_cost,
      (SELECT COALESCE(SUM(total_ai_tokens), 0) FROM project_costs) as total_tokens,
      (SELECT COALESCE(SUM(total_time_seconds), 0) FROM project_costs) as total_time_seconds,
      (SELECT COUNT(*) FROM build_sessions) as build_sessions,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM apps) as total_apps,
      (SELECT COUNT(*) FROM kanban_tasks) as total_tasks,
      (SELECT COUNT(*) FROM github_repos) as github_repos,
      (SELECT COUNT(DISTINCT brand) FROM cloudflare_projects) as total_brands
  `).first();

  // Get projects by type
  const byType = await env.DB.prepare(`
    SELECT type, COUNT(*) as count 
    FROM cloudflare_projects 
    GROUP BY type 
    ORDER BY count DESC
  `).all();

  // Get projects by brand
  const byBrand = await env.DB.prepare(`
    SELECT brand, COUNT(*) as count 
    FROM cloudflare_projects 
    GROUP BY brand 
    ORDER BY count DESC
    LIMIT 10
  `).all();

  // Recent activity
  const recentDeployments = await env.DB.prepare(`
    SELECT project_id, status, created_at, platform
    FROM deployments 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all();

  return json({
    overview: result,
    by_type: byType.results,
    by_brand: byBrand.results,
    recent_deployments: recentDeployments.results,
    generated_at: new Date().toISOString()
  });
}

// Get projects with pagination
async function getProjects(env: Env, url: URL): Promise<Response> {
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const brand = url.searchParams.get('brand');
  const type = url.searchParams.get('type');

  let query = 'SELECT * FROM cloudflare_projects WHERE 1=1';
  const params: any[] = [];

  if (brand) {
    query += ' AND brand = ?';
    params.push(brand);
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' ORDER BY cataloged_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const results = await env.DB.prepare(query).bind(...params).all();
  const total = await env.DB.prepare('SELECT COUNT(*) as count FROM cloudflare_projects').first();

  return json({
    projects: results.results,
    total: total?.count || 0,
    limit,
    offset
  });
}

// Get deployments
async function getDeployments(env: Env, url: URL): Promise<Response> {
  const limit = parseInt(url.searchParams.get('limit') || '20');

  const results = await env.DB.prepare(`
    SELECT 
      id, project_id, platform, status, environment,
      commit_message, branch, deployer, url, preview_url,
      build_time_ms, build_size_bytes, created_at, completed_at
    FROM deployments 
    ORDER BY created_at DESC 
    LIMIT ?
  `).bind(limit).all();

  return json({
    deployments: results.results,
    total: results.results.length
  });
}

// Get cost breakdown
async function getCosts(env: Env): Promise<Response> {
  const costs = await env.DB.prepare(`
    SELECT 
      project_id,
      total_time_seconds,
      total_time_cost,
      total_ai_tokens,
      total_ai_cost,
      total_cost,
      datetime(last_updated, 'unixepoch') as last_updated
    FROM project_costs
    ORDER BY total_cost DESC
  `).all();

  const totals = await env.DB.prepare(`
    SELECT 
      SUM(total_time_seconds) as total_time,
      SUM(total_ai_tokens) as total_tokens,
      SUM(total_cost) as total_cost
    FROM project_costs
  `).first();

  return json({
    costs: costs.results,
    totals,
    currency: 'USD'
  });
}

// Get R2 storage stats
async function getR2Stats(env: Env): Promise<Response> {
  const buckets = await env.DB.prepare(`
    SELECT * FROM r2_buckets ORDER BY created_at DESC
  `).all();

  const objects = await env.DB.prepare(`
    SELECT 
      bucket_name,
      COUNT(*) as object_count,
      SUM(size) as total_size
    FROM r2_objects 
    GROUP BY bucket_name
    ORDER BY total_size DESC
  `).all();

  const recentObjects = await env.DB.prepare(`
    SELECT key, bucket_name, size, content_type, uploaded_at
    FROM r2_objects 
    ORDER BY uploaded_at DESC 
    LIMIT 20
  `).all();

  return json({
    buckets: buckets.results,
    objects_by_bucket: objects.results,
    recent_objects: recentObjects.results,
    total_buckets: buckets.results.length,
    total_objects: objects.results.reduce((sum: number, o: any) => sum + (o.object_count || 0), 0)
  });
}

// Get build sessions
async function getBuildSessions(env: Env): Promise<Response> {
  const sessions = await env.DB.prepare(`
    SELECT * FROM build_sessions 
    ORDER BY started_at DESC 
    LIMIT 50
  `).all();

  return json({
    sessions: sessions.results,
    total: sessions.results.length
  });
}

// Get activity timeline
async function getTimeline(env: Env): Promise<Response> {
  // Combine recent activity from multiple tables
  const deployments = await env.DB.prepare(`
    SELECT 
      'deployment' as type,
      project_id as name,
      status,
      created_at as timestamp
    FROM deployments 
    ORDER BY created_at DESC 
    LIMIT 10
  `).all();

  const builds = await env.DB.prepare(`
    SELECT 
      'build' as type,
      worker_name as name,
      status,
      started_at as timestamp
    FROM build_sessions 
    ORDER BY started_at DESC 
    LIMIT 10
  `).all();

  // Merge and sort
  const timeline = [
    ...deployments.results.map((d: any) => ({ ...d, type: 'deployment' })),
    ...builds.results.map((b: any) => ({ ...b, type: 'build' }))
  ].sort((a: any, b: any) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 20);

  return json({ timeline });
}
