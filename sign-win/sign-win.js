// This is a callback that can be used to sign the executable on Windows.
// See: https://www.electron.build/configuration/win
// We are using this callback instead of the electron-builder built-in mechanism
// because we want to use the DigiCert signing tool to sign the executable.
// See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
exports.default = async function (configuration) {
  const { execa } = await import('execa')
  try {
    console.log('@@ Signing for windows', configuration.path)
    const execPath = configuration.path
    const { stdout, stderr, exitCode } = await execa('smctl', [
      'sign',
      '--fingerprint',
      configuration.fingerprint,
      '--input',
      execPath
    ])
    console.log('@@ stdout', stdout)
    console.log('@@ stderr', stderr)
    console.log('@@ exitCode', exitCode)
  } catch (error) {
    console.error('@@ error catched', error)
    throw error
  }
}
