set -e # Exit immediately if a command exits with a non-zero status.


cd ../
# Export NODE_ENV as production for the entire script
export NODE_ENV=production
yarn build:prod
cd ./server_extension

if [ -d "./vizly_notebook/static" ]; then
    rm -r ./vizly_notebook/static
fi

if [ ! -d "./vizly_notebook/static" ]; then
    mkdir -p ./vizly_notebook/static
fi

# Move files from ./out to server_extension/vizly-notebook/static
cp -r ../out/* ./vizly_notebook/static/

# Remove existing dist and build directories if they exist
if [ -d "./dist" ]; then
    rm -r ./dist
fi

if [ -d "./build" ]; then
    rm -r ./build
fi

# Function to perform sed operation compatible with both GNU and BSD sed
function safe_sed() {
    local file=$1
    local pattern=$2
    if sed --version 2>&1 | grep -q GNU; then
        # GNU sed
        sed -i "$pattern" "$file"
    else
        # BSD sed
        sed -i '' "$pattern" "$file"
    fi
}

export -f safe_sed

# Open vizly_notebook/static/index.html and replace src="/vizly-notebook with src=".
safe_sed "./vizly_notebook/static/index.html" 's|src="/_next|src="./_next|g'
safe_sed "./vizly_notebook/static/index.html" 's|href="/_next|href="./_next|g'

# Open vizly_notebook/static/_next/static/css/*.css and replace url(_next/static/media with url(../media
find ./vizly_notebook/static/_next/static/css -name "*.css" -type f -exec bash -c 'safe_sed "$0" "s|url(/_next/static/media|url(../media|g"' {} \;


# Ensure the MANIFEST.in is utilized during distribution creation
python setup.py sdist bdist_wheel

wheel_file=$(ls dist/*.whl)
scp -i ~/Desktop/Dev/certs/emory-aws.pem $wheel_file ubuntu@10.65.183.188:~/shared/
