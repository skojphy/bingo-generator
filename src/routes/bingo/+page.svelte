<script>
	import { onMount } from 'svelte';
	import { bingoData, bingoState, bingoCount } from '$lib/stores';
	import html2canvas from 'html2canvas';

	function toggle(index) {
		bingoState.update((state) => {
			state[index] = !state[index];
			updateBingoCount(state);
			return [...state];
		});
	}

	function updateBingoCount(state) {
		let count = 0;
		const grid = [...Array(5)].map((_, i) => state.slice(i * 5, i * 5 + 5));

		for (let i = 0; i < 5; i++) {
			if (grid[i].every(Boolean)) count++; // 가로
			if (grid.map((row) => row[i]).every(Boolean)) count++; // 세로
		}

		if ([0, 6, 12, 18, 24].every((i) => state[i])) count++;
		if ([4, 8, 12, 16, 20].every((i) => state[i])) count++;

		bingoCount.set(count);
	}

	async function saveBingoAsImage() {
		const bingoBoard = document.querySelector('.bingo-grid');
		const canvas = await html2canvas(bingoBoard);
		const link = document.createElement('a');
		link.href = canvas.toDataURL('image/png');
		link.download = 'bingo.png';
		link.click();
	}

	function copyToClipboard() {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			alert('링크가 복사되었습니다!');
		});
	}
</script>

<h1>빙고판</h1>
<p>완성된 빙고 개수: {$bingoCount}</p>

<div class="bingo-grid">
	{#each $bingoData as item, index}
		<div class="bingo-cell" on:click={() => toggle(index)} class:active={$bingoState[index]}>
			{item}
		</div>
	{/each}
</div>

<button on:click={saveBingoAsImage}>빙고 저장</button>
<button on:click={copyToClipboard}>빙고 공유</button>

<style>
	.bingo-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 5px;
	}
	.bingo-cell {
		padding: 20px;
		text-align: center;
		background-color: lightgray;
		cursor: pointer;
	}
	.bingo-cell.active {
		background-color: yellow;
	}
</style>
