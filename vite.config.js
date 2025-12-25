import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

const saveImagePlugin = () => ({
  name: 'save-image-plugin',
  configureServer(server) {
    server.middlewares.use('/api/save-image', async (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { filename, content } = JSON.parse(body);
            const filePath = path.resolve(__dirname, filename);
            const dir = path.dirname(filePath);

            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            // Remove header "data:image/png;base64,"
            const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');

            fs.writeFile(filePath, buffer, (err) => {
              if (err) {
                console.error('Failed to save image:', err);
                res.statusCode = 500;
                res.end('Error saving image');
              } else {
                console.log('Saved image:', filename);
                res.statusCode = 200;
                res.end('Image saved');
              }
            });
          } catch (e) {
            console.error('Error parsing request:', e);
            res.statusCode = 400;
            res.end('Invalid JSON');
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), saveImagePlugin()],
})
