with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    jdk20
    maven
  ];
}
