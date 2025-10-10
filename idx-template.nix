# No user-configurable parameters
{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
  ];
  # Shell script that produces the final environment
  bootstrap = ''
    # Copy the folder containing the `idx-template` files to the final
    # project folder for the new workspace. ${./.} inserts the directory
    # of the checked-out Git folder containing this template.
    cp -rf ${./.} "$out"

    # Set some permissions
    chmod -R +w "$out"

    # Remove the template files themselves and any connection to the template's
    # Git repository
    rm -rf "$out/.git" "$out/idx-template".{nix,json}

    # Add required .env.local file
    echo "Your desired text here" > filename.txt

    echo "Your desired text here" > .env
  '';
}