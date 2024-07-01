// script8.js

document.addEventListener('DOMContentLoaded', function() {
    const redOnlyButton = document.getElementById('redOnlyButton');
    const threeColorsButton = document.getElementById('threeColorsButton');
    const buttonContainer = document.getElementById('button-container');
    const message = document.getElementById('message');
    const result1Div = document.getElementById('result1');
    const result2Div = document.getElementById('result2');
    let startTime, endTime;
    let attempts = 0;
    let reactionTimesRed = [];
    let reactionTimesThree = [];
    const redOnlyColor = '#ff0000'; // 赤一色
    const threeColors = ['#ff0000', '#008000', '#ffff00']; // 赤, 緑, 黄色
    const maxAttempts = 5; // 黄色が出るまでの最大試行回数
    let currentAttempts = 0; // 現在の試行回数
    let currentMode = ''; // 現在のモード

    redOnlyButton.addEventListener('click', function() {
        currentMode = 'redOnly';
        showInstruction("画面が赤色になったら左クリックをしてください", startTest);
    });

    threeColorsButton.addEventListener('click', function() {
        currentMode = 'threeColors';
        showInstruction("画面が黄色になったら左クリックをしてください", startTest);
    });

    function showInstruction(instruction, callback) {
        message.textContent = instruction;
        setTimeout(callback, 3000); // 3秒後にテスト開始
    }

    function getRandomTime(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomColor() {
        if (currentMode === 'redOnly') {
            return redOnlyColor;
        } else {
            return threeColors[Math.floor(Math.random() * threeColors.length)];
        }
    }

    function startTest() {
        buttonContainer.style.display = 'none'; // ボタンを非表示にする
        result1Div.style.display = 'none'; // 結果コンテナを非表示にする
        result2Div.style.display = 'none'; // 結果コンテナを非表示にする
        if (attempts === 0) {
            if (currentMode === 'redOnly') {
                reactionTimesRed = [];
            } else {
                reactionTimesThree = [];
            }
        }
        message.textContent = "待ってください...";
        setTimeout(() => {
            let chosenColor;
            if (currentMode === 'threeColors') {
                chosenColor = (currentAttempts >= maxAttempts) ? '#ffff00' : getRandomColor();
                if (chosenColor === '#ffff00') {
                    message.textContent = "今すぐクリック！";
                    startTime = new Date().getTime();
                    currentAttempts = 0; // リセット
                } else {
                    message.textContent = "黄色を待ってください...";
                    currentAttempts++;
                }
            } else {
                chosenColor = redOnlyColor;
                message.textContent = "今すぐクリック！";
                startTime = new Date().getTime();
            }
            document.body.style.backgroundColor = chosenColor;
            if (chosenColor === '#ffff00' || currentMode === 'redOnly') {
                document.addEventListener('click', endTest);
            } else {
                setTimeout(nextTest, 500);
            }
        }, getRandomTime(500, 2000)); // ここで1秒から2秒に変更
    }

    function endTest() {
        endTime = new Date().getTime();
        const reactionTime = (endTime - startTime) / 1000;
        if (currentMode === 'redOnly') {
            reactionTimesRed.push(reactionTime);
        } else {
            reactionTimesThree.push(reactionTime);
        }
        attempts++;
        message.textContent = `反応速度: ${reactionTime} 秒`;
        document.body.style.backgroundColor = "#f0f0f0";
        document.removeEventListener('click', endTest);

        if (attempts < 5) {
            setTimeout(startTest, 1000);
        } else {
            displayResults();
        }
    }

    function nextTest() {
        document.body.style.backgroundColor = "#f0f0f0";
        if (attempts < 5) {
            setTimeout(startTest, 1000);
        } else {
            displayResults();
        }
    }

    function displayResults() {
        let result1HTML = "<ul>";
        let result2HTML = "<ul>";
        if (reactionTimesRed.length > 0) {
            reactionTimesRed.forEach((time, index) => {
                result1HTML += `<li>テスト ${index + 1}: ${time} 秒</li>`;
            });
            result1HTML += `</ul><p>平均反応速度: ${(reactionTimesRed.reduce((a, b) => a + b, 0) / reactionTimesRed.length).toFixed(3)} 秒</p>`;
            result1Div.innerHTML = `<h3>Test1の結果</h3>` + result1HTML + 
                                   `<div class="button-container">
                                        <button id="copyResult1" onclick="copyToClipboard('result1')">結果をコピー</button>
                                        <a id="tweetResult1" href="#" target="_blank">
                                            <img src="twitter.png" alt="ツイートする">
                                        </a>
                                    </div>`;
            result1Div.style.display = 'block'; // 結果コンテナを表示する
        }
        if (reactionTimesThree.length > 0) {
            reactionTimesThree.forEach((time, index) => {
                result2HTML += `<li>テスト ${index + 1}: ${time} 秒</li>`;
            });
            result2HTML += `</ul><p>平均反応速度: ${(reactionTimesThree.reduce((a, b) => a + b, 0) / reactionTimesThree.length).toFixed(3)} 秒</p>`;
            result2Div.innerHTML = `<h3>Test2の結果</h3>` + result2HTML + 
                                   `<div class="button-container">
                                        <button id="copyResult2" onclick="copyToClipboard('result2')">結果をコピー</button>
                                        <a id="tweetResult2" href="#" target="_blank">
                                            <img src="twitter.png" alt="ツイートする">
                                        </a>
                                    </div>`;
            result2Div.style.display = 'block'; // 結果コンテナを表示する
        }
        message.textContent = ''; // メッセージをクリアする
        attempts = 0;
        currentAttempts = 0;
        currentMode = '';
        buttonContainer.style.display = 'flex'; // ボタンを再表示する
    }


    window.copyToClipboard = function(elementId) {
        const el = document.getElementById(elementId);
        const range = document.createRange();
        range.selectNodeContents(el.querySelector('ul'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        alert('結果がコピーされました');
    }
    
    window.tweetResult = function(testTitle, results, average) {
        const tweetText = `${testTitle}${average}秒だ!`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
    }
});

