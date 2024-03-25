const { spawnSync } = require('child_process')

// This is a callback that can be used to sign the executable on Windows.
// See: https://www.electron.build/configuration/win
// We are using this callback instead of the electron-builder built-in mechanism
// because we want to use the DigiCert signing tool to sign the executable.
// See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
exports.default = async function (configuration) {
  const applySign = process.env.APPLY_WIN_SIGN === 'true'

  if (!applySign) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@ APPLY_WIN_SIGN not set to true, skipping signing in windows')
    return
  }

  console.log('Signing: ', configuration.path)
  const execPath = configuration.path

  const child = spawnSync('smctl', [
    'sign',
    '--fingerprint',
    process.env.DIGICERT_FINGERPRINT,
    '--input',
    execPath
  ], { encoding: 'utf-8' })

  if (child.error) {
    console.error('Signing failed:', child.error)
    throw new Error(child.error)
  }

  console.log(child.stdout)

  // `smctl` returns exit code 0 even if the signing fails :(. )
  // So we need to check the output for errors.
  // See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
  if (child.stdout.includes('FAILED')) {
    console.error('Signing failed:', child.stdout)
    throw new Error(child.stdout)
  }
  console.log('Signed ', configuration.path)
}
