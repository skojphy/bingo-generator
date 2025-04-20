<script lang="ts">
  import ThemeInputForm from '../components/ThemeInputForm.svelte';
  let rooms: string[] = Array(25).fill('');
  let styleConfig = {
    color: '#222222',
    bgColor: '#ffffff',
    font: 'sans-serif'
  };
  function handleUpdate(e: CustomEvent) {
    rooms = e.detail.rooms;
    styleConfig = e.detail.styleConfig;
  }
  function handleSubmit(e: CustomEvent) {
    // TODO: 빙고판 생성 로직 연결 예정
    alert('빙고 테마가 입력되었습니다!');
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
  <ThemeInputForm
    {rooms}
    {styleConfig}
    on:update={handleUpdate}
    on:submit={handleSubmit}
  />
  <!-- TODO: 빙고판 생성 컴포넌트 연결 예정 -->
</main>
