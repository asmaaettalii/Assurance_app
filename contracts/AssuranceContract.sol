// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssuranceContract {
    enum Statut { ACTIF, SINISTRE, INDEMNISE }

    struct Contrat {
        address assureur;
        address assure;
        uint256 montantPrime;
        uint256 montantIndemnisation;
        Statut statut;
        bool estPaye;
    }

    mapping(uint256 => Contrat) public contrats;
    uint256 public nextId;
    mapping(address => uint256[]) public contractsByAddress;

    event ContratCree(uint256 id, address assure);
    event PrimePayee(uint256 id, uint256 montant);
    event SinistreDeclare(uint256 id);
    event IndemnisationPayee(uint256 id, uint256 montant);

    constructor() {}

    function creerContrat(address _assure, uint256 _prime, uint256 _indemnisation) external {
        contrats[nextId] = Contrat({
            assureur: msg.sender,
            assure: _assure,
            montantPrime: _prime,
            montantIndemnisation: _indemnisation,
            statut: Statut.ACTIF,
            estPaye: false
        });
        
        contractsByAddress[msg.sender].push(nextId);
        contractsByAddress[_assure].push(nextId);

        emit ContratCree(nextId, _assure);
        nextId++;
    }

    function getContractsForUser(address _user) external view returns (uint256[] memory) {
        return contractsByAddress[_user];
    }

    function payerPrime(uint256 _id) external payable {
        Contrat storage c = contrats[_id];
        require(msg.sender == c.assure, "Seul l'assure peut payer");
        require(msg.value == c.montantPrime, "Montant incorrect");
        require(!c.estPaye, "Deja paye");
        
        c.estPaye = true;
        // Transfer premium to insurer
        payable(c.assureur).transfer(msg.value);
        emit PrimePayee(_id, msg.value);
    }

    function declarerSinistre(uint256 _id) external {
        Contrat storage c = contrats[_id];
        require(c.estPaye, "Prime non payee");
        require(c.statut == Statut.ACTIF, "Contrat non actif");
        require(msg.sender == c.assure, "Seul l'assure peut declarer");
        
        c.statut = Statut.SINISTRE;
        emit SinistreDeclare(_id);
    }

    function payerIndemnisation(uint256 _id) external payable {
        Contrat storage c = contrats[_id];
        require(msg.sender == c.assureur, "Seul l'assureur peut payer");
        require(c.statut == Statut.SINISTRE, "Pas de sinistre declare");
        require(msg.value == c.montantIndemnisation, "Montant incorrect");

        c.statut = Statut.INDEMNISE;
        payable(c.assure).transfer(msg.value);
        emit IndemnisationPayee(_id, msg.value);
    }
}
