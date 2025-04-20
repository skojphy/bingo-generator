# 구현 단계별 체크리스트

## 1단계: 프로젝트 환경 구축 및 기본 구조

- [x] SvelteKit, Tailwind, Vitest, Playwright 환경 세팅 (커밋: f849aac)
- [x] 폴더/컴포넌트 구조 설계 (커밋: f849aac)
- [x] ESLint, Prettier 등 설정 (커밋: f849aac)
- [x] 의존성/패키지 추가 및 누락 패키지 해결 (커밋: 8e60e37, f6d04c9)

---

## 2단계: 테마 입력 및 스타일 지정 UI

- [x] 테마 25개 입력 폼 구현 (커밋: 43f6cca)
- [x] 색상 옵션/직접입력 UI 구현 (커밋: 43f6cca)
- [x] 폰트 옵션 선택 UI 구현 (커밋: 43f6cca)
- [x] 컬러피커(svelte-awesome-color-picker)로 글자색/배경색/셀 배경/테두리색 옵션 적용 및 HEX 기본값 보장 (커밋: see log)
- [x] 컬러피커 라벨 제거 및 미니멀 UI(컬러 원만 보이고 클릭 시에만 열림) (커밋: see log)
- [x] 컬러피커 undefined/null/3자리 HEX 등 에러 방지 로직 추가 (커밋: see log)

---

## 3단계: 빙고판 생성 및 렌더링

- [x] 빙고판 각 칸을 정사각형 textarea로 변경 및 스타일 개선 (커밋: 5c313f2)
- [x] 빙고판 5x5 grid 레이아웃 및 gap/여백 스타일 개선 (커밋: cad9d4d)
- [x] 5x5 빙고판 생성 로직 구현
- [x] 칸별 스타일 적용

---

## 4단계: URL 공유 및 접근

- [ ] 빙고판 고유 URL 생성 (커밋: feat)
- [ ] URL 복사/공유 기능 (커밋: feat)
- [ ] 공유 URL로 누구나 접근 가능 (커밋: test)

---

## 5단계: 빙고 체크/상태 표시 및 이미지 다운로드

- [ ] 칸 클릭 시 체크/해제 (커밋: feat)
- [ ] 빙고 개수 실시간 표시 (커밋: feat)
- [ ] 빙고판 이미지 다운로드 (커밋: feat)

---

## 6단계: 리팩토링/문서화/최적화

- [ ] 코드 리팩토링 (커밋: refactor)
- [ ] 문서화/README/설계 문서 최신화 (커밋: docs)
- [ ] 배포(Vercel) (커밋: chore)

---

## 7단계: 테스트 구조/접근성(a11y) 개선 및 분리

- [x] unit test와 e2e test 완전 분리 (vitest, playwright)
- [x] package.json의 test:unit 스크립트 명확화 (src/demo.spec.ts만 실행)
- [x] e2e 샘플 테스트 제거, board.e2e.spec.ts만 유지
- [x] 접근성(a11y) 경고 제거: Cell.svelte와 빙고 셀 div → button으로 변경
- [x] SvelteKit a11y 경고 없이 모든 테스트 통과

---
