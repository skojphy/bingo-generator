<script lang="ts">
	import ThemeStyleControls from './ThemeStyleControls.svelte';
	export let rooms: string[] = Array(25).fill('');
	export let styleConfig = {
		color: '#222222',
		bgColor: '#ffffff',
		font: 'sans-serif',
		cellColor: '#b5f4e0',
		cellBorderColor: '#222222',
		checkedCellColor: '#2f8466',
		checkedCellTextColor: '#ffffff',
		borderVisible: true
	};
	// HEX 유효성 보장: undefined/null 방지
	function ensureHex(val: string, fallback: string) {
		if (!val || typeof val !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(val)) return fallback;
		return val;
	}
	$: styleConfig.color = ensureHex(styleConfig.color, '#222222');
	$: styleConfig.bgColor = ensureHex(styleConfig.bgColor, '#ffffff');
	$: styleConfig.cellColor = ensureHex(styleConfig.cellColor, '#b5f4e0');
	$: styleConfig.cellBorderColor = ensureHex(styleConfig.cellBorderColor, '#222222');
	$: styleConfig.checkedCellColor = ensureHex(styleConfig.checkedCellColor, '#2f8466');
	$: styleConfig.checkedCellTextColor = ensureHex(styleConfig.checkedCellTextColor, '#ffffff');
	// 5x5 빙고판 2차원 배열로 변환
	$: board = Array.from({ length: 5 }, (_, i) => rooms.slice(i * 5, i * 5 + 5));
	function updateCell(i: number, j: number, value: string) {
		rooms[i * 5 + j] = value;
		styleChanged = true; // 텍스트 수정 시에도 적용하기 버튼 활성화
	}
	const fontOptions = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
	let textareaRefs = Array.from({ length: 5 }, () => Array(5));
	let checked = Array.from({ length: 5 }, () => Array(5).fill(false));
	function toggleCell(i: number, j: number) {
		checked[i][j] = !checked[i][j];
	}
	let shareUrl = '';
	let copySuccess = false;
	let bingoCount = 0; // bingoCount 정의 추가 (초기값 0)

	// 제목 상태 추가
	let boardTitle = '';

	async function shareBoard() {
		// Notion API에 POST 요청
		const res = await fetch('/api/bingo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ board, styleConfig, boardTitle, name: boardTitle }) // name도 전달
		});
		const data = await res.json();
		if (data.id) {
			shareUrl = `${window.location.origin}/share/${data.id}`;
		} else {
			alert('공유 실패: ' + (data.error || '알 수 없는 에러'));
		}
	}

	async function copyShareUrl() {
		if (!shareUrl) return;
		try {
			await navigator.clipboard.writeText(shareUrl);
			copySuccess = true;
			setTimeout(() => (copySuccess = false), 1200);
		} catch (e) {
			copySuccess = false;
			alert('복사 실패!');
		}
	}

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	// 공유 모드: /share/{id} 경로 처리 (임시, 실제 구현은 별도 페이지에서)
	// let isShared = false;
	// let sharedBoard: string[][] = [];
	// let checked = Array.from({ length: 5 }, () => Array(5).fill(false));
	// let bingoCount = 0;

	// onMount(async () => {
	// 	const url = new URL(window.location.href);
	// 	const shareId = url.pathname.startsWith('/share/') ? url.pathname.split('/').pop() : null;
	// 	if (shareId) {
	// 		isShared = true;
	// 		try {
	// 			const res = await fetch(`/api/bingo?id=${shareId}`);
	// 			const data = await res.json();
	// 			if (data.board) {
	// 				sharedBoard = data.board;
	// 				checked = Array.from({ length: 5 }, () => Array(5).fill(false));
	// 				updateBingoCount();
	// 			} else {
	// 				alert('빙고판 데이터를 불러올 수 없습니다.');
	// 			}
	// 		} catch (e) {
	// 			alert('빙고판 불러오기 실패!');
	// 		}
	// 	}
	// });

	function decodeBoard(param: string): string[][] {
		const arr = param.split(',').map((cell) => decodeURIComponent(cell));
		const grid = [];
		for (let i = 0; i < 5; ++i) grid.push(arr.slice(i * 5, i * 5 + 5));
		return grid;
	}

	// 기존 boardParam 파싱 로직 주석처리 (URL 파라미터 공유 방식은 더 이상 사용하지 않음)
	// onMount(() => {
	// 	const url = new URL(window.location.href);
	// 	const boardParam = url.searchParams.get('board');
	// 	if (boardParam) {
	// 		isShared = true;
	// 		sharedBoard = decodeBoard(boardParam);
	// 		checked = Array.from({ length: 5 }, () => Array(5).fill(false));
	// 		updateBingoCount();
	// 	}
	// });

	function updateBingoCount() {
		let count = 0;
		// 가로
		for (let i = 0; i < 5; ++i) if (checked[i].every((v) => v)) count++;
		// 세로
		for (let j = 0; j < 5; ++j) if (checked.every((row) => row[j])) count++;
		// 대각선
		if ([0, 1, 2, 3, 4].every((k) => checked[k][k])) count++;
		if ([0, 1, 2, 3, 4].every((k) => checked[k][4 - k])) count++;
		bingoCount = count;
	}

	// 적용하기/공유하기 버튼 상태 관리
	let styleChanged = false;

	function handleStyleChange() {
		styleChanged = true;
	}

	$: styleConfig, handleStyleChange();

	function applyStyle() {
		let id = shareUrl?.split('/').pop();
		if (!id) {
			// 공유된 적이 없으면 새로 생성(POST) 후 PATCH
			fetch('/api/bingo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ board, styleConfig, boardTitle, name: boardTitle })
			}).then(async (res) => {
				const data = await res.json();
				if (data.id) {
					shareUrl = `${window.location.origin}/share/${data.id}`;
					// 바로 PATCH로 동기화
					fetch('/api/bingo', {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ id: data.id, board, styleConfig, boardTitle, name: boardTitle })
					}).then(() => {
						styleChanged = false;
					});
				} else {
					alert('적용 실패: ' + (data.error || '알 수 없는 에러'));
				}
			});
		} else {
			fetch('/api/bingo', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, board, styleConfig, boardTitle, name: boardTitle })
			}).then(async (res) => {
				const data = await res.json();
				if (!res.ok) {
					alert('적용 실패: ' + (data.error || '알 수 없는 에러'));
				} else {
					styleChanged = false;
				}
			});
		}
	}
</script>

<!-- 테마 스타일 커스텀 컴포넌트로 분리 -->
<ThemeStyleControls bind:styleConfig {fontOptions} on:input={handleStyleChange} />

<!-- 빙고판 제목 입력 UI -->
<div class="bingo-title-wrap">
	<input
		class="bingo-title-input"
		type="text"
		placeholder="제목을 입력하세요"
		bind:value={boardTitle}
		maxlength={40}
		on:input={() => styleChanged = true}
	/>
</div>

<!-- 빙고판 영역 -->
<div
	class="board-grid"
	style="width:600px; height:600px; background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color};"
>
	{#each board as row, i}
		{#each row as cell, j}
			<div
				class="cell-outer"
				on:click={() => toggleCell(i, j)}
				on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCell(i, j); }}
				tabindex="0"
				role="button"
				aria-pressed={checked[i][j]}
			>
				<textarea
					class="cell-input"
					bind:this={textareaRefs[i][j]}
					bind:value={board[i][j]}
					on:input={(e) => updateCell(i, j, (e.target as HTMLTextAreaElement)?.value || '')}
					maxlength={40}
					placeholder="테마명을 입력하세요"
					rows="3"
					style="background:{checked[i][j]
						? styleConfig.checkedCellColor
						: styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible
						? 'solid'
						: 'none'};color:{checked[i][j] ? styleConfig.checkedCellTextColor : styleConfig.color};"
				></textarea>
				<div
					class="cell-content {board[i][j]?.length > 24 ? 'shrink2' : board[i][j]?.length > 14 ? 'shrink' : ''}"
					style="background:{checked[i][j]
						? styleConfig.checkedCellColor
						: styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible
						? 'solid'
						: 'none'};color:{checked[i][j] ? styleConfig.checkedCellTextColor : styleConfig.color};"
				>
					{board[i][j] || '테마명을 입력하세요'}
				</div>
			</div>
		{/each}
	{/each}
</div>

<!-- 공유 버튼 UI: 빙고판과 버튼 사이 여백 추가 -->
<div class="share-controls share-controls-bottom">
	<button class="share-btn {styleChanged ? 'apply-btn' : ''}" on:click={styleChanged ? applyStyle : shareBoard}>
		{styleChanged ? '적용하기' : '공유하기'}
	</button>
	{#if shareUrl}
		<input
			class="share-url"
			type="text"
			readonly
			value={shareUrl}
			on:focus={(e) => {
				const target = e.target as HTMLInputElement | null;
				if (target) target.select();
			}}
		/>
		<button class="copy-btn" on:click={copyShareUrl}>복사</button>
		{#if copySuccess}
			<span class="copy-success">복사됨!</span>
		{/if}
	{/if}
</div>

<style>
	:global(body) {
		min-width: 380px;
	}
	.board-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 12px;
		margin: 0 auto;
		margin-left: 5vw;
		margin-right: 5vw;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
		border-radius: 12px;
		padding: 24px;
		z-index: 0;
		min-width: 340px;
	}
	@media (max-width: 700px) {
		.board-grid {
			width: 92vw !important;
			height: 92vw !important;
			min-width: 340px;
			min-height: 0;
			padding: 14px;
			gap: 7px;
			margin-left: 2vw;
			margin-right: 2vw;
		}
	}
	@media (max-width: 430px) {
		.board-grid {
			width: 98vw !important;
			height: 98vw !important;
			min-width: 340px;
			padding: 6px;
			gap: 4px;
			margin-left: 1vw;
			margin-right: 1vw;
		}
	}
	.cell-outer {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
		z-index: 0;
	}
	.cell-input {
		position: absolute;
		opacity: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		font-size: 1.05rem;
		border-radius: 10px;
		text-align: center;
		resize: none;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		overflow-wrap: break-word;
		white-space: pre-line;
	}
	.cell-content {
		z-index: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.05rem;
		text-align: center;
		white-space: pre-line;
		border-radius: 10px;
		box-sizing: border-box;
		pointer-events: none;
		color: inherit;
		background: transparent;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-word;
		line-height: 1.13;
		min-width: 0;
		min-height: 0;
		max-width: 100%;
		max-height: 100%;
		padding: 2px;
	}
	.cell-content.shrink {
		font-size: 0.78em;
	}
	.cell-content.shrink2 {
		font-size: 0.65em;
	}
	@media (max-width: 700px) {
		.cell-content {
			font-size: 0.98rem;
			padding: 1px;
		}
		.cell-content.shrink {
			font-size: 0.7em;
		}
		.cell-content.shrink2 {
			font-size: 0.6em;
		}
	}
	@media (max-width: 430px) {
		.cell-content {
			font-size: 0.86rem;
			padding: 0.5px;
		}
		.cell-content.shrink {
			font-size: 0.62em;
		}
		.cell-content.shrink2 {
			font-size: 0.5em;
		}
	}
	.share-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 18px;
	}
	.share-controls-bottom {
		margin-top: 32px;
		justify-content: center;
	}
	.share-btn {
		padding: 0.5em 1.2em;
		background: #f5f5f5;
		border: 1.5px solid #bbb;
		border-radius: 8px;
		font-size: 1.05rem;
		cursor: pointer;
		transition: background 0.2s;
	}
	.share-btn:hover {
		background: #e0e0e0;
	}
	.apply-btn {
		background: #2f8466;
		color: #fff;
		border: 1.5px solid #2f8466;
		transition: background 0.2s, color 0.2s;
	}
	.apply-btn:hover {
		background: #22624c;
	}
	.share-url {
		width: 320px;
		font-size: 1em;
		padding: 0.3em 0.7em;
		border-radius: 6px;
		border: 1px solid #ccc;
	}
	.copy-btn {
		padding: 0.35em 0.9em;
		font-size: 0.97em;
		border-radius: 6px;
		border: 1px solid #ccc;
		background: #f8f8f8;
		cursor: pointer;
		margin-left: 0.3em;
	}
	.copy-success {
		color: #24c324;
		font-size: 0.97em;
		margin-left: 0.6em;
	}
	.bingo-title-wrap {
		width: 100%;
		min-width: 0;
		margin: 36px auto 18px auto;
		display: flex;
		justify-content: center;
	}
	.bingo-title-input {
		width: 84vw;
		max-width: 520px;
		min-width: 180px;
		font-size: 1.25em;
		font-weight: bold;
		padding: 0.38em 0.7em;
		border-radius: 8px;
		border: 1.5px solid #bbb;
		text-align: center;
		background: #fafafa;
		margin-bottom: 0.5em;
		outline: none;
		transition: border 0.18s, font-size 0.18s;
		box-sizing: border-box;
	}
	.bingo-title-input:focus {
		border: 1.5px solid #4c9cff;
	}
	@media (max-width: 700px) {
		.bingo-title-input {
			width: 92vw;
			max-width: 98vw;
			font-size: 1.08em;
			padding: 0.32em 0.5em;
		}
		.board-grid {
			width: 92vw !important;
			height: 92vw !important;
			min-width: 0;
			min-height: 0;
			padding: 14px;
			gap: 7px;
		}
	}
	@media (max-width: 430px) {
		.bingo-title-input {
			width: 98vw;
			max-width: 99vw;
			font-size: 0.97em;
			padding: 0.25em 0.3em;
		}
		.board-grid {
			width: 98vw !important;
			height: 98vw !important;
			padding: 6px;
			gap: 4px;
		}
	}
</style>
