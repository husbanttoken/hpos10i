function cl(s) {console.log(s);}
function ei(i) {return document.getElementById(i);}
function pp(v) {return '+'.repeat(v);}
function flip6(a) {
    var a0=[]
    for (i=0;i<a[0].length;i++){
        var a1=[];
        for (j=0;j<6;j++){a1.push(a[j][i]);}
        a0.push(a1);
    }
    return a0;
}
function getI(a,is) {
    var a0=[];
    is.forEach(i=>a0.push(a[i]))
    return a0;
}
async function load10(s){
    var a=[];
    var p=[]
    ei('load').innerHTML=s+9;
    for (i=s;i<s+10;i++){
        try {
        p.push(nft.methods.ownerOf(i).call())
        } catch {}
    }
    await Promise.allSettled(p).then(rs => {
        rs.forEach(r=> {
            if (r.status=="fulfilled") {
                a.push(r.value)
            } else {
                a.push("0x0000000000000000000000000000000000000000");
            }
        })
    });
    return a;
}
function bToN(a) { // boolean array to index numbers
    r = [];
    for (var i=0;i<a.length;i++) {if (a[i]) r.push(i)}
    return r;
}
console.log('hello');
var binance = 'https://bsc-dataseed.binance.org/';
// var binance = 'https://data-seed-prebsc-1-s1.binance.org:8545/'; // test

// NO GO    CHANGE !!!!
bitcoinAddress = "0x4C769928971548eb71A3392EAf66BeDC8bef4B80";
nftAddress     = "0x769ffCBF7cd348476309B08473B5aC76D3EADEd8";
mAddress       = "0x1f3D396549D3490e3C80C25aDA00BF7b6FE759EA";
// NO GO    CHANGE !!!!

// TEST
// bitcoinAddress ="0x129C6F4a60d5c908F9620ad8b567187c92c618a8"; 
// nftAddress     ="0x9B1948CBF47AD6aC275B58F032D3C48367a0D974"; 
// mAddress       ="0x5F7DC13E194f0664961Ccf6BC9C917971107038D";
////////////


meta = "ipfs://QmQDW3JNsDRHzrQG1Wb3FUyfHdqrtEECd7WJh2RnXK64SQ";
imgs = "ipfs://QmSBbfFMeMnBZV3ML4NJQFaCsXkpYYmWo2vg8gRVroPxKM";

var tok,nft;
var web3,accounts;
var market; // result of getM , [[owners],[prices]]
function pin(url) {
    s= "https://gateway.pinata.cloud/ipfs/";
    return s+url.substr(7)
}
var obj={};
var c=42;
function bsc(a) {
    return `<a href="https://bscscan.com/address/${a}">${a.substr(0,6)+'..'+a.substr(a.length-4,a.length)}</a>`
}
function rain(s) {
    //return `<span class="rain">${s}</span>`
    return s
}
function fr3(s) {
    if (s.length==3) return  s                 ;
    if (s.length==2) return  s + "&nbsp;"      ;
    if (s.length==1) return  s + "&nbsp;&nbsp;";
}
async function addA(a) { // type tokid block price owner buyer
    var div = document.createElement('div');
    s="";
    t=a[0];
    if (t==0){s+= `<span class="mono"><span class="blue">S</span>: #${fr3(a[1])} by ${bsc(a[4])} for ${rain(a[3].slice(0,-9))} BITCOIN </span> `;}
    if (t==1){s+= `<span class="mono"><span class="red">X</span>: #${fr3(a[1])} by ${bsc(a[4])} </span> `;}
    if (t==3){s+= `<span class="mono"><span class="green">B</span>: #${fr3(a[1])} by ${bsc(a[5])} for ${rain(a[3].slice(0,-9))} BITCOIN </span> `;

    }
    div.innerHTML=s;
    ei('act').append(div);

}
async function addH(i,tid,price) { // index, target-id
    cl('addiing H : '+i+' '+tid+' '+price);
      var div = document.createElement('div');
    obj = await (await fetch('meta/'+i)).json();
s = `
<div class="h">
<b>HODLER #${i}</b>
<br/>
<img width="200px" src="imgs/${i}.png"/>
<span class="mono" style="">
Head : ${obj.attributes[0].value}
Eyes : ${obj.attributes[1].value}
Mouth: ${obj.attributes[2].value}
</span>
<br/>`;

    if (tid=='market') {
s+=`
<div class="right">
${price.slice(0,-9)} BITCOIN 
</div>
</br>
<div class="right">
<button onclick="approveTok(${i})">Approve</button>
<button onclick="buy(${i})">Buy</button>
</div>
</div>
`;
        }

    if (tid=='my') {
        if (!price) {
            s+=`
<div>
Price <input value="1" id="my${i}"/> 
</div>
</br>
<div class="right">
<button onclick="approveNft(${i})">Approve</button>
</div>
<div class="right">
<button onclick="putSale(${i})">Put Up For Sale</button>
</div>
</div>
`;
        } else {
            price = price.slice(0,-9);
            s+=`
<div>
In Market For ${price} BITCOIN
</div>
<div class="right">

<button onclick="cSale(${i})">Cancel Sale</button>
</div>
</div>
`;
        }

    }
// <button>Cancel Sale</button>

// <button>Approve</button>
// <button>Buy</button>
    div.innerHTML=s;
    ei(tid).append(div);
};

async function approveTok(id) {
    cl('approvetok clicked '+id);
    cl('price is '+market[1][id]);
    await tok.methods.approve(mAddress,market[1][id]).send({from:accounts[0]},function (err, res) {})
}
async function buy(id) {
    cl('buy clicked '+id);
    await mar.methods.buy(id).send({from:accounts[0]},function (err, res) {})
}
async function approveNft(id) {
    cl('approvenft clicked '+id);
    await nft.methods.approve(mAddress,id).send({from:accounts[0]},function (err, res) {})
}
async function buyTok(id) {
    cl('buy clicked '+id);
}
async function putSale(id) {
    p= ei('my'+id).value;
    cl('psale clicked '+id+' price '+p+'000000000');
    result = window.confirm('Put HODLER #'+id+' on sale for: '+p+' BITCOIN');
    if (result ) {
        await mar.methods.pSale(id,p+'000000000').send({from:accounts[0]},function (err, res) {})
    } 
}
async function cSale(id) {
    cl('csale clicked '+id);
    await mar.methods.cSale(id).send({from:accounts[0]},function (err, res) {})
}
document.addEventListener("DOMContentLoaded", async function(event) {
    cl('ready');
    // await addH(3,'my');
    // await addH(6,'my');
    // await addH(33,'market');
    // await addH(72,'market');
    ei('connect').onclick = function() {
        cl('x');
        ethereum.request({ method: 'eth_requestAccounts' });
    }
    try {
        accounts = await ethereum.request({ method: 'eth_accounts' });
        web3 = new Web3(ethereum);
        if (accounts.length==0){
            accounts=["0x1000000000000000000000000000000000000001"];
        }
    } catch {
        accounts=["0x1000000000000000000000000000000000000001"];
        web3 = new Web3(new Web3.providers.HttpProvider(binance));
    }

    //We take the first address in the array of addresses and display it
    cl(accounts);
    ei('address').innerHTML=bsc(accounts[0]);

    tok = new web3.eth.Contract(erc20abi, bitcoinAddress);
    nft = new web3.eth.Contract(nftabi, nftAddress);
    mar = new web3.eth.Contract(mabi, mAddress);

    // ei('buy').onclick = async function() {
    //     cl('buy clicked');
    //     await nft.methods.buy().send({from:accounts[0]},function (err, res) {})

    // }
    // ei('approve').onclick = async function() {
    //     cl('approve clicked');
    //     await tok.methods.approve(nftAddress,"10101010101000000000").send({from:accounts[0]},function (err, res) {})

    // }
    await tok.methods.allowance(accounts[0],nftAddress).call(function (err, res) {
        console.log("The allowance  is: ", res)
        // ei('allowance').innerHTML=res;
    })
    await tok.methods.balanceOf(accounts[0]).call(function (err, res) {
        console.log("The balance is: ", res);
        ei('balance').innerHTML=res.slice(0,-9);
    })



    var a0=[];
    for (var i=0;i<10;i++){
        cl('loading '+i);
        var l = await load10(1+i*10);
        a0=a0.concat(l);
    }

    var a1 = bToN(a0.map(a=>a.toLowerCase()==accounts[0].toLowerCase()));
    console.log(" my tokens " ,a0)
    a1.forEach(id=>{
        addH(id+1,'my');
    });

    // await mar.methods.getO().call(function (err, res) {
    //     a = bToN(res.map(a=>a.toLowerCase()==accounts[0].toLowerCase()));
    //     console.log(" my tokens " ,a)
    //     a.forEach(id=>{
    //         addH(id,'my');
    //         // cl('xxx'+id);
    //     });
    //     // bToN(res.map(a=>a.toLowerCase()==accounts[0].toLowerCase())).map
    //     // console.log("The balance is: ", res);
    //     // ei('balance').innerHTML=res.slice(0,-9);
    // })
    // }
    // await mar.methods.getO().call(function (err, res) {
    //     a = bToN(res.map(a=>a.toLowerCase()==accounts[0].toLowerCase()));
    //     console.log(" my tokens " ,a)
    //     a.forEach(id=>{
    //         addH(id,'my');
    //         // cl('xxx'+id);
    //     });
    //     // bToN(res.map(a=>a.toLowerCase()==accounts[0].toLowerCase())).map
    //     // console.log("The balance is: ", res);
    //     // ei('balance').innerHTML=res.slice(0,-9);
    // })
    await mar.methods.getH().call(function (err, res) {
        console.log(" history :" ,res)
        var f = flip6(res);
        cl(f);
        f.reverse().map(i=>addA(i)); // add activity
        // for (i=0;i<res[0].length;i++){
        //     addA(res[1],i);
        // }

        // console.log("The balance is: ", res);
        // ei('balance').innerHTML=res.slice(0,-9);
    })
    await mar.methods.getM().call(function (err, res) {
        // a [ addresses ] , [ price ] 
        console.log(" market :" ,res)
        market = res;
        ix = bToN(res[0].map(i=>{return i!='0x0000000000000000000000000000000000000000'}));
        // as = getI(res[0],ix);
        // ps = getI(res[1],ix);

        ix.forEach( i => {
            if (res[0][i].toLowerCase()==accounts[0].toLowerCase()) {
                addH(i,'my',res[1][i]);
            }
            addH(i,'market',res[1][i]);
        })
        // console.log("The balance is: ", res);
        // ei('balance').innerHTML=res.slice(0,-9);
    })




    // await nft.methods.count().call(async function (err, res) {
    //     cl('current count:'+res);
    //     ei('left').innerHTML=res-1;

    //     await nft.methods.tokenURI(res).call(async function (err, res) {
    //         console.log("The uri  is: ", pin(res));

    //         obj = await (await fetch(pin(res))).json();
    //         cl(obj);
            
    //         ei('name').innerHTML=obj.name;
    //         ei('img').src="https://gateway.pinata.cloud/ipfs/QmS6jQTgwWZBgPBW3xbBhFjPuivgqmoVLTE8YKfhYWveA7/"+obj.image;
    //         for(var i =0;i<6;i++) {
                
    //             ei('v'+i).innerHTML=pp(obj.attributes[i].value);
    //         }
            
    //     })
    // })
    // // await nft.methods.tokenURI(1).call(async function (err, res) {
    // //     cl(res,err);
    // //     // ei('uri').innerHTML=res;

    // //     // obj =await (await fetch(pin(res))).json();
    // //     // cl(obj)
    // // })
    // await tok.methods.totalSupply().call((err, result) => { console.log(result) })

    // // daiToken.methods.balanceOf(senderAddress).call(function (err, res) {
    // //     if (err) {
    // //         console.log("An error occured", err)
    // //         return
    // //     }
    // //     console.log("The balance is: ", res)
    // // })
    // loadG(c);

    // ei('plus' ).onclick = async function() { c++;loadG(c);ei("gi").innerHTML=c}
    // ei('minus').onclick = async function() { c--;loadG(c);ei("gi").innerHTML=c}
});


    // try {
    // await Promise.all(p);
    // debugger;
    // } catch {

    // debugger;
    // }
            //     a0[i]=res;
            // a0[i]="0x0000000000000000000000000000000000000000";
