var board = new Array();
var added = new Array();
var score = 0;
var top = 240;
$(document).ready(function (e) {
    newGame();
});

function newGame() {
    //初始化棋盘格
    init();
    //再随机两个各自生成的数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    $("#gameOver").css('display', 'none');
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#gridCell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        //初始化格子数组
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }

    for (var i = 0; i < 4; i++) {
        //初始化判定合并的数组
        added[i] = new Array();
        for(var j = 0; j < 4; j++) {
            added[i][j] = 0;
        }
    }

    //通知前端对board二维数组进行设定
    updateBoardView();
}

function updateBoardView() {
    //更新数组的前端样式
    $(".numberCell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#gridContainer").append('<div class="numberCell" id="numberCell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#numberCell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
            }
            else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                //numberCell覆盖
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j])); //返回背景色
                theNumberCell.css('color', getNumberColor(board[i][j])); //返回前景色
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

function generateOneNumber() {
    //生成随机的格子
    if (nospace(board)) return false;
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randx][randy] == 0) break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

//事件响应循环
$(document).keydown(function (event) {
    switch (event.keyCode) {
        //left
        case 37:
            if (moveLeft()) {
                getScore();
                generateOneNumber();
                //setTimeout("", 400);
            }
            break;
    }
})

function moveLeft() {
    //判断能否左移
    if (!canMoveLeft(board)) return false;
    //清空
    resetAddedArray();
    //移动
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    //落脚位置是否为空及中间无障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }
                    //落脚位置的数字和本来的数字相等及中间无障碍物
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        if (added[i][k] != 0) {
                            board[i][k + 1] = board[i][j];
                            board[i][j] = 0;
                        }
                        else {
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}