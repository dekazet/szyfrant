echo Starting Szyfrant deployment
echo Cleaning previous version
rm -rf ./deployment
echo Creating directory
mkdir deployment
echo Copying server scrips
cp ./src/server/*.js ./deployment
echo Creating build directory
mkdir ./deployment/build
echo Copying build files
cp -r ./build/* ./deployment/build/

