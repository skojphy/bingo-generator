<script>
	import Cell from './Cell.svelte';
	let col = new Array(5).fill(0).map((_, i) => i);
	let row = new Array(5).fill(0).map((_, i) => i);

	const count = 0;
</script>

<div class="board">
	{#each row}
		<div class="row">
			{#each col}
				<Cell />
			{/each}
		</div>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>
