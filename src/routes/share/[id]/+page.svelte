<script lang="ts">
	import { onMount } from 'svelte';

	let board: string[][] = [];
	let styleConfig: any = {};
	let loading = true;
	let notFound = false;
	let bingoCount = 0;
	let checked: boolean[][] = [];
	let boardTitle = '';
	let createdAt = '';

	function toggleCell(i: number, j: number) {
		checked = checked.map((row: boolean[], rowIdx: number) =>
			rowIdx === i ? row.map((val: boolean, colIdx: number) => (colIdx === j ? !val : val)) : row
		);
		updateBingoCount();
	}

	function updateBingoCount() {
		let count = 0;
		for (let i = 0; i < checked.length; ++i) if (checked[i].every((v: boolean) => v)) count++;
		for (let j = 0; j < (checked[0]?.length || 0); ++j)
			if (checked.every((row: boolean[]) => row[j])) count++;
		if (checked.every((row: boolean[], idx: number) => row[idx])) count++;
		if (checked.every((row: boolean[], idx: number) => row[checked.length - 1 - idx])) count++;
		bingoCount = count;
	}

	onMount(async () => {
		const url = new URL(window.location.href);
		const id = url.pathname.split('/').pop();
		try {
			const res = await fetch(`/api/bingo?id=${id}`);
			const data = await res.json();
			if (data.board) {
				board = data.board;
				styleConfig = data.styleConfig || {};
				boardTitle = data.boardTitle || '';
				createdAt = data.createdAt || '';
				checked = Array.from({ length: board.length }, (_, i) =>
					Array(board[0]?.length || 0).fill(false)
				);
				updateBingoCount();
				loading = false;
			} else {
				notFound = true;
				loading = false;
			}
		} catch (e) {
			notFound = true;
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="loading">빙고판을 불러오는 중...</div>
{:else if notFound}
	<div class="not-found">빙고판을 찾을 수 없습니다.</div>
{:else}
	<div
		class="bingo-shared bingo-shared-spacing"
		style="display: flex; flex-direction: column; align-items: center;"
	>
		{#if boardTitle}
			<h1 class="bingo-title-shared">{boardTitle}</h1>
		{/if}
		<div
			class="board-grid"
			style="width:600px; height:600px; background:{styleConfig.bgColor ||
				'#ffffff'}; font-family:{styleConfig.font || 'sans-serif'}; color:{styleConfig.color ||
				'#222222'}; margin: 0 auto;"
		>
			{#each board as row, i}
				{#each row as cell, j}
					<div
						class="cell-outer"
						on:click={() => toggleCell(i, j)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') toggleCell(i, j);
						}}
						tabindex="0"
						role="button"
						aria-pressed={checked[i][j]}
					>
						<div
							class="cell-content bingo-cell {checked[i][j] ? 'checked' : ''} {cell.length > 24
								? 'shrink2'
								: cell.length > 14
									? 'shrink'
									: ''}"
							style="background:{checked[i][j]
								? (styleConfig.checkedCellColor ?? styleConfig.cellColor ?? '#2f8466')
								: (styleConfig.cellColor ??
									'#b5f4e0')};border:1.5px solid {styleConfig.cellBorderColor ??
								'#222222'};border-style:{styleConfig.borderVisible === false
								? 'none'
								: 'solid'};color:{checked[i][j]
								? (styleConfig.checkedCellTextColor ?? styleConfig.color ?? '#ffffff')
								: (styleConfig.color ?? '#222222')};"
						>
							{cell}
						</div>
					</div>
				{/each}
			{/each}
		</div>
		<div class="bingo-count-shared">완성한 빙고: <strong>{bingoCount}</strong></div>
	</div>
{/if}

<style>
	:global(body),
	:global(html) {
		min-width: 0;
		width: 100%;
		overflow-x: unset;
	}
	.loading,
	.not-found {
		text-align: center;
		font-size: 1.2em;
		padding: 2em 0;
		color: #888;
	}
	.bingo-shared-spacing {
		margin-top: 48px;
	}
	.bingo-count-shared {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 32px auto 32px auto;
		font-size: 1.13em;
		font-weight: 500;
		color: #2d7d2d;
	}
	.bingo-title-shared,
	.bingo-shared-spacing {
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}
	.bingo-title-shared {
		margin: 0 auto 18px auto;
		font-size: 2em;
		font-weight: bold;
		text-align: center;
		background: none;
		border-radius: 0;
		border: none;
		padding: 0.3em 0.8em 0.2em 0.8em;
		margin-bottom: 0.5em;
		color: #232323;
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
		max-width: 900px;
	}
	@media (max-width: 700px) {
		.board-grid {
			width: 92vw !important;
			height: 92vw !important;
			min-width: 340px;
			max-width: 98vw;
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
			max-width: 99vw;
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
	@media (max-width: 700px) {
		html {
			font-size: 15px;
		}
		.bingo-shared-spacing {
			margin-top: 24px;
			margin-bottom: 16px;
			padding-left: 4vw;
			padding-right: 4vw;
		}
		.bingo-title-shared {
			width: 100%;
			font-size: 1.1em;
			padding: 0.4em 0.2em 0.2em 0.2em;
		}
	}
	@media (max-width: 430px) {
		html {
			font-size: 13.5px;
		}
		.bingo-shared-spacing {
			margin-top: 12px;
			margin-bottom: 8px;
			padding-left: 1vw;
			padding-right: 1vw;
		}
		.bingo-title-shared {
			font-size: 1em;
		}
		.bingo-count-shared {
			font-size: 0.97em;
			margin: 16px auto 16px auto;
		}
	}
</style>
