let canvas_width = 1250;
let canvas_height = 900;
let grid_size = 9;
let grid_top = 20;
let grid_bottom = 880;
let cell_w = canvas_width / grid_size;
let cell_h = (grid_bottom - grid_top) / grid_size;
let clicked_cell = null;
let num = [];
let position_num = [];

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
    for(let row = 0; row < grid_size; row++){//loop Matrix 9x9
        for(let col = 0; col < grid_size; col++){
            let [x , y , x2 , y2] = position_num[row][col] //assign multiple variable from position_num like Ex. position_num[0][0] is [12,23,24,54] then x = 12 , y = 23 , x2 =24 ,y2 = 54 
            if(culculate_box(mouseX,mouseY,x,y,x2,y2)){
                clicked_cell = [row,col];
            }
        }
    }
}

function keyPressed(){
    num;
    if(clicked_cell != null){
        let [row, col] = clicked_cell;
        num[row][col] = parseInt(key);
    }
}
