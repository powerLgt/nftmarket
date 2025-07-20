const { expect } = require("chai"); 
const { ethers } = require("hardhat");

describe("MyNFT contract", function () {
    let myNFT;
    let owner;
    let user1;

    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();

        // 部署合约
        myNFT = await ethers.deployContract("MyNFT");
        await myNFT.deployed();
    });


    it("Should Mint a new NFT TOken", async function () {
        // 使用owner mint
        await myNFT.mint(user1.address);
        const tokenId = await myNFT.currentTokenId();
        await expect(await myNFT.ownerOf(tokenId)).to.equal(user1.address);
        await expect(await myNFT.balanceOf(user1.address)).to.equal(ethers.BigNumber.from("1"));
    });

    it("Should transfer token", async function() {
        await myNFT.mint(user1.address);
        const tokenId = await myNFT.currentTokenId();
        await myNFT.connect(user1).transferFrom(user1.address, owner.address, tokenId);
        await expect(await myNFT.ownerOf(tokenId)).to.equal(owner.address);
    });
})