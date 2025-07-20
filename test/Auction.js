const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("auction contract", function () {

    let auction;
    let myNFT;
    let owner;
    let seller;
    let user1;

    before(async function () {
        [owner, seller, user1] = await ethers.getSigners();
        auction = await ethers.deployContract("Auction");
        await auction.deployed();
        console.log("auction deployed");
        myNFT = await ethers.deployContract("MyNFT");
        await myNFT.deployed();
        console.log("myNFT deployed");
    });

    it("create auction", async function () {
        let bidPrice = 111111;
        // 给卖家mint一个nft
        await myNFT.mint(seller.address);
        let tokenId = await myNFT.currentTokenId();
        console.log("tokenId: ", tokenId);
        await myNFT.connect(seller).approve(auction.address, tokenId);
        console.log("finish approve", myNFT.address);
        await auction.connect(seller).createAuction(myNFT.address, tokenId.toBigInt(), 100000, 5);
        let auctionId = await auction.currentAuctionId();
        console.log("auctionId: ", auctionId);
        await auction.connect(user1).bid(auctionId, {
            value: bidPrice // 转账金额需匹配参数
        });
        console.log("finish deposit");
        let initialBalance = await ethers.provider.getBalance(seller.address);
        console.log("wait for Auction end");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await auction.endAuction(auctionId);
        expect(await myNFT.ownerOf(tokenId)).to.equal(user1.address);
        expect((await ethers.provider.getBalance(seller.address)).toBigInt()).to.equal(initialBalance.toBigInt() + BigInt(bidPrice));

    });
})