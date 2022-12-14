// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./aave/FlashLoanReceiverBase.sol";

contract SimpleAaveFlashloan is FlashLoanReceiverBase {
    using SafeMath for uint256;

    struct Data {
        address token;
        uint256 amount;
  }
    address public tokenBorrowed;

    event Log(string message, uint256 value);
    event LogAsset(string message, address token);

  constructor(ILendingPoolAddressesProvider _addressProvider)
  FlashLoanReceiverBase(_addressProvider)
  { }

  function flashLoan(address _token, uint256 _amount) external {
        uint256 token_balance = IERC20(_token).balanceOf(address(this));
        uint256 min_amount = _amount.div(50);
    require(
      token_balance > min_amount,
      "token balance has to be higher than 10% of the amount borrowed"
    );

        address receiverAddress = address(this);

    // multiple assets can be borrowed, in this case just 1
    address[] memory assets = new address[](1);
    assets[0] = _token;

    // array of amount has to be the same lenght as the assets array
    uint256[] memory amounts = new uint256[](1);
    amounts[0] = _amount;

    // 0 = no debt (flashloan), 1 = stable and 2 = variable
    uint256[] memory modes = new uint256[](1);
    modes[0] = 0;

    require(
      assets.length == amounts.length,
      "assets and amounts arrays are not the same length"
    );

        // this is the address that would receive the debt in case modes 1 and 2
        address onBehalfOf = address(this);

        // data that can be usefull to do arbitrage or liquidations
        bytes memory params = abi.encode(
      Data({ token: _token, amount: _amount })
    );

        uint16 referralCode = 0;

    // LENDING_POOL is called inside FlashLoanReceiverBase
    LENDING_POOL.flashLoan(
      receiverAddress,
      assets,
      amounts,
      modes,
      onBehalfOf,
      params,
      referralCode
    );
  }

  // AAVE protocol will call this function after we call LENDING_POOL.flashLoan()
  // here the flashloan is received, in this function we have to repay AAVE after doing stuff with the flashloan
  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns(bool) {
    require(initiator == address(this), "!initiator");

        Data memory data_decoded = abi.decode(params, (Data));

    if (assets.length == 1) {
      tokenBorrowed = assets[0];
            uint256 amountBorrowed = amounts[0];
            uint256 fee = premiums[0];

      require(
        tokenBorrowed == data_decoded.token &&
        amountBorrowed == data_decoded.amount
      );

            /*
             *  arbitrage, yield or liquidation code
             */

            //emit LogAsset('token', tokenBorrowed);
            emit Log("borrowed", amountBorrowed);
            emit Log("fee", fee);
            emit Log("amount to pay back", amountBorrowed.add(fee));

            // amoun to pay back to AAVE
            uint256 totalAmount = amountBorrowed.add(fee);
      // approve LENDING_POOL
      IERC20(tokenBorrowed).approve(address(LENDING_POOL), totalAmount);
    } else {
      // if you borrow more than 1 token
      for (uint256 i = 0; i < assets.length; i++) {
                emit LogAsset("token", assets[i]);
                emit Log("borrowed", amounts[i]);
                emit Log("fee", premiums[i]);
      }
    }
    return true;
  }
}
