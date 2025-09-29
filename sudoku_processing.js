let canvas_width = 500;
let canvas_height = 750;
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
for(let i = 0; i < grid_size; i++){
    num[i] = [];
    for(let j = 0; j < grid_size; j++){
        num[i][j] = 0;
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
}

function draw(){
    draw_grid();
    
    
}

        
function draw_grid(){
    background(255);
    draw_table();
    draw_subtable();
    if(clicked_cell != null){
        draw_circle_in_cell(...clicked_cell);
    }
    drawNumbers();
    drawNumberSelector();
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
            let y = grid_top + j * cell_h
            line(0, y, width, y)
        }
    }
}

function draw_circle_in_cell(row, col){
    let x = col * cell_w + cell_w / 2
    let y = grid_top + row * cell_h + cell_h / 2
    fill(255, 0, 0)
    ellipse(x, y, 20, 20)
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
        if (fixedCells.has(row * grid_size + col)) {
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
  num = generateSolution();
  fixedCells.clear();
  for (let r = 0; r < grid_size; r++) {
    for (let c = 0; c < grid_size; c++) {
      if (random() > 0.6) {
        fixedCells.add(r * grid_size + c);
      } else {
        num[r][c] = 0;
      }
    }
  }
}
