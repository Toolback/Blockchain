pragma solidity ^0.8.9;

contract MultiCall {
    function makeMultiCall(address[] calldata contracts, bytes[] calldata data) external view returns (bytes[] memory)
    {
        require(contracts.length == data.length, "args length mismatch");

        bytes[] memory results = new bytes[](data.length);

        for (uint i; i < contracts.length; i++)
        // we use staticcall because we'r not changing state;
        {
            (bool success, bytes memory result) = contracts[i].staticcall(data[i]);
            require(success, "multi call failed");
            results[i] = result;
        }

        return results;
    }
}

contract A {
    function test1() external view returns (uint, uint)
    {
        return (1, block.timestamp);
    }

    function getData1() external pure returns (bytes memory)
    {
        return abi.encodeWithSelector(this.test1.selector, 1);
    }
}

contract B {
    function test2() external view returns (uint, uint)
    {
        return (2, block.timestamp);
    }

    function getData2() external pure returns (bytes memory)
    {
        return abi.encodeWithSelector(this.test2.selector, 2);
    }
}