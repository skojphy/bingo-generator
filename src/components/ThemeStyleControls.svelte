<script lang="ts">
  import ColorPicker from 'svelte-awesome-color-picker';
  export let styleConfig: any;
  export let fontOptions: string[] = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
  // styleConfig의 각 필드가 반응형이 되도록 부모에서 반드시 객체를 전달해야 함
</script>

<div class="style-controls-grid"
  style="display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); grid-template-rows: repeat(3, auto); gap: 12px 18px; align-items: end; margin-bottom: 12px; max-width: 600px;"
>
  <label>셀 배경색<ColorPicker bind:hex={styleConfig.cellColor} label="" /></label>
  <label>글자색<ColorPicker bind:hex={styleConfig.color} label="" /></label>
  <label>전체 배경색<ColorPicker bind:hex={styleConfig.bgColor} label="" /></label>
  <label>선택 시 셀 배경색<ColorPicker bind:hex={styleConfig.checkedCellColor} label="" /></label>
  <label>선택 시 글자색<ColorPicker bind:hex={styleConfig.checkedCellTextColor} label="" /></label>
  <label>셀 테두리색<ColorPicker bind:hex={styleConfig.cellBorderColor} label="" /></label>
  <label>폰트
    <select bind:value={styleConfig.font}>
      {#each fontOptions as font}
        <option value={font}>{font}</option>
      {/each}
    </select>
  </label>
  <label style="font-size: 0.95em; white-space: nowrap;">
    <input type="checkbox" bind:checked={styleConfig.borderVisible} aria-label="셀 테두리 표시" />
    셀 테두리 보이기
  </label>
</div>
