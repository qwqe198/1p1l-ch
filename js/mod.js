let modInfo = {
    name: "1点=1层", // 模组名称
    id: "one-points-one-layer", // 模组ID
    author: "loader3229", // 作者
    pointsName: "点数", // 点数名称
    modFiles: ["layers.js", "tree.js", "donate.js"], // 模组文件列表

    discordName: "loader3229的Discord服务器", // Discord名称
    discordLink: "https://discord.gg/jztUReQ2vT", // Discord链接
    initialStartPoints: new Decimal(1), // 用于硬重置和新玩家的初始点数
    offlineLimit: 1,  // 离线时间限制(小时)
}

// 版本信息
let VERSION = {
    num: "30", // 版本号
    name: "奇点", // 版本名称
}

// 更新日志
let changelog = `<h1>更新日志:</h1><br>
    <h3>v30</h3><br>
        - 新增奇点层<br>
        - 终局目标: 30点<br>
    <h3>v29</h3><br>
        - 新增文明层<br>
        - 终局目标: 29点<br>
    <h3>v28</h3><br>
        - 新增AI层<br>
        - 终局目标: 28点<br>
    <h3>v27</h3><br>
        - 新增思想层<br>
        - 终局目标: 27点<br>
    <h3>v26</h3><br>
        - 新增机器人层<br>
        - 终局目标: 26点<br>
    <h3>v25</h3><br>
        - 新增能量层<br>
        - 终局目标: 25点<br>
    <h3>v24</h3><br>
        - 新增神经元层<br>
        - 终局目标: 24点<br>
    <h3>v23</h3><br>
        - 新增机器层<br>
        - 终局目标: 23点<br>
    <h3>v22</h3><br>
        - 新增齿轮层<br>
        - 终局目标: 22点<br>
    <h3>v21</h3><br>
        - 新增精通层<br>
        - 终局目标: 21点<br>
    <h3>v20</h3><br>
        - 新增帝国层<br>
        - 终局目标: 20点<br>
    <h3>v19</h3><br>
        - 新增生命精华层<br>
        - 终局目标: 19点<br>
    <h3>v18</h3><br>
        - 新增超空间层<br>
        - 终局目标: 18点<br>
    <h3>v16.5</h3><br>
        - 新增幻影灵魂和超级点数<br>
        - 终局目标: 16.5点<br>
    <h3>v15</h3><br>
        - 新增魔法层<br>
        - 终局目标: 15点<br>
    <h3>v14</h3><br>
        - 新增平衡能量<br>
        - 终局目标: 14点<br>
    <h3>v13</h3><br>
        - 新增太阳层<br>
        - 终局目标: 13点<br>
    <h3>v12</h3><br>
        - 新增超级生成器<br>
        - 终局目标: 12点<br>
    <h3>v10.5</h3><br>
        - 新增3个层<br>
        - 终局目标: 10.5点<br>
    <h3>v8</h3><br>
        - 新增4个层<br>
        - 终局目标: 9点<br>
    <h3>v4</h3><br>
        - 新增4个层<br>
        - 终局目标: 5点<br>
`

// 胜利文本
let winText = `恭喜！您已到达终点并通关此游戏，但目前...`

// 不应每帧调用的函数列表
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

// 获取起始点数
function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// 判断是否显示点数/秒
function canGenPoints(){
    return true
}

// 获取点数基础值
function getPointBase(){
    if(player.h.challenges[11]>=5){
        let s=40/player.h.challenges[11];
        if(hasMilestone("sp",23) && hasUpgrade("sp",45))s*=(650/player.sp.points.add("1e650").log10());
        else if(hasMilestone("sp",23))s*=Decimal.pow(0.999,softcap(player.sp.points.add(1).log10().min(800),new Decimal(625),0.5).sub(400)).toNumber();
        if(player.c.unlocked)s*=Decimal.pow(0.99,tmp.c.power[1]).toNumber();
        if(player.sp.points.gte("eee10"))s=0;
        if(s!=s)s=8;
        return new Decimal(2).add(s);
    }
    return new Decimal(10);
}

// 获取点数软上限起始值
function getPointSCStart(){
    let ret=new Decimal(27);
    if(hasUpgrade("ai",11))ret = ret.add(1);
    if(hasUpgrade("ai",44))ret = ret.add(0.5);
    if(player.c.unlocked){
        ret = ret.add(tmp.c.power[1].min(70).div(100));
        ret = ret.add(tmp.c.power[1].sub(120).max(0).cbrt().div(40));
    }
    if(hasMilestone("si",2))ret = ret.add(player.si.points.add(1).log10().div(hasMilestone("si",19)?50:100));
    if(hasMilestone("si",11))ret = ret.add(getRealPointGenTaxPower().add(1).log10().div(50));
    return ret;
}

// 获取点数软上限
function getPointSC(){
    return 10;
}

// 计算点数/秒
function getPointGen() {
    if(player.points.gte(30))return new Decimal(0);
    let gain = softcap(getRealPoints().add(getRealPointGen()).log(getPointBase()).log2().div(inChallenge("h",11)?2:1),getPointSCStart(),1/getPointSC()).sub(player.points);
    if(inChallenge("h",52))gain = softcap(getRealPoints().add(getRealPointGen()).log(getPointBase()).log2().div(inChallenge("h",11)?2:1).add(1).log2(),getPointSCStart(),1/getPointSC()).sub(player.points);
    return gain
}

// 计算税前真实点数生成
function getRealPointGenBeforeTaxes() {
    let gain = new Decimal(0)
    if(hasUpgrade("p",11))gain=gain.add(player.p.points.mul(10)).add(10);
    if(hasUpgrade("p",12))gain=gain.mul(upgradeEffect("p",12));
    if(hasUpgrade("p",13))gain=gain.mul(upgradeEffect("p",13));
    if(hasUpgrade("p",22))gain=gain.mul(upgradeEffect("p",22));
    if(hasUpgrade("p",23))gain=gain.mul(upgradeEffect("p",23));
    gain = gain.mul(layers.b.effect());
    gain = gain.mul(layers.g.powerEff());
    gain = gain.mul(layers.t.powerEff());
    gain = gain.mul(layers.s.buyables[11].effect());
    if (player.q.unlocked) gain = gain.mul(tmp.q.enEff);
    if (player.h.unlocked) gain = gain.mul(layers.h.effect());
    if(hasUpgrade("ss",43))gain = gain.pow(1.01);
    return gain
}

// 计算真实点数生成
function getRealPointGen() {
    let sc=Decimal.pow(2,Decimal.pow(2,29.1));
    let gain = getRealPointGenBeforeTaxes();
    if(gain.lte(sc))return gain;
    gain = Decimal.pow(2,Decimal.pow(2,Decimal.sub(30,Decimal.pow(0.9,gain.log2().log2().sub(29).mul(10)))));
    return gain
}

// 计算真实点数生成税收系数
function getRealPointGenTaxPower() {
    let sc=Decimal.pow(2,Decimal.pow(2,29.1));
    let gain = getRealPointGenBeforeTaxes();
    if(gain.lte(sc))return Decimal.dOne;
    let gain1 = gain.log2().log2();
    let gain2 = Decimal.sub(30,Decimal.pow(0.9,gain.log2().log2().sub(29).mul(10)));
    return Decimal.pow(2,gain1.sub(gain2));
}

// 计算真实点数
function getRealPoints() {
    if(inChallenge("h",52))return Decimal.pow(getPointBase(),Decimal.pow(2,Decimal.pow(2,softcap(player.points.max(0),getPointSCStart(),getPointSC())).sub(1).mul(inChallenge("h",11)?2:1)));
    return Decimal.pow(getPointBase(),Decimal.pow(2,softcap(player.points.max(0),getPointSCStart(),getPointSC()).mul(inChallenge("h",11)?2:1)));
}

// 设置真实点数
function setRealPoints(s){
    player.points=s.log(getPointBase()).log2().div(inChallenge("h",11)?2:1);
    if(inChallenge("h",52))player.points=player.points.add(1).log2();
    player.points=softcap(player.points,getPointSCStart(),1/getPointSC()).min(30);
}

// 添加玩家数据
function addedPlayerData() { return {
}}

// 页面顶部显示内容
var displayThings = [
    "模组作者: loader3229 翻译: 22222",
    "终局目标: "+VERSION.num+"点",
    function(){if(getRealPointGen().gte(Decimal.pow(2,Decimal.pow(2,29.1))))return "点数生成: "+format(getRealPointGen())+"x ("+format(getRealPointGenBeforeTaxes())+"x)"; return "点数生成: "+format(getRealPointGen())+"x"},
    function(){if(getRealPointGen().gte(Decimal.pow(2,Decimal.pow(2,29.1)))){return "<span style=color:red;>您的税收使点数生成变为"+format(getRealPointGenTaxPower(),4)+"次方根!</span>";}return "";},
    function(){if(player.points.gte(30))return "您已达到30点，现在通货膨胀即将到来...";if(player.points.gte(29.9999))return "您还需要"+format(new Decimal(30).sub(player.points),4)+"点才能达到30点。"; return "进度: "+format(player.points.mul(100).div(VERSION.num))+"%"},
]

// 判断游戏是否结束
function isEndgame() {
    return player.points.gte(new Decimal(VERSION.num))
}

// 背景样式
var backgroundStyle = {

}

// 最大帧长度
function maxTickLength() {
    return(3600) // 默认为1小时
}

// 修复旧版本存档
function fixOldSave(oldVersion){
}