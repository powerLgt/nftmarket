// SPDX-License-Identifier: MIT 
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auction {
    struct AuctionItem {
        address nftAddress;
        uint256 tokenId;
        address seller;
        uint256 startPrice;
        uint256 endTime;
        uint256 highestPrice;
        address bidder;
        bool isEnd;
    }

    mapping(uint256 => AuctionItem) _auctions;
    uint256 _currentAuctionId;

    function createAuction(address nft, uint256 tokenId, uint256 startPrice, uint256 duration) 
        public returns (uint256) {

        IERC721 nftContract = IERC721(nft);

        require(startPrice > 0, "startPrice must greater then zero");
        require(duration > 0, "duration must greater then zero");
        require(msg.sender == nftContract.ownerOf(tokenId), "only owner can sell nft");
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        uint256 auctionId = ++_currentAuctionId;
        uint256 endTime = block.timestamp + duration;
        _auctions[auctionId] = AuctionItem(nft, tokenId, msg.sender, startPrice, endTime, 0, msg.sender, false);
        return auctionId;
    }

    function bid(uint256 auctionId) public payable {
        require(_auctions[auctionId].tokenId > 0, "Auction is not exist");
        require(msg.value > _auctions[auctionId].highestPrice, "value must greater than highestPrice");
        
        uint256 amount = _auctions[auctionId].highestPrice;
        address lastOne = _auctions[auctionId].bidder;

        _auctions[auctionId].highestPrice = msg.value;
        _auctions[auctionId].bidder = msg.sender;

        if (amount != 0) {
            payable(lastOne).transfer(amount);
        }
    }

    function endAuction(uint256 auctionId) public {
        require(_auctions[auctionId].tokenId > 0, "Auction is not exist");
        require(block.timestamp >= _auctions[auctionId].endTime, "it's too early to endAuction");
        require(_auctions[auctionId].isEnd == false, "auction had been end");
        _auctions[auctionId].isEnd = true;

        IERC721 nft = IERC721(_auctions[auctionId].nftAddress);
        // 把NFT转给最高拍卖人
        nft.transferFrom(address(this), _auctions[auctionId].bidder, _auctions[auctionId].tokenId);
        // 把钱转给卖家
        payable(_auctions[auctionId].seller).transfer(_auctions[auctionId].highestPrice);
    }

    function currentAuctionId() public view returns (uint256) {
        return _currentAuctionId;
    }
}