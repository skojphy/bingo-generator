<script lang="ts">
  export let styleConfig: any;
  export let ensureHex: (val: string, fallback: string) => string;
</script>

<button
  class="cell cell-input"
  type="button"
  placeholder="Insert Name"
  role="textbox"
  tabindex="0"
  aria-label="셀 이름 입력"
  style="
    width:100%;
    background:none;
    border:{styleConfig && styleConfig.borderVisible ? `2px solid ${ensureHex(styleConfig.cellBorderColor, '#bbbbbb')}` : 'none'};
    outline:none;
  "
>
  <slot />
</button>

<style>
.cell {
  background-color: rgb(255, 201, 201);
  width: 80px;
  height: 80px;
  padding: 0;
  font: inherit;
  border-radius: 0;
  box-sizing: border-box;
}
</style>
