const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssuranceContract", function () {
    let AssuranceContract, assuranceContract;
    let insurer, insured, otherAccount;

    beforeEach(async function () {
        [insurer, insured, otherAccount] = await ethers.getSigners();
        AssuranceContract = await ethers.getContractFactory("AssuranceContract");
        assuranceContract = await AssuranceContract.connect(insurer).deploy();
    });

    it("Should create a contract", async function () {
        await assuranceContract.connect(insurer).creerContrat(insured.address, ethers.parseEther("1"), ethers.parseEther("10"));
        const contrat = await assuranceContract.contrats(0);
        expect(contrat.assure).to.equal(insured.address);
        expect(contrat.montantPrime).to.equal(ethers.parseEther("1"));
        expect(contrat.statut).to.equal(0); // ACTIF
    });

    it("Should allow insured to pay premium", async function () {
        await assuranceContract.connect(insurer).creerContrat(insured.address, ethers.parseEther("1"), ethers.parseEther("10"));

        await expect(assuranceContract.connect(insured).payerPrime(0, { value: ethers.parseEther("1") }))
            .to.emit(assuranceContract, "PrimePayee")
            .withArgs(0, ethers.parseEther("1"));

        const contrat = await assuranceContract.contrats(0);
        expect(contrat.estPaye).to.equal(true);
    });

    it("Should allow insured to declare claim", async function () {
        await assuranceContract.connect(insurer).creerContrat(insured.address, ethers.parseEther("1"), ethers.parseEther("10"));
        await assuranceContract.connect(insured).payerPrime(0, { value: ethers.parseEther("1") });

        await expect(assuranceContract.connect(insured).declarerSinistre(0))
            .to.emit(assuranceContract, "SinistreDeclare")
            .withArgs(0);

        const contrat = await assuranceContract.contrats(0);
        expect(contrat.statut).to.equal(1); // SINISTRE
    });

    it("Should allow insurer to pay indemnity", async function () {
        await assuranceContract.connect(insurer).creerContrat(insured.address, ethers.parseEther("1"), ethers.parseEther("10"));
        await assuranceContract.connect(insured).payerPrime(0, { value: ethers.parseEther("1") });
        await assuranceContract.connect(insured).declarerSinistre(0);

        // Insurer pays indemnity
        await expect(assuranceContract.connect(insurer).payerIndemnisation(0, { value: ethers.parseEther("10") }))
            .to.emit(assuranceContract, "IndemnisationPayee")
            .withArgs(0, ethers.parseEther("10"));

        const contrat = await assuranceContract.contrats(0);
        expect(contrat.statut).to.equal(2); // INDEMNISE
    });
});
