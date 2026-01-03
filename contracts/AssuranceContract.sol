// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssuranceContract {
    enum Statut { ACTIF, SINISTRE, INDEMNISE }
    enum StatutSinistre { AUCUN, DECLARE, APPROUVE, REJETE }

    struct Contrat {
        address assureur;
        address assure;
        uint256 montantPrime;
        uint256 montantIndemnisation;
        Statut statut;
        bool estPaye;
        
        // Nouveaux champs pour le sinistre
        StatutSinistre statutSinistre;
        string descriptionSinistre;
        string preuveSinistre;
    }

    mapping(uint256 => Contrat) public contrats;
    uint256 public nextId;
    mapping(address => uint256[]) public contractsByAddress;

    event ContratCree(uint256 id, address assure);
    event PrimePayee(uint256 id, uint256 montant);
    event SinistreDeclare(uint256 id);
    event SinistreApprouve(uint256 id);
    event SinistreRejete(uint256 id);
    event IndemnisationPayee(uint256 id, uint256 montant);

    constructor() {}

    function creerContrat(address _assure, uint256 _prime, uint256 _indemnisation) external {
        contrats[nextId] = Contrat({
            assureur: msg.sender,
            assure: _assure,
            montantPrime: _prime,
            montantIndemnisation: _indemnisation,
            statut: Statut.ACTIF,
            estPaye: false,
            statutSinistre: StatutSinistre.AUCUN,
            descriptionSinistre: "",
            preuveSinistre: ""
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
        payable(c.assureur).transfer(msg.value);
        emit PrimePayee(_id, msg.value);
    }

    function declarerSinistre(uint256 _id, string memory _description, string memory _preuve) external {
        Contrat storage c = contrats[_id];
        require(c.estPaye, "Prime non payee");
        require(c.statutSinistre == StatutSinistre.AUCUN, "Sinistre deja declare");
        require(msg.sender == c.assure, "Seul l'assure peut declarer");
        
        c.statut = Statut.SINISTRE; // On garde la synchro avec l'ancien statut
        c.statutSinistre = StatutSinistre.DECLARE;
        c.descriptionSinistre = _description;
        c.preuveSinistre = _preuve;

        emit SinistreDeclare(_id);
    }

    function approuverSinistre(uint256 _id) external {
        Contrat storage c = contrats[_id];
        require(msg.sender == c.assureur, "Seul l'assureur peut approuver");
        require(c.statutSinistre == StatutSinistre.DECLARE, "Aucun sinistre a approuver");

        c.statutSinistre = StatutSinistre.APPROUVE;
        emit SinistreApprouve(_id);
    }

    function rejeterSinistre(uint256 _id) external payable {
        Contrat storage c = contrats[_id];
        require(msg.sender == c.assureur, "Seul l'assureur peut rejeter");
        require(c.statutSinistre == StatutSinistre.DECLARE, "Aucun sinistre a rejeter");
        require(c.estPaye, "Prime non payee, rien a rembourser");

        c.statutSinistre = StatutSinistre.REJETE;
        c.estPaye = false; // Remboursement implique annulation paiement
        
        payable(c.assure).transfer(c.montantPrime);
        emit SinistreRejete(_id);
    }

    function payerIndemnisation(uint256 _id) external payable {
        Contrat storage c = contrats[_id];
        require(msg.sender == c.assureur, "Seul l'assureur peut payer");
        require(c.statutSinistre == StatutSinistre.APPROUVE, "Sinistre non approuve");
        require(msg.value == c.montantIndemnisation, "Montant incorrect");

        c.statut = Statut.INDEMNISE;
        payable(c.assure).transfer(msg.value);
        emit IndemnisationPayee(_id, msg.value);
    }
}
