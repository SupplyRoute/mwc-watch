---
version: alpha
name: "MWC 시계"
description: "검게 산화된 군용 계측기와 오래된 황동 눈금의 중후함을 현대 손목시계 경험으로 번역한 한국어 브랜드 사이트"
colors:
  ink: "#090a08"
  ink-soft: "#151510"
  paper: "#d8d0c0"
  paper-bright: "#f2ecdf"
  field: "#766247"
  field-dark: "#11110e"
  signal: "#b88b4a"
  signal-deep: "#8f6738"
  mist: "#a8a091"
typography:
  display:
    fontFamily: "Pretendard Variable, Pretendard, Noto Sans KR, Malgun Gothic, sans-serif"
  editorial:
    fontFamily: "Pretendard Variable, Pretendard, Noto Sans KR, Malgun Gothic, sans-serif"
  body:
    fontFamily: "Pretendard Variable, Pretendard, Noto Sans KR, Malgun Gothic, sans-serif"
  mono:
    fontFamily: "Pretendard Variable, Pretendard, Noto Sans KR, Malgun Gothic, sans-serif"
rounded:
  DEFAULT: "2px"
  circle: "50%"
spacing:
  section-gap: "clamp(100px, 11vw, 176px)"
  page-pad: "clamp(24px, 5vw, 84px)"
  page-max: "1440px"
components:
  button:
    minHeight: "52px"
    borderRadius: "2px"
  navigation:
    desktopHeight: "78px"
    mobileHeight: "68px"
  story-card:
    borderWidth: "1px"
    borderRadius: "2px"
  field-rail:
    height: "142px"
    lineWidth: "1px"
---

# MWC 시계 Design System

## Overview

### Creative North Star

검게 산화된 군용 계측기 위에 오래된 황동 눈금과 정비 도면을 펼친다. 1970년대 보급 규격표의 정밀함은 유지하되, 수집품 진열장이나 과장된 럭셔리 숍이 아니라 오늘의 중후한 제품 카탈로그로 편집한다. 모든 표식과 선은 실제 정보 구조를 설명해야 하며, 장식만을 위한 밀리터리·럭셔리 요소는 쓰지 않는다.

### Product context and register

- **Audience and primary job:** 작은 크기의 실용적인 필드 워치를 찾는 한국어 사용자에게 MWC의 태도와 첫 제품을 명확히 소개한다.
- **Target market and evidence:** 사용자가 한국어 사이트를 명시했다. 실제 판매 지역과 법적·상거래 범위는 아직 정해지지 않았다.
- **Locale and language policy:** 소유 콘텐츠는 한국어, 모델명·규격·기술 표식은 필요한 범위에서 영어와 라틴 문자를 병기한다.
- **Usage scene:** 모바일 탐색을 우선하고, 데스크톱에서는 제품 사진과 필드 로그 레일이 더 많은 맥락을 제공한다.
- **Register:** 브랜드/콘텐츠 사이트. 애플리케이션형 CRUD 계약은 적용하지 않는다.
- **Memorable signature:** 영웅 이미지 뒤의 황동 측정 링과 화면 오른쪽의 수직 필드 로그가 시계를 정밀 계측 중인 장면처럼 보이게 한다.
- **Restraint:** 제품 설명, 내비게이션, 긴 한국어 문단에서는 선명한 대비와 편안한 행간이 표현보다 우선한다.
- **Anti-references:** 전술 장비 쇼핑몰의 위장 패턴, 사이버펑크 네온, 왕관·메달·별점으로 고급스러움을 주장하는 전형적인 럭셔리몰, 과도한 빈티지 낡음, 둥근 SaaS 카드 UI를 피한다.
- **Token ownership/runtime mapping:** 이 문서는 디자인 의도를 규정하고 `styles.css`의 `:root` 변수가 런타임 토큰을 구현한다. 빌드나 생성 단계는 없다.

## Colors

`ink`와 `ink-soft`가 산화된 금속의 주 표면을 만들고, `paper`와 `paper-bright`는 본문과 정비 문서에만 사용한다. `field-dark`는 깊이가 필요한 제품 표면, `field`는 스크롤바와 보조 눈금에 쓴다. `signal`과 `signal-deep`은 노화된 황동으로, 링크·진행·초점·측정선처럼 중요한 신호에만 쓴다. 본문 대비는 WCAG AA를 목표로 하며 강제 색상 모드에서는 시스템 색을 존중한다.

## Typography

모든 텍스트 역할은 Pretendard Variable과 Pretendard로 통일한다. 제목은 700–900의 굵기와 촘촘한 자간, 본문은 400–700의 굵기와 넉넉한 행간, 기술 표식은 작은 크기와 넓은 자간으로 구분한다. 서로 다른 서체에 기대지 않고 한 글꼴 안의 굵기·크기·자간 대비로 군용 계측기의 정밀함과 중후함을 유지한다.

## Layout

최대 너비 1440px의 비대칭 2열 구성이 기본이다. 큰 제목과 제품 사진이 서로 맞물리고, 데이터 스트립과 사양 행은 실제 제품 정보를 구조화한다. 860px 이하에서는 모든 주요 영역이 단일 열로 바뀌며, 560px 이하에서는 터치 우선 여백과 전폭 CTA를 사용한다. 이미지 비율을 명시해 로딩 중 레이아웃 이동을 막는다.

## Elevation & Depth

정적인 콘텐츠 카드에는 그림자를 쓰지 않는다. 깊이는 검은 표면의 미세한 명도 차, 황동색 가는 경계선, 제품 사진의 실제 조명으로 만든다. 제품 사진과 정비 도면 프레임에는 금속판에서 살짝 들어 올려진 듯한 제한적인 깊은 그림자를 허용한다. 헤더에는 탐색 문맥을 유지하기 위한 약한 배경 블러가 허용된다.

## Shapes

기본 모서리는 2px로 거의 직각이다. 원형은 시계 다이얼, 좌표 조준선, 상태점처럼 의미가 있는 계기 요소에만 쓴다. 선 두께는 대부분 1px, 주요 프레임 모서리 신호는 2px이다.

## Components

### Foundational visual states

모든 링크와 버튼은 기본·호버·포커스·눌림 상태를 가진다. 키보드 포커스는 `signal` 3px 외곽선으로 표시한다. 이미지에는 고정 비율을 두며, 모션 감소 환경에서는 등장 전환과 부드러운 스크롤을 제거한다.

### Buttons and actions

주 행동은 황동색 실색 버튼, 보조 행동은 밑줄 텍스트 링크다. 버튼은 52px 이상 높이를 유지하며 상태 변화로 크기가 바뀌지 않는다. 모바일에서는 주요 CTA가 전폭이 된다.

### Navigation and data display

데스크톱 헤더는 얇은 가로 내비게이션과 활성 밑줄을 사용한다. 모바일 메뉴는 화면 전체를 사용하며 Escape로 닫히고 포커스를 토글로 돌려준다. 사양과 원칙은 의미 있는 `dl`로 마크업한다.

### Forms and overlays

현재 사이트에는 전송 폼이나 모달이 없다. 연락은 명시적인 이메일 링크로 제공하며, 임시 주소임을 사용자에게 알린다.

### Iconography

외부 아이콘 세트 없이 CSS 조준선 마크와 텍스트 화살표를 사용한다. 의미가 모호한 아이콘 단독 컨트롤은 사용하지 않는다.

### Motion

등장 모션은 720ms의 감속 곡선으로 한 번만 실행한다. 호버 이동은 180–240ms 범위다. 장식적 반복 애니메이션은 없으며 `prefers-reduced-motion`을 따른다.

### Content and data visualization

문장은 과장보다 제작 태도와 물리적 사양을 설명한다. 아직 확정되지 않은 가격, 출시일, 제작자 정보는 사실처럼 쓰지 않고 명시적인 임시 상태로 남긴다.
무브먼트 구조 이미지는 실제 탑재 칼리버와 일치하는 제조사 공식 자료만 사용하고, 화면 안에서 출처와 확대 경로를 함께 제공한다.

## Do's and Don'ts

- **Do:** 군용 규격의 언어를 제품 크기, 소재, 제작 기록 같은 실제 정보에 연결한다.
- **Do:** 한국어 본문을 넉넉한 행간과 읽기 좋은 폭으로 유지한다.
- **Don't:** 위장 무늬, 계급장, 무기 이미지를 밀리터리 분위기의 지름길로 사용하지 않는다.
- **Don't:** 확정되지 않은 원산지, 가격, 방수 성능, 출시일을 검증된 사실처럼 공개하지 않는다.
