Write-Verbose -Message 'You can execute this script directly, or call it via "npm run build"'
Write-Output 'Building'
npx vue-cli-service build
Write-Output 'Copying code to ./server/public'
Copy-Item -Path 'dist/*' -Destination 'server/public' -Force -Recurse