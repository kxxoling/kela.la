# Copyright 2023 Star Rail Station
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

Add-Type -AssemblyName System.Web

$ProgressPreference = 'SilentlyContinue'

$game_path = ""

Write-Output "Attempting to locate Warp Url!"

if ($args.Length -eq 0) {
    $app_data = [Environment]::GetFolderPath('ApplicationData')
    $locallow_path = "$app_data\..\LocalLow\miHoYo\$([char]0x5d29)$([char]0x574f)$([char]0xff1a)$([char]0x661f)$([char]0x7a79)$([char]0x94c1)$([char]0x9053)\"

    $log_path = "$locallow_path\Player.log"

    if (-Not [IO.File]::Exists($log_path)) {
        Write-Output "Failed to locate log file!"
        Write-Output "Try using the Global client script?"
        return
    }

    $log_lines = Get-Content $log_path -First 11

    if ([string]::IsNullOrEmpty($log_lines)) {
        $log_path = "$locallow_path\Player-prev.log"

        if (-Not [IO.File]::Exists($log_path)) {
            Write-Output "Failed to locate log file!"
            Write-Output "Try using the Global client script?"
            return
        }

        $log_lines = Get-Content $log_path -First 11
    }

    if ([string]::IsNullOrEmpty($log_lines)) {
        Write-Output "Failed to locate game path! (1)"
        Write-Output "Please contact support at discord.gg/srs"
        return
    }

    $log_lines = $log_lines.split([Environment]::NewLine)

    for ($i = 0; $i -lt 10; $i++) {
        $log_line = $log_lines[$i]

        if ($log_line.startsWith("Loading player data from ")) {
            $game_path = $log_line.replace("Loading player data from ", "").replace("data.unity3d", "")
            break
        }
    }
} else {
    $game_path = $args[0]
}

if ([string]::IsNullOrEmpty($game_path)) {
    Write-Output "Failed to locate game path! (2)"
    Write-Output "Please contact support at discord.gg/srs"
}

$copy_path = [IO.Path]::GetTempPath() + [Guid]::NewGuid().ToString()

$cache_path = "$game_path/webCaches/Cache/Cache_Data/data_2"
$cache_folders = Get-ChildItem "$game_path/webCaches/" -Directory
$max_version = 0

for ($i = 0; $i -le $cache_folders.Length; $i++) {
    $cache_folder = $cache_folders[$i].Name
    if ($cache_folder -match '^\d+\.\d+\.\d+\.\d+$') {
        $version = [int]-join($cache_folder.Split("."))
        if ($version -ge $max_version) {
            $max_version = $version
            $cache_path = "$game_path/webCaches/$cache_folder/Cache/Cache_Data/data_2"
        }
    }
}

Copy-Item -Path $cache_path -Destination $copy_path
$cache_data = Get-Content -Encoding UTF8 -Raw $copy_path
Remove-Item -Path $copy_path

$cache_data_split = $cache_data -split '1/0/'

for ($i = $cache_data_split.Length - 1; $i -ge 0; $i--) {
    $line = $cache_data_split[$i]

    if ($line.StartsWith('http') -and $line.Contains("getGachaLog")) {
        $url = ($line -split "\0")[0]

        $res = Invoke-WebRequest -Uri $url -ContentType "application/json" -UseBasicParsing | ConvertFrom-Json

        if ($res.retcode -eq 0) {
            $uri = [Uri]$url
            $query = [Web.HttpUtility]::ParseQueryString($uri.Query)

            $keys = $query.AllKeys
            foreach ($key in $keys) {
                # Retain required params
                if ($key -eq "authkey") { continue }
                if ($key -eq "authkey_ver") { continue }
                if ($key -eq "sign_type") { continue }
                if ($key -eq "game_biz") { continue }
                if ($key -eq "lang") { continue }

                $query.Remove($key)
            }

            $latest_url = $uri.Scheme + "://" + $uri.Host + $uri.AbsolutePath + "?" + $query.ToString()

            Write-Output "Warp History Url Found!"
            Write-Output $latest_url
            Set-Clipboard -Value $latest_url
            Write-Output "Warp History Url has been saved to clipboard."
            return;
        }
    }
}

Write-Output "Could not locate Warp History Url."
Write-Output "Please make sure to open the Warp history before running the script."
