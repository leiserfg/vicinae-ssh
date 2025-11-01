# SSH Extension for Vicinae

This extension allows you to quickly open a remote host via SSH from Vicinae. It provides a command (`ssh`) that launches an SSH session using your preferred terminal executor.

- **SSH Command**: Easily connect to a remote host using SSH.
- **Customizable Executor**: Configure the command used to launch SSH (default: `kitty -1 kitten ssh`).
## Features
- **SSH Command**: Easily connect to a remote host using SSH.
- **Customizable Executor**: Configure the command used to launch SSH (default: `kitty -1 kitten ssh`).
- **SSH Command**: Easily connect to a remote host using SSH.
- **Customizable Executor**: Configure the command used to launch SSH (default: `kitty -1 kitten ssh`).

## Usage
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the extension in development mode:
   ```bash
   npm run dev
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```

## Configuration
You can customize the SSH executor command in the extension preferences. By default, it uses `kitty -1 kitten ssh`, but you can change this to any command that suits your workflow.

## License
MIT

