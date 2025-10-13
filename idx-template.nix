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
    cat > "$out/.env" << EOF
    # Fill in your Firebase project details.
    # You can find these in your Firebase project settings.
    #NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    #NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    #NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    #NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    #NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    #NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    #GEMINI_API_KEY="GEMINIAPIKEY"
    EOF
  '';
}