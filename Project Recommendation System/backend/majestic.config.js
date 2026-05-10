module.exports = {
  // Majestic spawns Jest directly (not via npm test), so we must pass the
  // --experimental-vm-modules Node flag ourselves.  Without it every ESM
  // test suite fails immediately because Node can't load ES modules in Jest.
  env: {
    NODE_OPTIONS: '--experimental-vm-modules',
  },
}
