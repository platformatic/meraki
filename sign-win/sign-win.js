exports.default = async function (configuration) {
  const CERTIFICATE_NAME = process.env.WINDOWS_SIGN_CERTIFICATE_NAME
  const TOKEN_PASSWORD = process.env.WINDOWS_SIGN_TOKEN_PASSWORD

  if (!CERTIFICATE_NAME || !TOKEN_PASSWORD) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('Missing environment variable WINDOWS_SIGN_CERTIFICATE_NAME or TOKEN_PASSWORD, NOT signing!')
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    return
  }

  require('child_process').execSync(
    `java -jar ./sign-win/jsign-5.0.jar --keystore hardwareToken.cfg --storepass "${TOKEN_PASSWORD}" --storetype PKCS11 --tsaurl http://timestamp.digicert.com --alias "${CERTIFICATE_NAME}" "${configuration.path}"`,
    {
      stdio: 'inherit'
    }
  )
}
