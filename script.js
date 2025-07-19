document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const startScreen = document.getElementById('start-screen');
    const storyModeScreen = document.getElementById('story-mode-screen');
    const gamePlayScreen = document.getElementById('game-play-screen');
    const practiceModeScreen = document.getElementById('practice-mode-screen');
    const resultScreen = document.getElementById('result-screen');

    const startStoryModeBtn = document.getElementById('start-story-mode');
    const startPracticeModeBtn = document.getElementById('start-practice-mode');

    const backToStartFromStoryBtn = document.getElementById('back-to-start-from-story');
    const backToStartFromPracticeBtn = document.getElementById('back-to-start-from-practice');
    const backToStartFromResultBtn = document.getElementById('back-to-start-from-result');

    const backToStoryFromGameBtn = document.getElementById('back-to-story-from-game');
    const backToStoryFromResultBtn = document.getElementById('back-to-story-from-result');
    const continueToNextLevelBtn = document.getElementById('continue-to-next-level');

    const levelSelectionDiv = document.getElementById('level-selection');

    const currentMissionTitle = document.getElementById('current-mission-title');
    const missionDescription = document.getElementById('mission-description');
    const textToTypeSpan = document.getElementById('text-to-type');
    const userInput = document.getElementById('user-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const timerSpan = document.getElementById('time-left');
    const scoreSpan = document.getElementById('current-score');
    const accuracySpan = document.getElementById('current-accuracy');
    const nextLevelButton = document.getElementById('next-level-button');
    const retryLevelButton = document.getElementById('retry-level-button');

    const virtualKeyboardContainer = document.getElementById('virtual-keyboard-container');

    const finalScoreSpan = document.getElementById('final-score');
    const finalAccuracySpan = document.getElementById('final-accuracy');
    const finalTimeSpan = document.getElementById('final-time');
    const starRatingDiv = document.getElementById('star-rating');

    const practiceButtons = document.querySelectorAll('#practice-mode-screen button[data-practice-type]');
    const practiceTextToTypeSpan = document.getElementById('practice-text-to-type');
    const practiceUserInput = document.getElementById('practice-user-input');
    const practiceFeedbackMessage = document.getElementById('practice-feedback-message');
    const practiceScoreSpan = document.getElementById('current-practice-score');
    const practiceMistakesSpan = document.getElementById('current-practice-mistakes');

    // --- Game Variables ---
    let currentLevel = 1;
    let maxLevelReached = 1; // Track highest level unlocked
    let gameData = {}; // Stores level completion data (stars, etc.)

    let currentText = '';
    let typedCharacters = 0;
    let correctCharacters = 0;
    let mistakes = 0;
    let startTime;
    let timerInterval;
    let gameTimerDuration = 60; // seconds per level

    let isPracticeMode = false;
    let practiceTypedCount = 0;
    let practiceMistakeCount = 0;
    let practiceCharacters = '';

    // --- Game Data (Levels) ---
    const levels = [
        {
            id: 1,
            title: "ระบบสื่อสารขัดข้อง",
            description: "ระบบสื่อสารของยานอวกาศมีข้อความผิดเพี้ยน ต้องแยกส่วนประกอบของข้อความที่ถูกต้องออกจากข้อความรบกวน",
            texts: [
                "CAT", "DOG", "SUN", "MOON", "STAR", "FISH", "BIRD", "TREE", "RAIN", "CLOUD"
            ],
            hint: "มองหาคำศัพท์ 3 ตัวอักษรที่เป็นชื่อสิ่งของรอบตัว"
        },
        {
            id: 2,
            title: "ปลดล็อกประตูฐานลับ",
            description: "ประตูฐานลับถูกล็อกด้วยรหัสที่ซับซ้อน ต้องหารูปแบบของชุดตัวอักษรที่เป็นกุญแจ",
            texts: [
                "ABBA", "CDDC", "EFFE", "GHKG", "LMML", "NOPN", "QRRQ", "STTS", "UVVU", "WXXW"
            ],
            hint: "สังเกตความสัมพันธ์ของตัวอักษรตัวแรกและตัวสุดท้าย"
        },
        {
            id: 3,
            title: "ซ่อมแซมหุ่นยนต์",
            description: "หุ่นยนต์เสียการควบคุม ต้องป้อนชุดคำสั่งเพื่อแยกส่วนการทำงานของหุ่นยนต์และแก้ไข",
            texts: [
                "INIT_SYSTEM", "CHECK_SENSORS", "CALIBRATE_JOINTS", "REBOOT_MODULE", "ACTIVATE_SHIELD", "DEACTIVATE_WEAPON", "UPDATE_PROTOCOL", "ANALYZE_DATA", "CLEAN_LOGS", "RESTORE_CONFIG"
            ],
            hint: "พิมพ์คำสั่งที่เริ่มต้นด้วยกริยาและตามด้วยส่วนประกอบของระบบ"
        },
        // เพิ่มด่านอื่นๆ ที่นี่
        {
            id: 4,
            title: "การจัดเรียงข้อมูล",
            description: "ข้อมูลถูกจัดเรียงแบบสลับไปมา คุณต้องจัดเรียงให้เป็นระเบียบตามลำดับตัวอักษร",
            texts: [
                "apple banana cherry", "dog cat bird", "moon sun star", "water fire earth", "north south east west"
            ],
            hint: "พิมพ์คำศัพท์ตามลำดับตัวอักษรภาษาอังกฤษ"
        },
        {
            id: 5,
            title: "การสร้างอัลกอริทึมพื้นฐาน",
            description: "เติมเต็มช่องว่างของอัลกอริทึมง่ายๆ ให้ถูกต้อง",
            texts: [
                "IF light ON THEN open_blinds", "WHILE not_hungry EAT food", "FOR i = 1 TO 10 PRINT i", "FUNCTION add(x, y) RETURN x+y", "CLASS Animal: MOVE()"
            ],
            hint: "คำที่หายไปมักเป็นคำสั่งพื้นฐานในโปรแกรมมิ่ง"
        }
    ];

    // --- Virtual Keyboard Layout ---
    const keyboardLayout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
        ['Ctrl', 'Win', 'Alt', ' ', 'Alt', 'Win', 'Menu', 'Ctrl']
    ];

    const shiftedKeys = {
        '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
        '[': '{', ']': '}', '\\': '|', ';': ':', '\'': '"', ',': '<', '.': '>', '/': '?',
    };

    let isShiftPressed = false;
    let isCapslockOn = false;

    // --- Cookie Functions ---
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function loadGameData() {
        const savedData = getCookie('codeKeysGameData');
        if (savedData) {
            gameData = JSON.parse(savedData);
            maxLevelReached = gameData.maxLevelReached || 1;
        } else {
            gameData = {
                maxLevelReached: 1,
                levelScores: {} // { '1': { stars: 0, bestTime: 0, bestAccuracy: 0 } }
            };
        }
        updatePlayerInfo();
        renderLevelSelection(); // Render levels based on loaded data
    }

    function saveGameData() {
        setCookie('codeKeysGameData', JSON.stringify(gameData), 365); // Save for 1 year
    }

    // --- UI Management ---
    function showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    function updatePlayerInfo() {
        document.getElementById('player-name').textContent = `ผู้เล่น: นักสืบดิจิทัล`;
        document.getElementById('current-level').textContent = `ด่าน: ${currentLevel}`;
    }

    // --- Virtual Keyboard Functions ---
    function createVirtualKeyboard() {
        virtualKeyboardContainer.innerHTML = ''; // Clear existing keyboard
        keyboardLayout.forEach(rowKeys => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('key-row');
            rowKeys.forEach(keyText => {
                const keyDiv = document.createElement('div');
                keyDiv.classList.add('key');
                keyDiv.textContent = keyText;
                keyDiv.dataset.key = keyText; // Store original key value
                // Add specific classes for styling
                if (keyText === 'Backspace') keyDiv.classList.add('backspace');
                else if (keyText === 'Tab') keyDiv.classList.add('tab');
                else if (keyText === 'CapsLock') keyDiv.classList.add('capslock');
                else if (keyText === 'Enter') keyDiv.classList.add('enter');
                else if (keyText === 'Shift') keyDiv.classList.add('lshift'); // Default to left shift, apply rshift if needed later
                else if (keyText === 'Ctrl') keyDiv.classList.add('lctrl');
                else if (keyText === 'Win') keyDiv.classList.add('lwin');
                else if (keyText === 'Alt') keyDiv.classList.add('lalt');
                else if (keyText === ' ') keyDiv.classList.add('space');
                // For right side keys, assume specific classes if more complex layout is desired.
                // For simplicity, we'll map them here.
                if (keyText === 'Shift' && rowKeys.indexOf(keyText) > rowKeys.length / 2) keyDiv.classList.remove('lshift'); keyDiv.classList.add('rshift'); // Basic right shift logic
                if (keyText === 'Ctrl' && rowKeys.indexOf(keyText) > rowKeys.length / 2) keyDiv.classList.remove('lctrl'); keyDiv.classList.add('rctrl');
                if (keyText === 'Alt' && rowKeys.indexOf(keyText) > rowKeys.length / 2) keyDiv.classList.remove('lalt'); keyDiv.classList.add('ralt');
                if (keyText === 'Menu') keyDiv.classList.add('menu');

                rowDiv.appendChild(keyDiv);
            });
            virtualKeyboardContainer.appendChild(rowDiv);
        });
        updateKeyboardCase(); // Initial case update
    }

    function updateKeyboardCase() {
        const keys = virtualKeyboardContainer.querySelectorAll('.key');
        keys.forEach(keyDiv => {
            const originalKey = keyDiv.dataset.key;
            let displayKey = originalKey;

            if (originalKey.length === 1 && /[a-z]/.test(originalKey)) { // Only affect letter keys
                if (isCapslockOn && !isShiftPressed) {
                    displayKey = originalKey.toUpperCase();
                } else if (!isCapslockOn && isShiftPressed) {
                    displayKey = originalKey.toUpperCase();
                } else if (isCapslockOn && isShiftPressed) { // Both pressed, reverts to lowercase
                    displayKey = originalKey.toLowerCase();
                } else { // Neither pressed, normal lowercase
                    displayKey = originalKey.toLowerCase();
                }
            } else if (isShiftPressed && shiftedKeys[originalKey]) {
                displayKey = shiftedKeys[originalKey];
            } else if (isShiftPressed && originalKey === 'Shift') {
                // Do nothing for Shift key itself
            } else if (isCapslockOn && originalKey === 'CapsLock') {
                 // Do nothing for CapsLock key itself
            }

            // Handle special keys that don't change case but are important for display
            if (originalKey === 'Backspace' || originalKey === 'Tab' || originalKey === 'Enter' ||
                originalKey === 'Shift' || originalKey === 'CapsLock' || originalKey === 'Ctrl' ||
                originalKey === 'Alt' || originalKey === 'Win' || originalKey === 'Menu' || originalKey === ' ') {
                keyDiv.textContent = originalKey; // Keep original text for these
            } else {
                keyDiv.textContent = displayKey;
            }
        });
    }


    function highlightKey(character) {
        // Handle shift for special characters and uppercase letters
        let targetKey = character;
        let requiresShift = false;

        if (character >= 'A' && character <= 'Z') {
            targetKey = character.toLowerCase();
            requiresShift = true;
        } else if (Object.values(shiftedKeys).includes(character)) {
            targetKey = Object.keys(shiftedKeys).find(key => shiftedKeys[key] === character);
            requiresShift = true;
        }

        // Highlight actual character key
        const keyToHighlight = virtualKeyboardContainer.querySelector(`.key[data-key="${targetKey}"]`);
        if (keyToHighlight) {
            keyToHighlight.classList.add('highlight');
        }

        // Highlight Shift key if needed
        if (requiresShift) {
            const leftShift = virtualKeyboardContainer.querySelector('.key.lshift');
            const rightShift = virtualKeyboardContainer.querySelector('.key.rshift');
            if (leftShift) leftShift.classList.add('highlight');
            if (rightShift) rightShift.classList.add('highlight');
        }
    }

    function clearKeyHighlight() {
        document.querySelectorAll('.key.highlight').forEach(key => key.classList.remove('highlight'));
    }

    function pressKeyEffect(keyEventCode) {
        let keyElement = null;
        let keyToFind = '';

        // Map event.code to dataset.key
        if (keyEventCode.startsWith('Key')) {
            keyToFind = keyEventCode.slice(3).toLowerCase();
        } else if (keyEventCode.startsWith('Digit')) {
            keyToFind = keyEventCode.slice(5);
        } else if (keyEventCode === 'Space') {
            keyToFind = ' ';
        } else if (keyEventCode === 'Minus') {
            keyToFind = '-';
        } else if (keyEventCode === 'Equal') {
            keyToFind = '=';
        } else if (keyEventCode === 'BracketLeft') {
            keyToFind = '[';
        } else if (keyEventCode === 'BracketRight') {
            keyToFind = ']';
        } else if (keyEventCode === 'Backslash') {
            keyToFind = '\\';
        } else if (keyEventCode === 'Semicolon') {
            keyToFind = ';';
        } else if (keyEventCode === 'Quote') {
            keyToFind = '\'';
        } else if (keyEventCode === 'Comma') {
            keyToFind = ',';
        } else if (keyEventCode === 'Period') {
            keyToFind = '.';
        } else if (keyEventCode === 'Slash') {
            keyToFind = '/';
        } else if (keyEventCode === 'Backquote') {
            keyToFind = '`';
        } else if (keyEventCode === 'CapsLock') {
            keyToFind = 'CapsLock';
        } else if (keyEventCode === 'ShiftLeft' || keyEventCode === 'ShiftRight') {
            keyToFind = 'Shift'; // Both map to 'Shift'
        } else if (keyEventCode === 'ControlLeft' || keyEventCode === 'ControlRight') {
            keyToFind = 'Ctrl';
        } else if (keyEventCode === 'AltLeft' || keyEventCode === 'AltRight') {
            keyToFind = 'Alt';
        } else if (keyEventCode === 'MetaLeft' || keyEventCode === 'MetaRight') {
            keyToFind = 'Win';
        } else if (keyEventCode === 'Enter') {
            keyToFind = 'Enter';
        } else if (keyEventCode === 'Backspace') {
            keyToFind = 'Backspace';
        } else if (keyEventCode === 'Tab') {
            keyToFind = 'Tab';
        }

        keyElement = virtualKeyboardContainer.querySelector(`.key[data-key="${keyToFind}"]`);

        // Handle specific Shift/Caps Lock behavior for effect
        if (keyEventCode === 'ShiftLeft' || keyEventCode === 'ShiftRight') {
            isShiftPressed = true;
            updateKeyboardCase();
            const leftShift = virtualKeyboardContainer.querySelector('.key.lshift');
            const rightShift = virtualKeyboardContainer.querySelector('.key.rshift');
            if (leftShift) leftShift.classList.add('pressed');
            if (rightShift) rightShift.classList.add('pressed');
            return; // Don't apply 'pressed' to generic key element if it's shift
        } else if (keyEventCode === 'CapsLock') {
            isCapslockOn = !isCapslockOn;
            updateKeyboardCase();
            const capsLockKey = virtualKeyboardContainer.querySelector('.key.capslock');
            if (capsLockKey) {
                capsLockKey.classList.toggle('pressed', isCapslockOn);
            }
            return;
        }


        if (keyElement) {
            keyElement.classList.add('pressed');
        }
    }

    function releaseKeyEffect(keyEventCode) {
        let keyElement = null;
        let keyToFind = '';

        if (keyEventCode.startsWith('Key')) {
            keyToFind = keyEventCode.slice(3).toLowerCase();
        } else if (keyEventCode.startsWith('Digit')) {
            keyToFind = keyEventCode.slice(5);
        } else if (keyEventCode === 'Space') {
            keyToFind = ' ';
        } else if (keyEventCode === 'Minus') {
            keyToFind = '-';
        } else if (keyEventCode === 'Equal') {
            keyToFind = '=';
        } else if (keyEventCode === 'BracketLeft') {
            keyToFind = '[';
        } else if (keyEventCode === 'BracketRight') {
            keyToFind = ']';
        } else if (keyEventCode === 'Backslash') {
            keyToFind = '\\';
        } else if (keyEventCode === 'Semicolon') {
            keyToFind = ';';
        } else if (keyEventCode === 'Quote') {
            keyToFind = '\'';
        } else if (keyEventCode === 'Comma') {
            keyToFind = ',';
        } else if (keyEventCode === 'Period') {
            keyToFind = '.';
        } else if (keyEventCode === 'Slash') {
            keyToFind = '/';
        } else if (keyEventCode === 'Backquote') {
            keyToFind = '`';
        } else if (keyEventCode === 'CapsLock') {
            keyToFind = 'CapsLock'; // CapsLock remains pressed if on
        } else if (keyEventCode === 'ShiftLeft' || keyEventCode === 'ShiftRight') {
            keyToFind = 'Shift';
        } else if (keyEventCode === 'ControlLeft' || keyEventCode === 'ControlRight') {
            keyToFind = 'Ctrl';
        } else if (keyEventCode === 'AltLeft' || keyEventCode === 'AltRight') {
            keyToFind = 'Alt';
        } else if (keyEventCode === 'MetaLeft' || keyEventCode === 'MetaRight') {
            keyToFind = 'Win';
        } else if (keyEventCode === 'Enter') {
            keyToFind = 'Enter';
        } else if (keyEventCode === 'Backspace') {
            keyToFind = 'Backspace';
        } else if (keyEventCode === 'Tab') {
            keyToFind = 'Tab';
        }

        keyElement = virtualKeyboardContainer.querySelector(`.key[data-key="${keyToFind}"]`);

        // Handle specific Shift/Caps Lock behavior for effect
        if (keyEventCode === 'ShiftLeft' || keyEventCode === 'ShiftRight') {
            isShiftPressed = false;
            updateKeyboardCase();
            const leftShift = virtualKeyboardContainer.querySelector('.key.lshift');
            const rightShift = virtualKeyboardContainer.querySelector('.key.rshift');
            if (leftShift) leftShift.classList.remove('pressed');
            if (rightShift) rightShift.classList.remove('pressed');
            return;
        }
        // CapsLock key's 'pressed' class is toggled on keydown, so no action on keyup unless toggling off

        if (keyElement) {
            // Only remove 'pressed' if it's not CapsLock and CapsLock is currently 'on'
            if (keyEventCode !== 'CapsLock' || !isCapslockOn) {
                keyElement.classList.remove('pressed');
            }
        }
    }


    // --- Game Logic ---

    function getRandom
