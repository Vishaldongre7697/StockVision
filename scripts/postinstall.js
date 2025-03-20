const fs = require('fs');
const path = require('path');

try {
  // 1. Create react-native-web symlink
  const rnWebTarget = path.resolve('node_modules/react-native-web');
  const rnWebLink = path.resolve('react-native-web.js');
  
  if (!fs.existsSync(rnWebLink)) {
    fs.symlinkSync(rnWebTarget, rnWebLink, 'junction');
    console.log('✓ Created react-native-web symlink');
  }

  // 2. Verify critical React Native dependencies
  const requiredPaths = {
    expoAssetRegistry: path.resolve('node_modules/expo-asset/build/AssetRegistry.js'),
    randomValues: path.resolve('node_modules/react-native-get-random-values'),
    reactNativeWeb: rnWebTarget
  };

  // 3. Check and create fallbacks where needed
  Object.entries(requiredPaths).forEach(([name, path]) => {
    if (!fs.existsSync(path)) {
      console.warn(`⚠️  Missing required path: ${path}`);
      
      // Create essential fallbacks
      if (name === 'expoAssetRegistry') {
        fs.writeFileSync(path, 'module.exports = { getAssetByID: () => null };');
        console.log(`✓ Created fallback ${name}`);
      }
    }
  });

  // 4. Verify Node.js polyfills
  const polyfills = {
    buffer: path.resolve('node_modules/buffer'),
    process: path.resolve('node_modules/process')
  };

  Object.entries(polyfills).forEach(([name, path]) => {
    if (!fs.existsSync(path)) {
      console.error(`❌ Missing required polyfill: ${name}`);
      process.exit(1);
    }
  });

  console.log('✓ Postinstall checks completed successfully');

} catch (error) {
  console.error('\n❌ Postinstall error:', error.message);
  console.log('Recommended fix:');
  console.log('1. Delete node_modules and package-lock.json');
  console.log('2. Run: npm install --force --legacy-peer-deps');
  process.exit(1);
}