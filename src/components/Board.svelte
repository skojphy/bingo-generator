<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import Cell from './Cell.svelte';
	export let rooms: string[] = Array(25).fill('');
	export let styleConfig = {
		color: '#222222',
		bgColor: '#ffffff',
		font: 'sans-serif',
		cellColor: '#fff9f9',
		cellBorderColor: '#bbbbbb',
		borderVisible: true
	};
	// HEX 유효성 보장: undefined/null 방지
	function ensureHex(val: string, fallback: string) {
		if (!val || typeof val !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(val)) return fallback;
		return val;
	}
	$: styleConfig.color = ensureHex(styleConfig.color, '#222222');
	$: styleConfig.bgColor = ensureHex(styleConfig.bgColor, '#ffffff');
	$: styleConfig.cellColor = ensureHex(styleConfig.cellColor, '#fff9f9');
	$: styleConfig.cellBorderColor = ensureHex(styleConfig.cellBorderColor, '#bbbbbb');
	// 5x5 빙고판 2차원 배열로 변환
	$: board = Array.from({ length: 5 }, (_, i) => rooms.slice(i * 5, i * 5 + 5));
	function updateCell(i: number, j: number, value: string) {
		rooms[i * 5 + j] = value;
	}
	const fontOptions = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
	let textareaRefs = Array.from({ length: 5 }, () => Array(5));

	// 공유 기능
	let shareUrl = '';
	let copySuccess = false;

	async function shareBoard() {
		// Notion API에 POST 요청
		const res = await fetch('/api/bingo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ board, styleConfig })
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
		const arr = param.split(',').map(cell => decodeURIComponent(cell));
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

	function toggleCell(i: number, j: number) {
		checked[i][j] = !checked[i][j];
		updateBingoCount();
	}

	function updateBingoCount() {
		let count = 0;
		// 가로
		for (let i = 0; i < 5; ++i) if (checked[i].every(v => v)) count++;
		// 세로
		for (let j = 0; j < 5; ++j) if (checked.every(row => row[j])) count++;
		// 대각선
		if ([0,1,2,3,4].every(k => checked[k][k])) count++;
		if ([0,1,2,3,4].every(k => checked[k][4-k])) count++;
		bingoCount = count;
	}
</script>

{#if false}
  <div class="bingo-shared">
    <div class="bingo-count">완성한 빙고: <strong>{bingoCount}</strong></div>
    <div class="board-grid" style="width:600px; height:600px;">
      {#each sharedBoard as row, i}
        {#each row as cell, j}
          <div class="cell-outer">
            <div
              class="cell-content bingo-cell {checked[i][j] ? 'checked' : ''}"
              on:click={() => toggleCell(i, j)}
              tabindex="0"
              role="button"
              aria-pressed={checked[i][j]}
            >{cell}</div>
          </div>
        {/each}
      {/each}
    </div>
  </div>
{:else}
<div
	class="style-controls-grid"
	style="
    display: grid;
    grid-template-columns: repeat(3, minmax(120px, 1fr));
    grid-template-rows: repeat(2, auto);
    gap: 12px 18px;
    align-items: end;
    margin-bottom: 12px;
    max-width: 600px;
  "
>
	<label
		>글자색
		<ColorPicker bind:hex={styleConfig.color} label="" />
	</label>
	<label
		>배경색
		<ColorPicker bind:hex={styleConfig.bgColor} label="" />
	</label>
	<label
		>셀 배경색
		<ColorPicker bind:hex={styleConfig.cellColor} label="" />
	</label>
	<label
		>셀 테두리색
		<ColorPicker bind:hex={styleConfig.cellBorderColor} label="" />
	</label>
	<label style="font-size: 0.95em;">
		폰트
		<select bind:value={styleConfig.font}>
			{#each fontOptions as font}
				<option value={font}>{font}</option>
			{/each}
		</select>
	</label>
	<label style="font-size: 0.95em; white-space: nowrap;">
		<input type="checkbox" bind:checked={styleConfig.borderVisible} aria-label="셀 테두리 표시" />
		셀 테두리 표시
	</label>
</div>

<!-- 공유 버튼 UI 추가 -->
<div class="share-controls">
  <button class="share-btn" on:click={shareBoard}>
    공유하기
  </button>
  {#if shareUrl}
    <input class="share-url" type="text" readonly value={shareUrl} on:focus={(e) => e.target.select()} />
    <button class="copy-btn" on:click={copyShareUrl}>복사</button>
    {#if copySuccess}
      <span class="copy-success">복사됨!</span>
    {/if}
  {/if}
</div>

<div
	class="board-grid"
	style="width:600px; height:600px; background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color};"
>
	{#each board as row, i}
		{#each row as cell, j}
			<div class="cell-outer" tabindex="0" on:click={() => textareaRefs[i][j].focus()}>
				<textarea
					class="cell-input"
					bind:this={textareaRefs[i][j]}
					bind:value={board[i][j]}
					on:input={(e) => updateCell(i, j, (e.target as HTMLTextAreaElement)?.value || '')}
					maxlength={40}
					placeholder="테마명을 입력하세요"
					rows="3"
					style="background:{styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible
						? 'solid'
						: 'none'};"
				></textarea>
				<div
					class="cell-content"
					style="background:{styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible
						? 'solid'
						: 'none'};"
				>
					{board[i][j] || '테마명을 입력하세요'}
				</div>
			</div>
		{/each}
	{/each}
</div>
{/if}

<style>
	.style-controls-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(120px, 1fr));
		grid-template-rows: repeat(2, auto);
		gap: 12px 18px;
		align-items: end;
		margin-bottom: 12px;
		max-width: 600px;
	}
	.style-controls-grid label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
	}
	.board-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 12px;
		margin: 0 auto;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
		border-radius: 12px;
		padding: 24px;
		z-index: 0;
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
	}
	.cell-outer:focus-within .cell-input,
	.cell-outer:active .cell-input {
		opacity: 1;
		z-index: 1;
	}
	.cell-outer:focus-within .cell-content,
	.cell-outer:active .cell-content {
		opacity: 0;
	}
	.share-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 18px;
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
	.bingo-shared {
		margin-bottom: 18px;
	}
	.bingo-count {
		font-size: 1.13em;
		margin-bottom: 12px;
		font-weight: 500;
		color: #2d7d2d;
	}
	.bingo-cell {
		cursor: pointer;
		user-select: none;
		transition: background 0.18s, color 0.18s;
	}
	.bingo-cell.checked {
		background: #b3e6b3 !important;
		color: #1a4d1a !important;
	}
</style>
