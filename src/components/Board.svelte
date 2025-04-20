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
          placeholder="방 이름"
          rows="3"
          style="background:{styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible ? 'solid' : 'none'};"
        ></textarea>
        <div class="cell-content"
          style="background:{styleConfig.cellColor};border:1.5px solid {styleConfig.cellBorderColor};border-style:{styleConfig.borderVisible ? 'solid' : 'none'};"
        >{board[i][j] || '방 이름'}</div>
      </div>
    {/each}
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
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
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
</style>
