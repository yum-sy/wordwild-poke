# Pokémon v2 — 구현 및 검증

2026-11-09. 독립 복제본 /Users/kami.san/Documents/Wordwild-Pokemon-Fangame, codex/pokemon-fangame 브랜치.

## 구현

- 1·2세대 251종, PokeAPI 고정 커밋 계보/타입/전설 분류. 이후 세대 진화/지역형 제외.
- 실제 진화와 외형 유지 Power Up. 모든 분기는 동일 확률 랜덤, 개체당 성장 최대 2회. 능력 보너스 한 번, 패시브·shiny 유지.
- 풀/불/물별 1·2세대 후보에서 각 1종, 총 3종 스타터 선택. 새로고침/도감 방문/홈 왕복은 후보 유지. 실패·클리어·포기 후 한 번 재추첨.
- 전설·환상 11종을 섞어 10개 보스에 중복 없이 배치. 도전별 순서 저장. 일반 야생 풀에는 포함하지 않음.
- 야생은 단계별 기초/진화 비중, 계열별 균등 추첨, 최근 3계열 회피. 미진화 개체가 초반에만 등장하지 않고 후반에도 등장.
- Shiny 총 1%, Giant/Silver/Gold 폐지. 실제 shiny 이미지, 진화·포획·계승·저장 보존.
- 아군 후면/적 전면, YOU/WILD/BOSS 및 아군 바닥 마커 유지.
- 251종 모두 정적/animated × front/back × normal/shiny 확보: PNG 1,004 + GIF 1,004. 약 90MB 전체 캐시를 미리 불러오지 않고 현재 전투/단독 미리보기만 GIF 요청.
- 프레임 합집합 정규화·발 기준·재생시간·투명도 검증. reduced-motion 및 백그라운드는 PNG로 전환. GIF 오류는 같은 종·방향·색 PNG로 대체, PNG도 실패하면 물음표.
- 팀 상세와 보상 대상 화면의 HP/공격/영구 실드 성장 게이지. 실제 진화 판정과 목표 함수 공유. 보상 후 예상값 미리보기.
- 시작 화면 전용 Pokédex, 6종씩 페이지, 발견/포획/shiny·진화 계열·단독 애니메이션 보기. 진행 중 메뉴에 도감 버튼 없음.
- 사용자 승인에 따라 v1 복제본 기록은 백업 없이 초기화. v2 키로 새 시작. 원본 Wordwild 키는 접근/삭제하지 않음.
- 코드 MIT, PokeAPI 데이터 BSD-3-Clause 안내, Pokémon 이미지 별도 권리·출처 기록. 비상업/비공식/비제휴 안내 유지.

## 검증 결과

- npm run check 통과.
- node --test tests/*.test.js: 101/101 통과.
- 테스트 포함: 모든 에셋 해시/크기, 분기 진화·shiny 보존, 스테이지 출현 비중 경계, 11→10 보스 추첨, 스타터 8개 조합·종료 멱등 처리, 목표값·보상 미리보기, 도감 수집, 행운 이벤트 숨은 적 미기록, 애니메이션 중지와 실패 대체.
- 별도 임시 디렉터리 빌드에서 /wordwild-pokemon-fangame/ 하위 PNG/GIF URL, GIF와 권리 안내 포함, QA 제외 확인.
- 자동 게임 시뮬레이션: 100스테이지 완료, 765회 상태 변경마다 저장/복원, 보스 10종 중복 없음, 치코리타→베이리프→메가니움 확인. 올바른 답을 선택한 엔진 검증이며 수동 플레이나 난이도 사용성 테스트를 대신하지 않음.
- 브라우저 10개 크기: 360×560, 667×320, 390×650, 844×390, 768×920, 1024×680, 820×1080, 1180×720, 1024×1366, 1366×768.
- 13개 기본 상태(홈/전투/보스/독해/보상대상/교체/포획실패/캠프/진화/보상/포획/도감/팀) 130조합 검사. 종료/클리어/행운 이벤트와 보상대상 재검 40조합, 팀 내부 잘림 추가 10조합 확인. 페이지 넘침·화면 밖 버튼·완료된 깨진 이미지 없음. 발견한 성장 카드 및 팀 내부 잘림 수정.
- 실제 브라우저 새로고침 뒤 스타터 후보 동일 확인. 단독 도감 GIF 로드 확인. 콘솔 오류 없음.
- QA는 python3 scripts/prepare-device-qa.py 로 생성하며 메모리 저장 사용, 배포에서 제외. 원본 저장소·원본 사이트·5173 서버는 변경하지 않음.

## 실행과 제한

이 저장소에서 npm run dev → http://127.0.0.1:5174 .
BASE_PATH=/wordwild-pokemon-fangame/ npm run build 로 독립 경로 빌드.
원격 저장소 등록, push, 공개 배포는 하지 않았음.

실제 iPad Safari의 성능/메모리/홈 화면 설치는 미검증. 브라우저 크기 모의 검사와 엔진 테스트 완료 상태. 음악/효과음 파일은 기존 승인본 유지, 이번에 재청취하지 않음.

## 상대 크기 보정 — 2026-11-09

PokeAPI 고정 pokemon.csv의 251종 키(height, dm)를 미터로 저장. 전투 양쪽 공통 기준에서 키 차이를 완만하게 압축하여 배율을 계산한다. 작은 포켓몬의 가독성과 큰 포켓몬의 화면 내 배치를 위해 상·하한 적용. 플레이어 후면의 확대 우위를 제거하고 보스 존재감을 보정한다. 파이리 0.6m / 칠색조 3.8m에서 칠색조의 스프라이트 상자 배율은 파이리의 약 2.38배. 실제 픽셀 실루엣 크기는 자세·날개에 따라 다르다. 카드 이미지는 비교 전투가 아니므로 기존 가독성 크기 유지, 도감 상세에 실제 키 표시. 정적/animated/일반/shiny 공통 적용.

상대 크기 수정 후 103/103 테스트 통과. 251×251 조합 배율 상·하한 및 좌우 대칭 검증. 10개 화면 크기에서 파이리/칠색조 배율 약 2.38 유지, 두 개체 화면 내 배치·이미지 정상 표시 확인.

## 그림자 통일 — 2026-11-09

시작 카드 외부의 고정 타원 그림자 제거. 모든 포켓몬 렌더러에서 88/96 발 기준점에 작은 접지 그림자 하나를 사용한다. 전/후면별 에셋 투명 경계 폭을 측정해 그림자 폭을 정하고, 일반/shiny 및 정적/애니메이션 사이에서 흔들리지 않게 고정한다. 전투 상대 크기 배율과 그림자도 함께 변한다. 10개 화면 크기 × 홈/전투/보스/도감/팀/포획/보상대상 70조합에서 기준점·폭·중복·스크롤 검사 통과. 기존 103개 테스트 통과.

## Poké Ball capture update

- PokeAPI's published sprite catalog supplies Pokémon and item sprites, but no move-specific attack-effect animation set was found. Existing attack effects remain pending a separate pixel-style art pass. Reference: https://github.com/PokeAPI/sprites#sprites
- Capture now throws a pixel Poké Ball, absorbs the Pokémon, drops and shakes three times, then locks with stars or releases the Pokémon. Reduced motion uses static states and text cues.
- Golden Net is displayed as Master Ball; old saved `goldenNets` and reward identifiers remain compatible. Chances and three-attempt limit are unchanged.
- Result and item consumption commit before presentation, so reloading cannot refund a ball or reroll that attempt. Full-party captures retain the swap candidate.
- Capture animation pauses while the page is hidden; input stays locked through the result.

## Evolution aura correction

Real species evolution no longer grants the persistent power-up aura. A separate `powerUpStage` increments only when growth has no next evolution. Eevee's first growth changes species with no aura; its second growth adds the first aura. Saved runs with last-evolution metadata are interpreted compatibly, and new heir/hall entries preserve the explicit aura rank. Growth limits and stat bonuses are unchanged.

## Capture ball tiers

Existing probability remains unchanged. Ball appearance follows the current target's actual chance: below 65% Poké Ball, 65–under 80% Great Ball, 80–95% Ultra Ball; an available Master Ball overrides this at 100%. Boss difficulty still applies. Button displays the actual per-attempt chance to one decimal place. The thrown ball and announcement use the same selection, saved before the item is consumed. Great/Ultra Ball sprites are pinned PokeAPI assets recorded in the capture manifest.

## Provisional game name

Public-facing branding is PokeWord (FanGame). The home-screen short label is PokeWord. Repository URL, app identity and save keys stay stable.

## Mobile report and help readability

Parents uses responsive stat cards and a scrollable report instead of squeezing text into a fixed stage. Help has a fixed heading/close action, scrollable instructions and a fixed confirmation footer, with keyboard focus included in the dialog trap. PokeAPI docs provide Pokémon cries, but no BGM endpoint/catalog; existing music is retained.

## Approved Poké Ball theme

Ivory surfaces, navy text, red primary actions and Pichu yellow replace green UI chrome. Existing regional scene backgrounds remain intact. Enlarged Pichu back/head artwork is shared by the top-bar logo, install icons and new 16/32px favicons. Close-up install icons use `any` purpose so launchers do not assume a maskable safe zone.

Learning text takes priority: mobile questions ~28–32px, answers 28px, passages 24px; larger displays use up to 48px prompts, 40px choices and 32px passages. Long content scrolls within the learning panel instead of shrinking. Pokémon HUD labels and stats are compact. Browser checks covered home/battle/reading/Parents across five viewport sizes; no horizontal document overflow or broken images observed.
