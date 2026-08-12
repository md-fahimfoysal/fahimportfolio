# Simple HTTP Server for Portfolio
$port = 8000
$folder = (Get-Location).Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "🚀 Website Live Server Started!"
Write-Host "📍 Open: http://localhost:$port"
Write-Host "📁 Serving: $folder"
Write-Host "Press Ctrl+C to stop..."

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath
    if ($urlPath -eq "/") { $urlPath = "/index.html" }
    
    $filePath = Join-Path $folder $urlPath.TrimStart("/")
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $content.Length
        
        # Set content type
        if ($filePath -like "*.html") { $response.ContentType = "text/html" }
        elseif ($filePath -like "*.css") { $response.ContentType = "text/css" }
        elseif ($filePath -like "*.js") { $response.ContentType = "application/javascript" }
        elseif ($filePath -like "*.json") { $response.ContentType = "application/json" }
        elseif ($filePath -like "*.png") { $response.ContentType = "image/png" }
        elseif ($filePath -like "*.jpg" -or $filePath -like "*.jpeg") { $response.ContentType = "image/jpeg" }
        elseif ($filePath -like "*.gif") { $response.ContentType = "image/gif" }
        elseif ($filePath -like "*.svg") { $response.ContentType = "image/svg+xml" }
        elseif ($filePath -like "*.xml") { $response.ContentType = "text/xml" }
        
        $response.OutputStream.Write($content, 0, $content.Length)
        $response.StatusCode = 200
    } else {
        $response.StatusCode = 404
        $response.ContentType = "text/html"
        $notFoundContent = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - File Not Found</h1>")
        $response.OutputStream.Write($notFoundContent, 0, $notFoundContent.Length)
    }
    
    $response.OutputStream.Close()
}

$listener.Stop()
