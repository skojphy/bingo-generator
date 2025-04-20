require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');

const app = express();
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// 빙고판 저장 (POST)
app.post('/api/bingo', async (req, res) => {
  const { board, styleConfig } = req.body;
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            { text: { content: 'Bingo Board' } }
          ]
        },
        board: {
          rich_text: [
            { text: { content: JSON.stringify(board) } }
          ]
        },
        ...(styleConfig && {
          styleConfig: {
            rich_text: [
              { text: { content: JSON.stringify(styleConfig) } }
            ]
          }
        })
      }
    });
    // Notion page id를 반환
    res.json({ id: response.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notion 저장 실패' });
  }
});

// 빙고판 조회 (GET)
app.get('/api/bingo/:id', async (req, res) => {
  try {
    const page = await notion.pages.retrieve({ page_id: req.params.id });
    const props = page.properties;
    const board = JSON.parse(props.board.rich_text[0].plain_text);
    const styleConfig = props.styleConfig
      ? JSON.parse(props.styleConfig.rich_text[0].plain_text)
      : null;
    res.json({ board, styleConfig });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: '빙고판을 찾을 수 없습니다.' });
  }
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
