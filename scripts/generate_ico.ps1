# ===================================================================
# ⚡ Converte PCL_Logo_Transparente.png em PCL_Logo.ico de alta fidelidade
# ===================================================================

Add-Type -AssemblyName System.Drawing

$sourcePng = "C:\PromptCore_Labs\assets\PCL_Logo_Transparente.png"
$targetIco = "C:\PromptCore_Labs\assets\PCL_Logo.ico"
$sizes = @(256, 128, 64, 48, 32, 16)

if (-not (Test-Path $sourcePng)) {
    Write-Error "Arquivo fonte nao encontrado: $sourcePng"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($sourcePng)
$imagesData = @()

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcImg, 0, 0, $size, $size)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()

    $imagesData += ,@($size, $pngBytes)
}
$srcImg.Dispose()

$fs = [System.IO.File]::Create($targetIco)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONDIR header (6 bytes)
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1 = Icon)
$bw.Write([uint16]$imagesData.Count) # Count

# Header is 6 bytes + (16 bytes * count)
$offset = 6 + (16 * $imagesData.Count)

foreach ($item in $imagesData) {
    $size = $item[0]
    $bytes = $item[1]

    $bWidth = if ($size -ge 256) { 0 } else { [byte]$size }
    $bHeight = if ($size -ge 256) { 0 } else { [byte]$size }

    $bw.Write([byte]$bWidth)
    $bw.Write([byte]$bHeight)
    $bw.Write([byte]0) # bColorCount
    $bw.Write([byte]0) # bReserved
    $bw.Write([uint16]1) # wPlanes
    $bw.Write([uint16]32) # wBitCount
    $bw.Write([uint32]$bytes.Length) # dwBytesInRes
    $bw.Write([uint32]$offset) # dwImageOffset

    $offset += $bytes.Length
}

foreach ($item in $imagesData) {
    $bytes = $item[1]
    $bw.Write($bytes)
}

$bw.Flush()
$bw.Close()
$fs.Close()

Write-Host "[OK] Icone PCL_Logo.ico gerado com sucesso em: $targetIco" -ForegroundColor Green
Write-Host "Tamanho total: $( (Get-Item $targetIco).Length ) bytes" -ForegroundColor Cyan

