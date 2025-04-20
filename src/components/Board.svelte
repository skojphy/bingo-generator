<script lang="ts">
  export let rooms: string[] = Array(25).fill('');
  export let styleConfig = {
    color: '#222222',
    bgColor: '#ffffff',
    font: 'sans-serif'
  };
  // 5x5 빙고판 2차원 배열로 변환
  $: board = Array.from({length: 5}, (_, i) => rooms.slice(i * 5, i * 5 + 5));
  function updateCell(i: number, j: number, value: string) {
    rooms[i * 5 + j] = value;
  }
  const fontOptions = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
</script>

<div class="style-controls">
  <label>글자색
    <input type="color" bind:value={styleConfig.color}>
  </label>
  <label>배경색
    <input type="color" bind:value={styleConfig.bgColor}>
  </label>
  <label>폰트
    <select bind:value={styleConfig.font}>
      {#each fontOptions as font}
        <option value={font}>{font}</option>
      {/each}
    </select>
  </label>
</div>

<div class="board-grid" style="background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color}">
  {#each board as row, i}
    {#each row as cell, j}
      <textarea
        class="cell-input"
        bind:value={board[i][j]}
        on:input={(e) => updateCell(i, j, (e.target as HTMLTextAreaElement)?.value || '')}
        maxlength={40}
        placeholder="방 이름"
        rows="3"
      ></textarea>
    {/each}
  {/each}
</div>

<style>
.style-controls {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 18px;
  align-items: center;
  justify-content: center;
}
.style-controls label {
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 600px;
  max-width: 650px;
  margin: 0 auto;
}
.cell-input {
  width: 110px;
  height: 110px;
  aspect-ratio: 1 / 1;
  border: 1.5px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  background: rgba(255,255,255,0.9);
  border-radius: 10px;
  word-break: break-all;
  text-align: center;
  resize: none;
  padding: 8px 4px;
  box-sizing: border-box;
  overflow-wrap: break-word;
}
</style>
