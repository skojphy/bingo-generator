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
</script>

<div class="board" style="background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color}">
  {#each board as row, i}
    <div class="row">
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
    </div>
  {/each}
</div>

<style>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 350px;
  max-width: 600px;
}
.row {
  display: flex;
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
  margin: 4px;
  border-radius: 10px;
  word-break: break-all;
  text-align: center;
  resize: none;
  padding: 8px 4px;
  box-sizing: border-box;
  overflow-wrap: break-word;
}
</style>
