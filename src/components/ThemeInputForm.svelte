<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let rooms: string[] = Array(25).fill('');
	export let styleConfig = {
		color: '#222222',
		bgColor: '#ffffff',
		font: 'sans-serif'
	};
	function updateRoom(idx: number, value: string) {
		rooms[idx] = value;
		dispatch('update', { rooms, styleConfig });
	}
	function updateStyle(key: 'color' | 'bgColor' | 'font', value: string) {
		styleConfig[key] = value;
		dispatch('update', { rooms, styleConfig });
	}
	function submit() {
		dispatch('submit', { rooms, styleConfig });
	}
	const fontOptions = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
</script>

<div class="bingo-input-form">
	<h2 class="mb-2 text-xl font-bold">방탈출 빙고 테마 입력</h2>
	<div class="mb-4 grid grid-cols-5 gap-2">
		{#each Array(25) as _, idx}
			<input
				class="w-full rounded border p-1 text-center"
				type="text"
				placeholder={'테마명을 입력하세요.'}
				bind:value={rooms[idx]}
				on:input={(e) => updateRoom(idx, (e.target as HTMLInputElement)?.value || '')}
				maxlength={30}
			/>
		{/each}
	</div>
	<div class="mb-4 flex items-center gap-4">
		<label class="flex items-center gap-2">
			<span>글자색</span>
			<input
				type="color"
				bind:value={styleConfig.color}
				on:input={(e) => updateStyle('color', (e.target as HTMLInputElement)?.value || '#222222')}
			/>
		</label>
		<label class="flex items-center gap-2">
			<span>배경색</span>
			<input
				type="color"
				bind:value={styleConfig.bgColor}
				on:input={(e) => updateStyle('bgColor', (e.target as HTMLInputElement)?.value || '#ffffff')}
			/>
		</label>
		<label class="flex items-center gap-2">
			<span>폰트</span>
			<select
				bind:value={styleConfig.font}
				on:change={(e) =>
					updateStyle('font', (e.target as HTMLSelectElement)?.value || 'sans-serif')}
			>
				{#each fontOptions as font}
					<option value={font}>{font}</option>
				{/each}
			</select>
		</label>
	</div>
	<button class="btn btn-primary w-full" on:click={submit}>빙고 생성</button>
</div>

<style>
	.bingo-input-form {
		max-width: 700px;
		margin: 0 auto;
	}
</style>
