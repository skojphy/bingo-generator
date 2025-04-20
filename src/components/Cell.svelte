<button
	type="button"
	class="cell-input"
	placeholder="Insert Name"
	role="textbox"
	tabindex="0"
	aria-label="셀 이름 입력"
	style="width:100%;background:none;border:none;outline:none;"
>
	<slot />
</button>

<style>
	button.cell-input {
		display: flex;
		align-items: center;
		background-color: rgb(255, 201, 201);
		width: 80px;
		height: 80px;
		border: 1px gray solid;
		padding: 0;
		font: inherit;
		border-radius: 0;
		cursor: pointer;
	}
</style>
