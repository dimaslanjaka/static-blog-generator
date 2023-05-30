git ls-tree -r -t -l --full-name HEAD | Where-Object {
 $_ -match '(.+)\s+(.+)\s+(.+)\s+(\d+)\s+(.*)'
 } | ForEach-Object {
 New-Object -Type PSObject -Property @{
     'col1'        = $matches[1]
     'col2'      = $matches[2]
     'col3' = $matches[3]
     'Size'      = [int]$matches[4]
     'path'     = $matches[5]
 }
 } | sort -Property Size -Top 10 -Descending