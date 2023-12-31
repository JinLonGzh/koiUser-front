let getScrollHeight = () => {
    var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

function goTopSpeed() {
    let timer = setInterval(() => {
        if (window.scrollY != 0) {
            window.scroll(0, Math.max(window.scrollY - 50, 0));
        } else {
            clearInterval(timer);
        }
    }, 10);
}

function goTopTime(time = 1) {
    let speed = window.scrollY / time / 100;
    let timer = setInterval(() => {
        if (window.scrollY != 0) {
            window.scroll(0, Math.max(window.scrollY - speed, 0));
        } else {
            clearInterval(timer);
        }
    }, 10);
}

function goBottomSpeed() {
    let times = (getScrollHeight() - window.scrollY) / 50;
    let timer = setInterval(() => {
        if (times > 0) {
            window.scroll(0, Math.max(window.scrollY + 50, 0));
            times--;
        } else {
            clearInterval(timer);
        }
    }, 10);
}

function goBottomTime(time = 1) {
    let speed = (getScrollHeight() - window.scrollY) / time / 100;
    let times = (getScrollHeight() - window.scrollY) / speed;
    let timer = setInterval(() => {
        if (times > 0) {
            window.scroll(0, Math.max(window.scrollY + speed, 0));
            times--;
        } else {
            clearInterval(timer);
        }
    }, 10);
}

enum GoBothType {
    "TopSpeed",
    "TopTime",
    "BottomSpeed",
    "BottomTime"
}

enum RollType {
    "speed",
    "time"
}

function goBoth (type: GoBothType, time = 1) {
    let funcArray = [goTopSpeed, goTopTime, goBottomSpeed, goBottomTime];
    if(type == GoBothType.TopTime || type == GoBothType.BottomTime) {
        funcArray[type](time);
    } else {
        funcArray[type]();
    }
}

export { goBoth, GoBothType, RollType };