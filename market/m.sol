pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract market  {

  IERC721 public nft;
  IERC20 public bitcoin;

  uint256 [100] tp; // token price
  address [100] to; // token owner 

  uint8   [] t;    // type
  uint256 [] tokid ;
  uint256 [] blocks;
  uint256 [] price ;
  address [] owner ;
  address [] buyer ;
  
  constructor() {

    bitcoin = IERC20 (0x4C769928971548eb71A3392EAf66BeDC8bef4B80);
    nft     = IERC721(0x769ffCBF7cd348476309B08473B5aC76D3EADEd8);

    // test 
    // bitcoin = IERC20 (0x129C6F4a60d5c908F9620ad8b567187c92c618a8);
    // nft     = IERC721(0x9B1948CBF47AD6aC275B58F032D3C48367a0D974);
 
 
  }

  // put History
  function pH(uint8   t0, uint256 tokid0, uint256 block0,uint256 p0, address o0, address b0) private {
    t.push(t0);
    tokid.push(tokid0);
    blocks.push(block0);
    price.push(p0);
    owner.push(o0);
    buyer.push(b0);
  }
  function pSale(uint id, uint p) public returns(bool) {
    require(p > 0                               ,"Error price is 0.         ");
    require(address(this) == nft.getApproved(id),"Error HODLER not approved.");

    nft.transferFrom(msg.sender, address(this),id);
    tp[id]=p;
    to[id]=msg.sender;
    pH(0,id,block.number,p,msg.sender,address(0));
    return true;
  }
  function cSale(uint id) public returns(bool) {
    assert(to[id]==msg.sender);
    nft.transferFrom(address(this),msg.sender,id);
    tp[id]=0;
    to[id]=address(0);
    pH(1,id,block.number,0,msg.sender,address(0));
    return true;
  }
  function buy(uint id) public returns(bool) {
    
    require(tp[id] >   0                                           ,"Error price is 0.                ");
    require(tp[id] <=  bitcoin.balanceOf(msg.sender)               ,"Error not enough BITCOIN balance.");
    require(tp[id] <=  bitcoin.allowance(msg.sender,address(this)) ,"Error BITCOIN not approved.      ");

    bitcoin.transferFrom(msg.sender,to[id],tp[id]);
    nft.transferFrom(address(this),msg.sender,id);
    pH(3,id,block.number,tp[id],to[id],msg.sender);
    tp[id]=0;
    to[id]=address(0);
    return true;
  }


  // get market
  function getM() public view returns(address [100] memory,uint256 [100] memory) {
    return (to,tp);
  }
  
  // get history length
  function getHl() public view returns(uint256) {
    return t.length;
  }

  function getHse1(uint256 s, uint256 e) public view returns(uint256   [] memory, uint256 [] memory,uint256 [] memory) {
    uint   [] memory t0    = new uint   [](e-s);
    uint   [] memory tid0  = new uint   [](e-s);
    uint   [] memory blo0  = new uint   [](e-s);
    for (uint i = s; i < e; i++) {
      t0   [i-s] = t      [i];
      tid0 [i-s] = tokid  [i];
      blo0 [i-s] = blocks [i];
      }
    return (t0,tid0,blo0);
  }
  function getHse2(uint256 s, uint256 e) public view returns(uint256 [] memory, address [] memory, address [] memory ) {
    uint   [] memory p0    = new uint   [](e-s);
    address[] memory o0    = new address[](e-s);
    address[] memory buy0  = new address[](e-s);
    for (uint i = s; i < e; i++) {
      p0   [i-s] = price  [i];
      o0   [i-s] = owner  [i];
      buy0 [i-s] = buyer  [i];
      }
    return (p0,o0,buy0);
  }

  // get history start end - STACK TOO DEEP
  /* function getHse(uint256 s, uint256 e) public view returns(uint256   [] memory, uint256 [] memory,uint256 [] memory,uint256 [] memory, address [] memory, address [] memory ) { */
  /*   uint   [] memory t0    = new uint   [](s-e); */
  /*   uint   [] memory tid0  = new uint   [](s-e); */
  /*   uint   [] memory blo0  = new uint   [](s-e); */
  /*   uint   [] memory p0    = new uint   [](s-e); */
  /*   address[] memory o0    = new address[](s-e); */
  /*   address[] memory buy0  = new address[](s-e); */
  /*   for (uint i = s; i < e; i++) { */
  /*     t0   [e-i] = t      [i]; */
  /*     tid0 [e-i] = tokid  [i]; */
  /*     blo0 [e-i] = blocks [i]; */
  /*     p0   [e-i] = price  [i]; */
  /*     o0   [e-i] = owner  [i]; */
  /*     buy0 [e-i] = buyer  [i]; */
  /*     } */
  /*   return (t0,tid0,blo0,p0,o0,buy0); */
  /* } */

  // get history 
  function getH() public view returns(uint8   [] memory, uint256 [] memory,uint256 [] memory,uint256 [] memory, address [] memory, address [] memory ) {
    return (t,tokid,blocks,price,owner,buyer);
  }

  // get owners
  function getO() public view returns(address[] memory) {
    address[] memory r = new address[](100);
    uint i;
    for (i = 1; i <= 101; i++) {
      try nft.ownerOf(i) returns (address a) {
        r[i]= a;
      } catch { }
    }
    return r;
  }
}

