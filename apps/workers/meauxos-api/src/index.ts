/**
 * MeauxOS Analytics API
 * Serves real-time analytics from D1 database
 */

interface Env {
  DB: D1Database;
  R2_INFRA: R2Bucket;
  R2_DOCS: R2Bucket;
  R2_IMAGES: R2Bucket;
  CORS_ORIGIN: string;
  CF_IMAGES_TOKEN?: string; // Optional: Cloudflare Images API token
  CF_ACCOUNT_ID?: string;   // Account ID for CF Images
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Filename, X-Folder',
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

      // Document Management API
      if (path === '/api/docs/list' || path.startsWith('/api/docs/list/')) {
        const folder = path.replace('/api/docs/list', '').replace(/^\//, '') || '';
        return await listDocuments(env, folder);
      }
      if (path === '/api/docs/upload' && request.method === 'POST') {
        return await uploadDocument(env, request);
      }
      if (path.startsWith('/api/docs/download/')) {
        const key = path.replace('/api/docs/download/', '');
        return await downloadDocument(env, key);
      }
      if (path.startsWith('/api/docs/delete/') && request.method === 'DELETE') {
        const key = path.replace('/api/docs/delete/', '');
        return await deleteDocument(env, key);
      }
      if (path === '/api/docs/folder' && request.method === 'POST') {
        return await createFolder(env, request);
      }

      // Photo Management API
      if (path === '/api/photos/list') {
        return await listPhotos(env, url);
      }
      if (path === '/api/photos/scan') {
        return await scanPhotos(env);
      }
      if (path.startsWith('/api/photos/image/')) {
        const key = decodeURIComponent(path.replace('/api/photos/image/', ''));
        return await getPhoto(env, key);
      }
      if (path === '/api/photos/meta' && request.method === 'POST') {
        return await updatePhotoMeta(env, request);
      }
      if (path === '/api/photos/duplicates') {
        return await findDuplicates(env);
      }
      if (path === '/api/photos/stats') {
        return await getPhotoStats(env);
      }
      if (path.startsWith('/api/photos/delete/') && request.method === 'DELETE') {
        const key = decodeURIComponent(path.replace('/api/photos/delete/', ''));
        return await deletePhoto(env, key);
      }

      // Cloudflare Images API
      if (path === '/api/cf-images/list') {
        return await listCFImages(env, url);
      }
      if (path === '/api/cf-images/stats') {
        return await getCFImagesStats(env);
      }
      if (path.startsWith('/api/cf-images/delete/') && request.method === 'DELETE') {
        const imageId = path.replace('/api/cf-images/delete/', '');
        return await deleteCFImage(env, imageId);
      }
      if (path === '/api/cf-images/meta' && request.method === 'POST') {
        return await updateCFImageMeta(env, request);
      }

      // Combined photos (R2 + CF Images)
      if (path === '/api/all-photos/list') {
        return await listAllPhotos(env, url);
      }
      if (path === '/api/all-photos/stats') {
        return await getAllPhotosStats(env);
      }

      return json({ error: 'Not found', endpoints: [
        '/api/analytics/overview',
        '/api/analytics/projects',
        '/api/analytics/deployments', 
        '/api/analytics/costs',
        '/api/analytics/r2',
        '/api/analytics/builds',
        '/api/analytics/timeline',
        '/api/docs/list',
        '/api/docs/upload (POST)',
        '/api/docs/download/:key',
        '/api/docs/delete/:key (DELETE)',
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

// ============================================
// Document Management Functions (R2_DOCS)
// ============================================

interface DocFile {
  key: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  modified: string;
  contentType: string;
  icon: string;
}

function getFileIcon(filename: string, contentType: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    // Documents
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'txt': 'text',
    'md': 'markdown',
    'rtf': 'text',
    // Spreadsheets
    'xls': 'excel',
    'xlsx': 'excel',
    'csv': 'csv',
    // Presentations
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    // Images
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    'webp': 'image',
    // Code
    'js': 'code',
    'ts': 'code',
    'jsx': 'code',
    'tsx': 'code',
    'html': 'code',
    'css': 'code',
    'json': 'json',
    'py': 'code',
    'go': 'code',
    'rs': 'code',
    // Archives
    'zip': 'archive',
    'tar': 'archive',
    'gz': 'archive',
    'rar': 'archive',
    // Video
    'mp4': 'video',
    'mov': 'video',
    'avi': 'video',
    'webm': 'video',
    // Audio
    'mp3': 'audio',
    'wav': 'audio',
    'ogg': 'audio',
    // Design
    'fig': 'figma',
    'sketch': 'sketch',
    'psd': 'photoshop',
    'ai': 'illustrator',
  };
  return iconMap[ext] || 'file';
}

async function listDocuments(env: Env, folder: string): Promise<Response> {
  try {
    const prefix = folder ? `${folder}/` : '';
    const listed = await env.R2_DOCS.list({ prefix, delimiter: '/' });
    
    const files: DocFile[] = [];
    
    // Add folders (commonPrefixes)
    if (listed.delimitedPrefixes) {
      for (const prefix of listed.delimitedPrefixes) {
        const name = prefix.replace(/\/$/, '').split('/').pop() || prefix;
        files.push({
          key: prefix,
          name,
          type: 'folder',
          size: 0,
          modified: '',
          contentType: 'folder',
          icon: 'folder'
        });
      }
    }
    
    // Add files
    for (const obj of listed.objects) {
      // Skip the folder placeholder itself
      if (obj.key.endsWith('/')) continue;
      
      const name = obj.key.split('/').pop() || obj.key;
      files.push({
        key: obj.key,
        name,
        type: 'file',
        size: obj.size,
        modified: obj.uploaded.toISOString(),
        contentType: obj.httpMetadata?.contentType || 'application/octet-stream',
        icon: getFileIcon(name, obj.httpMetadata?.contentType || '')
      });
    }
    
    // Sort: folders first, then by name
    files.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    
    return json({
      folder: folder || '/',
      files,
      total: files.length,
      truncated: listed.truncated
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function uploadDocument(env: Env, request: Request): Promise<Response> {
  try {
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const folder = formData.get('folder') as string || '';
      
      if (!file) {
        return json({ error: 'No file provided' }, 400);
      }
      
      const key = folder ? `${folder}/${file.name}` : file.name;
      const arrayBuffer = await file.arrayBuffer();
      
      await env.R2_DOCS.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'application/octet-stream'
        },
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      });
      
      // Track in D1
      await env.DB.prepare(`
        INSERT OR REPLACE INTO r2_objects (key, bucket_name, size, content_type, uploaded_at)
        VALUES (?, 'meauxos-documents', ?, ?, datetime('now'))
      `).bind(key, file.size, file.type).run();
      
      return json({
        success: true,
        key,
        name: file.name,
        size: file.size,
        contentType: file.type
      });
    } else {
      // Raw body upload
      const filename = request.headers.get('X-Filename') || 'untitled';
      const folder = request.headers.get('X-Folder') || '';
      const key = folder ? `${folder}/${filename}` : filename;
      
      const body = await request.arrayBuffer();
      
      await env.R2_DOCS.put(key, body, {
        httpMetadata: {
          contentType: contentType || 'application/octet-stream'
        }
      });
      
      return json({
        success: true,
        key,
        name: filename,
        size: body.byteLength
      });
    }
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function downloadDocument(env: Env, key: string): Promise<Response> {
  try {
    const object = await env.R2_DOCS.get(decodeURIComponent(key));
    
    if (!object) {
      return json({ error: 'File not found' }, 404);
    }
    
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new Response(object.body, { headers });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function deleteDocument(env: Env, key: string): Promise<Response> {
  try {
    await env.R2_DOCS.delete(decodeURIComponent(key));
    
    // Remove from D1 tracking
    await env.DB.prepare(`
      DELETE FROM r2_objects WHERE key = ? AND bucket_name = 'meauxos-documents'
    `).bind(key).run();
    
    return json({ success: true, deleted: key });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function createFolder(env: Env, request: Request): Promise<Response> {
  try {
    const { name, parent } = await request.json() as { name: string; parent?: string };
    
    if (!name) {
      return json({ error: 'Folder name required' }, 400);
    }
    
    const key = parent ? `${parent}/${name}/` : `${name}/`;
    
    // Create empty object as folder placeholder
    await env.R2_DOCS.put(key, new Uint8Array(0), {
      customMetadata: {
        isFolder: 'true',
        createdAt: new Date().toISOString()
      }
    });
    
    return json({ success: true, folder: key });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

// ============================================
// Photo Management Functions (R2_IMAGES)
// ============================================

interface PhotoItem {
  key: string;
  name: string;
  size: number;
  uploaded: string;
  contentType: string;
  url: string;
  thumbnail?: string;
  tags?: string[];
  title?: string;
  hash?: string;
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'heic'];

async function listPhotos(env: Env, url: URL): Promise<Response> {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const cursor = url.searchParams.get('cursor') || undefined;
    const prefix = url.searchParams.get('prefix') || '';
    const filter = url.searchParams.get('filter') || ''; // tagged, untagged, duplicates
    
    const listed = await env.R2_IMAGES.list({ 
      limit, 
      cursor,
      prefix 
    });
    
    const photos: PhotoItem[] = [];
    
    for (const obj of listed.objects) {
      const ext = obj.key.split('.').pop()?.toLowerCase() || '';
      if (!IMAGE_EXTENSIONS.includes(ext)) continue;
      
      const name = obj.key.split('/').pop() || obj.key;
      
      // Get metadata from D1
      const meta = await env.DB.prepare(
        'SELECT title, alt, tags FROM image_meta WHERE key = ?'
      ).bind(obj.key).first();
      
      photos.push({
        key: obj.key,
        name,
        size: obj.size,
        uploaded: obj.uploaded.toISOString(),
        contentType: obj.httpMetadata?.contentType || 'image/jpeg',
        url: `/api/photos/image/${encodeURIComponent(obj.key)}`,
        tags: meta?.tags ? JSON.parse(meta.tags as string) : [],
        title: meta?.title as string || '',
        hash: obj.checksums?.md5 ? Buffer.from(obj.checksums.md5).toString('hex') : undefined
      });
    }
    
    // Apply filters
    let filtered = photos;
    if (filter === 'untagged') {
      filtered = photos.filter(p => !p.tags || p.tags.length === 0);
    } else if (filter === 'tagged') {
      filtered = photos.filter(p => p.tags && p.tags.length > 0);
    }
    
    return json({
      photos: filtered,
      total: filtered.length,
      cursor: listed.truncated ? listed.cursor : null,
      hasMore: listed.truncated
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function scanPhotos(env: Env): Promise<Response> {
  try {
    let cursor: string | undefined;
    let totalScanned = 0;
    let totalImages = 0;
    const allPhotos: { key: string; size: number; hash?: string }[] = [];
    
    // Scan all objects in bucket
    do {
      const listed = await env.R2_IMAGES.list({ limit: 1000, cursor });
      
      for (const obj of listed.objects) {
        totalScanned++;
        const ext = obj.key.split('.').pop()?.toLowerCase() || '';
        if (IMAGE_EXTENSIONS.includes(ext)) {
          totalImages++;
          allPhotos.push({
            key: obj.key,
            size: obj.size,
            hash: obj.checksums?.md5 ? Buffer.from(obj.checksums.md5).toString('hex') : undefined
          });
        }
      }
      
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    
    // Find duplicates by size (quick heuristic)
    const sizeMap = new Map<number, string[]>();
    for (const photo of allPhotos) {
      const existing = sizeMap.get(photo.size) || [];
      existing.push(photo.key);
      sizeMap.set(photo.size, existing);
    }
    
    const potentialDuplicates: { size: number; files: string[] }[] = [];
    sizeMap.forEach((files, size) => {
      if (files.length > 1) {
        potentialDuplicates.push({ size, files });
      }
    });
    
    // Get folder breakdown
    const folders = new Map<string, number>();
    for (const photo of allPhotos) {
      const folder = photo.key.includes('/') ? photo.key.split('/').slice(0, -1).join('/') : '/';
      folders.set(folder, (folders.get(folder) || 0) + 1);
    }
    
    const folderBreakdown = Array.from(folders.entries())
      .map(([folder, count]) => ({ folder, count }))
      .sort((a, b) => b.count - a.count);
    
    return json({
      totalScanned,
      totalImages,
      potentialDuplicates: potentialDuplicates.length,
      duplicateGroups: potentialDuplicates.slice(0, 50),
      folderBreakdown: folderBreakdown.slice(0, 20),
      totalSize: allPhotos.reduce((sum, p) => sum + p.size, 0)
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function getPhoto(env: Env, key: string): Promise<Response> {
  try {
    const object = await env.R2_IMAGES.get(key);
    
    if (!object) {
      return json({ error: 'Image not found' }, 404);
    }
    
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new Response(object.body, { headers });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function updatePhotoMeta(env: Env, request: Request): Promise<Response> {
  try {
    const { key, title, alt, tags } = await request.json() as {
      key: string;
      title?: string;
      alt?: string;
      tags?: string[];
    };
    
    if (!key) {
      return json({ error: 'Key required' }, 400);
    }
    
    await env.DB.prepare(`
      INSERT OR REPLACE INTO image_meta (key, title, alt, tags, updated_at)
      VALUES (?, ?, ?, ?, strftime('%s', 'now'))
    `).bind(key, title || '', alt || '', JSON.stringify(tags || [])).run();
    
    return json({ success: true, key });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function findDuplicates(env: Env): Promise<Response> {
  try {
    const sizeGroups = new Map<number, { key: string; name: string }[]>();
    let cursor: string | undefined;
    
    do {
      const listed = await env.R2_IMAGES.list({ limit: 1000, cursor });
      
      for (const obj of listed.objects) {
        const ext = obj.key.split('.').pop()?.toLowerCase() || '';
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;
        
        const existing = sizeGroups.get(obj.size) || [];
        existing.push({ 
          key: obj.key, 
          name: obj.key.split('/').pop() || obj.key 
        });
        sizeGroups.set(obj.size, existing);
      }
      
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    
    // Filter to only groups with duplicates
    const duplicates: { size: number; sizeFormatted: string; files: { key: string; name: string }[] }[] = [];
    
    sizeGroups.forEach((files, size) => {
      if (files.length > 1) {
        duplicates.push({
          size,
          sizeFormatted: formatBytes(size),
          files
        });
      }
    });
    
    // Sort by potential space savings (size * count)
    duplicates.sort((a, b) => (b.size * b.files.length) - (a.size * a.files.length));
    
    const potentialSavings = duplicates.reduce((sum, d) => sum + (d.size * (d.files.length - 1)), 0);
    
    return json({
      totalGroups: duplicates.length,
      potentialSavings: formatBytes(potentialSavings),
      potentialSavingsBytes: potentialSavings,
      duplicates: duplicates.slice(0, 100)
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function getPhotoStats(env: Env): Promise<Response> {
  try {
    let totalImages = 0;
    let totalSize = 0;
    const extensions: Record<string, number> = {};
    const months: Record<string, number> = {};
    let cursor: string | undefined;
    
    do {
      const listed = await env.R2_IMAGES.list({ limit: 1000, cursor });
      
      for (const obj of listed.objects) {
        const ext = obj.key.split('.').pop()?.toLowerCase() || '';
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;
        
        totalImages++;
        totalSize += obj.size;
        extensions[ext] = (extensions[ext] || 0) + 1;
        
        const month = obj.uploaded.toISOString().slice(0, 7);
        months[month] = (months[month] || 0) + 1;
      }
      
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    
    // Get tagged count from D1
    const tagged = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM image_meta WHERE tags IS NOT NULL AND tags != "[]"'
    ).first();
    
    return json({
      totalImages,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      taggedCount: tagged?.count || 0,
      untaggedCount: totalImages - (tagged?.count as number || 0),
      byExtension: Object.entries(extensions)
        .map(([ext, count]) => ({ ext, count }))
        .sort((a, b) => b.count - a.count),
      byMonth: Object.entries(months)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.month.localeCompare(a.month))
        .slice(0, 12)
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function deletePhoto(env: Env, key: string): Promise<Response> {
  try {
    await env.R2_IMAGES.delete(key);
    await env.DB.prepare('DELETE FROM image_meta WHERE key = ?').bind(key).run();
    
    return json({ success: true, deleted: key });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

// ============================================
// Cloudflare Images API Functions
// ============================================

const CF_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';

interface CFImage {
  id: string;
  filename: string;
  uploaded: string;
  variants: string[];
  meta?: Record<string, string>;
}

async function callCFImagesAPI(env: Env, endpoint: string, method = 'GET', body?: any): Promise<any> {
  if (!env.CF_IMAGES_TOKEN) {
    throw new Error('CF_IMAGES_TOKEN not configured. Run: wrangler secret put CF_IMAGES_TOKEN');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${env.CF_IMAGES_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'CF Images API error');
  }

  return data.result;
}

async function listCFImages(env: Env, url: URL): Promise<Response> {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '100');

    const result = await callCFImagesAPI(env, `?page=${page}&per_page=${perPage}`);

    const images = result.images.map((img: CFImage) => ({
      id: img.id,
      source: 'cloudflare-images',
      name: img.filename || img.id,
      uploaded: img.uploaded,
      url: img.variants?.[0] || `https://imagedelivery.net/${CF_ACCOUNT_ID}/${img.id}/public`,
      thumbnail: img.variants?.find((v: string) => v.includes('thumbnail')) || img.variants?.[0],
      variants: img.variants,
      tags: img.meta?.tags ? img.meta.tags.split(',') : [],
      title: img.meta?.title || ''
    }));

    return json({
      photos: images,
      total: result.images.length,
      hasMore: result.images.length === perPage
    });
  } catch (error: any) {
    if (error.message.includes('CF_IMAGES_TOKEN')) {
      return json({ 
        error: error.message,
        setup: {
          step1: 'Create API token at https://dash.cloudflare.com/profile/api-tokens',
          step2: 'Permissions: Account > Cloudflare Images > Read',
          step3: 'Run: cd apps/workers/meauxos-api && wrangler secret put CF_IMAGES_TOKEN'
        }
      }, 401);
    }
    return json({ error: error.message }, 500);
  }
}

async function getCFImagesStats(env: Env): Promise<Response> {
  try {
    // Get usage stats
    const statsUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/stats`;
    
    if (!env.CF_IMAGES_TOKEN) {
      return json({ 
        configured: false,
        message: 'CF_IMAGES_TOKEN not set',
        setup: {
          step1: 'Create API token at https://dash.cloudflare.com/profile/api-tokens',
          step2: 'Permissions: Account > Cloudflare Images > Read',
          step3: 'Run: cd apps/workers/meauxos-api && wrangler secret put CF_IMAGES_TOKEN'
        }
      });
    }

    const res = await fetch(statsUrl, {
      headers: {
        'Authorization': `Bearer ${env.CF_IMAGES_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!data.success) {
      return json({ error: data.errors?.[0]?.message }, 500);
    }

    return json({
      configured: true,
      count: data.result.count,
      allowed: data.result.allowed
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function deleteCFImage(env: Env, imageId: string): Promise<Response> {
  try {
    await callCFImagesAPI(env, `/${imageId}`, 'DELETE');
    
    // Also remove from D1 tracking
    await env.DB.prepare('DELETE FROM images_metadata WHERE image_id = ?').bind(imageId).run();

    return json({ success: true, deleted: imageId });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function updateCFImageMeta(env: Env, request: Request): Promise<Response> {
  try {
    const { imageId, title, tags, description } = await request.json() as {
      imageId: string;
      title?: string;
      tags?: string[];
      description?: string;
    };

    // Update in D1
    await env.DB.prepare(`
      INSERT OR REPLACE INTO images_metadata (image_id, filename, description, tags, category, updated_at)
      VALUES (?, '', ?, ?, '', CURRENT_TIMESTAMP)
    `).bind(imageId, description || '', JSON.stringify(tags || [])).run();

    return json({ success: true, imageId });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

// Combined: List from both R2 and CF Images
async function listAllPhotos(env: Env, url: URL): Promise<Response> {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const filter = url.searchParams.get('filter') || '';
    
    const allPhotos: any[] = [];

    // 1. Get R2 images
    try {
      const r2Listed = await env.R2_IMAGES.list({ limit });
      
      for (const obj of r2Listed.objects) {
        const ext = obj.key.split('.').pop()?.toLowerCase() || '';
        if (!IMAGE_EXTENSIONS.includes(ext)) continue;
        
        const meta = await env.DB.prepare(
          'SELECT title, alt, tags FROM image_meta WHERE key = ?'
        ).bind(obj.key).first();
        
        allPhotos.push({
          id: obj.key,
          source: 'r2',
          name: obj.key.split('/').pop() || obj.key,
          size: obj.size,
          uploaded: obj.uploaded.toISOString(),
          url: `/api/photos/image/${encodeURIComponent(obj.key)}`,
          tags: meta?.tags ? JSON.parse(meta.tags as string) : [],
          title: meta?.title as string || ''
        });
      }
    } catch (e) {
      console.error('R2 list error:', e);
    }

    // 2. Get CF Images (if configured)
    if (env.CF_IMAGES_TOKEN) {
      try {
        const cfResult = await callCFImagesAPI(env, `?per_page=${limit}`);
        
        for (const img of cfResult.images) {
          allPhotos.push({
            id: img.id,
            source: 'cloudflare-images',
            name: img.filename || img.id,
            uploaded: img.uploaded,
            url: img.variants?.[0] || `https://imagedelivery.net/${CF_ACCOUNT_ID}/${img.id}/public`,
            thumbnail: img.variants?.find((v: string) => v.includes('thumbnail')) || img.variants?.[0],
            tags: img.meta?.tags ? img.meta.tags.split(',') : [],
            title: img.meta?.title || ''
          });
        }
      } catch (e) {
        console.error('CF Images error:', e);
      }
    }

    // Apply filter
    let filtered = allPhotos;
    if (filter === 'untagged') {
      filtered = allPhotos.filter(p => !p.tags || p.tags.length === 0);
    } else if (filter === 'tagged') {
      filtered = allPhotos.filter(p => p.tags && p.tags.length > 0);
    } else if (filter === 'r2') {
      filtered = allPhotos.filter(p => p.source === 'r2');
    } else if (filter === 'cf-images') {
      filtered = allPhotos.filter(p => p.source === 'cloudflare-images');
    }

    // Sort by upload date
    filtered.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime());

    return json({
      photos: filtered,
      total: filtered.length,
      sources: {
        r2: allPhotos.filter(p => p.source === 'r2').length,
        cfImages: allPhotos.filter(p => p.source === 'cloudflare-images').length
      }
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}

async function getAllPhotosStats(env: Env): Promise<Response> {
  try {
    let r2Stats = { totalImages: 0, totalSize: 0, untaggedCount: 0 };
    let cfStats = { configured: false, count: 0, allowed: 0 };

    // R2 stats
    try {
      let cursor: string | undefined;
      do {
        const listed = await env.R2_IMAGES.list({ limit: 1000, cursor });
        for (const obj of listed.objects) {
          const ext = obj.key.split('.').pop()?.toLowerCase() || '';
          if (IMAGE_EXTENSIONS.includes(ext)) {
            r2Stats.totalImages++;
            r2Stats.totalSize += obj.size;
          }
        }
        cursor = listed.truncated ? listed.cursor : undefined;
      } while (cursor);

      const tagged = await env.DB.prepare(
        'SELECT COUNT(*) as count FROM image_meta WHERE tags IS NOT NULL AND tags != "[]"'
      ).first();
      r2Stats.untaggedCount = r2Stats.totalImages - (tagged?.count as number || 0);
    } catch (e) {
      console.error('R2 stats error:', e);
    }

    // CF Images stats
    if (env.CF_IMAGES_TOKEN) {
      try {
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/stats`,
          {
            headers: {
              'Authorization': `Bearer ${env.CF_IMAGES_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await res.json();
        if (data.success) {
          cfStats = {
            configured: true,
            count: data.result.count?.current || 0,
            allowed: data.result.count?.allowed || 0
          };
        }
      } catch (e) {
        console.error('CF Images stats error:', e);
      }
    }

    return json({
      r2: {
        totalImages: r2Stats.totalImages,
        totalSize: r2Stats.totalSize,
        totalSizeFormatted: formatBytes(r2Stats.totalSize),
        untaggedCount: r2Stats.untaggedCount
      },
      cfImages: cfStats,
      combined: {
        totalImages: r2Stats.totalImages + cfStats.count,
        cfImagesConfigured: cfStats.configured
      }
    });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}
