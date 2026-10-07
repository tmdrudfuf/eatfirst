// Signs release builds with the Play upload key when these Gradle properties exist
// (put them in ~/.gradle/gradle.properties — never in this repo):
//   EATFIRST_UPLOAD_STORE_FILE, EATFIRST_UPLOAD_STORE_PASSWORD,
//   EATFIRST_UPLOAD_KEY_ALIAS, EATFIRST_UPLOAD_KEY_PASSWORD
// Without them release stays debug-signed, which Play rejects on upload — so it can't ship by accident.
const { withAppBuildGradle } = require('expo/config-plugins');

const UPLOAD_CONFIG = `
        upload {
            if (project.hasProperty('EATFIRST_UPLOAD_STORE_FILE')) {
                storeFile file(EATFIRST_UPLOAD_STORE_FILE)
                storePassword EATFIRST_UPLOAD_STORE_PASSWORD
                keyAlias EATFIRST_UPLOAD_KEY_ALIAS
                keyPassword EATFIRST_UPLOAD_KEY_PASSWORD
            }
        }`;

module.exports = (config) =>
  withAppBuildGradle(config, (c) => {
    let src = c.modResults.contents;
    if (src.includes('EATFIRST_UPLOAD_STORE_FILE')) return c;
    src = src.replace(/signingConfigs \{/, (m) => m + UPLOAD_CONFIG);
    // Only the release buildType's signingConfig line follows the "Caution!" comment in the template.
    src = src.replace(
      /(release \{[^}]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig project.hasProperty('EATFIRST_UPLOAD_STORE_FILE') ? signingConfigs.upload : signingConfigs.debug"
    );
    if (!src.includes('signingConfigs.upload')) throw new Error('withReleaseSigning: build.gradle template changed');
    c.modResults.contents = src;
    return c;
  });
