let canvas_width =525;
let canvas_height = 800;
let grid_size = 9;
let grid_top =125;
let grid_bottom = 625;
let xflowchart = 650;        
let yflowchart =50; 
let selectorH = 50;
let selectedNumber = null;
let selectorTop;
let cellSelectorW;
let cell_w = canvas_width / grid_size;
let cell_h = (grid_bottom - grid_top) / grid_size;
let clicked_cell = null;
let num = [];
let position_num = [];
let fixedCells = new Set();
let isError = [];
let solution = [];
let showCorrect = false;
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
function setup(){//Initializes the canvas and game state
    createCanvas(1000, canvas_height);
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
    background(255);
    drawflowchart();
    draw_grid();
}        
function draw_grid(){//Manages full grid
    draw_table();
    draw_subtable();
    if(clicked_cell != null){       
        draw_highlight(clicked_cell[0], clicked_cell[1],225,225,225);
        drawhighlightSameNumbers();
    }
    drawNumbers();
    drawNumberSelector();
    drawErrors();
}

function draw_table(){//Draws the bold lines for 3*3
    strokeWeight(5);
    line(0, grid_top,canvas_width, grid_top);
    line(0, grid_bottom,canvas_width, grid_bottom);
    for(let i = 1; i < grid_size; i++){
        if(i % 3 == 0){
            let x = i * cell_w //3 * (500/9);
            line(x, grid_top, x, grid_bottom);
        }
    }
    for(let j = 1; j < grid_size; j++){
        if(j % 3 == 0){
            let y = grid_top + j * cell_h;
            line(0, y,canvas_width, y);
        }    
    }
    strokeWeight(5);
    line(canvas_width-1,grid_top,canvas_width-1,grid_bottom);
}

function draw_subtable(){//9*9
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
            line(0, y,canvas_width, y);
        }
    }
}
function draw_highlight(row, col) {//Highlights the selected cell in pink
    noStroke();
    fill(255, 200, 200);
    rect(col * cell_w, grid_top + row * cell_h, cell_w, cell_h);  
}    
function culculate_box(Xuser,Yuser,x,y,x2,y2){
    return(Xuser > x && Xuser < x2 && Yuser > y && Yuser < y2);
}        
function mousePressed(){//Handles mouse clicks to select a cell
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

function keyPressed(){//insert number (1-9), delete (0/Backspace), or reset (r key).
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
                if (!fixedCells.has(row * grid_size + col) && n === solution[row][col]) {
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
function generateSolution() {//Generates a full valid Sudoku solution
    let board = Array.from({ length: grid_size }, () => Array(grid_size).fill(0));
    solveBoard(board);
    return board;
}
function solveBoard(board) {//Recursive backtracking function to solve
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
function isValid(board, row, col, num) {//Checks if placing num in row, col is valid
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
function generatePuzzle() {//using a valid solution/then randomly removes some numbers to create a playable puzzle
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
function inBox(mx, my, x, y, x2, y2) {
    return mx > x && mx < x2 && my > y && my < y2;
}
function shuffleNumbers() {//Shuffles numbers 1–9 for random
    let a = [];
    for (let i = 0; i < 9; i++) a[i] = i + 1;
    for (let i = 8; i > 0; i--) {
        let j = Math.floor(random(i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function drawErrors() {//Shows red borders around cells with invalid
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
function drawArrow(x, y1, y2) {//Draws vertical and horizontal
    let arrowGap = 10;
    stroke(0);
    strokeWeight(2);
    line(x, y1, x, y2 - arrowGap);
    line(x, y2 - arrowGap, x - 5, y2 - arrowGap - 5);
    line(x, y2 - arrowGap, x + 5, y2 - arrowGap - 5);
}
function start_stop_type(posx, posy, size, word) {//Draws start/end 
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(posx, posy, size, size / 2);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(word, posx, posy);
    return posy + size / 4 + 100;
}
function process_type(posx, posy, size, word) {//Draws rectangle
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(posx - size / 2, posy - size / 2, size, size); // centered box
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(word, posx, posy);
    return posy + size / 2 + 100;
}
function decision_type(posx, posy, size, word) {//Draws diamond shape
    fill(255);
    stroke(0);
    strokeWeight(2);
    quad(
        posx, posy - size / 2,         // top
        posx + size, posy,             // right
        posx, posy + size / 2,         // bottom
        posx - size, posy              // left
    );
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(word, posx, posy);
    return posy + size / 2 + 100;
}
function drawArrowHorizontal(x1, x2, y) {
    stroke(0);
    strokeWeight(2);
    line(x1, y, x2 - 10, y);
    line(x2 - 10, y, x2 - 15, y - 5);
    line(x2 - 10, y, x2 - 15, y + 5);
}
function text_box(x, y, size, word) {//Draws small labeled rectangles
    fill(255);
    stroke(0);
    rect(x, y, 40, 20);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(word, x + 20, y + 10);
}
function drawflowchart(){//Draws a full logic flowchart
    let y1 = start_stop_type(xflowchart, yflowchart, 100, "START");
    drawArrow(xflowchart, yflowchart + 25, y1 - 50);
    let y2 = process_type(xflowchart, y1, 100, "Initialize Grid");
    drawArrow(xflowchart, y1 + 50, y2 - 40);
    let y3 = process_type(xflowchart, y2, 110, "User Interaction");
    drawArrow(xflowchart, y2 + 55, y3 - 50);
    let y4 = decision_type(xflowchart, y3, 100, "Is Solved?");
    text("TRUE", xflowchart + 25, y4 - 75);
    drawArrowHorizontal(xflowchart + 100, xflowchart + 200, y3);
    text("FALSE", xflowchart + 120, y3 - 20);
    drawArrow(xflowchart + 200, y3, y4 - 50);
    drawArrow(xflowchart, y3 + 50, y4 - 50);
    let y5 = process_type(xflowchart, y4, 100, "Show Result");
    drawArrow(xflowchart, y4 + 50, y5 - 70);
    drawArrowHorizontal(xflowchart, xflowchart + 200, y5 - 70);
    let y5alt = process_type(xflowchart + 200, y4, 100, "Show Mistake");
    drawArrow(xflowchart + 200, y4 + 50, y5 - 50);
    start_stop_type(xflowchart + 200, y5alt - 25, 100, "END");
}
function drawhighlightSameNumbers() {//Highlights all other cells with the same number
    if (!clicked_cell) return;
    let [selectedRow, selectedCol] = clicked_cell;
    let selectedVal = num[selectedRow][selectedCol];
    if (selectedVal === 0) return;
    stroke(255, 150, 0);
    strokeWeight(3);
    noFill();
    for (let row = 0; row < grid_size; row++) {
        for (let col = 0; col < grid_size; col++) {
            if (row === selectedRow && col === selectedCol) continue;
            if (num[row][col] === selectedVal) {
            let x = col * cell_w;
            let y = grid_top + row * cell_h;
            rect(x + 2, y + 2, cell_w - 4, cell_h - 4);
            }
        }
    }
    noStroke();
}
