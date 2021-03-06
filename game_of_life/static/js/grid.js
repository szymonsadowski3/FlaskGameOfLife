var CURRENT_GRID = [];
var PLAY_INTERVAL;
var INTERVAL_RUNNING = false;

function stopPlayInterval() {
    INTERVAL_RUNNING = false;
    clearInterval(PLAY_INTERVAL);
    $("#play_button").removeClass('red');
}

$(document).ready(function () {
    function step() {
        $.ajax("/next_grid", {
            data: JSON.stringify({"grid": CURRENT_GRID}),
            contentType: 'application/json',
            type: 'POST'
        }).done(function (updated_grid) {
            update_view(updated_grid);
            CURRENT_GRID = updated_grid;
        });
    }

    $(".button-collapse").sideNav();

    $("#step_button").click(step);

    $("#play_button").click(function () {
        if (!INTERVAL_RUNNING) {
            var delay = $("#step_delay").val() * 1000;

            PLAY_INTERVAL = setInterval(function () {
                step();
            }, delay);

            INTERVAL_RUNNING = true;

            $(this).addClass('red');
        } else {
            stopPlayInterval();
        }
    });

    $("#stop_button").click(function () {
        stopPlayInterval();
    });
});

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function update_view(grid) {
    var rows = grid.length;
    var cols = grid[0].length;

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var cell = $("#" + r + "_" + c);
            if (+grid[r][c] === 1) {
                cell.addClass("clicked");
            } else if (+grid[r][c] === 0) {
                cell.removeClass("clicked");
            }
        }
    }
}

function gridCreation(rows, cols) {

    var grid = clickableGrid(rows, cols, function (el, row, col, i) {
        // console.log("You clicked on element:", el);
        // console.log("You clicked on row:", row);
        // console.log("You clicked on col:", col);
        // console.log("You clicked on item #:", i);

        CURRENT_GRID[row][col] = 1 - CURRENT_GRID[row][col];
        // alert(JSON.stringify(CURRENT_GRID));

        $(el).toggleClass('clicked');
    });

    $("#table-scroll").append(grid);

    function clickableGrid(rows, cols, callback) {
        var i = 0;
        var grid = document.createElement('table');
        grid.className = 'grid center-align';
        for (var r = 0; r < rows; ++r) {
            var tr = grid.appendChild(document.createElement('tr'));
            for (var c = 0; c < cols; ++c) {
                var cell = tr.appendChild(document.createElement('td'));

                // var width = Math.round(768 / cols);

                var filler = $('<div></div>');
                filler.addClass("filler");

                $(cell).append(filler);

                $(cell).attr('id', r + '_' + c);
                cell.addEventListener('click', (function (el, r, c, i) {
                    return function () {
                        callback(el, r, c, i);
                    }
                })(cell, r, c, i), false);
            }
        }
        return grid;
    }

    CURRENT_GRID = zeros([rows, cols]);
}