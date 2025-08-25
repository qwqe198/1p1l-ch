let modInfo = {
    name: "1点=1层",
    id: "one-points-one-layer",
    author: "loader3229",
    pointsName: "点数",
    modFiles: ["layers.js", "tree.js", "donate.js"],

    discordName: "loader3229的Discord服务器",
    discordLink: "https://discord.gg/jztUReQ2vT",
    initialStartPoints: new Decimal (1), // 用于硬重置和新玩家
    offlineLimit: 1,  // 离线时间限制(小时)
}

// 版本号和名称
let VERSION = {
    num: "29",
    name: "人工智能",
}

let changelog = `<h1>更新日志:</h1><br>
    <h3>v28</h3><br>
        - 新增人工智能层<br>
        - 终局: 28点<br>
    <h3>v27</h3><br>
        - 新增灵感层<br>
        - 终局: 27点<br>
    <h3>v26</h3><br>
        - 新增机器人层<br>
        - 终局: 26点<br>
    <h3>v25</h3><br>
        - 新增能量层<br>
        - 终局: 25点<br>
    <h3>v24</h3><br>
        - 新增神经元层<br>
        - 终局: 24点<br>
    <h3>v23</h3><br>
        - 新增机器层<br>
        - 终局: 23点<br>
    <h3>v22</h3><br>
        - 新增齿轮层<br>
        - 终局: 22点<br>
    <h3>v21</h3><br>
        - 新增精通层<br>
        - 终局: 21点<br>
    <h3>v20</h3><br>
        - 新增帝国层<br>
        - 终局: 20点<br>
    <h3>v19</h3><br>
        - 新增生命精华层<br>
        - 终局: 19点<br>
    <h3>v18</h3><br>
        - 新增超空间层<br>
        - 终局: 18点<br>
    <h3>v16.5</h3><br>
        - 新增幻影灵魂和超级点数<br>
        - 终局: 16.5点<br>
    <h3>v15</h3><br>
        - 新增魔法层<br>
        - 终局: 15点<br>
    <h3>v14</h3><br>
        - 新增平衡能量层<br>
        - 终局: 14点<br>
    <h3>v13</h3><br>
        - 新增太阳能量层<br>
        - 终局: 13点<br>
    <h3>v12</h3><br>
        - 新增超级生成器<br>
        - 终局: 12点<br>
    <h3>v10.5</h3><br>
        - 新增3个新层<br>
        - 终局: 10.5点<br>
    <h3>v8</h3><br>
        - 新增4个新层<br>
        - 终局: 9点<br>
    <h3>v4</h3><br>
        - 新增4个新层<br>
        - 终局: 5点<br>
`

let winText = `恭喜！您已到达终点并通关了这个游戏，但目前就到这里...`

// 如果你在任何层中添加了新函数，并且这些函数在被调用时会产生效果，请在这里添加它们
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// 决定是否显示点数/秒
function canGenPoints(){
    return true
}


function getPointBase(){
    if(player.h.challenges[11]>=5){
        let s=40/player.h.challenges[11];
        if(hasMilestone("sp",23) && hasUpgrade("sp",45))s*=(650/player.sp.points.add("1e650").log10());
        else if(hasMilestone("sp",23))s*=Decimal.pow(0.999,softcap(player.sp.points.add(1).log10().min(800),new Decimal(625),0.5).sub(400)).toNumber();
        if(player.c.unlocked)s*=Decimal.pow(0.99,tmp.c.power[1]).toNumber();
        if(s!=s)s=8;
        return new Decimal(2).add(s);
    }
    return new Decimal(10);
}

function getPointSCStart(){
    let ret=new Decimal(27);
    if(hasUpgrade("ai",11))ret = ret.add(1);
    if(hasUpgrade("ai",44))ret = ret.add(0.5);
    if(player.c.unlocked)ret = ret.add(tmp.c.power[1].div(100));
    return ret;
}
function getPointSC(){
    return 10;
}
// Calculate points/sec!
function getPointGen() {
	let gain = softcap(getRealPoints().add(getRealPointGen()).log(getPointBase()).log2().div(inChallenge("h",11)?2:1),getPointSCStart(),1/getPointSC()).sub(player.points);
    if(inChallenge("h",52))gain = softcap(getRealPoints().add(getRealPointGen()).log(getPointBase()).log2().div(inChallenge("h",11)?2:1).add(1).log2(),getPointSCStart(),1/getPointSC()).sub(player.points);
	return gain
}

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

function getRealPointGen() {
	let sc=Decimal.pow(2,Decimal.pow(2,29.1));
    let gain = getRealPointGenBeforeTaxes();
    if(gain.lte(sc))return gain;
    gain = Decimal.pow(2,Decimal.pow(2,Decimal.sub(30,Decimal.pow(0.9,gain.log2().log2().sub(29).mul(10)))));
	return gain
}

function getRealPointGenTaxPower() {
	let sc=Decimal.pow(2,Decimal.pow(2,29.1));
    let gain = getRealPointGenBeforeTaxes();
    if(gain.lte(sc))return Decimal.dOne;
    let gain1 = gain.log2().log2();
    let gain2 = Decimal.sub(30,Decimal.pow(0.9,gain.log2().log2().sub(29).mul(10)));
	return Decimal.pow(2,gain1.sub(gain2));
}

function getRealPoints() {
    if(inChallenge("h",52))return Decimal.pow(getPointBase(),Decimal.pow(2,Decimal.pow(2,softcap(player.points.max(0),getPointSCStart(),getPointSC())).sub(1).mul(inChallenge("h",11)?2:1)));
	return Decimal.pow(getPointBase(),Decimal.pow(2,softcap(player.points.max(0),getPointSCStart(),getPointSC()).mul(inChallenge("h",11)?2:1)));
}

function setRealPoints(s){
	player.points=s.log(getPointBase()).log2().div(inChallenge("h",11)?2:1);
    if(inChallenge("h",52))player.points=player.points.add(1).log2();
    player.points=softcap(player.points,getPointSCStart(),1/getPointSC());
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// 在页面顶部显示额外信息
var displayThings = [
    "模组作者: loader3229 汉化:22222",
    "终局: "+VERSION.num+"点",
    function(){return "点数增益: "+format(getRealPointGen())+"倍"},
    function(){return "进度: "+format(player.points.mul(100).div(VERSION.num))+"%"},
function(){
    if(getRealPointGen().gte(Decimal.pow(2,Decimal.pow(2,29.1)))) {
        return "<span style='color:red;'>你的税收让你的点数获取被开了"+format(getRealPointGenTaxPower(),4)+"次方根！</span>";
    }
    return "";
}
]

// 决定游戏何时"结束"
function isEndgame() {
    return player.points.gte(new Decimal(VERSION.num))
}

// 以下是次要内容！

// 背景样式，可以是一个函数
var backgroundStyle = {

}

// 如果你有可能会被长时间tick影响的内容，可以修改这个
function maxTickLength() {
    return(3600) // 默认是1小时，这个值可以任意大
}

// 如果你需要撤销旧版本的通货膨胀，可以使用这个。如果版本早于修复问题的版本，
// 你可以用这个限制他们当前的资源。
function fixOldSave(oldVersion){
}