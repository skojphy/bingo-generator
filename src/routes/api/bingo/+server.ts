import { json, type RequestHandler } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notionToken = import.meta.env.VITE_NOTION_TOKEN;
const databaseId = import.meta.env.VITE_DATABASE_ID;
const notion = new Client({ auth: notionToken });

export const POST: RequestHandler = async ({ request }) => {
	const { board, styleConfig } = await request.json();
	try {
		const response = await notion.pages.create({
			parent: { database_id: databaseId },
			properties: {
				Name: {
					title: [{ text: { content: 'Bingo Board' } }]
				},
				board: {
					rich_text: [{ text: { content: JSON.stringify(board) } }]
				},
				...(styleConfig && {
					styleConfig: {
						rich_text: [{ text: { content: JSON.stringify(styleConfig) } }]
					}
				})
			}
		});
		return json({ id: response.id });
	} catch (err) {
		console.error(err);
		return json({ error: 'Notion 저장 실패' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'id 파라미터 필요' }, { status: 400 });
	try {
		const page = (await notion.pages.retrieve({ page_id: id })) as PageObjectResponse;
		const props = page.properties as any;
		const board =
			props.board && props.board.rich_text.length > 0
				? JSON.parse(props.board.rich_text[0].plain_text)
				: null;
		const styleConfig =
			props.styleConfig && props.styleConfig.rich_text.length > 0
				? JSON.parse(props.styleConfig.rich_text[0].plain_text)
				: null;
		return json({ board, styleConfig });
	} catch (err) {
		console.error(err);
		return json({ error: '빙고판을 찾을 수 없습니다.' }, { status: 404 });
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	const { id, board, styleConfig } = await request.json();
	if (!id) return json({ error: 'id 파라미터 필요' }, { status: 400 });
	try {
		const response = await notion.pages.update({
			page_id: id,
			properties: {
				board: {
					rich_text: [{ text: { content: JSON.stringify(board) } }]
				},
				...(styleConfig && {
					styleConfig: {
						rich_text: [{ text: { content: JSON.stringify(styleConfig) } }]
					}
				})
			}
		});
		return json({ id: response.id });
	} catch (err) {
		console.error(err);
		return json({ error: 'Notion 업데이트 실패' }, { status: 500 });
	}
};
