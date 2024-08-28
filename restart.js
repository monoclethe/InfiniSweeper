function restart() {
    document.getElementById("endPopup").style.display = "none";
    var gameActive = true;

    var cells = [
        "x|y",
        "0|0"
    ]
    var types = {
        //Type info: 0-8: free cells | 9: mine
        "x|y": ["type"],
        "0|0": 0
    }
    var visibility = {
        //Visibility info: false: covered | true: uncovered
        "x|y": ["visibility"],
        "0|0": true
    }
    var edgeTiles = [
        "0|0"
    ]
    var flagged = [

    ]
}