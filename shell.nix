{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
 nativeBuildInputs = with pkgs.buildPackages; [ nodejs_20 nodePackages.pnpm ];
}
