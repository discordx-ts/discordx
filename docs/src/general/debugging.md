# Use the VSCode debugger to debug your bot

1. Create the `.vscode/launch.json` file at your project root directory if the file do not already exists
2. Install ts-node as a dev dependency

   ```
   npm i -D ts-node
   ```

3. Copy paste this into your `launch.json` file

   ```json
   {
     // Use IntelliSense to learn about possible attributes.
     // Hover to view descriptions of existing attributes.
     // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug bot",
         "protocol": "inspector",
         "args": ["${workspaceRoot}/PATH_TO_YOUR_MAIN.ts"],
         "cwd": "${workspaceRoot}",
         "runtimeArgs": ["-r", "ts-node/register/transpile-only"],
         "internalConsoleOptions": "neverOpen"
       }
     ]
   }
   ```

4. You can now put some breakpoints, go to the debug tab in VSCode and launch your bot
