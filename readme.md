# Discord music bot

A fully featured music bot for discord!

### Features:

-   Play any song from a youtube url
-   Play any playlist
-   Skip songs, remove, songs from queue, move songs in queue
-   Each user can select custom prefix
-

## Installation

-   Add a ".env" file that contains the following information, alternatively define the env variables somewhere else
    -   BOT_TOKEN which is the token retrieved after creating your bot in https://discord.com/developers/applications
    -   ENVIRONMENT (optional) possible values DEV, PROD. Changes how logging works.
        -   PROD additionally creates log files in ./logs folder while DEV only logs them in the console
-   Create a config.json file for which you can use the config.example.json file as a starting point. Simply copy it and change the name
-   Download and install ffmpeg
-   Run npm install to install all of the dependencies
-   To start:
    -   In a dev environment run the "npm start" -command or "npm run dev" -command to restart on changes to files
    -   In a production environment you can still use the dev -commands but you can also create the updated and compiled files with "npm run update" and then run those files with "npm run start:production"
