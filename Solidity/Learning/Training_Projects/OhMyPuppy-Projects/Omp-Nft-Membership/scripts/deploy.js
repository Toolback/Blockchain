async function main() {
    const NftMembership = await ethers.getContractFactory("NftMembership")
  
    // Start deployment, returning a promise that resolves to a contract object
    const nftMembership = await NftMembership.deploy()
    console.log("Contract deployed to address:", nftMembership.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    
