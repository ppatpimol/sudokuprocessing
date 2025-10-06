let canvas_width = 750;
let canvas_height = 1000;
let grid_size = 9;
let grid_top = 20;
let grid_bottom = 650;
let cell_w = canvas_width / grid_size;
let cell_h = (grid_bottom - grid_top) / grid_size;
let clicked_cell = null;
let num = [];
let position_num = [];
let fixedCells = new Set();
let selectedNumber = null;
let selectorTop;
let selectorH = 50;
let cellSelectorW;
let isError = [];
let solution = [];
let showCorrect = false;
let btnW = 160, btnH = 45;
let resetX = 60, resetY;
let showX, showY;
for (let r = 0; r < grid_size; r++) {
    num[r] = [];
    isError[r] = [];
    solution[r] = [];
    for (let c = 0; c < grid_size; c++) {
      num[r][c] = 0;
      isError[r][c] = false;
      solution[r][c] = 0;
    }
 }

for(let row = 0; row < grid_size; row++){
    let row_pos = [];//Create A Blank Column to recieve a box position 
    for(let col = 0; col < grid_size; col++){
        let x = col * cell_w;
        let y = grid_top + row * cell_h;
        let x2 = x + cell_w;
        let y2 = y + cell_h;
        row_pos.push([x,y,x2,y2]);//Store Array Ex. row_pos = [[2,3,4,5],[?,?,?,?],....]
    }
    position_num.push(row_pos)//Store Array in Array Ex. postion_num = [[[2,3,4,5],[?,?,?,?],....],[[2,3,4,5],[?,?,?,?],....]]
}
        
function setup(){
    createCanvas(canvas_width, canvas_height);
    cell_w = canvas_width / grid_size;
    cell_h = (grid_bottom - grid_top) / grid_size;
    cellSelectorW = canvas_width / grid_size;
    selectorTop = grid_bottom + 20;
    generatePuzzle();
    textAlign(CENTER, CENTER);
    resetY = grid_bottom + 100;
    showY  = grid_bottom + 100;
    showX  = 280;
}

function draw(){
    draw_grid();     
}        
function draw_grid(){
    background(255);
    draw_table();
    draw_subtable();
    if(clicked_cell != null){       
        draw_highlight(clicked_cell[0], clicked_cell[1]);
    }
    drawNumbers();
    drawNumberSelector();
    drawErrors();
    drawButtons();
}

function draw_table(){
    strokeWeight(5);
    line(0, grid_top, width, grid_top);
    line(0, grid_bottom, width, grid_bottom);
    
    for(let i = 1; i < grid_size; i++){
        if(i % 3 == 0){
            let x = i * cell_w //3 * (500/9);
            line(x, grid_top, x, grid_bottom);
        }
    }

    for(let j = 1; j < grid_size; j++){
        if(j % 3 == 0){
            let y = grid_top + j * cell_h;
            line(0, y, width, y);
        }
    }
}

function draw_subtable(){
    strokeWeight(1)
    for(let i = 1; i < grid_size; i++){
        if(i % 3 != 0){
            let x = i * cell_w //1 * (500/9);
            line(x, grid_top, x, grid_bottom);
        }
    }
    
    for(let j = 1; j < grid_size; j++){
        if(j % 3 != 0){
            let y = grid_top + j * cell_h;
            line(0, y, width, y);
        }
    }
}

function draw_highlight(row, col) {
  noStroke();
  fill(255, 200, 200);
  rect(col * cell_w, grid_top + row * cell_h, cell_w, cell_h);
  
}
    
function culculate_box(Xuser,Yuser,x,y,x2,y2){
    return(Xuser > x && Xuser < x2 && Yuser > y && Yuser < y2);
}
        
function mousePressed(){
    for (let row = 0; row < grid_size; row++) {
      for (let col = 0; col < grid_size; col++) {
        let [x, y, x2, y2] = position_num[row][col];
        if (culculate_box(mouseX, mouseY, x, y, x2, y2)) {
          if (!fixedCells.has(row * grid_size + col)) {
            clicked_cell = [row, col];
          }
          return;
        }
      }
    }
    if (mouseY >= selectorTop && mouseY <= selectorTop + selectorH) {
      for (let i = 0; i < 9; i++) {
        let x = i * cellSelectorW;
        if (mouseX >= x && mouseX <= x + cellSelectorW) {
          selectedNumber = i + 1;
          if (clicked_cell) {
            let [row, col] = clicked_cell;
            if (!fixedCells.has(row * grid_size + col)) {
              num[row][col] = selectedNumber;
            }
          }
          return;
        }
      }
    }
      // Reset button
    if (inBox(mouseX, mouseY, resetX, resetY, resetX + btnW, resetY + btnH)) {
      generatePuzzle();
      clicked_cell = null;
      selectedNumber = null;
      showCorrect = false;
      for (let i = 0; i < grid_size; i++)
        for (let j = 0; j < grid_size; j++)
          isError[i][j] = false;
      return;
    }

    // Show Correct button
    if (inBox(mouseX, mouseY, showX, showY, showX + btnW, showY + btnH)) {
      showCorrect = !showCorrect;
      return;
    }
}

function keyPressed(){
    if (clicked_cell) {
      let [row, col] = clicked_cell;
      if (!fixedCells.has(row * grid_size + col)) {
        if (key >= '1' && key <= '9') {
          num[row][col] = parseInt(key);
        } else if (key === '0' || key === 'Backspace' || key === 'Delete') {
          num[row][col] = 0;
        }
      }
    }
    if (key === 'r' || key === 'R') {
    generatePuzzle();
    clicked_cell = null;
    selectedNumber = null;
}
 }
function drawNumbers() {
  textSize(24);
  textAlign(CENTER, CENTER);
  for (let row = 0; row < grid_size; row++) {
    for (let col = 0; col < grid_size; col++) {
      let n = num[row][col];
      if (n !== 0) {
        let x = col * cell_w + cell_w / 2;
        let y = grid_top + row * cell_h + cell_h / 2;
        if (showCorrect && n === solution[row][col]) {
          fill(0, 180, 0); // green
        } else if (fixedCells.has(row * grid_size + col)) {
          fill(0);
        } else {
          fill(50, 100, 255);
        }
        text(n, x, y);
      }
    }
  }
}
function drawNumberSelector() {//1-9
  let selectorTop = grid_bottom + 20;
  let selectorH = 50;
  let cellSelectorW = canvas_width / 9;

  for (let i = 0; i < 9; i++) {
    let x = i * cellSelectorW;
    let y = selectorTop;
    fill(selectedNumber === i + 1 ? 200 : 240);
    stroke(0);
    rect(x, y, cellSelectorW, selectorH);

    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(i + 1, x + cellSelectorW / 2, y + selectorH / 2);
  }
}
function generateSolution() {
  let board = Array.from({ length: grid_size }, () => Array(grid_size).fill(0));
  solveBoard(board);
  return board;
}
function solveBoard(board) {
  for (let row = 0; row < grid_size; row++) {
    for (let col = 0; col < grid_size; col++) {
      if (board[row][col] === 0) {
        let nums = shuffle([...Array(9).keys()].map(n => n + 1));
        for (let numTry of nums) {
          if (isValid(board, row, col, numTry)) {
            board[row][col] = numTry;
            if (solveBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
function isValid(board, row, col, num) {
  if (board[row].includes(num)) return false;
  for (let r = 0; r < grid_size; r++) {
    if (board[r][col] === num) return false;
  }
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}
function generatePuzzle() {
  solution = generateSolution();
  num = JSON.parse(JSON.stringify(solution));
  fixedCells.clear();
  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      if (random() > 0.6) {
        fixedCells.add(r * grid_size + c);
      } else {
        num[r][c] = 0;
      }
      isError[r][c] = false;
    }
  }
}
function drawButtons() {
  fill(230);
  stroke(0);
  rect(resetX, resetY, btnW, btnH, 10);
  fill(0);
  textSize(16);
  text("Reset Puzzle", resetX + btnW / 2, resetY + btnH / 2);

  fill(showCorrect ? color(150, 255, 150) : 230);
  stroke(0);
  rect(showX, showY, btnW, btnH, 10);
  fill(0);
  text("Show Correct", showX + btnW / 2, showY + btnH / 2);
}
function inBox(mx, my, x, y, x2, y2) {
  return mx > x && mx < x2 && my > y && my < y2;
}
function shuffleNumbers() {
  let a = [];
  for (let i = 0; i < 9; i++) a[i] = i + 1;
  for (let i = 8; i > 0; i--) {
    let j = Math.floor(random(i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function drawErrors() {
  noFill();
  stroke(255, 0, 0);
  strokeWeight(3);
  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      if (num[r][c] == 0 || fixedCells.has(r * grid_size + c)) continue;

      let wrong = false;
      if (solution && solution[r][c] !== 0) {
        wrong = (num[r][c] !== solution[r][c]);
      } else {
        let v = num[r][c];
        for (let i = 0; i < grid_size && !wrong; i++) {
          if (i != c && num[r][i] == v) wrong = true;
          if (i != r && num[i][c] == v) wrong = true;
        }

        let sr = Math.floor(r / 3) * 3;
        let sc = Math.floor(c / 3) * 3;
        for (let rr = sr; rr < sr + 3 && !wrong; rr++) {
          for (let cc = sc; cc < sc + 3 && !wrong; cc++) {
            if ((rr != r || cc != c) && num[rr][cc] == v) wrong = true;
          }
        }
      }

      if (wrong) {
        let x = c * cell_w;
        let y = grid_top + r * cell_h;
        rect(x, y, cell_w, cell_h);
        rect(x + 2, y + 2, cell_w - 4, cell_h - 4);
      }
    }
  }
  noStroke();
}
