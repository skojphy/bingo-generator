import { Client } from '@notionhq/client';

// 환경변수에서 Notion 토큰과 DB ID를 가져옵니다.
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.DATABASE_ID;

export { notion, databaseId };
