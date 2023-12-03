// This is a callback that can be used to sign the executable on Windows.
// See: https://www.electron.build/configuration/win
// We are using this callback instead of the electron-builder built-in mechanism
// because we want to use the DigiCert signing tool to sign the executable.
// See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
exports.default = async function (configuration) {
  const { execa } = await import('execa')
  console.log('@@ Signing for windows', configuration.path)
  const execPath = configuration.path
  const { all, exitCode } = await execa('smctl', [
    'sign',
    '--fingerprint',
    'f5f3e92cc99cc0169228d81ef65ba16ea680fe0a',
    '--input',
    execPath
  ])
  // `smctl` returns exit code 0 even if the signing fails :(. )
  // So we need to check the output for errors.
  // See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
  if (all.includes('FAILED')) {
    console.error('Signing failed:', all, exitCode)
    throw new Error(stdout)
  }
}
