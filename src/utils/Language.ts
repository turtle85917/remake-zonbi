export const ko = {
    "term": {
        "action": {
            "progress": "진행하기",
            "item": {
                "dump": "버리기"
            }
        },
        "categories": {
            "basic": "기본",
            "play": "즐기기"
        },
        "status": {
            "level": "**🩹 레벨**",
            "health": "**❤️ 체력**",
            "thirst": "**💧 갈증**",
            "satiety": "**🍖 포만감**",
            "goods-data": "**💰 재화 데이터**",
            "effect": "**🧬 받고 있는 효과**",
            "usual": "**🤨 부가 사항**"
        },
        "error": "오류...",
        "ms": "㎳"
    },
    "error": {
        "already_account": "계정이 이미 존재해요.",

        "already_verify": "이미 이 서버와 연동되어 있어요.",
        "first_verify": "연동을 먼저 해주세요.",

        "bot_is_rebooting": "봇이 재시작된 상태인 것 같아요!",
        "account_notfound": "당신은 계정이 존재하지 않는 상태인 것 같습니다.",

        "usage": [
            "명령어 사용법이 올바르지 않아요.",
            "",
            "{command.line}",
            "{command.options}"
        ].join("\n"),

        "dm": "개인 메시지 채널에서는 답변해줄 수 없어요.",

        "expire": "*(상호작용이 만료되었어요!)*",
        "user-control": "메시지 주인만이 조작할 수 있어요.",

        "length": {
            "larger-than": "입력된 값은 {length}글자보다 커야 되요!",
            "less-than": "입력된 값은 {length}글자보다 적어야 되요!"
        },
        "log-message": {
            "t": "오류가 나 로깅하여 보냈습니다.",
            "d": [
                "Guild - {guild.name} ({guild.id})",
                "Channel - {channel.name} ({channel.id})",
                "User - {user.name} ({user.id})",
                "",
                "Message - {message.content}",
                "Error - {error}"
            ].join("\n")
        },

        "need-item": "{item.icon} {item.name} {item.quantity}개가 부족해요.",

        "unhandeld-error": "🐛 오류..."
    },
    "preset": {
        "answer-components": {
            "yes": "넵!", "no": "아뇨"
        },
        "page-components": {
            "left": "◀", "right": "▶",
            "refrash": "🔄"
        }
    },
    "command": {
        "account": {
            "error-already_verify": "이미 이 서버와 연동이 되어 있어요.",
            "error-name": "이름에서는 특수문자는 빼고 입력해주세요. (`_`는 제외)",
            "error-overlap-name": "해당 별명의 계정이 이미 존재해요.",

            "t": "계정 만들기",
            "description": "앞으로 사용하게 될 별명을 입력해주세요.",

            "link": [
                "이미 계정이 존재하네요. 이 서버와 연동할까요?",
                "(다만, 이 서버의 데이터는 다른 서버의 데이터와 *다른 데이터로 저장*됩니다.)"
            ].join("\n"),

            "modal-textinput": {
                "name": { "l": "별명", "p": "사용될 별명" }
            },

            "success": "계정이 성공적으로 만들어졌습니다.",
            "success_verify": "{name}님 안녕하세요! 또 다른 서버와 연동하셨군요.",

            "prev-server": { "d": "*(단계 이전됨)*" }
        },
        "attend": {
            "error-already": "이미 출석체크하셨어요.",

            "t-success": "✅ 생존 신고 완료!",
            "t-reward": "💞 연속 생존 신고 보상!",

            "combo-broken": "> 💔 연속 생존 신고 실패... ~~(× {maxCombo}~~",
            "combo-ing": "> ❤️ 연속으로 생존 신고 중... (× {maxCombo}",

            "survival-ing": "> 현재 `{day}일` 생존 중...",

            "calendar": "**__📆 달력__**",
            "footer-reward-desc": "최종 보상은 연속 생존 신고가 끝날 때 한 번에 들어갑니다."
        },
        "help": {
            "t": "명령어 목록",
            "d": "봇은 지금 활동 중이에요!"
        },
        "inventory": {
            "error-notfound": "해당 아이템 데이터는 지워진 것 같아요.",

            "t": "🏦 {name} 님의 창고",

            "d-found": "창고 안에서 다양한 아이템들을 찾았습니다.",
            "d-empty": "창고가 비어있어요.",

            "d-health": [
                "",
                "**🏚️ 내구도**",
                "> {healthBar}"
            ].join("\n"),

            "backpack-weight": "현재 창고의 수용 무게: {weight.current} / {weight.maximum}",

            "info-field": ["총 무게 / 수량"],

            "action": {
                "error-dump": "해당 아이템은 버릴 수 없어요.",
                "error-coupon": "해당 아이템을 여러개로 다른 아이템으로 교환할 수 없어요.",

                "dump": {
                    "t": "🗑️ 아이템 버리기",
                    "how-dump": "`{quantity}개` 버리시겠습니까?"
                },

                "coupon": {
                    "placeholder": "아이템 쿠폰",
                    "need-item": "해당 아이템: {quantity}개 필요",

                    "t": "💞 아이템 교환하기",
                    "how-coupon": "`{need.quantity}개`를 바꾸시겠습니까?",
                }
            }
        },
        "setting": {
            "error-no-attachments": "png나 jpeg 확장자로 된 파일을 첨부해주세요.",
            "error-no-correct-contentType": "파일 확장자가 올바르지 않아요.",
            "erorr-file-so-big": "파일이 너무 크고 아름답네요. 2MB를 넘지 않는 파일을 업로드해주세요.",

            "t": "🔁 환경 변수 값 설정",

            "profile-image-change": "프로필 이미지가 정상적으로 변경되었어요."
        },
        "ping": {
            "checking": "전 지금 활동하고 있어요! (- ![term.ms])",
            "error": "전 지금 활동하고 있어요! (error)",
            "success": "전 지금 활동하고 있어요! ({ping} ![term.ms])"
        },
        "profile": {
            "error-other_account": "{name}이라는 별명으로 사용 중인 계정이 없어요.",
            "error-other_verify": "{name}님은 이 서버와 연동된 상태가 아니에요.",
            "error-other_guild": "{name}님은 이 서버에 있지 않는 유저에요.",

            "need-mileage": "> ~~Lv. {level.prev}~~ → Lv. {level.next} ({level.mileage} 부족)",
            "health-speed": "> 5분 → [❤️ + {health}]",

            "usual": {
                "guild-level": "> 🩹 연동된 서버 평균 레벨: `{level}`",
                "start-survival": "> 🚩 <t:{createdAt}:D>에 생존 시작",
                "survival": "> 📆 {timestamp} 생존 중..."
            }
        },
        "travel": {
            "error-no-outside": "이것은 문이 아닙니다."
        }
    }
};