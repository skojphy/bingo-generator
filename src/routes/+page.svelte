<script lang="ts">
  import Board from '../components/Board.svelte';
  let rooms: string[] = Array(25).fill('');
  let styleConfig = {
    color: '#222222',
    bgColor: '#ffffff',
    font: 'sans-serif'
  };
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
  <h1 class="text-3xl font-bold mb-6">방탈출 빙고 생성기</h1>
  <Board bind:rooms bind:styleConfig />
  <!-- TODO: 빙고판 생성 컴포넌트 연결 예정 -->
</main>
