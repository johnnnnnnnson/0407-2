let cols = 15;
let rows = 15;
let cellW, cellH;
let targetX, targetY;
let gameState = "START"; // 遊戲狀態: START, PLAYING, WIN, LOSE
let timeLimit = 30; // 倒數時間 30 秒
let startTime;
let maxDist;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
  maxDist = dist(0, 0, cols, rows);
}

function initGame() {
  targetX = floor(random(cols));
  targetY = floor(random(rows));
  gameState = "PLAYING";
  startTime = millis();
}

function draw() {
  background(40);

  if (gameState === "START") {
    showStartScreen();
  } else if (gameState === "PLAYING") {
    drawGrid();
    drawHoverEffect();
    checkTimeAndDrawUI();
  } else if (gameState === "WIN") {
    showEndScreen("遊戲成功！你找到了唯一座標！", color(60, 180, 90));
  } else if (gameState === "LOSE") {
    showEndScreen("挑戰失敗！時間已到。", color(200, 60, 60));
  }
}

function drawGrid() {
  stroke(80);
  for (let i = 0; i <= cols; i++) {
    line(i * cellW, 0, i * cellW, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * cellH, width, j * cellH);
  }
}

function drawHoverEffect() {
  let gridX = floor(mouseX / cellW);
  let gridY = floor(mouseY / cellH);

  // 確保滑鼠在畫布範圍內
  if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
    let d = dist(gridX, gridY, targetX, targetY);
    let normalizedDist = d / maxDist;
    
    // 距離越近，圓圈越大
    let cSize = map(normalizedDist, 0, 1, min(cellW, cellH) * 0.9, min(cellW, cellH) * 0.2);
    
    // 距離越近，顏色越偏紅/暖色；越遠越偏藍/冷色。目標點自然呈現最鮮豔的紅色，不突兀
    let rCol = map(normalizedDist, 0, 0.7, 255, 50, true);
    let bCol = map(normalizedDist, 0.3, 1, 50, 255, true);
    let col = color(rCol, 50, bCol);

    fill(col);
    noStroke();
    ellipse(gridX * cellW + cellW / 2, gridY * cellH + cellH / 2, cSize);
  }
}

function checkTimeAndDrawUI() {
  let elapsed = floor((millis() - startTime) / 1000);
  let timeLeft = max(0, timeLimit - elapsed);
  
  if (timeLeft <= 0) {
    gameState = "LOSE";
  }

  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`倒數: ${timeLeft} 秒`, 15, 15);
}

function mousePressed() {
  if (gameState === "START") {
    initGame();
  } else if (gameState === "PLAYING") {
    let gridX = floor(mouseX / cellW);
    let gridY = floor(mouseY / cellH);

    // 確保點擊範圍在網格內
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      // 點擊確認是否為目標座標
      if (gridX === targetX && gridY === targetY) {
        gameState = "WIN";
      } else {
        // 點錯懲罰：將開始時間往前推 3000 毫秒，相當於扣除 3 秒鐘
        startTime -= 3000;
      }
    }
  } else {
    // 遊戲結束時點擊回到開始畫面
    gameState = "START";
  }
}

function showEndScreen(msg, bgColor) {
  background(bgColor);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(msg, width / 2, height / 2 - 20);
  
  textSize(20);
  text("點擊畫面重新開始", width / 2, height / 2 + 40);
  
  // 顯示目標座標以便在失敗時檢閱
  if (gameState === "LOSE") {
    textSize(16);
    fill(200);
    text(`正確的目標座標為: (${targetX}, ${targetY})`, width / 2, height / 2 + 80);
  }
}

function showStartScreen() {
  background(40);
  fill(255);
  textAlign(CENTER, CENTER);
  
  textSize(36);
  text("尋寶遊戲", width / 2, height / 2 - 80);
  
  textSize(18);
  text("【 規則說明 】\n移動滑鼠尋找唯一正確的方格。\n圓圈越大、顏色越暖（紅），代表距離越近！\n點擊錯誤會扣除 3 秒鐘。\n請在 30 秒內找到隱藏的目標！", width / 2, height / 2);
  
  textSize(24);
  fill(255, 215, 0); // 給開始提示一個顯眼的顏色
  text("點擊畫面開始遊戲", width / 2, height / 2 + 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellW = width / cols;
  cellH = height / rows;
}