exports.default = async function (configuration) {
  console.log('@@ CONFIGURATION @@', configuration)

  // require('child_process').execSync(
  //   `java -jar ./sign-win/jsign-5.0.jar --keystore hardwareToken.cfg --storepass "${TOKEN_PASSWORD}" --storetype PKCS11 --tsaurl http://timestamp.digicert.com --alias "${CERTIFICATE_NAME}" "${configuration.path}"`,
  //   {
  //     stdio: 'inherit'
  //   }
  // )
}
