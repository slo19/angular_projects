import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "my-blog",
  outDir: './dist/static',
  distFolder: './dist/my-blog/browser',
  routes: {
    '/posts/:id': {
      type: 'contentFolder',
      id: {
        folder: "./mdfiles"
      }
    },
  },
  puppeteerLaunchOptions: {args: ['--no-sandbox', '--disable-setuid--sandbox']},
};
