const main = async () => {
    const [manager, randomPerson] = await hre.ethers.getSigners();
    const poetryContractFactory = await hre.ethers.getContractFactory('PoetryWall');
    const poetryContract = await poetryContractFactory.deploy();
    await poetryContract.deployed();

    console.log("Contract deployed to:", poetryContract.address, "Feels like a good time to write a poem !");
    console.log("Manager address :", manager.address);

    let poetsCount;
    poets = await poetryContract.getTotalPoets();
    let poemsCount;
    poemsCount = await poetryContract.getTotalPoems();

    let poemsTxn = await poetryContract.poem();
    await poemsTxn.wait();

    poemsCount = await poetryContract.getTotalPoems();
    poetsCount = await poetryContract.getTotalPoets();


    poemsTxn = await poetryContract.connect(randomPerson).poem();
    await poemsTxn.wait();

    poemsCount = await poetryContract.getTotalPoems();
    poetsCount = await poetryContract.getTotalPoets();


    poemsTxn = await poetryContract.poem();
    await poemsTxn.wait();

    poemsCount = await poetryContract.getTotalPoems();
    poetsCount = await poetryContract.getTotalPoets();


};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
};

runMain();