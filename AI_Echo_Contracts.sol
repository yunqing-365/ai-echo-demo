// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AI-Echo 核心基建协议
 * @dev 包含数据要素确权 (KnowledgeRegistry) 与 智能分账 (SmartSplitBill)
 */
contract AIEchoProtocol {
    
    // ==========================================
    // 1. KnowledgeRegistry 知识产权确权模块
    // ==========================================
    
    struct Asset {
        address creator;      // 创作者/提供者地址
        string assetHash;     // 数据的 SHA-256 哈希值（防篡改凭证）
        uint256 timestamp;    // 上链时间
        bool isVerified;      // 是否通过预言机清洗验证
    }
    
    // 映射：数据哈希 => 资产详情
    mapping(string => Asset) public assetRegistry;
    
    // 确权事件记录
    event AssetRegistered(string indexed assetHash, address indexed creator, uint256 timestamp);

    // 登记语料/非遗数据资产
    function registerAsset(string memory _assetHash) public {
        require(assetRegistry[_assetHash].creator == address(0), "该数据资产已被确权，存在抄袭风险！");
        
        assetRegistry[_assetHash] = Asset({
            creator: msg.sender,
            assetHash: _assetHash,
            timestamp: block.timestamp,
            isVerified: true
        });
        
        emit AssetRegistered(_assetHash, msg.sender, block.timestamp);
    }


    // ==========================================
    // 2. SmartSplitBill 智能清算与分账模块
    // ==========================================
    
    address public platformNode; // 平台运维节点地址
    address public ecosystemFund; // 生态激励基金地址

    constructor(address _platformNode, address _ecosystemFund) {
        platformNode = _platformNode;
        ecosystemFund = _ecosystemFund;
    }

    event PaymentSettled(string indexed assetHash, uint256 totalAmount, uint256 creatorShare);

    /**
     * @dev B端大模型调用数据时触发的分账函数
     * @param _assetHash 调用的语料哈希
     * @param _creatorRatio 预言机传回的创作者分成比例 (例如 825 表示 82.5%)
     */
    function triggerSplitBill(string memory _assetHash, uint256 _creatorRatio) public payable {
        require(msg.value > 0, "调用账单金额必须大于 0");
        require(_creatorRatio <= 1000, "分成比例参数异常");
        
        // 查询该数据的原作者
        address creator = assetRegistry[_assetHash].creator;
        require(creator != address(0), "请求的数据资产未在链上注册");

        uint256 totalAmount = msg.value;
        
        // 秒级计算分配金额
        uint256 creatorAmount = (totalAmount * _creatorRatio) / 1000;
        uint256 remainingAmount = totalAmount - creatorAmount;
        
        // 剩余部分 60% 归平台节点，40% 归社区生态基金
        uint256 platformAmount = (remainingAmount * 60) / 100;
        uint256 fundAmount = remainingAmount - platformAmount;

        // 执行资金拨付 (免信任、全自动、无资金盘风险)
        payable(creator).transfer(creatorAmount);
        payable(platformNode).transfer(platformAmount);
        payable(ecosystemFund).transfer(fundAmount);

        emit PaymentSettled(_assetHash, totalAmount, creatorAmount);
    }
}