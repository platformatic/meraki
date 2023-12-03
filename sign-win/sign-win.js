const exec = util.promisify(require('child_process').exec)

// This is a callback that can be used to sign the executable on Windows.
// See: https://www.electron.build/configuration/win
// We are using this callback instead of the electron-builder built-in mechanism
// because we want to use the DigiCert signing tool to sign the executable.
// See also: https://docs.digicert.com/en/digicert-keylocker/sign-with-digicert-signing-tools/sign-with-smctl.html
exports.default = async function (configuration) {
  console.log('@@ Signing for windows', configuration.path)
  const execPath = configuration.path
  const { stdout, stderr } = await exec(
    `smctl sign --fingerprint "${configuration.fingerprint}" --input "${execPath}"`,
    {
      stdio: 'inherit'
    }
  )
  console.log('@@ stdout', stdout)
  console.log('@@ stderr', stderr)
}
