<script lang="ts">
  import ColorPicker from 'svelte-awesome-color-picker';
  export let styleConfig: any;
  export let fontOptions: string[] = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
  // styleConfig의 각 필드가 반응형이 되도록 부모에서 반드시 객체를 전달해야 함
</script>

<div class="style-controls-grid">
  <label class="style-label"><span>셀 배경색</span><ColorPicker bind:hex={styleConfig.cellColor} label="" /></label>
  <label class="style-label"><span>글자색</span><ColorPicker bind:hex={styleConfig.color} label="" /></label>
  <label class="style-label"><span>전체 배경색</span><ColorPicker bind:hex={styleConfig.bgColor} label="" /></label>
  <label class="style-label"><span class="long-label">선택 시 셀 배경색</span><ColorPicker bind:hex={styleConfig.checkedCellColor} label="" /></label>
  <label class="style-label"><span>선택 시 글자색</span><ColorPicker bind:hex={styleConfig.checkedCellTextColor} label="" /></label>
  <label class="style-label"><span>셀 테두리색</span><ColorPicker bind:hex={styleConfig.cellBorderColor} label="" /></label>
  <label class="style-label"><span>폰트</span>
    <select bind:value={styleConfig.font} style="vertical-align: middle;">
      {#each fontOptions as font}
        <option value={font}>{font}</option>
      {/each}
    </select>
  </label>
  <label class="style-label" style="font-size: 0.95em; white-space: nowrap;">
    <input type="checkbox" bind:checked={styleConfig.borderVisible} aria-label="셀 테두리 표시" style="vertical-align: middle; margin-right: 6px;" />
    <span>셀 테두리 보이기</span>
  </label>
</div>

<style>
.style-controls-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  grid-template-rows: repeat(3, auto);
  gap: 12px 18px;
  align-items: center;
  margin-bottom: 12px;
  max-width: 600px;
}
.style-label {
  display: flex;
  align-items: center;
  gap: 0.6em;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.2;
}
.style-label > span {
  min-width: 0;
}
.style-label > span.long-label {
  white-space: nowrap;
  letter-spacing: -0.01em;
}

@media (max-width: 700px) {
  .style-controls-grid {
    max-width: 98vw;
    gap: 8px 10px;
  }
  .style-label {
    font-size: 0.93em;
  }
  .style-label > span {
    font-size: 0.93em;
  }
  select {
    font-size: 0.96em;
  }
}
@media (max-width: 480px) {
  .style-label {
    font-size: 0.76em;
    gap: 0.4em;
  }
  .style-label > span {
    font-size: 0.8em;
  }
}
@media (max-width: 430px) {
  .style-controls-grid {
    max-width: 100vw;
    gap: 6px 4px;
  }
  .style-label {
    font-size: 0.83em;
  }
  .style-label > span {
    font-size: 0.83em;
  }
  select {
    font-size: 0.85em;
  }
}

:global(body) {
  min-width: 380px;
}
</style>
