<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { error } from '@sveltejs/kit';

let board: string[][] = [];
let styleConfig: any = {};
let loading = true;
let notFound = false;
let bingoCount = 0;
let checked = Array.from({ length: 5 }, () => Array(5).fill(false));
let boardTitle = '';
let createdAt = '';

function updateBingoCount() {
  let count = 0;
  for (let i = 0; i < 5; ++i) if (checked[i].every(v => v)) count++;
  for (let j = 0; j < 5; ++j) if (checked.every(row => row[j])) count++;
  if ([0,1,2,3,4].every(k => checked[k][k])) count++;
  if ([0,1,2,3,4].every(k => checked[k][4-k])) count++;
  bingoCount = count;
}

function toggleCell(i: number, j: number) {
  checked[i][j] = !checked[i][j];
  updateBingoCount();
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
      checked = Array.from({ length: 5 }, () => Array(5).fill(false));
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
  <div class="bingo-shared">
    <div class="bingo-title-shared">{boardTitle}</div>
    <div class="bingo-count">완성한 빙고: <strong>{bingoCount}</strong></div>
    <div class="board-grid" style="width:600px; height:600px; background:{styleConfig.bgColor}; font-family:{styleConfig.font}; color:{styleConfig.color};">
      {#each board as row, i}
        {#each row as cell, j}
          <div class="cell-outer">
            <div
              class="cell-content bingo-cell {checked[i][j] ? 'checked' : ''}"
              on:click={() => toggleCell(i, j)}
              tabindex="0"
              role="button"
              aria-pressed={checked[i][j]}
              style="background:{checked[i][j] ? (styleConfig.checkedCellColor || '#b3e6b3') : (styleConfig.cellColor || '#fff9f9')};border:1.5px solid {styleConfig.cellBorderColor || '#bbbbbb'};border-style:{styleConfig.borderVisible === false ? 'none' : 'solid'};color:{checked[i][j] ? (styleConfig.checkedCellTextColor || '#1a4d1a') : (styleConfig.color || '#222222')};"
            >{cell}</div>
          </div>
        {/each}
      {/each}
    </div>
  </div>
{/if}

<style>
.loading, .not-found {
  text-align: center;
  font-size: 1.2em;
  padding: 2em 0;
  color: #888;
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
}
.cell-content {
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
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.bingo-cell.checked {
  background: #b3e6b3 !important;
  color: #1a4d1a !important;
}
.bingo-title-shared {
  width: 600px;
  margin: 0 auto 18px auto;
  font-size: 1.35em;
  font-weight: bold;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  padding: 0.45em 0.8em;
  margin-bottom: 0.5em;
}
</style>
