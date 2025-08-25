localStorage.supporterCode = localStorage.supporterCode || "";

addLayer("donate", {
    startData() { return {unlocked: true}},
    color: "#ff8888",
    symbol: "D",
    row: "side",
    position: -1,
    layerShown() { return true },
    tooltip: "捐赠支持",
    tabFormat: [
        "blank", "blank", "blank",
        ["raw-html", "<h1><a href=https://afdian.com/@loader3229/plan target=_blank>爱发电支持</a></h1>"],
        ["raw-html", "<h1><a href=https://ko-fi.com/loader3229 target=_blank>在Ko-Fi上请我喝咖啡</a></h1>"],
        ["raw-html", "<h1><a href=https://patreon.com/user?u=56328626 target=_blank>Patreon赞助</a></h1>"],
        ["raw-html", "<a href=/b.html target=_blank>输入支持者代码获取奖励！</a>"],
    ],
});