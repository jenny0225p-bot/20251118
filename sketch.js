let sprite;
let sprite2;
const TOTAL_FRAMES = 9;
const SPRITE_SHEET_W = 1525;
const SPRITE_SHEET_H = 180;
let FRAME_W;
let FRAME_H = SPRITE_SHEET_H;
let ANIM_SPEED = 6; // lower = faster

// 動畫控制：初始不播放，使用 animTick 作為進度計數器（只在播放時增加）
let animTick = 0;
let playing = false;

// 第二個精靈（預設 6 幀，圖片大小 1516x265）
const TOTAL_FRAMES_2 = 9;
const SPRITE2_W = 1520;
const SPRITE2_H = 270;
let FRAME2_W;
let FRAME2_H = SPRITE2_H;

function preload() {
  sprite = loadImage('1/all.png');
  sprite2 = loadImage('2/all2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 使用整數寬度避免子像素偏移
  FRAME_W = floor(SPRITE_SHEET_W / TOTAL_FRAMES);
  FRAME2_W = floor(SPRITE2_W / TOTAL_FRAMES_2);
  imageMode(CENTER);
  smooth();
}

function draw() {
  background('#9a8c98');

  if (!sprite) return;

  // 若正在播放則增加 animTick，否則保持原地（實現暫停）
  if (playing) animTick++;

  // 使用 animTick 作為全域 tick，並把第一張精靈的進度對映到第二張精靈，保持兩者連動
  let globalTick = animTick / ANIM_SPEED;
  let idx = floor(globalTick) % TOTAL_FRAMES;
  // 把 globalTick 在第一張表的循環內的進度，映射到第二張的幀索引
  let idx2 = floor((globalTick % TOTAL_FRAMES) * TOTAL_FRAMES_2 / TOTAL_FRAMES) % TOTAL_FRAMES_2;

  // 讓兩個角色大小一致並依視窗尺寸自動縮放
  let desiredW = min(width, height) / 4; // 每個角色寬佔視窗的四分之一

  // 第一個角色顯示尺寸
  let scale1 = desiredW / FRAME_W;
  let displayW1 = FRAME_W * scale1;
  let displayH1 = FRAME_H * scale1;

  // 第二個角色顯示尺寸（與第一個顯示寬度相近，維持比例）
  let scale2 = desiredW / FRAME2_W;
  let displayW2 = FRAME2_W * scale2;
  let displayH2 = FRAME2_H * scale2;

  // 固定水平間距為 50px，並使整體水平置中；移除水平擺動，僅保留上下 bobbing
  let gap = 50;
  let totalWidth = displayW1 + gap + displayW2;
  let left = width / 2 - totalWidth / 2;
  let x1 = left + displayW1 / 2;
  let x2 = left + displayW1 + gap + displayW2 / 2;

  // 加入小幅上下擺動讓連動更有生命感（兩者有小相位差）
  // bobbing 的時間基準改為 animTick，只有在播放時會運動
  let t = animTick * 0.05; // 可調頻率
  let bobAmp = max(2, desiredW * 0.02);
  let bob1 = sin(t * 2) * bobAmp;
  let bob2 = sin(t * 2 + 0.3) * bobAmp * 0.9;

  let y1 = height / 2 + bob1;
  let y2 = height / 2 + bob2;

  // 繪製第一個角色（來源座標取整數避免取樣誤差）
  let sx = floor(idx * FRAME_W);
  image(sprite, x1, y1, displayW1, displayH1, sx, 0, FRAME_W, FRAME_H);

  // 繪製第二個角色，使用映射過的幀索引並略微不同相位使連動更自然
  if (sprite2) {
    let sx2 = floor(idx2 * FRAME2_W);
    image(sprite2, x2, y2, displayW2, displayH2, sx2, 0, FRAME2_W, FRAME2_H);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 點擊畫布切換播放狀態（只在畫布範圍內切換）
function mouseClicked() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    playing = !playing;
  }
}
