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
		cellBorder: true,
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
</script>

<div class="style-controls-grid"
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
  <label>글자색
    <ColorPicker bind:hex={styleConfig.color} label="" />
  </label>
  <label>배경색
    <ColorPicker bind:hex={styleConfig.bgColor} label="" />
  </label>
  <label>셀 배경색
    <ColorPicker bind:hex={styleConfig.cellColor} label="" />
  </label>
  <label>셀 테두리색
    <ColorPicker bind:hex={styleConfig.cellBorderColor} label="" />
  </label>
  <label style="font-size: 0.95em;">
    폰트
    <select bind:value={styleConfig.font}>
      <option value="sans-serif">Sans-serif</option>
      <option value="serif">Serif</option>
      <option value="monospace">Monospace</option>
    </select>
  </label>
  <label style="font-size: 0.95em; white-space: nowrap;">
    <input type="checkbox" bind:checked={styleConfig.borderVisible} aria-label="셀 테두리 표시" />
    셀 테두리 표시
  </label>
</div>

<div
	class="board-grid"
	style="background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color}"
>
	{#each board as row, rowIndex}
		<div class="board-row">
			{#each row as cell, colIndex}
				<Cell
					bind:this={cellRefs[rowIndex][colIndex]}
					styleConfig={styleConfig}
					ensureHex={ensureHex}
				>
					<textarea
						class="cell-input"
						bind:value={board[rowIndex][colIndex]}
						on:input={(e) => updateCell(rowIndex, colIndex, (e.target as HTMLTextAreaElement)?.value || '')}
						maxlength={40}
						placeholder="방 이름"
						rows="3"
						style={`background:${styleConfig.cellColor};border:1.5px solid ${styleConfig.cellBorderColor};border-style:${styleConfig.borderVisible ? 'solid' : 'none'};`}
					></textarea>
				</Cell>
			{/each}
		</div>
	{/each}
</div>

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
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
		min-width: 600px;
		max-width: 650px;
		margin: 0 auto;
	}
	.cell-input {
		width: 110px;
		height: 110px;
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.05rem;
		border-radius: 10px;
		word-break: break-all;
		text-align: center;
		resize: none;
		padding: 8px 4px;
		box-sizing: border-box;
		overflow-wrap: break-word;
	}
</style>
