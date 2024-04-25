with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    jdk11
    gradle
    android-tools
    bun
  ];
}
