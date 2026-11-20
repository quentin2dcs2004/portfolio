param([int]$Port = 8080)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "Impossible d'ecouter sur le port $Port : $_"
  exit 1
}
Write-Host "SERVING $root at http://localhost:$Port"
$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
  '.mp4'  = 'video/mp4'
  '.glb'  = 'model/gltf-binary'
  '.gltf' = 'model/gltf+json'
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($rel -eq '/' -or [string]::IsNullOrWhiteSpace($rel)) { $rel = '/index.html' }
    $rel = $rel.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
    $fp = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $fp.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $bytes = [Text.Encoding]::UTF8.GetBytes('Forbidden')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } elseif (-not (Test-Path -LiteralPath $fp -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ext = [IO.Path]::GetExtension($fp).ToLowerInvariant()
      $res.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' })
      $bytes = [IO.File]::ReadAllBytes($fp)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    $res.StatusCode = 500
    $bytes = [Text.Encoding]::UTF8.GetBytes([string]$_)
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } finally {
    $res.OutputStream.Close()
  }
}
