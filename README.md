# 방탈출 빙고 생성기

## 프로젝트 소개

- 사용자가 입력한 테마로 5x5 빙고판을 만들고, URL로 공유할 수 있는 SvelteKit 기반 웹 서비스

## 주요 기능

1. 빙고판 생성 (테마 25개 입력)
2. 테마 서식(색상: 옵션+직접입력, 폰트: 옵션 선택) 지정
3. 빙고판 URL 공유 (누구나 접근 가능)
4. 빙고 체크 및 빙고 개수 표시
5. 이미지로 다운로드

## 사용법

1. 테마 입력 → 빙고판 생성
2. 각 칸별 스타일(색상, 폰트) 지정
3. URL 복사/공유
4. 빙고 체크 및 결과 확인
5. 이미지 다운로드

## 개발 및 테스트

- TDD 기반 개발
- 커밋 체크리스트 및 글로벌 룰 준수
- 테스트 도구:
  - 컴포넌트/단위 테스트: Vitest + @testing-library/svelte
  - E2E 테스트: Playwright

## 기술 스택

- Svelte 5, SvelteKit
- Tailwind CSS
- Vitest, @testing-library/svelte, Playwright
- Prettier, ESLint
- 배포: Vercel

## 폴더 구조

/src
/components
/routes
/lib
/tests

## 커밋 메시지 규칙

- feat: 새로운 기능
- fix: 버그 수정
- test: 테스트 코드
- refactor: 리팩토링
- docs: 문서
- chore: 기타

## 라이선스 및 기여 방법

- MIT 라이선스
