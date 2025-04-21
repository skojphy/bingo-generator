import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.VITE_NOTION_TOKEN });
const databaseId = process.env.VITE_DATABASE_ID;

export { notion, databaseId };
