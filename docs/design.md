# 설계 문서 (Design)

## 시스템 아키텍처

- SvelteKit SPA
- 주요 모듈: 테마 입력, 빙고판 생성, 스타일 설정, URL 생성/공유, 체크/상태 표시, 이미지 다운로드

## 주요 컴포넌트 구조

- ThemeInputForm
- BingoBoard
- StyleSelector
- ShareUrl
- BingoStats
- DownloadButton

## 주요 설계 원칙

- 입력/설정 → 빙고 생성 → 공유/체크/다운로드의 UX 플로우
- 반응형, 접근성, 직관적 UI
- TDD 기반 컴포넌트 단위 개발
